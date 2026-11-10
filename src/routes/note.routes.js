const express = require('express');

const {
  authenticate
} = require('../middleware/auth.middleware');

const {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/note.controller');

const router = express.Router();

router.use(authenticate);

router.route('/')
  .post(createNote)
  .get(getMyNotes);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;