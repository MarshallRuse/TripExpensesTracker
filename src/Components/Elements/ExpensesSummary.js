import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    FormControl,
    Grid,
    InputLabel, 
    MenuItem,
    Paper, 
    Select,
    Typography, 
    } from '@material-ui/core';
import { Cancel, CheckCircle, ExpandMore } from '@material-ui/icons';
import getSymbolFromCurrency from 'currency-symbol-map';
import moment from 'moment';

import currencyList from '../../utils/currency_list';
import fixerKey from '../../APIKeys/fixer';


const styles = theme => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    input: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    paper: {
        width: '90%'
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    summaryGrid: {
        paddingTop: '10px',
        width: '100%'
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        width: '100%'
    },
    summaryRowData: {
        textAlign: 'right',
    },
    toolbar: theme.mixins.toolbar
})

const ExpensesSummary = ({ trip, expenses, classes }) => {

    const [preferredCurrency, setPreferredCurrency] = useState(trip.preferredCurrency);
    const [rate, setRate] = useState(1);
    const [expenseCostTotal, setExpenseCostTotal] = useState();
    const [expenseDateRange, setExpenseDateRange] = useState({});
    const [editPreferredCurrencyDialogOpen, setEditPreferredCurrencyDialogOpen] = useState(false);

    useEffect(() => {
        async function calculateTotalInPreferredCurrency(){

            let total = 0;
            expenses.forEach((expense) => {
                total += expense.cost.inEUR;
            });
            
            if (preferredCurrency !== 'EUR'){
                const response = await fetch(`http://data.fixer.io/api/latest?access_key=${fixerKey}&symbols=${preferredCurrency}`);
                const responseJSON = await response.json();
                const exchangeRate = responseJSON.rates[preferredCurrency];
                setRate(exchangeRate);
            }
            setExpenseCostTotal(rate * total);
        }

        calculateTotalInPreferredCurrency();

        // Calculate date range
        const expenseDates = expenses.map(expense => moment(expense.dateTime));
        const expenseDateRange = {
            beginning: moment.min(expenseDates).format('MMM Do YYYY'),
            end: moment.max(expenseDates).format('MMM Do YYYY'),
            numberOfDays: moment.max(expenseDates).diff(moment.min(expenseDates), 'days') + 1
        };
        setExpenseDateRange(expenseDateRange);

    }, [preferredCurrency, expenses, rate]);

    const handlePreferredCurrencyChange = (event) => {
        const currencyCode = event.target.value;
        setPreferredCurrency(currencyCode);
    }

    const onSubmit = async () => {

        setEditPreferredCurrencyDialogOpen(false);
        const submission = {
            preferredCurrency
        };

        try {
            await fetch(`/update_trip/${trip._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submission)
            });

        } catch(err){
            console.log('Could not update summary currency', err)
        }
    }
    
    return (
        <>
            <Grid container className={classes.summaryGrid} justify='center'>
                <Paper className={classes.paper}>
                    <Grid item xs={12}>
                        <Typography variant='body1' align='center' style={{width: '100%'}}>
                            Expense Summary for
                        </Typography>
                        <Typography variant='h5' align='center' gutterBottom={true}>
                            <strong>{trip.title}</strong>
                        </Typography>
                        <Typography variant='body2' align='center' color='textSecondary' gutterBottom>
                            <strong>{expenseDateRange.beginning + ' '}</strong> - 
                            <strong>{' ' + expenseDateRange.end}</strong>
                        </Typography>
                    </Grid>
                    <Divider variant='middle' />
                    <Grid item xs={12} className={classes.summaryRow}>
                        <Grid item xs={6}>
                            <Typography variant='body1'>
                                Total Spent ({preferredCurrency}):
                            </Typography>
                            <Typography 
                                variant='caption' 
                                color='primary' 
                                onClick={() => setEditPreferredCurrencyDialogOpen(true)}
                            >
                                Change currency
                            </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.summaryRowData}>
                            <Typography variant='body1'>
                                <strong>
                                    {getSymbolFromCurrency(preferredCurrency)} 
                                    {' ' + Number.parseFloat(expenseCostTotal).toFixed(2)}
                                </strong> 
                            </Typography>
                            <Typography variant='caption'>
                                (Present Conversion Rate)
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider variant='middle' />
                    <Grid item xs={12} className={classes.summaryRow}>
                        <Grid item xs={6}>
                            <Typography variant='body1'>
                                No. of Transactions:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.summaryRowData}>
                            {expenses.length}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.summaryRow}>
                        <Grid item xs={6}>
                            <Typography variant='body1'>
                                Avg. No. of Transactions:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.summaryRowData}>
                            {(expenses && expenses.length > 0 && expenseDateRange.numberOfDays)
                                ?   (expenses.length / expenseDateRange.numberOfDays).toFixed(2) + '/ day'
                                :   0
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.summaryRow}>
                        <Grid item xs={6}>
                            <Typography variant='body1'>
                                Mean Value:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} className={classes.summaryRowData}>
                            {(expenses && expenses.length > 0 && expenseDateRange.numberOfDays)
                                ?   getSymbolFromCurrency(preferredCurrency) + ' ' 
                                    + (((expenseCostTotal * rate) / expenseDateRange.numberOfDays).toFixed(2)) 
                                    + '/ day'
                                :   0
                            }
                        </Grid>
                    </Grid>
                    <Divider variant='middle' />
                    <Grid item xs={12} className={classes.summaryRow}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                                <Typography className={classes.heading}>Expenses by Category</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container className={classes.summaryGrid} justify='center'>
                                { expenses
                                    .map((expense) => expense.category)
                                    .filter((category, index, self) => self.indexOf(category) === index)
                                    .map((category) => {
                                        return (
                                            <Grid item xs={12} key={category} className={classes.summaryRow}>
                                                <Grid item xs={6}>
                                                    <Typography variant='body1'>
                                                        {category}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} className={classes.summaryRowData}>
                                                    <Typography variant='body1'>
                                                        <strong>
                                                        {getSymbolFromCurrency(preferredCurrency) + ' '}
                                                        {((expenses
                                                            .filter((expense) => expense.category === category)
                                                            .map((expense) => expense.cost.inEUR)
                                                            .reduce((total, cost) => total + cost, 0)
                                                            ) * rate).toFixed(2) // Filter expenses by category, extract their costs in Euro, total, mult by rate
                                                        }
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>)
                                    })}
                                    </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </Grid>
                        <Grid item xs={12} className={classes.summaryRow}>
                        <ExpansionPanel style={{width: '100%'}}>
                            <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                                <Typography className={classes.heading}>Expenses by Date</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <Grid container className={classes.summaryGrid} justify='center'>
                                { expenses
                                    .map((expense) => moment(expense.dateTime).format('MMM Do YYYY'))
                                    .filter((date, index, self) => self.indexOf(date) === index)
                                    .map((date) => {
                                        return (
                                            <Grid item xs={12} key={date} className={classes.summaryRow}>
                                                <Grid item xs={6}>
                                                    <Typography variant='body1'>
                                                        {date}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} className={classes.summaryRowData}>
                                                    <Typography variant='body1'>
                                                        <strong>
                                                        {getSymbolFromCurrency(preferredCurrency) + ' '}
                                                        {((expenses
                                                            .filter((expense) => moment(expense.dateTime).format('MMM Do YYYY') === date)
                                                            .map((expense) => expense.cost.inEUR)
                                                            .reduce((total, cost) => total + cost, 0)
                                                            ) * rate).toFixed(2) // Filter expenses by category, extract their costs in Euro, total, mult by rate
                                                        }
                                                        </strong>
                                                    </Typography>
                                                </Grid>
                                            </Grid>)
                                    })}
                                    </Grid>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </Grid>
                </Paper>
            </Grid>
            <div className={classes.toolbar} />

            {/* Dialog for changing the preferred currency */}
            <Dialog 
                open={ editPreferredCurrencyDialogOpen } 
                onClose={() => setEditPreferredCurrencyDialogOpen(false)}
            >
                <DialogTitle id="form-dialog-title">Change your summary currency</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <InputLabel htmlFor='currency'>Currency *</InputLabel>
                        <Select
                            value={preferredCurrency}
                            onChange={handlePreferredCurrencyChange}
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
                    <div className={[classes.input, classes.spaceApart].join(' ')}>
                        <Button 
                            color="primary" 
                            variant='contained'
                            onClick={onSubmit}
                        >
                            <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                            Edit
                        </Button>
                        <Button 
                            color="secondary" 
                            variant='contained'
                            onClick={() => setEditPreferredCurrencyDialogOpen(false)}
                        >
                            <Cancel style={{marginRight: '5px'}} fontSize='small' />
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default withStyles(styles)(ExpensesSummary);