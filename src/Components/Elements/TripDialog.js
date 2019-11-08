import React from 'react';

import { Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import TripForm from '../Elements/TripForm';

const TripDialog = ({ open, closeTripDialog, trip, onSubmit }) => (
            <Dialog open={ open } onClose={ closeTripDialog }>
                <DialogTitle id="form-dialog-title">{trip ? 'Edit your Trip': 'Create a New Trip'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill out the form below.
                    </DialogContentText>
                    <TripForm trip={trip} onSubmit={onSubmit}/>
                </DialogContent>
            </Dialog>)


export default TripDialog;