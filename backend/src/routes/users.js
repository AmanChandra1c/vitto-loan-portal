const express = require('express');
const router = express.Router();
const supabase = require('../db');

// POST /api/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
