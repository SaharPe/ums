const router = require('express').Router();
const User = require('../models/User');

// Create user
router.post('/', async (req, res) => {
    try {
        // Check if user is already registered, if so return it
        // const existingUser = await User.findOne({ username: req.body.username });

        const existingUser = await User.findOne({ username: { $regex: `^${req.body.username}$`, $options: 'i' } });
        if (existingUser) return res.json(existingUser);

        // Create user object
        const user = new User({
            username: req.body.username,
            status: 'Working'
        });

        // Save user in db
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

// Update user
router.patch('/:id', async (req, res) => {
    try {
        // Find user by id and update it
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, { status: req.body.status }, { new: true, useFindAndModify: false });
        if (!user) return res.status(404).json({ message: 'User is not registered' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

// Get user
router.get('/:id', async (req, res) => {
    try {
        // Find user by id
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User is not registered' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        if (!users) return res.status(404).json({ message: 'Could not get users' });
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        // Find user by id and delete it
        const user = await User.findByIdAndDelete({ _id: req.params.id });
        if (!user) return res.status(404).json({ message: 'User is not registered' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error });
    }
});

module.exports = router;