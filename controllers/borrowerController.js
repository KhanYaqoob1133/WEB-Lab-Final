const Borrower = require('../models/borrower');

exports.createBorrower = async (req, res) => {
  try {
    const borrower = new Borrower(req.body);
    await borrower.save();
    res.status(201).json(borrower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.find();
    res.status(200).json(borrowers);
  } catch (error) {
    res.status(500).json({ error: "Error loading borrowers." });
  }
};
