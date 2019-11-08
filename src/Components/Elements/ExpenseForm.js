import React, { Component } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';


class ExpenseForm extends Component {

    state = {
        title: '',
    };

    componentDidMount(){
        const { expense } = this.props;

        expense && this.setState(() => ({
            ...expense
        }));
    };

    componentDidUpdate(prevProps){
        const { expense: prevExpense} = prevProps;
        const { expense } = this.props;

        if (prevExpense && prevExpense._id !== expense._id){
            this.setState(() => ({
                ...expense
            }))
        }
    }

    handleTitleChange = (event) => {
        const title = event.target.value;
        this.setState(() => ({
            title
        }));
    }

    onSubmit = () => {

        this.props.onSubmit({
            ...this.state
        });

        this.setState(() => ({ 
            title: ''
        }));
    }

    render() {

        const { categories } = this.props;
        const { title, description } = this.state;

        return (
            <form>
                <TextField
                    label='Expense Title'
                    value={title}
                    onChange={this.handleTitleChange}
                    margin='normal'
                    fullWidth
                />
                <br />
                <FormControl fullWidth>
                    <InputLabel htmlFor='category'>Category</InputLabel>
                    <Select
                        value={categories}
                        onChange={this.handleMusclesChange}
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
                    onChange={this.handleDescriptionChange}
                    margin='normal'
                    fullWidth
                />
                <Button 
                    color="primary" 
                    variant='contained'
                    onClick={this.onSubmit}
                    disabled={!title}
                >
                    {this.props.trip ? 'Edit' : 'Create'}
                </Button>
            </form>
        )
    }
};

export default ExpenseForm;