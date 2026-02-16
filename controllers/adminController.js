const User = require('../models/User');
const Task = require('../models/Task');
const sendEmail = require('../utils/emailService');

// Get All Users with Filters
exports.getUsers = async (req, res) => {
  try {
    const { areaOfInterest, city, type } = req.query;
    let query = { role: 'Employee' };
    if (areaOfInterest) query.areaOfInterest = areaOfInterest;
    if (city) query.city = city;
    if (type) query.type = type;

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Review Onboarding Task
exports.reviewOnboarding = async (req, res) => {
  try {
    const { userId, action } = req.body; // action: 'Approve' or 'Reject'
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Fallback if name is missing in old records
    const userName = user.name || "Candidate"; 
    
    // --- EMAIL TEMPLATE CONFIG ---
    // 1. UPLOAD YOUR LOGO to a public URL and paste it here.
    // If you don't have one yet, use this placeholder or your website logo link.
    const LOGO_URL = "https://placehold.co/150x50/020617/06B6D4?text=LEXA"; 
    
    // 2. Common Email Styles
    const containerStyle = `
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
      max-width: 600px; 
      margin: 0 auto; 
      border: 1px solid #E2E8F0; 
      background-color: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
    `;
    
    const headerStyle = `
      background-color: #020617; 
      padding: 30px; 
      text-align: center;
    `;

    const bodyStyle = `
      padding: 40px 30px; 
      color: #334155; 
      line-height: 1.6;
    `;

    const footerStyle = `
      background-color: #F8FAFC; 
      padding: 30px; 
      border-top: 1px solid #E2E8F0;
      font-size: 0.9em;
      color: #64748B;
    `;

    const signatureBlock = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
        <p style="margin: 0 0 5px 0;">Best regards,</p>
        <p style="margin: 0; font-weight: bold; color: #0F172A; font-size: 1.1em;">Jackie Mohanty</p>
        <p style="margin: 0; color: #64748B;">Founder @LEXA</p>
        <div style="margin-top: 10px; font-size: 0.9em;">
          <p style="margin: 2px 0;">P: +91 96502 80857 | E: <a href="mailto:jackie@lexatechnologies.com" style="color: #06B6D4; text-decoration: none;">jackie@lexatechnologies.com</a></p>
          <p style="margin: 5px 0;"><a href="#" style="color: #06B6D4; font-weight: 600; text-decoration: none;">Schedule a Business Consultation &rarr;</a></p>
        </div>
        <p style="margin-top: 15px; font-size: 11px; color: #94A3B8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Building India’s fastest Software Delivery Company</p>
      </div>
    `;

    if (action === 'Approve') {
      user.status = 'Active';

      // --- APPROVAL EMAIL ---
      await sendEmail(
        user.email, 
        "Welcome to the Team! | Lexa Technologies", 
        `
        <div style="${containerStyle}">
          <div style="${headerStyle}">
             <img src="${LOGO_URL}" alt="LEXA" style="max-width: 150px; height: auto;">
          </div>
          <div style="${bodyStyle}">
            <h2 style="color: #0F172A; margin-top: 0;">You’re In! 🚀</h2>
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Congratulations! We’ve reviewed your onboarding task, and we are thrilled to welcome you officially to <strong>Lexa Technologies</strong>.</p>
            <p>Your portal access is now <strong>Active</strong>. You can log in immediately to view your dashboard, access team resources, and start your journey with us.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/portal/login" style="background-color: #06B6D4; color: #FFFFFF; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
            </div>
            ${signatureBlock}
          </div>
          <div style="${footerStyle}">
             &copy; ${new Date().getFullYear()} Lexa Technologies. All rights reserved.
          </div>
        </div>
        `
      );

    } else {
      user.status = 'Rejected'; 

      // --- REJECTION EMAIL ---
      await sendEmail(
        user.email, 
        "Update on your Application | Lexa Technologies", 
        `
        <div style="${containerStyle}">
          <div style="${headerStyle}">
             <img src="${LOGO_URL}" alt="LEXA" style="max-width: 150px; height: auto;">
          </div>
          <div style="${bodyStyle}">
            <h2 style="color: #0F172A; margin-top: 0;">Application Update</h2>
            <p>Hi <strong>${userName}</strong>,</p>
            <p>Thank you for the effort you put into your onboarding task. Our team has reviewed your submission.</p>
            <p>Unfortunately, we are unable to approve your application at this time as the submission did not meet our current requirements for the <strong>${user.areaOfInterest}</strong> role.</p>
            <p>We encourage you to refine your work and apply again in the future.</p>
            ${signatureBlock}
          </div>
          <div style="${footerStyle}">
             &copy; ${new Date().getFullYear()} Lexa Technologies. All rights reserved.
          </div>
        </div>
        `
      );
    }

    await user.save();
    res.json({ message: `User ${action}d successfully` });
  } catch (err) {
    console.error("Review Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Reports
exports.getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'Employee' });
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const pendingUsers = await User.countDocuments({ status: 'Pending' });
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    res.json({ totalUsers, activeUsers, pendingUsers, completedTasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};