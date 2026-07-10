const fs = require('fs');
const path = require('path');

// Path to notes.json file
const notesFilePath = path.join(__dirname, '../data/notes.json');

// Helper: Read notes from JSON file
const readNotes = () => {
    try {
        const data = fs.readFileSync(notesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading notes file:', error);
        return [];
    }
};

// Helper: Write notes to JSON file
const writeNotes = (notes) => {
    try {
        fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing notes file:', error);
        return false;
    }
};

// Helper: Find note by ID
const findNote = (id) => {
    const notes = readNotes();
    return notes.find(note => note.id === parseInt(id));
};

// Helper: Generate unique ID
const generateId = () => {
    const notes = readNotes();
    if (notes.length === 0) return 1;
    return Math.max(...notes.map(note => note.id)) + 1;
};

// Helper: Get current date in YYYY-MM-DD format
const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Helper: Validate note data
const validateNote = (note, isUpdate = false) => {
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

// Helper: Filter notes by search query
const filterNotes = (notes, searchQuery) => {
    if (!searchQuery) return notes;
    
    const query = searchQuery.toLowerCase();
    return notes.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
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
const getAllNotes = (req, res) => {
    try {
        const allNotesList = readNotes();
        
        // Calculate dashboard statistics
        const totalNotes = allNotesList.length;
        const favorites = allNotesList.filter(note => note.favorite).length;
        const pinned = allNotesList.filter(note => note.pinned).length;
        const categories = [...new Set(allNotesList.map(note => note.category))];
        
        // Get recent notes (sorted by newest, max 5)
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
const getNotesList = (req, res) => {
    try {
        let notes = readNotes();
        
        // Get query parameters
        const search = req.query.search;
        const category = req.query.category;
        const sort = req.query.sort || 'newest';
        
        // Apply filters
        if (search) {
            notes = filterNotes(notes, search);
        }
        
        if (category) {
            notes = filterByCategory(notes, category);
        }
        
        // Apply sorting
        notes = sortNotes(notes, sort);
        
        // Separate pinned notes (pinned always appear first)
        notes = separatePinned(notes);
        
        // Get all unique categories for filter dropdown
        const allCategories = [...new Set(readNotes().map(note => note.category))];
        
        res.render('notes', {
            title: 'All Notes',
            notes,
            allCategories,
            currentSearch: search || '',
            currentCategory: category || '',
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
const showCreateForm = (req, res) => {
    try {
        const categories = ['Programming', 'Node.js', 'Express', 'JavaScript', 'Laravel', 'React', 'English', 'Personal', 'Interview', 'System design'];
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
const createNote = (req, res) => {
    try {
        const { title, content, category, tags, favorite, pinned } = req.body;
        
        // Create note object
        const note = {
            id: generateId(),
            title: title.trim(),
            content: content.trim(),
            category: category || 'General',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
            favorite: favorite === 'on',
            pinned: pinned === 'on',
            createdAt: getCurrentDate(),
            updatedAt: getCurrentDate()
        };
        
        // Validate note
        const errors = validateNote(note);
        
        if (errors.length > 0) {
            const categories = ['Programming', 'Node.js', 'Express', 'JavaScript', 'Laravel', 'React', 'English', 'Personal', 'Interview'];
            return res.render('create', {
                title: 'Create Note',
                categories,
                errors,
                formData: req.body
            });
        }
        
        // Save note
        const notes = readNotes();
        notes.push(note);
        writeNotes(notes);
        
        // Redirect with success message
        res.redirect('/notes?message=Note created successfully&messageType=success');
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: View single note
const viewNote = (req, res) => {
    try {
        const note = findNote(req.params.id);
        
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
const showEditForm = (req, res) => {
    try {
        const note = findNote(req.params.id);
        
        if (!note) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }
        
        const categories = ['Programming', 'Node.js', 'Express', 'JavaScript', 'Laravel', 'React', 'English', 'Personal', 'Interview'];
        
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
const updateNote = (req, res) => {
    try {
        const { title, content, category, tags, favorite, pinned } = req.body;
        const noteId = parseInt(req.params.id);
        
        // Find existing note
        const notes = readNotes();
        const noteIndex = notes.findIndex(note => note.id === noteId);
        
        if (noteIndex === -1) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }
        
        // Create updated note object
        const updatedNote = {
            ...notes[noteIndex],
            title: title.trim(),
            content: content.trim(),
            category: category || 'General',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : [],
            favorite: favorite === 'on',
            pinned: pinned === 'on',
            updatedAt: getCurrentDate()
        };
        
        // Validate note
        const errors = validateNote(updatedNote, true);
        
        if (errors.length > 0) {
            const categories = ['Programming', 'Node.js', 'Express', 'JavaScript', 'Laravel', 'React', 'English', 'Personal', 'Interview'];
            return res.render('edit', {
                title: 'Edit Note',
                note: { ...updatedNote, id: noteId },
                categories,
                errors
            });
        }
        
        // Update note
        notes[noteIndex] = updatedNote;
        writeNotes(notes);
        
        // Redirect with success message
        res.redirect(`/notes/${noteId}?message=Note updated successfully&messageType=success`);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Delete note
const deleteNote = (req, res) => {
    try {
        const noteId = parseInt(req.params.id);
        const notes = readNotes();
        const noteIndex = notes.findIndex(note => note.id === noteId);
        
        if (noteIndex === -1) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }
        
        // Remove note
        notes.splice(noteIndex, 1);
        writeNotes(notes);
        
        // Redirect with success message
        res.redirect('/?message=Note deleted successfully&messageType=success');
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Toggle favorite
const toggleFavorite = (req, res) => {
    try {
        const noteId = parseInt(req.params.id);
        const notes = readNotes();
        const noteIndex = notes.findIndex(note => note.id === noteId);
        
        if (noteIndex === -1) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }
        
        // Toggle favorite
        notes[noteIndex].favorite = !notes[noteIndex].favorite;
        notes[noteIndex].updatedAt = getCurrentDate();
        writeNotes(notes);
        
        // Redirect back with message
        const message = notes[noteIndex].favorite ? 'Note added to favorites' : 'Note removed from favorites';
        res.redirect(`/notes/${noteId}?message=${message}&messageType=success`);
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).render('500', { title: '500 - Server Error', error: error.message });
    }
};

// Controller: Toggle pin
const togglePin = (req, res) => {
    try {
        const noteId = parseInt(req.params.id);
        const notes = readNotes();
        const noteIndex = notes.findIndex(note => note.id === noteId);
        
        if (noteIndex === -1) {
            return res.status(404).render('404', { title: '404 - Note Not Found' });
        }
        
        // Toggle pin
        notes[noteIndex].pinned = !notes[noteIndex].pinned;
        notes[noteIndex].updatedAt = getCurrentDate();
        writeNotes(notes);
        
        // Redirect back with message
        const message = notes[noteIndex].pinned ? 'Note pinned' : 'Note unpinned';
        res.redirect(`/notes/${noteId}?message=${message}&messageType=success`);
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
