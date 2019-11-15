const mongoose = require('mongoose');
const validator = require('validator');




const expenseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    cost: {
        amount: {
            type: Number,
            required: true,
            default: 0.00
        },
        currency: {
            type: String,
            required: true,
            default: 'CAD'
        },
        inEUR: {
            type: Number,
            required: true,
        },
        rateToEUR: {
            type: Number,
            required: true
        }
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'DEBIT', 'CREDIT_VISA', 'CREDIT_MASTERCARD', 'CREDIT_AMEX', 'CREDIT_OTHER', 'CHEQUE'],
        default: 'CASH'
    },
    dateTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    location: {
        business: {
            type: String,
            required: false,
            trim: true
        },
        city: {
            type: String,
            required: false,
            trim: true
        },
        country: {
            type: String,
            required: false,
            trim: true
        }
    },
    trip: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Trip'
    }
});


const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;