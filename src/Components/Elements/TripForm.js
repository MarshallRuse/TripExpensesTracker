import React, { useState, useContext } from 'react';
import { TextField, Button } from '@material-ui/core';

import DialogContext from '../../context/DialogContext';

const TripForm = () => {

    const { dialog } = useContext(DialogContext);
    const [title, setTitle] = useState(dialog.editMode ? dialog.itemToEdit.title : '');


    const handleTitleChange = (event) => {
        const title = event.target.value;
        setTitle(title);
    }

    const onSubmit = () => {

        let tripToSubmit = {};
        if (dialog.editMode){
            tripToSubmit = {
                ...dialog.itemToEdit,
                title
            }
        } else {
            tripToSubmit = {
                title
            }
        }

        dialog.editMode 
        ? dialog.editItemFunction(tripToSubmit) 
        : dialog.createItemFunction(tripToSubmit);

        setTitle('');
    }

    return (
        <form>
            <TextField
                label='Trip Title'
                value={title}
                onChange={handleTitleChange}
                margin='normal'
                fullWidth
            />
            <Button 
                color="primary" 
                variant='contained'
                onClick={onSubmit}
                disabled={!title}
            >
                {dialog.editMode ? 'Edit' : 'Create'}
            </Button>
        </form>
    )
};

export default TripForm;