import React, { Fragment, useEffect, useCallback, useContext, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Drawer, 
    Grid, 
    Paper, 
    Typography
 } from '@material-ui/core';
import moment from 'moment';
import ExpenseCard from '../Elements/ExpenseCard';
import ExpensesSummary from '../Elements/ExpensesSummary';

import PageContext from '../../context/PageContext';
import DialogContext from '../../context/DialogContext';
import SummaryDrawerContext from '../../context/SummaryDrawerContext';

import fixerKey from '../../APIKeys/fixer';

const styles = theme => ({
    breadcrumbs: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '10px'
    },
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
    paper: { 
        padding: 20,  
        overflowY: 'auto',
        height: '100%', 
    },
    toolbar: theme.mixins.toolbar
})


const ExpensesPage = ({ classes, match }) => {
    
    const { page, pageDispatch } = useContext(PageContext);
    const { dialogDispatch } = useContext(DialogContext);
    const { summaryDrawer, summaryDrawerDispatch } = useContext(SummaryDrawerContext);

    const [trip, setTrip] = useState({});
    const [expenses, setExpenses] = useState([]);
    const [fetchExpenses, setFetchExpenses] = useState(true);

    const handleExpenseFormSubmitCreate = useCallback(async (expense) => {
        dialogDispatch({ type: 'CLOSE' });
        console.log('Expense is: ', expense)

        // Convert the price to CAD for the date spent, for ease of summarizing later.
        let rate = 1;
        if (expense.cost.currency !== 'EUR'){
            try {
                const dateFormatted = moment(expense.dateTime).format('YYYY-MM-DD');
                const fromSymbol = expense.cost.currency;
                const url = `http://data.fixer.io/api/${dateFormatted}?access_key=${fixerKey}&symbols=${fromSymbol}`;
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
                const url = `http://data.fixer.io/api/${dateFormatted}?access_key=${fixerKey}&symbols=${fromSymbol}`;
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


    return (
        <Fragment>
                <div className={classes.toolbar} />
                <Grid container direction='row' justify='center' alignItems='center'>
                    { (expenses && expenses.length > 0)
                        ?   expenses.map((expense, index) => (
                            <Grid item xs={10} key={index}>
                                <ExpenseCard expense={expense} editExpense={editExpense} deleteExpense={deleteExpense} />
                            </Grid>)) 
                        :   <Grid item xs={10}>
                                <Paper className={classes.paper}>
                                    <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                        Add your first expense!
                                    </Typography>
                                </Paper>
                            </Grid>
                    }
                </Grid>
        
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