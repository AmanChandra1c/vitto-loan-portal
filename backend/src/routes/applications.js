const express = require('express');
const router = express.Router();
const supabase = require('../db');

// Validation helper for UUID
const isValidUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// POST /api/applications
router.post('/applications', async (req, res) => {
  try {
    const { name, mobile, amount, purpose, language } = req.body;
    
    // Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
    }
    if (!mobile || typeof mobile !== 'string' || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: 'Mobile must be exactly 10 digits' });
    }
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!purpose || typeof purpose !== 'string' || purpose.trim() === '') {
      return res.status(400).json({ error: 'Purpose is required and must be a non-empty string' });
    }
    const validLanguages = ['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'];
    if (!language || !validLanguages.includes(language)) {
      return res.status(400).json({ error: `Language must be one of: ${validLanguages.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([
        { 
          name: name.trim(), 
          mobile, 
          amount: numAmount, 
          purpose: purpose.trim(), 
          language, 
          status: 'pending' 
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/applications
router.get('/applications', async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('applications').select('*').order('created_at', { ascending: false });

    if (status) {
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status filter' });
      }
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/applications/:id/status
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Invalid application ID format' });
    }

    const validStatuses = ['approved', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status must be approved or rejected' });
    }

    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/summary
router.get('/summary', async (req, res) => {
  try {
    const { data, error } = await supabase.from('applications').select('amount, status');
    
    if (error) throw error;

    let total = data.length;
    let totalAmount = 0;
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    data.forEach(app => {
      totalAmount += Number(app.amount);
      if (app.status === 'pending') pending++;
      if (app.status === 'approved') approved++;
      if (app.status === 'rejected') rejected++;
    });

    res.status(200).json({
      total,
      totalAmount,
      pending,
      approved,
      rejected
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
