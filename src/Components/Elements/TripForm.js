import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';


class TripForm extends Component {

    state = {
        title: '',
    };

    componentDidMount(){
        const { trip } = this.props;

        trip && this.setState(() => ({
            ...trip
        }));
    };

    componentDidUpdate(prevProps){
        const { trip: prevTrip} = prevProps;
        const { trip } = this.props;

        if (prevTrip && prevTrip._id !== trip._id){
            this.setState(() => ({
                ...trip
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

        const { title } = this.state;

        return (
            <form>
                <TextField
                    label='Trip Title'
                    value={title}
                    onChange={this.handleTitleChange}
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

export default TripForm;