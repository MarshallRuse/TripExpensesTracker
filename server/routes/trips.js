const express = require('express');
const router = express.Router();

const Trip = require('../../db/models/trip');


// C 
router.post('/create_trip', async (req, res) => {
    let tripObj = { ...req.body };

    const trip = new Trip({
        ...tripObj,
        owner: 'Marshall'
    });

    try {
        await trip.save();
        res.status(201).json(trip);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/update_trip/:tripID/add_category', async (req, res) => {

    const newCategory = req.body.newCategory;

    try {
        const trip = await Trip.findById(req.params.tripID);

        if (newCategory){
            const categories = [...trip.categories, newCategory];
            trip.categories = categories;
            await trip.save();
        }
        res.status(200).json(trip.categories);
    } catch (err) {
        res.status(400).send(err);
    }
});

// R
router.get('/get_trips', async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (err){
        res.status(400).send(err);
    }
});

router.get('/get_trip/:tripID', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.tripID);
        res.status(200).json(trip);
    } catch (err){
        res.status(400).send(err);
    }
})

// U
router.patch('/update_trip/:tripID', async (req, res) => {

    const permittedEdits = ['title', 'preferredCurrency'];
    const filteredFields = Object.keys(req.body).filter((field) => permittedEdits.includes(field));

    try {
        const trip = await Trip.findById(req.params.tripID);
        filteredFields.forEach((field) => {
            trip[field] = req.body[field];
        });
        await trip.save();
        res.status(200).json(trip);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.patch('/update_trip/:tripID/edit_category', async (req, res) => {

    const { originalCategory, editedCategory } = req.body;

    try {
        const trip = await Trip.findById(req.params.tripID);

        if (editedCategory){
            const newCategories = [...trip.categories];
            const index = newCategories.findIndex((category) => category === originalCategory);
            newCategories[index] = editedCategory;
            trip.categories = newCategories;
            await trip.save();
        }
        res.status(200).json(trip.categories);
    } catch (err) {
        res.status(400).send(err);
    }
});


// D
router.delete('/delete_trip/:tripID', async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.tripID);
        res.status(200).json(trip);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/update_trip/:tripID/delete_category', async (req, res) => {

    const { categoryToDelete } = req.body;

    try {
        const trip = await Trip.findById(req.params.tripID);

        if (categoryToDelete){
            const newCategories = [...trip.categories];
            const index = newCategories.findIndex((category) => category === categoryToDelete);
            newCategories.splice(index, 1);
            trip.categories = newCategories;
            await trip.save();
        }
        res.status(200).json(trip.categories);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;