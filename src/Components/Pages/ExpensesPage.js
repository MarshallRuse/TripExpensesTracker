import React, { Fragment, useEffect, useCallback, useContext, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    Drawer, 
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid, 
    IconButton,
    Paper, 
    Radio,
    RadioGroup,
    Typography
 } from '@material-ui/core';
import { HighlightOff } from '@material-ui/icons';

import moment from 'moment';
import ExpenseCard from '../Elements/ExpenseCard';
import ExpensesSummary from '../Elements/ExpensesSummary';

import PageContext from '../../context/PageContext';
import DialogContext from '../../context/DialogContext';
import SummaryDrawerContext from '../../context/SummaryDrawerContext';

import FlagIcon from '../../utils/flagIcons';
import countryCodes from '../../utils/countryCodes';

import { sortByDateTime, sortByCost, sortByCountry, sortByCategoryCost, sortByCategoryTransactions } from '../../utils/sortingFunctions';

const styles = theme => ({
    drawer: {
        flexShrink: 0,
        zIndex: [theme.zIndex.appBar - 10, '!important']
    },
    flexCenter: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    },
    centerContent: {
        flex: 1,
        height: 'calc(100% - 56px - 56px)'
    },
    flag: {
        marginLeft: '10px'
    },
    groupHeading: {
        // backgroundColor: '#fafafa',
        padding: '10px',
        width: '100%',
    },
    input: {
        marginTop: '10px',
        marginBottom: '20px'
    },
    paper: { 
        padding: 20,  
        overflowY: 'auto',
        height: '100%', 
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    toolbar: theme.mixins.toolbar
})


