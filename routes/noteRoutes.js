const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/auth');

// Dashboard - Display analytics
router.get('/', noteController.getAllNotes);

// Notes List - Display all notes with filters
router.get('/notes', noteController.getNotesList);

// Create Note - Show form
router.get('/notes/create', authMiddleware, noteController.showCreateForm);

// Create Note - Save new note
router.post('/notes', authMiddleware, noteController.createNote);

// View Note - Display single note
router.get('/notes/:id', noteController.viewNote);

// Edit Note - Show edit form
router.get('/notes/:id/edit', authMiddleware, noteController.showEditForm);

// Update Note - Save changes
router.post('/notes/:id/update', authMiddleware, noteController.updateNote);

// Delete Note
router.post('/notes/:id/delete', authMiddleware, noteController.deleteNote);

// Toggle Favorite
router.post('/notes/:id/favorite', authMiddleware, noteController.toggleFavorite);

// Toggle Pin
router.post('/notes/:id/pin', authMiddleware, noteController.togglePin);

module.exports = router;
