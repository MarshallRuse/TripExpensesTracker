import React, { useContext } from 'react';

import { Dialog, DialogContent, DialogTitle} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


import TripForm from './TripForm';
import ExpenseForm from './ExpenseForm';

import DialogContext from '../../context/dialogContext';
import PageContext from '../../context/pageContext';

const FormDialog = ({ open, closeDialog }) => {

    const { page } = useContext(PageContext);
    const { dialog } = useContext(DialogContext);

    const pageType = page.currentPage === 'TRIP' ? 'Trip' : 'Expense';

    return(
        <Dialog open={ open } onClose={ closeDialog }>
            <DialogTitle id="form-dialog-title">{dialog.editMode ? `Edit your ${pageType}`: `Create a New ${pageType}`}</DialogTitle>
            <DialogContent>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                { page.currentPage === 'TRIPS' 
                    ?   <TripForm 
                            trip={dialog.itemToEdit} 
                            onSubmit={dialog.editMode ? dialog.editItemFunction : dialog.createItemFunction}
                        />
                    :   <ExpenseForm
                            expense={dialog.itemToEdit}
                            onSubmit={dialog.editMode ? dialog.editItemFunction : dialog.createItemFunction}
                        />
                }
                </MuiPickersUtilsProvider>
            </DialogContent>
        </Dialog>)
}


export default FormDialog;