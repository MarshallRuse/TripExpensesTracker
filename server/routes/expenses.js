const express = require('express');
const router = express.Router();

const Expense = require('../../db/models/expense');


// C 
router.post('/create_expense', async (req, res) => {
    let expenseObj = { ...req.body };    
    console.log('Expense Obj: ', expenseObj);

    const expense = new Expense({
        ...expenseObj,
        owner: 'Marshall'
    });

    try {
        await expense.save();
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).send(err);
    }
});

// R
router.get('/get_expenses/:tripID', async (req, res) => {
    try {
        const expenses = await Expense.find({ trip: req.params.tripID});
        res.status(200).json(expenses);
    } catch (err){
        res.status(400).send(err);
    }
});

// U
router.patch('/update_expense/:expenseID', async (req, res) => {

    const permittedEdits = ['title', 'category', 'description', 'cost', 'paymentMethod', 'dateTime', 'location', 'trip'];
    const filteredFields = Object.keys(req.body).filter((field) => permittedEdits.includes(field));
    console.log('req body is: ', req.body);
    try {
        const expense = await Expense.findById(req.params.expenseID);
        filteredFields.forEach((field) => {
            expense[field] = req.body[field];
        });
        await expense.save();
        res.status(200).json(expense);
    } catch (err) {
        res.status(400).send(err);
    }
});

// D
router.delete('/delete_expense/:expenseID', async (req, res) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.expenseID);
        res.status(200).json(expense);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;