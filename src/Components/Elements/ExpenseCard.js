import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Card, 
    CardContent, 
    CardActions,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import moment from 'moment';
import getSymbolFromCurrency from 'currency-symbol-map';

const styles = theme => ({
    card: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: '10px'
    },
    cardActions: {
        justifyContent: 'flex-end',
        paddingTop: '0px',
        paddingBottom: '2px'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
})

class ExpenseCard extends Component {

    state = {
        moreActionsOpen: false,
        anchorEl: undefined
    }

    toggleMoreActionsOpen = (event) => {

        this.setAnchorEl(event);

        this.setState((prevState) => ({ 
            moreActionsOpen: !prevState.moreActionsOpen
        }))
    }

    setAnchorEl = (event) => {
        const anchorEl = this.state.anchorEl ? undefined : event.currentTarget;

        this.setState(() => ({
            anchorEl
        }))
    }

    handleEditSelection = () => {
        this.props.editExpense(this.props.expense._id);
        this.toggleMoreActionsOpen();
    }

    handleDeleteSelection = () => {
        this.props.deleteExpense(this.props.expense._id);
        this.toggleMoreActionsOpen();
    }

    render() {

        const { classes, expense, sortCriteria } = this.props;
        const currencySymbol = getSymbolFromCurrency(expense.cost.currency);

        return (
            
                <Card className={classes.card}>
                
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {expense.title}
                        </Typography>
                        <Typography variant='body2' color="textSecondary">
                            {expense.category}
                        </Typography>
                        <Typography variant='body1'>
                            {sortCriteria !== 'dateTime' && `${moment(expense.dateTime).format('MMM Do, YYYY')} - `}
                            {moment(expense.dateTime).format('hh:mm a')}
                        </Typography>
                        {expense.location.business && 
                            <Typography variant='body2' color='primary'>
                                {expense.location.business}
                            </Typography>
                        }
                        <Typography variant='body2' color='primary'>
                            {`${expense.location.city}, ${expense.location.country}`}
                        </Typography>
                        <Typography variant='h6' color='textPrimary'>
                            {`${currencySymbol} ${Number.parseFloat(expense.cost.amount).toFixed(2)}`}
                            <Typography variant='caption'>
                                &nbsp;({expense.cost.currency})
                            </Typography>
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                        <MoreHoriz onClick={this.toggleMoreActionsOpen}/>
                        <Menu
                            id="long-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.moreActionsOpen}
                            onClose={this.toggleMoreActionsOpen}
                            PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: 200,
                            },
                            }}
                        >
                            <MenuItem  onClick={this.handleEditSelection}>
                                Edit
                            </MenuItem>
                            <MenuItem onClick={this.handleDeleteSelection}>
                                Delete
                            </MenuItem> 
                        </Menu>
                    </CardActions>
                </Card>
        )
    }
}

export default withStyles(styles)(ExpenseCard);