const ExpensesPage = ({ classes, match }) => {
    
    const { page, pageDispatch } = useContext(PageContext);
    const { dialog, dialogDispatch } = useContext(DialogContext);
    const { summaryDrawer, summaryDrawerDispatch } = useContext(SummaryDrawerContext);

    const [trip, setTrip] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [groupedExpenses, setGroupedExpenses] = useState([]);
    const [fetchExpenses, setFetchExpenses] = useState(true);
    // Sorting Functionality
    const [sortCriteria, setSortCriteria] = useState('dateTime');
    const [sortOrder, setSortOrder] = useState('DESC');

    const handleExpenseFormSubmitCreate = useCallback(async (expense) => {
        dialogDispatch({ type: 'CLOSE' });

        // Convert the price to CAD for the date spent, for ease of summarizing later.
        let rate = 1;
        if (expense.cost.currency !== 'EUR'){
            try {
                const dateFormatted = moment(expense.dateTime).format('YYYY-MM-DD');
                const fromSymbol = expense.cost.currency;
                const url = `http://data.fixer.io/api/${dateFormatted}?access_key=${process.env.REACT_APP_FIXER_API_KEY}&symbols=${fromSymbol}`;
                const response = await fetch(url);
                const responseJSON = await response.json();
                rate = responseJSON.rates[fromSymbol]
            } catch(err){
                console.log('Could not convert currency to EUR', err);
            }
        }

        const costWithEUR = {
            ...expense.cost,
            inEUR: expense.cost.amount / rate,
            rateToEUR: rate
        }

        const expenseToSubmit = {
            ...expense,
            cost: costWithEUR
        }


        try {
            await fetch('/create_expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseToSubmit)
            });
            setFetchExpenses(true);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }, [dialogDispatch])

    const handleExpenseFormSubmitEdit = useCallback(async (expense) => {
        dialogDispatch({ type: 'CLOSE' });
        dialogDispatch({ type: 'SET_EDIT_MODE_FALSE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: undefined });

        // Convert the price to CAD for the date spent, for ease of summarizing later.
        let rate = 1;
        if (expense.cost.currency !== 'EUR'){
            try {
                const dateFormatted = moment(expense.dateTime).format('YYYY-MM-DD');
                const fromSymbol = expense.cost.currency;
                const url = `http://data.fixer.io/api/${dateFormatted}?access_key=${process.env.REACT_APP_FIXER_API_KEY}&symbols=${fromSymbol}`;
                const response = await fetch(url);
                const responseJSON = await response.json();
                rate = responseJSON.rates[fromSymbol]
            } catch(err){
                console.log('Could not convert currency to EUR', err);
            }
        }

        const costWithEUR = {
            ...expense.cost,
            inEUR: expense.cost.amount / rate,
            rateToEUR: rate
        }

        const expenseToSubmit = {
            ...expense,
            cost: costWithEUR
        }

        try {
            await fetch(`/update_expense/${expense._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expenseToSubmit)
            });

            // Save to state
            setFetchExpenses(true);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }, [dialogDispatch]);

    // On load, set the current page to EXPENSES for breadcrumbs and FormDialog to use
    useEffect(() => {
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'EXPENSES'});
        pageDispatch({ type: 'SET_TRIP_ID', tripID: match.params.trip})
        dialogDispatch({ 
            type: 'SET_CREATE_ITEM_FUNCTION', 
            createItemFunction: handleExpenseFormSubmitCreate
        });
        dialogDispatch({
            type: 'SET_EDIT_ITEM_FUNCTION',
            editItemFunction: handleExpenseFormSubmitEdit
        })
        
    }, [    page.currentPage, 
            pageDispatch, 
            dialogDispatch, 
            match.params.trip, 
            handleExpenseFormSubmitCreate, 
            handleExpenseFormSubmitEdit
        ])
    
    // useEffect for fetching the trip object
    useEffect(() => {
        async function getTrip(){
            try {
                const response = await fetch(`/get_trip/${match.params.trip}`);
                const trip = await response.json();
                setTrip(trip);
            } catch(err){
                console.log('Error fetching trip, ', err);
                return undefined;
            }
        }
        getTrip();

    }, [match.params.trip])

    // useEffect for fetching the expenses
    useEffect(() => {

        async function getExpenses(){
            try {
                const response = await fetch(`/get_expenses/${match.params.trip}`);
                const expenses = await response.json();
                setExpenses(expenses);
                setFetchExpenses(false);
            } catch(err){
                console.log('Error fetching expenses, ', err);
                return undefined;
            }
        }

        if (fetchExpenses){
            getExpenses();
        }


    }, [fetchExpenses, match.params.trip]);

    // useEffect for grouping the expenses by sort criteria
    useEffect(() => {
        
        switch(sortCriteria){
            case 'dateTime':
                return setGroupedExpenses(sortByDateTime(expenses, sortOrder));
            case 'cost':
                return setGroupedExpenses(sortByCost(expenses, sortOrder));
            case 'country':
                return setGroupedExpenses(sortByCountry(expenses, sortOrder));
            case 'categoryCost':
                return setGroupedExpenses(sortByCategoryCost(expenses, sortOrder));
            case 'categoryNumTransactions':
                return setGroupedExpenses(sortByCategoryTransactions(expenses, sortOrder));
            default:
                return setGroupedExpenses(sortByDateTime(expenses, 'DESC'));
        }
        
    }, [expenses, sortCriteria, sortOrder])


    const editExpense = (expenseID) => {
        const selectedExpenseToEdit = expenses.find((trip) => trip._id === expenseID);
        dialogDispatch({ type: 'SET_EDIT_MODE_TRUE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: selectedExpenseToEdit });
        dialogDispatch({ type: 'OPEN' });
    }

    const deleteExpense = async (expenseID) => {
        try {
            const responseObj = await fetch(`/delete_expense/${expenseID}`, {
                method: 'DELETE'
            });

            const deletedExpense = await responseObj.json();
            setExpenses(expenses.filter((expense) => expense._id !== deletedExpense._id));

        } catch (err) {
            console.log('Error deleting trip', err);
        }
    }

    // Sort Dialog Functionality
    const handleCloseSortDialog = () => {
        dialogDispatch({ type: 'CLOSE_SORT_DIALOG' });
    }

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    }

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    }


    return (
        <Fragment>
                <div className={classes.toolbar} />
                <Grid container direction='row' justify='center' alignItems='center'>
                    { (groupedExpenses && groupedExpenses.length > 0)
                        ?   groupedExpenses.map((group, groupIndex) => (
                            <Fragment key={'group' + groupIndex}>
                                {group.groupOnValue && 
                                    <>
                                    <Typography variant='h6' align='left' color='primary' className={classes.groupHeading}>
                                        {group.groupOnValue}
                                        {(sortCriteria === 'country' 
                                            && countryCodes.filter((c) => c.name.toLowerCase() === group.groupOnValue.toLowerCase()).length > 0)
                                            && <FlagIcon 
                                                    code={
                                                        countryCodes.filter((c) => c.name.toLowerCase() === group.groupOnValue.toLowerCase())[0].code
                                                    } 
                                                    
                                                    className={classes.flag}
                                                />
                                        }
                                    </Typography>
                                    
                                    </>
                                }
                                {group.groupedItems.map((expense, expenseIndex) => (
                                    <Grid item xs={10} key={'expense' + groupIndex + expenseIndex}>
                                        <ExpenseCard 
                                            expense={expense} 
                                            sortCriteria={sortCriteria}
                                            editExpense={editExpense} 
                                            deleteExpense={deleteExpense} />
                                    </Grid>
                                ))}
                            </Fragment>)) 
                        :   <Grid item xs={10}>
                                <Paper className={classes.paper}>
                                    <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                        Add your first expense!
                                    </Typography>
                                </Paper>
                            </Grid>
                    }
                </Grid>
                
                {/* Sort Dialog */}
                <Dialog 
                open={dialog.sortDialogOpen} 
                onClose={handleCloseSortDialog}
            >
                <DialogTitle id="form-dialog-title">Sort Expenses</DialogTitle>
                <DialogContent>
                    <Grid container direction='row' justify='space-around' wrap='nowrap'>
                        <Grid item xs={6}>
                        <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Sort Criteria</FormLabel>
                        <RadioGroup aria-label="sort-criteria" name="sortCriteria" value={sortCriteria} onChange={handleSortCriteriaChange}>
                            <FormControlLabel 
                                value="dateTime" 
                                control={<Radio color='primary' />} 
                                label="Date & Time" 
                            />
                            <FormControlLabel
                                value="cost" 
                                control={<Radio color='primary' />} 
                                label="Cost" 
                            />
                            <FormControlLabel 
                                value="country" 
                                control={<Radio color='primary' />} 
                                label="Country" 
                            />
                            <FormControlLabel
                                value="categoryCost"
                                control={<Radio color='primary' />}
                                label="Category (Cost)"
                            />
                            <FormControlLabel
                                value="categoryNumTransactions"
                                control={<Radio color='primary' />}
                                label="Category (# Transactions)"
                            />
                        </RadioGroup>
                    </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Order</FormLabel>
                        <RadioGroup aria-label="sort-order" name="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
                            <FormControlLabel
                                value="ASC"
                                control={<Radio color="secondary" />}
                                label="Ascending"
                            />
                            <FormControlLabel
                                value="DESC"
                                control={<Radio color="secondary" />}
                                label="Descending"
                            />
                        </RadioGroup>
                    </FormControl>
                        </Grid>
                    </Grid>
                    
                    
                    <br />
                    <div className={[classes.input, classes.spaceApart].join(' ')}>
                        <IconButton 
                            onClick={handleCloseSortDialog}
                        >
                            <HighlightOff style={{marginRight: '5px'}} fontSize='large' />
                        </IconButton>
                    </div>
                </DialogContent>
            </Dialog>
        
            {/* Expenses Summary */}
            <Drawer 
                className={classes.drawer} 
                anchor="bottom"
                open={summaryDrawer.drawerOpen}
                onClose={() => summaryDrawerDispatch({ type: 'CLOSE' })}
            >
                <ExpensesSummary trip={trip} expenses={expenses} />
                <div className={classes.toolbar} />
            </Drawer>

        </Fragment>
        
    )
}
    


export default withStyles(styles)(ExpensesPage);