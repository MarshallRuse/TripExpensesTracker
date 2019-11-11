import React, { Fragment, useEffect, useContext, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Paper, Typography } from '@material-ui/core';
import ExpenseCard from '../Elements/ExpenseCard';

import PageContext from '../../context/PageContext';
import DialogContext from '../../context/DialogContext';

const styles = theme => ({
    breadcrumbs: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '10px'
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
    }
})

const ExpensesPage = ({ classes, match }) => {

    const { page, pageDispatch } = useContext(PageContext);
    const { dialog, dialogDispatch } = useContext(DialogContext);

    const [expenses, setExpenses] = useState([]);


    // On load, set the current page to trips for breadcrumbs and FormDialog to use
    if (page.currentPage !== 'EXPENSES'){
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
    }
    useEffect(() => {
        return () => {
            console.log('Cleaned up');
        }
    }, []);

    useEffect(() => {
        async function loadExpensesOnUpdate(){
            const loadedExpenses = await loadExpenses();
            setExpenses(loadedExpenses);
        }
        loadExpensesOnUpdate();
    }, [expenses]);

    const loadExpenses = async () => {
        try {
            const responseObj = await fetch('/get_expenses');
            const expenses = await responseObj.json();
            return expenses;
        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }



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


    async function handleExpenseFormSubmitCreate(expense){
        dialogDispatch({ type: 'CLOSE' });

        try {
            const responseObj = await fetch('/create_expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense)
            });
            const newExpense = await responseObj.json();
            setExpenses([ ...expenses, newExpense]);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }

    async function handleExpenseFormSubmitEdit(expense){
        dialogDispatch({ type: 'CLOSE' });
        dialogDispatch({ type: 'SET_EDIT_MODE_FALSE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: undefined });

        try {
            const responseObj = await fetch(`/update_expense/${expense._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(expense)
            });

            const newExpense = await responseObj.json();

            // ******
            // This next part doesn't work yet without another call to loadTrips in 
            // the useEffect watching for a change to 'trips'. So the code below doesn't strictly
            // do anything yet because the trips array is overwritten by that call.  This function 
            // doesnt have access to the state, because its actually being placed on the dialogContext before
            // the state is initialized.  The trips are outside of the closure of the function being called in 
            // TripForm.  I hope to find a way to remedy this without needing to call for the entire list of trips
            // again. 
            // *******
            // Replace in same position, so edited trip doesn't go to end of array
            const expenseToReplaceIndex = expenses.findIndex((expense) => expense._id === newExpense._id );
            console.log('Expense to replace index, ', expenseToReplaceIndex)
            let newExpenses = [...expenses];
            newExpenses[expenseToReplaceIndex] = newExpense;

            // Save to state
            setExpenses(newExpenses);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }

    return (
        <Fragment>
            <Grid container direction='column' alignItems='center' justify='center' className={classes.centerContent}>
                <Grid item xs={12}>
                    
                </Grid>
                <Grid container direction='row' justify='center' alignItems='center'>
                    { expenses.length > 0
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
            </Grid>
        </Fragment>
        
    )
}
    


export default withStyles(styles)(ExpensesPage);