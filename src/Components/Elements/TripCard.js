import React, { Fragment, Component } from 'react';
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

import FlagIcon from '../../utils/flagIcons';
import getSymbolFromCurrency from 'currency-symbol-map';
import countryCodes from '../../utils/countryCodes';


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
    flags: {
        marginRight: '10px',
        marginTop: '5px',
        marginBottom: '2px'
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
        numUniqueCities: 0,
        totalCost: 0
    }

    async componentDidMount(){
        this.fetchAndSetExpensesData();
    }
    
    componentDidUpdate(prevProps){
        if (prevProps.trip !== this.props.trip){
            this.fetchAndSetExpensesData();
        }
    }

    async fetchAndSetExpensesData(){
        try {
            const response = await fetch(`/get_expenses/${this.props.trip._id}`);
            const expenses = await response.json();

            let dateRange = '';
            let numUniqueCities = 0;
            let uniqueCountries = [];
            let totalCost = 0;

            if (expenses.length > 0){
                // Calculate date range
                const dates = expenses.map(expense => moment(expense.dateTime));
                const maxDate = moment.max(dates);
                const minDate = moment.min(dates);
                dateRange = `${minDate.format('MMM D, YYYY')} - ${maxDate.format('MMM D, YYYY')}`

                // Calculate number of cities
                const cities = expenses.map((expense) => expense.location.city);
                numUniqueCities = cities.filter((city, index, self) => self.indexOf(city) === index).length;

                // Get unique countries
                const countries = expenses.map((expense) => expense.location.country);
                uniqueCountries = countries.filter((country, index, self) => self.indexOf(country) === index);

                // Calculate total cost
                expenses.forEach((expense) => {
                    totalCost += expense.cost.amount;
                });
            }


            this.setState(() => ({
                expenses,
                dateRange,
                numUniqueCities,
                uniqueCountries,
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
                        <Typography variant='body2' color='primary'>
                            {`Cities visited: ${this.state.numUniqueCities}`}
                        </Typography>
                        {this.state.uniqueCountries && 
                            this.state.uniqueCountries.map((country) => {
                                const countryObj = countryCodes.filter((c) => c.name.toLowerCase() === country.toLowerCase());
                                if (countryObj.length > 0){
                                    const code = countryObj[0].code;
                                    return (
                                        <FlagIcon key={code} code={code} size='2x' className={classes.flags} />
                                    )
                                } else {
                                    // Just to shut the compiler up
                                    return (<Fragment key={country}></Fragment>); 
                                }
                            
                            
                        })}
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