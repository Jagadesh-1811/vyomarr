const Contact = require('../models/Contact');
const { sendEmail, emailTemplates } = require('../config/email');

// Submit a new contact message (public)
const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newContact = new Contact({
      name,
      email: email.toLowerCase(),
      subject,
      message,
      status: 'new'
    });

    await newContact.save();

    // Send confirmation email to user
    try {
      await sendEmail(
        email,
        'We received your message - Vyomarr',
        `
        <div style="font-family: 'Lato', sans-serif; max-width: 600px; margin: 0 auto; background: #000b49; padding: 40px; border-radius: 16px;">
          <h1 style="color: #fc4c00; font-size: 28px; margin-bottom: 20px;">Thank you for reaching out!</h1>
          <p style="color: #f8f9f9; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
          <p style="color: #bfc3c6; font-size: 16px; line-height: 1.6;">
            We have received your message regarding "<strong style="color: #f8f9f9;">${subject}</strong>". 
            Our team will review it and get back to you within 24-48 hours.
          </p>
          <p style="color: #bfc3c6; font-size: 14px; margin-top: 30px;">
            Best regards,<br/>
            <strong style="color: #fc4c00;">The Vyomarr Team</strong>
          </p>
        </div>
        `
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Your message has been sent successfully!', 
      data: newContact 
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ error: 'Server Error during contact submission' });
  }
};

// Get all contact messages (admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch contacts' });
  }
};

// Get single contact by ID (admin)
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch contact' });
  }
};

// Update contact status (admin)
const updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    const updateData = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (status === 'replied') updateData.repliedAt = new Date();

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ error: 'Could not update contact' });
  }
};

// Delete contact message (admin)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete contact' });
  }
};

// Get contact statistics (admin)
const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });
    const readCount = await Contact.countDocuments({ status: 'read' });
    const repliedCount = await Contact.countDocuments({ status: 'replied' });
    const resolvedCount = await Contact.countDocuments({ status: 'resolved' });

    res.json({
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount,
      resolved: resolvedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch contact statistics' });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
};
