import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import {  
    Button,
    Collapse,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    IconButton, 
    InputLabel, 
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, 
    TextField, 
    Typography
} from '@material-ui/core';
import { Add, CheckCircle, Cancel, Delete, DeleteForever, Edit, ExpandLess, ExpandMore } from '@material-ui/icons';

import DialogContext from '../../context/DialogContext';

import currencyList from '../../currency_list';
const defaultCategories = ['Food', 'Coffee', 'Tea', 'Beer', 'Wine', 'Transport', 'Activity', 'Misc.'];

const styles = theme => ({
    actionMenuItem: {
        backgroundColor: '#fafafa',
        color: 'blue'
    },
    deleteButton: {
        color: theme.palette.secondary.dark
    },
    input: {
        marginTop: '10px',
        marginBottom: '20px'
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
    
    // Category states - a bit hectic due to adding, editing, deleting category functionality
        // List of categories
    const [categories, setCategories] = useState(dialog.editMode ? dialog.itemToEdit.categories : defaultCategories);
    const [categoriesListOpen, setCategoriesListOpen] = useState(false);
        // Category to add or edit, with original category for finding in category list
    const [originalCategory, setOriginalCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
        // Add or edit category dialog functionality
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [categoryDialogMode, setCategoryDialogMode] = useState(null);
        // Delete category functionality
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState('');
        // When deleting categories from an existing trip, check if there are any expenses
        // that have that category and disallow deletion until all expenses have been reassigned
    const [deletionAllowed, setDeletionAllowed] = useState(false);
    const [expensesToReassign, setExpensesToReassign] = useState([]);

    // Main Dialog Functionality
    const handleTitleChange = (event) => {
        const title = event.target.value;
        setTitle(title);
    }

    const handlePreferredCurrencyChange = (event) => {
        const currencyCode = event.target.value;
        setPreferredCurrency(currencyCode);
    } 

    const toggleOpenCategories = (event) => {
        setCategoriesListOpen(categoriesListOpen => !categoriesListOpen);
    }

    const handleCancel = (event) => {
        dialogDispatch({ type: 'SET_EDIT_MODE_FALSE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: undefined });
        dialogDispatch({ type: 'CLOSE' });

        setTitle('');
        setPreferredCurrency('CAD');
        setCategories(defaultCategories);
    }

    const onSubmit = () => {

        let tripToSubmit = {};
        if (dialog.editMode){
            tripToSubmit = {
                ...dialog.itemToEdit,
                title,
                preferredCurrency,
                categories
            }
        } else {
            tripToSubmit = {
                title,
                preferredCurrency,
                categories
            }
        }

        dialog.editMode 
        ? dialog.editItemFunction(tripToSubmit) 
        : dialog.createItemFunction(tripToSubmit);

        setTitle('');
    }

    // Add Category Functionality
    const handleAddCategory = () => {
        setNewCategory('');
        setCategoryDialogMode('ADD');
        setCategoryDialogOpen(true);
    }

    const onAddCategory = async (category) => {
        
        try {
            const currentTripCategories = categories.map((cat) => cat.toLowerCase());

            if (newCategory.toLowerCase() !== 'add_category' 
                    && !currentTripCategories.includes(newCategory.toLowerCase())){
                
                if (dialog.editMode){
                    const catObj = {
                        newCategory
                    };
    
                    const response = await fetch(`/update_trip/${dialog.itemToEdit._id}/add_category`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(catObj)
                    });
                    const categories = await response.json();
                    setCategories(categories);
                    setCategoryDialogOpen(false);
                } else {
                    const newCategories = [...categories, newCategory];
                    setCategories(newCategories);
                    setCategoryDialogOpen(false);
                }
                
            } else {
                throw new Error('Cannot add category "Add_Category" or variations thereof.');
            }

        } catch(err){
            console.log('Error adding category,', err)
        }
    }

    // Edit Category Functionality
    const handleEditCategory = (category) => {
        setOriginalCategory(category);
        setNewCategory(category)
        setCategoryDialogMode('EDIT');
        setCategoryDialogOpen(true);
    }

    const handleNewCategoryChange = (event) => {
        const cat = event.target.value;
        setNewCategory(cat);
    }

    const onEditCategory = async () => {

        if (dialog.editMode){

            const catEdit = {
                originalCategory, 
                editedCategory: newCategory
            }
            try {
                const response = await fetch(`/update_trip/${dialog.itemToEdit._id}/edit_category`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(catEdit)
                });
                const newCategories = await response.json();
                setCategories(newCategories);
                // Clean up
                setOriginalCategory('');
                setNewCategory('')
                setCategoryDialogMode(null);
                setCategoryDialogOpen(false);
            } catch(err){
                console.log('Error editting category, ', err)
            }
        } else {
            const index = categories.findIndex((category) => category === originalCategory);
            const newCategories = [...categories];
            newCategories[index] = newCategory;
            setCategories(newCategories);
            // Clean up
            setOriginalCategory('');
            setNewCategory('')
            setCategoryDialogMode(null);
            setCategoryDialogOpen(false);
        }
    }

    const cancelEditCategory = () => {
        // Clean up
        setOriginalCategory('');
        setNewCategory('')
        setCategoryDialogMode(null);
        setCategoryDialogOpen(false);
    }

    // Delete Category Functionality
    const handleDeleteCategory = async (category) => {
        const categoryToDelete = category;

        if (dialog.itemToEdit){
            try {
                // fetch the expenses to see if any have the category-in-question as their 
                // category for deletion. If so, disallow deletion until reassignment
                const response = await fetch(`/get_expenses/${dialog.itemToEdit._id}`);
                const expenses = await response.json();

                const expensesToReassign = expenses.filter((expense) => expense.category === categoryToDelete);

                if (expensesToReassign.length > 0){
                    setDeletionAllowed(false);
                    setExpensesToReassign(expensesToReassign);
                    setDeleteDialogOpen(true);
                } else {
                    setDeletionAllowed(true);
                    setDeleteDialogOpen(true);
                }

            } catch(err){
                console.log('Fetching of related expenses failed, ', err);
            }
        } else {
            setDeletionAllowed(true);
            setDeleteDialogOpen(true);
        }
        setCategoryToDelete(categoryToDelete);
    }

    const onDeleteCategory = async () => {
        if (dialog.editMode){
            try {
                const response = await fetch(`/update_trip/${dialog.itemToEdit._id}/delete_category`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categoryToDelete
                    })
                });
                const newCategories = await response.json();
                setCategories(newCategories);
                // Clean up
                setDeletionAllowed(false);
                setExpensesToReassign([]);
                setDeleteDialogOpen(false);
                setCategoryToDelete('');

            } catch (err){
                console.log('Failed to delete category, ', err);
            }
        } else { // Before a trip is first created
            const newCategories = [...categories];
            const index = newCategories.findIndex((category) => category === categoryToDelete);
            newCategories.splice(index, 1);
            setCategories(newCategories);
            // Clean up
            setDeletionAllowed(false);
            setExpensesToReassign([]);
            setDeleteDialogOpen(false);
            setCategoryToDelete('');
        }
    }

    const cancelDeleteCategory = () => {
        // Clean up
        setDeletionAllowed(false);
        setExpensesToReassign([]);
        setDeleteDialogOpen(false);
        setCategoryToDelete('');
    }

    
    return (
        <>
        <form>
            <TextField
                label='Trip Title'
                value={title}
                onChange={handleTitleChange}
                margin='normal'
                fullWidth
            />
            <br />
            <FormControl fullWidth>
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
            <List >
                <ListItem button onClick={toggleOpenCategories}>
                    <ListItemText primary="Categories" />
                    {categoriesListOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={categoriesListOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {categories &&
                            categories.map((category) => 
                                <ListItem key={category} >
                                    <ListItemText primary={category} />
                                    <IconButton onClick={() => handleEditCategory(category)}>
                                        <Edit fontSize='small'/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteCategory(category)}>
                                        <Delete fontSize='small'/>
                                    </IconButton>
                                </ListItem>
                            )
                        }
                        <ListItem key='ADD_CATEGORY' button className={classes.actionMenuItem} onClick={handleAddCategory}>
                            <ListItemText primary={'Add Category'} /> 
                            <Add />
                        </ListItem>
                    </List>
                </Collapse> 
            </List>
            <div className={[classes.input, classes.spaceApart].join(' ')}>
                <Button 
                    style={{marginRight: '10px'}}
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

        {/* Add / Edit Category Dialog*/}
        <Dialog 
            open={ categoryDialogOpen } 
            onClose={cancelEditCategory}
        >
            <DialogTitle id="form-dialog-title">
                {categoryDialogMode === 'ADD' 
                    ? 'Add a new Expense Category'
                    : 'Edit Expense Category'
                }
            </DialogTitle>
            <DialogContent>
                <TextField 
                    label='Expense Category'
                    value={newCategory}
                    onChange={handleNewCategoryChange}
                    margin='normal'
                    className={classes.input}
                    fullWidth
                />
                <br />
                <div className={[classes.input, classes.spaceApart].join(' ')}>
                    <Button 
                        color="primary" 
                        variant='contained'
                        onClick={categoryDialogMode === 'ADD' ? onAddCategory : onEditCategory}
                    >
                        <CheckCircle style={{marginRight: '5px'}} fontSize='small' />
                        {categoryDialogMode === 'ADD' 
                            ?   'Add'
                            :   'Edit'
                        }
                    </Button>
                    <Button 
                        color="secondary" 
                        variant='contained'
                        onClick={cancelEditCategory}
                    >
                        <Cancel style={{marginRight: '5px'}} fontSize='small' />
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

        {/* Delete Category Dialog*/}
        <Dialog 
            open={ deleteDialogOpen } 
            onClose={cancelDeleteCategory}
        >
            <DialogTitle id="form-dialog-title">
                Deleting a Category...
            </DialogTitle>
            <DialogContent>
                {deletionAllowed 
                    ?   <Typography variant='body1'>
                            Are you sure you want to delete the category <strong>{categoryToDelete}</strong>?
                        </Typography>
                    :   <>
                            <Typography variant='body1'>
                                Unable to delete category. There are expenses with the chosen category assigned.
                                Please reassign the expenses to have another category before selecting this one for 
                                deletion.
                                <br/>
                                The expenses assigned this category are:
                                <br/>
                            </Typography>
                            {   <ul>
                                {expensesToReassign.map((expense) => (
                                    <li key={expense.title}>
                                        <Typography variant='body1'>
                                            <strong>{expense.title}</strong>
                                        </Typography>
                                    </li>
                                ))}
                            </ul>}
                        </>
                }
                <br />
                <div className={[classes.input, classes.spaceApart].join(' ')}>
                    <Button  
                        variant='contained'
                        className={classes.deleteButton}
                        onClick={onDeleteCategory}
                        disabled={!deletionAllowed}
                    >
                        <DeleteForever style={{marginRight: '5px'}} fontSize='small' />
                        Delete
                    </Button>
                    <Button 
                        color="secondary" 
                        variant='contained'
                        onClick={cancelDeleteCategory}
                    >
                        <Cancel style={{marginRight: '5px'}} fontSize='small' />
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
        </>
    )
};

export default withStyles(styles)(TripForm);