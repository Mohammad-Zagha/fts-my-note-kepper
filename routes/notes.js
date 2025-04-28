const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const { getPaginationData } = require('../utils/pagenation');

router.get('/', async (req, res) => {
  try {
    const total = await Note.countDocuments();
    
    const { skip, limit, pagination } = getPaginationData({ 
      page: req.query.page, 
      limit: req.query.limit, 
      total 
    });
    
    // Get paginated notes
    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: notes.length,
      pagination,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve notes',
      error: error.message
    });
  }
});

// Search notes by title or content
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter is required'
      });
    }
    
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    };
    
    const total = await Note.countDocuments(searchQuery);
    
    const { skip, limit, pagination } = getPaginationData({ 
      page: req.query.page, 
      limit: req.query.limit, 
      total 
    });
    
    const notes = await Note.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: notes.length,
      pagination,
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search notes',
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve note',
      error: error.message
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the note'
      });
    }
    
    const note = await Note.create({
      title,
      content
    });
    
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create note',
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title or content to update'
      });
    }
    
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to update note',
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: error.message
    });
  }
});

module.exports = router;