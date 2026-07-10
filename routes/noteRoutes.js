const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Dashboard - Display analytics
router.get('/', noteController.getAllNotes);

// Notes List - Display all notes with filters
router.get('/notes', noteController.getNotesList);

// Create Note - Show form
router.get('/notes/create', noteController.showCreateForm);

// Create Note - Save new note
router.post('/notes', noteController.createNote);

// View Note - Display single note
router.get('/notes/:id', noteController.viewNote);

// Edit Note - Show edit form
router.get('/notes/:id/edit', noteController.showEditForm);

// Update Note - Save changes
router.post('/notes/:id/update', noteController.updateNote);

// Delete Note
router.post('/notes/:id/delete', noteController.deleteNote);

// Toggle Favorite
router.post('/notes/:id/favorite', noteController.toggleFavorite);

// Toggle Pin
router.post('/notes/:id/pin', noteController.togglePin);

module.exports = router;
