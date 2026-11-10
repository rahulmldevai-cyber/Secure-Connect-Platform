const noteModel = require('../models/note.model');

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const eventBus = require('../events/eventBus');
const EVENTS = require('../events/events');

const { isValidNonEmptyString } = require('../utils/validators');

function sanitizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
    .map((tag) => tag.trim().toLowerCase())
    .slice(0, 10);
}

function canAccessNote(note, user) {
  return note.userId.toString() === user.id || user.role === 'admin';
}

exports.createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;

  if (!isValidNonEmptyString(title, 120)) {
    throw new ApiError(
      400,
      'Title is required and must be 1-120 characters.'
    );
  }

  if (
    typeof content !== 'string' ||
    content.trim().length === 0 ||
    content.length > 10000
  ) {
    throw new ApiError(
      400,
      'Content is required and must be 1-10000 characters.'
    );
  }

  const note = await noteModel.createNote({
    userId: req.user.id,
    title: title.trim(),
    content: content.trim(),
    tags: sanitizeTags(tags)
  });

  eventBus.emit(EVENTS.NOTE_CREATED, {
    note,
    user: req.user
  });

  res.status(201).json(new ApiResponse(201, 'Note created successfully.', { note }));
});

exports.getMyNotes = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin' && req.query.all === 'true') {
    const notes = await noteModel.findAllNotes();

    return res.status(200).json(
      new ApiResponse(200, 'All notes fetched successfully.', {
        notes
      })
    );
  }

  const notes = await noteModel.findNotesByUser(req.user.id);

  res.status(200).json(
    new ApiResponse(200, 'Notes fetched successfully.', {
      notes
    })
  );
});

exports.getNoteById = asyncHandler(async (req, res) => {
  const note = await noteModel.findNoteById(req.params.id);

  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  if (!canAccessNote(note, req.user)) {
    throw new ApiError(403, 'You cannot access this note.');
  }

  res.status(200).json(
    new ApiResponse(200, 'Note fetched successfully.', {
      note
    })
  );
});

exports.updateNote = asyncHandler(async (req, res) => {
  const note = await noteModel.findNoteById(req.params.id);

  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  if (!canAccessNote(note, req.user)) {
    throw new ApiError(403, 'You cannot update this note.');
  }

  const updates = {};

  if (req.body.title !== undefined) {
    if (!isValidNonEmptyString(req.body.title, 120)) {
      throw new ApiError(
        400,
        'Title must be 1-120 characters if provided.'
      );
    }

    updates.title = req.body.title.trim();
  }

  if (req.body.content !== undefined) {
    if (
      typeof req.body.content !== 'string' ||
      req.body.content.trim().length === 0 ||
      req.body.content.length > 10000
    ) {
      throw new ApiError(
        400,
        'Content must be 1-10000 characters if provided.'
      );
    }

    updates.content = req.body.content.trim();
  }

  if (req.body.tags !== undefined) {
    updates.tags = sanitizeTags(req.body.tags);
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'No valid fields provided to update.');
  }

  const updatedNote = await noteModel.updateNoteByIdAny(
    req.params.id,
    updates
  );

  if (!updatedNote) {
    throw new ApiError(404, 'Note not found.');
  }

  eventBus.emit(EVENTS.NOTE_UPDATED, {
    note: updatedNote,
    user: req.user
  });

  res.status(200).json(
    new ApiResponse(200, 'Note updated successfully.', {
      note: updatedNote
    })
  );
});

exports.deleteNote = asyncHandler(async (req, res) => {
  const note = await noteModel.findNoteById(req.params.id);

  if (!note) {
    throw new ApiError(404, 'Note not found.');
  }

  if (!canAccessNote(note, req.user)) {
    throw new ApiError(403, 'You cannot delete this note.');
  }

  const deleted = await noteModel.deleteNoteByIdAny(req.params.id);

  if (!deleted) {
    throw new ApiError(404, 'Note not found.');
  }

  eventBus.emit(EVENTS.NOTE_DELETED, {
    note,
    user: req.user
  });

  res.status(204).send();
});