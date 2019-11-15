import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Button, 
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField, 
    Typography
} from '@material-ui/core';
import { DateTimePicker } from "@material-ui/pickers";
import { Add, Cancel, CheckCircle } from '@material-ui/icons';

import LocationAutocomplete from './LocationAutocomplete';
import DialogContext from '../../context/DialogContext';
import PageContext from '../../context/PageContext';

import currencyList from '../../currency_list';

const categories = ['Food', 'Beer', 'Transport', 'Activity', 'Misc.'];
const paymentMethods = ['Cash', 'Debit', 'Credit - Visa', 'Credit - Mastercard', 'Credit - AmEx', 'Credit - Other', 'Cheque'];

const styles = theme => ({
    actionMenuItem: {
        backgroundColor: '#fafafa',
        color: 'blue'
    },
    input: {
        marginTop: '10px',
        marginBottom: '20px'
    },
    sectionTitle: {
        paddingBottom: '10px',
        paddingTop: '10px'
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-around'
    }
});

const ExpenseForm = ({ classes, ...other }) => {
    const { dialog, dialogDispatch } = useContext(DialogContext);
    const { page } = useContext(PageContext);

    const [title, setTitle] = useState(dialog.editMode ? dialog.itemToEdit.title : '');
    const [cost, setCost] =  useState(dialog.editMode ? dialog.itemToEdit.cost.amount : '');
    const [category, setCategory] = useState(dialog.editMode ? dialog.itemToEdit.category : '');
    const [description, setDescription] = useState(dialog.editMode ? dialog.itemToEdit.description : '');
    const [currency, setCurrency] = useState(dialog.editMode ? dialog.itemToEdit.cost.currency : 'CAD');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedDateTime, setDateTime] = useState(new Date());
    const [business, setBusiness] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);

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

    const handleBusinessChange = (event) => {
        const business = event.target.value;
        setBusiness(business);
    }

    const handleCityChange = (event) => {
        const city = event.target.value;
        setCity(city);
    }

    const handleCountryChange = (event) => {
        const country = event.target.value;
        setCountry(country);
    }

    const handleDescriptionChange = (event) => {
        const description = event.target.value;
        setDescription(description);
    }

    const handleCancel = (event) => {
        dialogDispatch({ type: 'CLOSE' });

        setTitle('');
        setCost('');
        setCategory('');
        setDescription('');
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

    const openAddCategoryDialog = () => {
        setNewCategoryDialogOpen(true);
    }

    const handleNewCategoryChange = (event) => {
        const newCat = event.target.value;
        setNewCategory(newCat);
    }

    const onAddCategory = async () => {
        try {

            const catObj = {
                newCategory
            };

            const response = await fetch(`/update_trip/${page.tripID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(catObj)
            });
            const responseObj = await response.json();
            

        } catch(err){
            console.log('Error adding category,', err)
        }
    }

    return (
        <>
        <form>
            <Typography variant='body2' align='center' gutterBottom className={classes.sectionTitle}>
                <strong>Expense Info</strong>
            </Typography>
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
                    <MenuItem
                        key={'ADD_CATEGORY'}
                        value={''}
                        className={classes.actionMenuItem}
                        onClick={openAddCategoryDialog}
                    >
                        Add Category 
                        <Add />
                    </MenuItem>
                </Select>
            </FormControl>
            <br />
            <FormControl fullWidth>
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
            <TextField
                label='Description'
                multiline
                rows="2"
                value={description}
                onChange={handleDescriptionChange}
                margin='normal'
                className={classes.input}
                fullWidth
            />
            <br />
            <Typography variant='body2' align='center' gutterBottom className={classes.sectionTitle}>
                <strong>Date & Time</strong>
            </Typography>
            <DateTimePicker 
                label='Date and Time'
                value={selectedDateTime} 
                onChange={handleDateTimeChange} 
                showTodayButton
                variant='outlined'
                className={classes.input}
                fullWidth
            />
            <br />
            <Typography variant='body2' align='center' gutterBottom className={classes.sectionTitle}>
                <strong>Location</strong>
            </Typography>
            <LocationAutocomplete />
            <br />
            <TextField
                label='Business'
                value={business}
                onChange={handleBusinessChange}
                margin='normal'
                className={classes.input}
                fullWidth
            />
            <br />
            <TextField
                label='City *'
                value={city}
                onChange={handleCityChange}
                margin='normal'
                className={classes.input}
                fullWidth
            />
            <br />
            <TextField
                label='Country *'
                value={country}
                onChange={handleCountryChange}
                margin='normal'
                className={classes.input}
                fullWidth
            />
            <br />
            <div className={[classes.input, classes.spaceApart].join(' ')}>
                <Button 
                    color="primary" 
                    variant='contained'
                    onClick={onSubmit}
                    disabled={!title || !cost || !category || !selectedDateTime}
                >
                    <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                    {dialog.editMode ? 'Edit' : 'Create'}
                </Button>
                <Button 
                    color="secondary" 
                    variant='contained'
                    onClick={handleCancel}
                >
                    <Cancel style={{marginRight: '5px'}} fontSize='small' />
                    Cancel
                </Button>
            </div>
        </form>
        <Dialog 
            open={ newCategoryDialogOpen } 
            onClose={() => setNewCategoryDialogOpen(false)}
        >
            <DialogTitle id="form-dialog-title">Add a new Expense Category</DialogTitle>
            <DialogContent>
                <TextField 
                    label='Expense Category'
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    margin='normal'
                    className={classes.input}
                    fullWidth
                />
                <br />
                <div className={[classes.input, classes.spaceApart].join(' ')}>
                    <Button 
                        color="primary" 
                        variant='contained'
                        onClick={onAddCategory}
                    >
                        <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                        Add
                    </Button>
                    <Button 
                        color="secondary" 
                        variant='contained'
                        onClick={() => setNewCategoryDialogOpen(false)}
                    >
                        <Cancel style={{marginRight: '5px'}} fontSize='small' />
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
        )
};

export default withStyles(styles)(ExpenseForm);