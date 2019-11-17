import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { withStyles } from '@material-ui/styles';
import { 
    ButtonBase, 
    Card, 
    CardContent, 
    CardActions,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import getSymbolFromCurrency from 'currency-symbol-map';


const styles = theme => ({
    card: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: '10px'
    },
    cardActions: {
        justifyContent: 'flex-end'
    },
    costDiv: {
        marginTop: '5px',

    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
})

class TripCard extends Component {

    state = {
        moreActionsOpen: false,
        anchorEl: undefined,
        expenses: [],
        dateRange: '',
        totalCost: 0
    }

    async componentDidMount(){
        try {
            const response = await fetch(`/get_expenses/${this.props.trip._id}`);
            const expenses = await response.json();

            let dateRange = '';
            let totalCost = 0;

            if (expenses.length > 0){
                const dates = expenses.map(expense => moment(expense.dateTime));
                const maxDate = moment.max(dates);
                const minDate = moment.min(dates);
                dateRange = `${minDate.format('MMM Do YY')} - ${maxDate.format('MMM Do YY')}`

                expenses.forEach((expense) => {
                    totalCost += expense.cost.amount;
                });
            }


            this.setState(() => ({
                expenses,
                dateRange,
                totalCost
            }));
        } catch (err){
            console.log('Could not find expenses for TripCard,', err);
        }
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
        this.props.editTrip(this.props.trip._id);
        this.toggleMoreActionsOpen();
    }

    handleDeleteSelection = () => {
        this.props.deleteTrip(this.props.trip._id);
        this.toggleMoreActionsOpen();
    }


    render() {

        const { classes, trip } = this.props;
        const currencySymbol = getSymbolFromCurrency(trip.preferredCurrency);

        return (
            
                <ButtonBase 
                    focusRipple
                    style={{width: '100%'}}
                >
                <Card className={classes.card}>
                <Link to={`/${trip._id}/expenses`} className={classes.link}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {trip.title}
                        </Typography>
                        <Typography varaint='body2' color="textSecondary">
                            { this.state.dateRange && this.state.dateRange }
                        </Typography>
                        <Typography variant='h6' color='textPrimary' className={classes.costDiv}>
                            {`${currencySymbol} ${Number.parseFloat(this.state.totalCost).toFixed(2)}`}
                            <Typography variant='caption'>
                                &nbsp;({trip.preferredCurrency})
                            </Typography>
                        </Typography>

                    </CardContent>
                    </Link>
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
                </ButtonBase>
        )
    }
}

export default withStyles(styles)(TripCard);