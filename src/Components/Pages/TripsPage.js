import React, { Fragment, useState, useContext, useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Grid, 
    Paper, 
    Typography
 } from '@material-ui/core';

import TripCard from '../Elements/TripCard';

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

const TripsPage = ({ classes, ...other }) => {
    const { page, pageDispatch } = useContext(PageContext);
    const { dialog, dialogDispatch } = useContext(DialogContext);

    const [trips, setTrips] = useState([]);

    // On load, set the current page to trips for breadcrumbs and FormDialog to use
    if (page.currentPage !== 'TRIPS'){
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'TRIPS'});
        dialogDispatch({ 
            type: 'SET_CREATE_ITEM_FUNCTION', 
            createItemFunction: handleTripFormSubmitCreate
        });
        dialogDispatch({
            type: 'SET_EDIT_ITEM_FUNCTION',
            editItemFunction: handleTripFormSubmitEdit
        })
    }
    useEffect(() => {
        return () => {
            console.log('Cleaned up');
        }
    }, [])

    // Watch for changes to list of Trips
    useEffect(() => {
        async function loadTripsOnUpdate(){
            const loadedTrips = await loadTrips();
            setTrips(loadedTrips);
        }
        loadTripsOnUpdate();
    }, [trips]);


    // BACKEND-FACING OPERATIONS
        // Trips
    const loadTrips = async () => {
        try {
            const responseObj = await fetch('/get_trips');
            const trips = await responseObj.json();
            return trips;
        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }

    const editTrip = (tripID) => {
        const selectedTripToEdit = trips.find((trip) => trip._id === tripID);
        dialogDispatch({ type: 'SET_EDIT_MODE_TRUE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: selectedTripToEdit });
        dialogDispatch({ type: 'OPEN' });
    }

    const deleteTrip = async (tripID) => {
        try {
            const responseObj = await fetch(`/delete_trip/${tripID}`, {
                method: 'DELETE'
            });

            const deletedTrip = await responseObj.json();
            setTrips(trips.filter((trip) => trip._id !== deletedTrip._id));

        } catch (err) {
            console.log('Error deleting trip', err);
        }
    }

    async function handleTripFormSubmitCreate(trip){
        dialogDispatch({ type: 'CLOSE' });

        try {
            const responseObj = await fetch('/create_trip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trip)
            });
            const newTrip = await responseObj.json();
            setTrips([ ...trips, newTrip]);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }

    async function handleTripFormSubmitEdit(trip){
        dialogDispatch({ type: 'CLOSE' });
        dialogDispatch({ type: 'SET_EDIT_MODE_FALSE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: undefined });

        try {
            const responseObj = await fetch(`/update_trip/${trip._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trip)
            });

            const newTrip = await responseObj.json();

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
            const tripToReplaceIndex = trips.findIndex((trip) => trip._id === newTrip._id );
            console.log('Trip to replace index, ', tripToReplaceIndex)
            let newTrips = [...trips];
            newTrips[tripToReplaceIndex] = newTrip;

            // Save to state
            setTrips(newTrips);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }

    return (
        <Fragment>
            <Grid container direction='column' alignItems='center' justify='center' className={classes.centerContent}>
                <Grid container direction='row' justify='center' alignItems='center' className={classes.cardList}>
                    { trips.length > 0 
                        ?   trips.map((trip, index) => (
                                <Grid item xs={10} key={index}>
                                    <TripCard trip={trip} editTrip={editTrip} deleteTrip={deleteTrip} />
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
        </Fragment>
        
        )
    }
    


    


export default withStyles(styles)(TripsPage);