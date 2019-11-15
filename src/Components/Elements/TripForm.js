import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import {  
    Button,
    FormControl, 
    InputLabel, 
    MenuItem,
    Select, 
    TextField 
} from '@material-ui/core';
import { CheckCircle, Cancel } from '@material-ui/icons';

import DialogContext from '../../context/DialogContext';

import currencyList from '../../currency_list';

const styles = theme => ({
    input: {
        marginTop: '10px',
        marginBottom: '10px'
    },
    spaceApart: {
        display: 'flex',
        justifyContent: 'space-around'
    }
});

const TripForm = ({ classes }) => {

    const { dialog, dialogDispatch } = useContext(DialogContext);
    const [title, setTitle] = useState(dialog.editMode ? dialog.itemToEdit.title : '');
    const [preferredCurrency, setPreferredCurrency] = useState(dialog.editMode ? dialog.itemToEdit.preferredCurrency : 'CAD');


    const handleTitleChange = (event) => {
        const title = event.target.value;
        setTitle(title);
    }

    const handlePreferredCurrencyChange = (event) => {
        const currencyCode = event.target.value;
        setPreferredCurrency(currencyCode);
    } 

    const handleCancel = (event) => {
        dialogDispatch({ type: 'CLOSE' });

        setTitle('');
        setPreferredCurrency('CAD');
    }

    const onSubmit = () => {

        let tripToSubmit = {};
        if (dialog.editMode){
            tripToSubmit = {
                ...dialog.itemToEdit,
                title,
                preferredCurrency
            }
        } else {
            tripToSubmit = {
                title,
                preferredCurrency
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
            <br />
            <FormControl>
                <InputLabel htmlFor='currency'>Currency *</InputLabel>
                <Select
                    value={preferredCurrency}
                    onChange={handlePreferredCurrencyChange}
                    className={classes.input}
                >
                    {currencyList.map((currObj) => 
                        <MenuItem 
                            value={currObj.code}
                            key={currObj.code}
                        >{`${currObj.code} - ${currObj.currencyName}`}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <br />
            <div className={[classes.input, classes.spaceApart].join(' ')}>
                <Button 
                    color="primary" 
                    variant='contained'
                    onClick={onSubmit}
                    disabled={!title}
                >
                    <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                    {dialog.editMode ? 'Edit' : 'Create'}
                </Button>
                <Button 
                    color="secondary" 
                    variant='contained'
                    onClick={handleCancel}
                >
                    <Cancel style={{marginRight: '5px'}} fontSize='small' />
                    Cancel
                </Button>
            </div>
        </form>
    )
};

export default withStyles(styles)(TripForm);