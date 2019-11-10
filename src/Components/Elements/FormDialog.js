import React, { useContext } from 'react';

import { Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import TripForm from './TripForm';
import ExpenseForm from './ExpenseForm';

import DialogContext from '../../context/DialogContext';
import PageContext from '../../context/PageContext';

const FormDialog = ({ open, closeDialog }) => {

    const { page } = useContext(PageContext);
    const { dialog } = useContext(DialogContext);

    const pageType = page.currentPage === 'TRIP' ? 'Trip' : 'Expense';

    return(
        <Dialog open={ open } onClose={ closeDialog }>
            <DialogTitle id="form-dialog-title">{dialog.editMode ? `Edit your ${pageType}`: `Create a New ${pageType}`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Fill out the form below.
                </DialogContentText>
                { page.currentPage === 'TRIP' 
                    ?   <TripForm 
                            trip={dialog.itemToEdit} 
                            onSubmit={dialog.editMode ? dialog.editItemFunction : dialog.createItemFunction}
                        />
                    :   <ExpenseForm
                            expense={dialog.itemToEdit}
                            onSubmit={dialog.editMode ? dialog.editItemFunction : dialog.createItemFunction}
                        />
                }
                
            </DialogContent>
        </Dialog>)
}


export default FormDialog;