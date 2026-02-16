// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     // Added name and phone to destructuring
//     const { name, email, phone, password, areaOfInterest, city, state, type } = req.body;
    
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       name,   // Save Name
//       email,
//       phone,  // Save Phone
//       password: hashedPassword,
//       areaOfInterest,
//       city,
//       state,
//       type,
//       status: 'Pending'
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'Registration successful. Please login.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.json({ token, user: { id: user._id, role: user.role, status: user.status, name: user.email } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { 
      name, email, phone, password, 
      areaOfInterest, city, state, type,
      // Capture submission data directly during register
      submissionText, submissionLink 
    } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      areaOfInterest,
      city,
      state,
      type,
      status: 'Pending',
      // Save the assessment immediately
      onboardingSubmission: {
        text: submissionText,
        link: submissionLink,
        submittedAt: new Date()
      }
    });

    await newUser.save();
    
    // Optional: Auto-login token generation if you wanted them logged in
    // But since we redirect to Home, we just return success
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ... keep exports.login as is
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.json({ token, user: { id: user._id, role: user.role, status: user.status, name: user.name } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };