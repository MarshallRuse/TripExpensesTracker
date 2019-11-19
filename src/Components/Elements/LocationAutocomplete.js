import React from 'react';
import {
    TextField,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import Script from 'react-load-script';



const styles = theme => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    },
    'pac-container': {
        zIndex: theme.zIndex.modal + 10,
        border: '2px solid red'
    } 
});

class LocationAutocomplete extends React.Component {

    state = {
        inputValue: '',
        options: []
    }

    autocomplete = {};
    
    //const [autocomplete, setAutocomplete] = React.useState({});
    

    handleScriptLoad = () => {
        const options = { type: ['(cities)']};

        /*global google*/
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), options);
        

        // Avoid paying for data that you don't need
        this.autocomplete.setFields(['address_components', 'formatted_address', 'name']);

        // Fire Event when a suggested name is selected
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);

    };

    handleChange = (event) => {
        const inputValue = event.target.value;
        this.setState(() => ({ inputValue}))
    };


    handlePlaceSelect = () => {
        const placeDetails = this.autocomplete.getPlace();

        let locationObj = {
            business: '',
            city: '',
            country: ''
        };

        // Extract Business info (if any)
        const business = placeDetails.name;
            
        // Extract City Info
        const locality = placeDetails.address_components.filter((component) => {
            return component.types.includes('locality');
        })[0];

            // Loop through the address components. If any with type = 'locality' match
            // the name of the business, then 'name' was in fact just the city name. In this case,
            // keep business value set to ''
        if (locality.long_name !== business){
            locationObj.type = 'business';
            locationObj.business = business;
        }

        locationObj.city = locality.long_name;

        // Extract Country Info
        const country = placeDetails.address_components.filter((component) => {
            return component.types.includes('country');
        })[0];
        
        locationObj.country = country.long_name;

        this.setState(() => ({ inputValue: `${locationObj.business && (locationObj.business + ', ')} ${locationObj.city}, ${locationObj.country}`})); 
        this.props.fillLocationInputs(locationObj);
  
    }

    render(){
        return (
            <>
                <Script 
                    url={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_PLACES_API_KEY}&libraries=places`}          
                    onLoad={this.handleScriptLoad}        
                /> 
                <TextField 
                    id='autocomplete' 
                    variant='outlined' 
                    label='Search for Location Data' 
                    value={this.state.inputValue}
                    onChange={this.handleChange}
                    fullWidth
                />
            </>
        )
    }     
};

export default withStyles(styles)(LocationAutocomplete);