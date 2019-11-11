import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField 
} from '@material-ui/core';
import { DateTimePicker } from "@material-ui/pickers";

import DialogContext from '../../context/DialogContext';
import PageContext from '../../context/PageContext';

import currencyList from '../../currency_list';

const categories = ['Food', 'Beer', 'Transport', 'Activity', 'Misc.'];
const paymentMethods = ['Cash', 'Debit', 'Credit - Visa', 'Credit - Mastercard', 'Credit - AmEx', 'Credit - Other', 'Cheque'];

const styles = theme => ({
    input: {
        marginTop: '10px',
        marginBottom: '10px'
    }
})

const ExpenseForm = ({ classes, ...other }) => {
    const { dialog } = useContext(DialogContext);
    const { page } = useContext(PageContext);

    const [title, setTitle] = useState(dialog.editMode ? dialog.itemToEdit.title : '');
    const [cost, setCost] =  useState(dialog.editMode ? dialog.itemToEdit.cost.amount : '');
    const [category, setCategory] = useState(dialog.editMode ? dialog.itemToEdit.category : '');
    const [description, setDescription] = useState(dialog.editMode ? dialog.itemToEdit.description : '');
    const [currency, setCurrency] = useState(dialog.editMode ? dialog.itemToEdit.cost.currency : 'CAD');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedDateTime, setDateTime] = useState(new Date());

    const handleTitleChange = (event) => {
        const title = event.target.value;
        setTitle(title);
    }

    const handleCostChange = (event) => {
        const cost = event.target.value;
        if (!cost || cost.match(/^\d{1,}(\.\d{0,2})?$/)){
            setCost(cost);
        }
    }

    const handleCurrencyChange = (event) => {
        const currencyCode = event.target.value;
        setCurrency(currencyCode);
    } 

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setCategory(category);
    }

    const handlePaymentMethodChange = (event) => {
        const method = event.target.value;
        setPaymentMethod(method);
    }

    const handleDateTimeChange = (thing) => {
        console.log('DateTime thing is: ', thing);
        setDateTime(thing);
    }

    const handleDescriptionChange = (event) => {
        const description = event.target.value;
        setDescription(description);
    }

    const onSubmit = () => {

        let expenseToSubmit = {};

        const numberCost = Number.parseFloat(cost);
        const paymentMethodFormatted = paymentMethod.toUpperCase().replace('-', '_').split(' ').join('');

        if (dialog.editMode){
            expenseToSubmit = {
                ...dialog.itemToEdit,
                title, 
                numberCost,
                category,
                currency,
                paymentMethodFormatted,
                selectedDateTime,
                description,

            }
        } else {
            expenseToSubmit = {
                title,
                numberCost,
                category,
                currency,
                paymentMethodFormatted,
                selectedDateTime,
                description
            }
        }

        const expenseFormatted = {
            title: expenseToSubmit.title,
            description: expenseToSubmit.description,
            category: expenseToSubmit.category,
            cost: {
                amount: expenseToSubmit.numberCost,
                currency: expenseToSubmit.currency
            },
            paymentMethod: expenseToSubmit.paymentMethodFormatted,
            dateTime: expenseToSubmit.selectedDateTime,
            trip: page.tripID
        }

        if (dialog.itemToEdit){
            expenseFormatted._id = dialog.itemToEdit._id;
        }

        dialog.editMode 
        ? dialog.editItemFunction(expenseFormatted) 
        : dialog.createItemFunction(expenseFormatted);

        setTitle('');
        setCost('');
        setCategory('');
        setDescription('');
    }

    return (
        <form>
            <TextField
                label='Expense Title *'
                value={title}
                onChange={handleTitleChange}
                margin='normal'
                variant='outlined'
                className={classes.input}
                fullWidth
            />
            <br />
            <TextField 
                label='Cost *'
                value={cost}
                onChange={handleCostChange}
                inputProps={{
                    type: 'number'
                }}
                margin='normal'
                variant='outlined'
                className={classes.input}
                fullWidth
            />
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor='category'>Category *</InputLabel>
                <Select
                    value={category}
                    onChange={handleCategoryChange}
                    className={classes.input}
                >
                    {categories.map((category) => 
                        <MenuItem 
                            value={category}
                            key={category}
                        >{category}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <br />
            <FormControl>
                <InputLabel htmlFor='currency'>Currency *</InputLabel>
                <Select
                    value={currency}
                    onChange={handleCurrencyChange}
                    className={classes.input}
                >
                    {currencyList.map((currObj) => 
                        <MenuItem 
                            value={currObj.code}
                            key={currObj.code}
                        >{`${currObj.code} - ${currObj.currencyName}`}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor='paymentMethod'>Payment Method</InputLabel>
                <Select
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    className={classes.input}
                >
                    {paymentMethods.map((method) => 
                        <MenuItem 
                            value={method}
                            key={method}
                        >{`${method}`}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <br />
            <DateTimePicker 
                label='Date and Time'
                value={selectedDateTime} 
                onChange={handleDateTimeChange} 
                showTodayButton
                variant='outlined'
                className={classes.input}
                fullWidth
            />
    
            <TextField
                label='Description'
                multiline
                rows="4"
                value={description}
                onChange={handleDescriptionChange}
                margin='normal'
                className={classes.input}
                fullWidth
            />
            <Button 
                color="primary" 
                variant='contained'
                onClick={onSubmit}
                className={classes.input}
                disabled={!title && !cost && !category && !selectedDateTime}
            >
                {dialog.editMode ? 'Edit' : 'Create'}
            </Button>
        </form>
    )
};

export default withStyles(styles)(ExpenseForm);