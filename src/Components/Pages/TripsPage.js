import React, { Fragment, useState, useContext, useEffect, useCallback } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
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

import TripCard from '../Elements/TripCard';

import PageContext from '../../context/PageContext';
import DialogContext from '../../context/DialogContext';

import { sortTripsByDateTime, sortTripsByCost, sortTripsByNumCities } from '../../utils/sortingFunctions';


const styles = theme => ({
    flexCenter: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    },
    centerContent: {
        flex: 1,
        height: 'calc(100% - 56px - 56px)'
    },
    cardList: {
        height: '100%',
        overflowY: 'auto'
    },
    input: {
        marginTop: '10px',
        marginBottom: '20px'
    },
    paper: { 
        height: '100%', 
        padding: 20,
        overflowY: 'auto' 
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-around'
    },
    toolbar: theme.mixins.toolbar
})

const TripsPage = ({ classes, ...other }) => {
    const { pageDispatch } = useContext(PageContext);
    const { dialog, dialogDispatch } = useContext(DialogContext);

    const [trips, setTrips] = useState([]);
    // Sorting functionality
    const [sortedTrips, setSortedTrips] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('dateTime');
    const [sortOrder, setSortOrder] = useState('DESC');

    const handleTripFormSubmitCreate = useCallback(async (trip) => {
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
    }, [dialogDispatch, trips]);

    const handleTripFormSubmitEdit = useCallback(async (trip) => {
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
            let newTrips = [...trips];
            newTrips[tripToReplaceIndex] = newTrip;

            // Save to state
            setTrips(newTrips);

        } catch(err){
            console.log('Error creating trip, ', err);
        }
    }, [dialogDispatch, trips]);


    useEffect(() => {
        async function loadTripsOnMount(){
            const loadedTrips = await loadTrips();
            setTrips(loadedTrips);
        }
        loadTripsOnMount();

        return () => {
            console.log('Cleaned up');
        }
    }, [])

    // On load, set the current page to trips for breadcrumbs and FormDialog to use
    useEffect(() => {
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'TRIPS'});
        pageDispatch({ type: 'SET_TRIP_ID', tripID: undefined});
        dialogDispatch({ 
            type: 'SET_CREATE_ITEM_FUNCTION', 
            createItemFunction: handleTripFormSubmitCreate
        });
        dialogDispatch({
            type: 'SET_EDIT_ITEM_FUNCTION',
            editItemFunction: handleTripFormSubmitEdit
        })
    }, [pageDispatch, dialogDispatch, handleTripFormSubmitCreate, handleTripFormSubmitEdit]);

    // useEffect for grouping the trips by sort criteria
    useEffect(() => {
        
        async function selectSort(){
            let sortedTrips = [];
            switch(sortCriteria){
                case 'dateTime':
                    sortedTrips = await sortTripsByDateTime(trips, sortOrder);
                    break;
                case 'cost':
                    sortedTrips = await sortTripsByCost(trips, sortOrder);
                    break;
                case 'numCities':
                    sortedTrips = await sortTripsByNumCities(trips, sortOrder);
                    break;
                default:
                    sortedTrips = await sortTripsByDateTime(trips, 'DESC');
            }
            
            setSortedTrips(sortedTrips);
        }
        selectSort();
        
    }, [trips, sortCriteria, sortOrder])


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
                { (sortedTrips && sortedTrips.length > 0) 
                    ?   sortedTrips.map((trip, index) => (
                                <Grid item xs={10} key={index}>
                                    <TripCard trip={trip} editTrip={editTrip} deleteTrip={deleteTrip} />
                                </Grid>
                            )
                        )
                    :   <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                    Add your first trip!
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
                <DialogTitle id="form-dialog-title">Sort Trips</DialogTitle>
                <DialogContent>
                    <Grid container direction='row' justify='space-around' wrap='nowrap'>
                        <Grid item xs={6}>
                        <FormControl component="fieldset" className={classes.formControl}>
                        <FormLabel component="legend">Sort Criteria</FormLabel>
                        <RadioGroup aria-label="sort-criteria" name="sortCriteria" value={sortCriteria} onChange={handleSortCriteriaChange}>
                            <FormControlLabel 
                                value="dateTime" 
                                control={<Radio color='primary' />} 
                                label="Date" 
                            />
                            <FormControlLabel
                                value="cost" 
                                control={<Radio color='primary' />} 
                                label="Cost" 
                            />
                            <FormControlLabel 
                                value="numCities" 
                                control={<Radio color='primary' />} 
                                label="# Cities" 
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
        </Fragment>
        
        )
    }
    


    


export default withStyles(styles)(TripsPage);