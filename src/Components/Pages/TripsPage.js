import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Grid, 
    Paper, 
    Typography
 } from '@material-ui/core';

import TripCard from '../Elements/TripCard';
import TripDialog from '../Elements/TripDialog';


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
        height: 'calc(100% - 56px - 56px - 40px)'
    },
    cardList: {
        height: '100%',
        overflowY: 'auto'
    },
    paper: { 
        padding: 20,  
        height: '100%', 
    }
})

class TripsPage extends Component {

    state = {
        trips: [],
        tripToEdit: {},
        tripEditMode: false,
        tripDialogOpen: false,
    }
    
    async componentDidMount(){
        this.loadTrips();
    }

    // FRONTEND OPERATIONS
        // Trips

    selectTripToEdit = (tripID) => {
        this.setState((prevState) => ({
            tripToEdit: prevState.trips.find((trip) => trip._id === tripID)
        }))
    }
    
    // Open and Close Trip Dialog functions.
    // Note, was originally simply a toggle function, but due to complexity
    // of needing to add selected trip on edit open, and clear selected trips on close,
    // was seperated into 2 functions.
    openTripDialog = () => {
        this.setState(() => ({ tripDialogOpen: true }));
    }

    closeTripDialog = () => {
        this.setState(() => ({ 
            tripDialogOpen: false,
            tripEditMode: false,
            tripToEdit: {}
        }));
    }

    // BACKEND-FACING OPERATIONS
        // Trips
        loadTrips = async () => {
            try {
                const responseObj = await fetch('/get_trips');
                const trips = await responseObj.json();
                this.setState(() => ({
                    trips
                }))
            } catch(err){
                console.log('Error creating trip, ', err);
            }
        }
    
        editTrip = (tripID) => {
            this.setState((prevState) => ({
                tripToEdit: prevState.trips.find((trip) => trip._id === tripID),
                tripEditMode: true,
                tripDialogOpen: true
            }))
        }
    
        deleteTrip = async (tripID) => {
            try {
                const responseObj = await fetch(`/delete_trip/${tripID}`, {
                    method: 'DELETE'
                });
    
                const deletedTrip = await responseObj.json();
    
                this.setState((prevState) => ({
                    trips: prevState.trips.filter((trip) => trip._id !== deletedTrip._id)
                }));
            } catch (err) {
                console.log('Error deleting trip', err);
            }
        }
    
        handleTripFormSubmitCreate = async (trip) => {
            this.closeTripDialog();
    
            try {
                const responseObj = await fetch('/create_trip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trip)
                });
                const newTrip = await responseObj.json();
    
                this.setState((prevState) => ({
                    trips: [
                        ...prevState.trips,
                        newTrip
                    ]
                }));
    
            } catch(err){
                console.log('Error creating trip, ', err);
            }
        }
    
        handleTripFormSubmitEdit = async (trip) => {
            this.closeTripDialog();
    
            try {
                const responseObj = await fetch(`/update_trip/${trip._id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trip)
                });
                const newTrip = await responseObj.json();
    
                this.setState((prevState) => ({
                    trips: [
                        ...prevState.trips.filter((trip) => trip._id !== newTrip._id),
                        newTrip
                    ]
                }));
    
            } catch(err){
                console.log('Error creating trip, ', err);
            }
        }

    render(){

        const { classes } = this.props;
        return (
            <Fragment>
                <Grid container direction='column' alignItems='center' justify='center' className={classes.centerContent}>
                    <Grid container direction='row' justify='center' alignItems='center' className={classes.cardList}>
                        { this.state.trips 
                            ?   this.state.trips.map((trip, index) => (
                                    <Grid item xs={10} key={index}>
                                        <TripCard trip={trip} editTrip={this.editTrip} deleteTrip={this.deleteTrip} />
                                    </Grid>))
                            
                            :   <Grid item xs={10}>
                                    <Paper className={classes.paper}>
                                        <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                            Add your first trip!
                                        </Typography>
                                    </Paper>
                                </Grid>
                        }
                    </Grid>
                </Grid>
                <TripDialog 
                    open={this.state.tripDialogOpen}
                    trip={this.state.tripToEdit} 
                    closeTripDialog={this.closeTripDialog}
                    onSubmit={this.state.tripEditMode ? this.handleTripFormSubmitEdit : this.handleTripFormSubmitCreate} 
                />
            </Fragment>
            
        )
    }
    
}

    


export default withStyles(styles)(TripsPage);