const Note = require('../models/Note');

// Helper: Get all unique categories from database
const getAllCategories = async () => {
    try {
        const notes = await Note.find({}, 'category');
        const categories = [...new Set(notes.map(note => note.category))];
        return categories.sort(); // Sort alphabetically
    } catch (error) {
        console.error('Error getting categories:', error);
        return ['General'];
    }
};

// Helper: Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Helper: Validate note data
const validateNote = (note) => {
    const errors = [];

    if (!note.title || note.title.trim() === '') {
        errors.push('Title is required');
    }

    if (note.title && note.title.length > 150) {
        errors.push('Title must not exceed 150 characters');
    }

    if (!note.content || note.content.trim() === '') {
        errors.push('Content is required');
    }

    return errors;
};

// Helper: Parse tags from form input
const parseTags = (tags) => {
    if (Array.isArray(tags)) {
        return tags.map(tag => tag.trim()).filter(tag => tag !== '');
    }

    if (typeof tags === 'string') {
        return tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    }

    return [];
};

// Helper: Build note payload from request body
const buildNotePayload = (body) => {
    // Allow custom category or use selected category
    let category = 'General';
    
    if (body.newCategory && body.newCategory.trim()) {
        category = body.newCategory.trim();
    } else if (body.category && body.category.trim()) {
        category = body.category.trim();
    }
    
    return {
        title: body.title ? body.title.trim() : '',
        heading: body.heading ? body.heading.trim() : '',
        content: body.content ? body.content.trim() : '',
        category: category,
        tags: parseTags(body.tags),
        favorite: body.favorite === 'on' || body.favorite === true,
        pinned: body.pinned === 'on' || body.pinned === true
    };
};

// Helper: Filter notes by search query
const filterNotes = (notes, searchQuery) => {
    if (!searchQuery) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query) ||
        (note.tags || []).some(tag => tag.toLowerCase().includes(query))
    );
};

// Helper: Filter notes by category
const filterByCategory = (notes, category) => {
    if (!category) return notes;
    return notes.filter(note => note.category === category);
};

// Helper: Sort notes
const sortNotes = (notes, sortBy) => {
    const sortedNotes = [...notes];

    switch (sortBy) {
        case 'newest':
            return sortedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return sortedNotes.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'a-z':
            return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
        case 'z-a':
            return sortedNotes.sort((a, b) => b.title.localeCompare(a.title));
        case 'favorites':
            return sortedNotes.sort((a, b) => b.favorite - a.favorite);
        case 'pinned':
            return sortedNotes.sort((a, b) => b.pinned - a.pinned);
        default:
            return sortedNotes;
    }
};

// Helper: Separate pinned and unpinned notes
const separatePinned = (notes) => {
    const pinned = notes.filter(note => note.pinned);
    const unpinned = notes.filter(note => !note.pinned);
    return [...pinned, ...unpinned];
};

// Controller: Display all notes (Dashboard)
const getAllNotes = async (req, res) => {
    try {
        const allNotesList = await Note.find({}).sort({ createdAt: -1 });

        const totalNotes = allNotesList.length;
        const favorites = allNotesList.filter(note => note.favorite).length;
        const pinned = allNotesList.filter(note => note.pinned).length;
        const categories = [...new Set(allNotesList.map(note => note.category))];
        const recentNotes = sortNotes([...allNotesList], 'newest').slice(0, 5);

        res.render('index', {
            title: 'Dashboard',
            totalNotes,
            favorites,
            pinned,
            categories,
            recentNotes,
            message: req.query.message,
            messageType: req.query.messageType
        });
    } catch (error) {
        console.error('Error getting notes:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Display notes list page
const getNotesList = async (req, res) => {
    try {
        const search = req.query.search || '';
        const category = req.query.category || '';
        const sort = req.query.sort || 'newest';

        let notes = await Note.find({});

        if (search) {
            notes = filterNotes(notes, search);
        }

        if (category) {
            notes = filterByCategory(notes, category);
        }

        notes = sortNotes(notes, sort);
        notes = separatePinned(notes);

        const allCategories = [...new Set((await Note.find({}, 'category')).map(note => note.category))];

        res.render('notes', {
            title: 'All Notes',
            notes,
            allCategories,
            currentSearch: search,
            currentCategory: category,
            currentSort: sort,
            message: req.query.message,
            messageType: req.query.messageType
        });
    } catch (error) {
        console.error('Error getting notes list:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Show create note form
const showCreateForm = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('create', {
            title: 'Create Note',
            categories,
            errors: [],
            formData: {}
        });
    } catch (error) {
        console.error('Error showing create form:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Create new note
const createNote = async (req, res) => {
    try {
        const noteData = {
            ...buildNotePayload(req.body),
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate()
        };

        const errors = validateNote(noteData);

        if (errors.length > 0) {
            const categories = await getAllCategories();
            return res.render('create', {
                title: 'Create Note',
                categories,
                errors,
                formData: req.body
            });
        }

        await Note.create(noteData);
        res.redirect('/notes?message=Note created successfully&messageType=success');
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: View single note
const viewNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }

        res.render('view', {
            title: note.title,
            note,
            message: req.query.message,
            messageType: req.query.messageType
        });
    } catch (error) {
        console.error('Error viewing note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Show edit form
const showEditForm = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }

        const categories = await getAllCategories();

        res.render('edit', {
            title: 'Edit Note',
            note,
            categories,
            errors: []
        });
    } catch (error) {
        console.error('Error showing edit form:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Update note
const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }

        const payload = buildNotePayload(req.body);
        const updatedNoteData = {
            title: payload.title,
            heading: payload.heading,
            content: payload.content,
            category: payload.category,
            tags: payload.tags,
            favorite: payload.favorite,
            pinned: payload.pinned,
            updatedAt: getCurrentDate()
        };

        const errors = validateNote(updatedNoteData);

        if (errors.length > 0) {
            const categories = await getAllCategories();
            return res.render('edit', {
                title: 'Edit Note',
                note: { ...note.toObject(), ...updatedNoteData },
                categories,
                errors
            });
        }

        Object.assign(note, updatedNoteData);
        await note.save();

        res.redirect(`/notes/${note.id}?message=Note updated successfully&messageType=success`);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Delete note
const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }

        await note.deleteOne();
        res.redirect('/?message=Note deleted successfully&messageType=success');
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Toggle favorite
const toggleFavorite = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }

        note.favorite = !note.favorite;
        note.updatedAt = getCurrentDate();
        await note.save();

        const message = note.favorite ? 'Note added to favorites' : 'Note removed from favorites';
        res.redirect(`/notes/${note.id}?message=${message}&messageType=success`);
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Toggle pin
const togglePin = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }

        note.pinned = !note.pinned;
        note.updatedAt = getCurrentDate();
        await note.save();

        const message = note.pinned ? 'Note pinned' : 'Note unpinned';
        res.redirect(`/notes/${note.id}?message=${message}&messageType=success`);
    } catch (error) {
        console.error('Error toggling pin:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

module.exports = {
    getAllNotes,
    getNotesList,
    showCreateForm,
    createNote,
    viewNote,
    showEditForm,
    updateNote,
    deleteNote,
    toggleFavorite,
    togglePin
};
