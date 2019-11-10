import React, { useState, useContext } from 'react';
import { 
    Button, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
    TextField 
} from '@material-ui/core';

import DialogContext from '../../context/DialogContext';

const categories = ['Food', 'Beer', 'Transport', 'Activity', 'Misc.'];

const ExpenseForm = () => {

    const { dialog } = useContext(DialogContext);

    const [title, setTitle] = useState(dialog.editMode ? dialog.itemToEdit.title : '');
    const [cost, setCost] =  useState(dialog.editMode ? dialog.itemToEdit.cost : '');
    const [category, setCategory] = useState(dialog.editMode ? dialog.itemToEdit.category : '');
    const [description, setDescription] = useState(dialog.editMode ? dialog.itemToEdit.description : '');


    const handleTitleChange = (event) => {
        const title = event.target.value;
        setTitle(title);
    }

    const handleCostChange = (event) => {
        const cost = event.target.value;
        setCost(cost);
    }

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setCategory(category);
    }

    const handleDescriptionChange = (event) => {
        const description = event.target.value;
        setDescription(description);
    }

    const onSubmit = () => {

        let expenseToSubmit = {};
        if (dialog.editMode){
            expenseToSubmit = {
                ...dialog.itemToEdit,
                title, 
                cost,
                category,
                description
            }
        } else {
            expenseToSubmit = {
                title,
                cost,
                category,
                description
            }
        }

        dialog.editMode 
        ? dialog.editItemFunction(expenseToSubmit) 
        : dialog.createItemFunction(expenseToSubmit);

        setTitle('');
        setCost(0);
        setCategory('');
        setDescription('');
    }

    return (
        <form>
            <TextField
                label='Expense Title *'
                value={title}
                onChange={handleTitleChange}
                margin='normal'
                fullWidth
            />
            <br />
            <TextField 
                label='Cost *'
                value={cost}
                onChange={handleCostChange}
                inputProps={{
                    type: 'number'
                }}
                margin='normal'
                fullWidth
            />
            <br />
            <FormControl fullWidth>
                <InputLabel htmlFor='category'>Category *</InputLabel>
                <Select
                    value={category}
                    onChange={handleCategoryChange}
                >
                    {categories.map((category) => 
                        <MenuItem 
                            value={category}
                            key={category}
                        >{category}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <br />
            <TextField
                label='Description'
                multiline
                rows="4"
                value={description}
                onChange={handleDescriptionChange}
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

export default ExpenseForm;