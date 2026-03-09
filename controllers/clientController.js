const Client = require('../models/Client');

// exports.getClients = async (req, res) => {
//   try {
//     const clients = await Client.find().sort({ createdAt: -1 });
//     res.json(clients);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

exports.getClients = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      // Admins see all pipeline stages and project values
      const clients = await Client.find().sort({ createdAt: -1 });
      res.json(clients);
    } else {
      // Employees ONLY see "Active Client" and DO NOT receive the projectValue field
      const clients = await Client.find({ status: 'Active Client' })
        .select('-projectValue -status') // Hide these fields
        .sort({ createdAt: -1 });
      res.json(clients);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addClient = async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, industry, projectValue } = req.body;
    const newClient = new Client({
      companyName, contactPerson, email, phone, industry, projectValue, status: 'Lead'
    });
    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const client = await Client.findByIdAndUpdate(id, { status }, { new: true });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addClientNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    client.notes.push({
      text,
      addedBy: req.user.id,
      addedByName: req.user.name || 'Admin' // req.user comes from authMiddleware
    });

    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};