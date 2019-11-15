import React from 'react';
import {
    Grid,
    TextField,
    Typography
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { withStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

import APIKey from '../../APIKeys/googlePlaces';

// For attaching the Google Maps Javascript API Script
function loadScript(src, position, id) {
    if (!position) {
      return;
    }
  
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
  }
  
  const autocompleteService = { current: null };

const styles = theme => ({
    icon: {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(2),
    }
});

const LocationAutocomplete = ({ classes }) => {
    
    const [sessionToken, setSessionToken] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const loaded = React.useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
          loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${APIKey}&libraries=places`,
            document.querySelector('head'),
            'google-maps',
          );
          
        }
    
        loaded.current = true;
      }

    const handleChange = event => {
        setInputValue(event.target.value);
    };

    const fetch = React.useMemo(
        () =>
          throttle((input, callback) => {
            autocompleteService.current.getPlacePredictions(input, callback);
          }, 200),
        [],
      );


    React.useEffect(() => {
        let active = true;
        console.log('Location Autocomplete useEffect', inputValue)

        if (!autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
          }
          if (!autocompleteService.current) {
            return undefined;
          }

        if (inputValue === '') {
            setOptions([]);
            return undefined;
        }

        console.log('Session Token is: ', sessionToken);
        if (sessionToken){
            try {
                fetch({ input: inputValue, sessionToken: sessionToken }, results => {
                    if (active) {
                      setOptions(results || []);
                    }
                  });
            } catch(err){
                console.log('Error using Places Autocomplete, ', err);
            }
        } else {
            const token = new window.google.maps.places.AutocompleteSessionToken();
            setSessionToken(token);
        }


        return () => {
            active = false;
        };
    }, [inputValue, fetch, sessionToken]);

    const handleOptionClicked = (option) => {
        console.log('Autocomplete closeeeeddd', option);
        setInputValue(option.description);

        const detailsService = new window.google.maps.places.PlaceDetailsRequest();
        detailsService.getDetails({
            placeId: option.placeId,
            fields: ['address_component']
          }, (results, status) => {
            if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                console.log('SUCCESS!!, Results: ', results);
              }
              else {
                  console.log('FAIL!!!!!')
              }
          })
    }

    return (
        <Autocomplete
            id="location-autocomplete"
            getOptionLabel={option => option.description}
            filterOptions={x => x}
            options={options}
            autoComplete
            autoSelect
            includeInputInList
            freeSolo
            disableOpenOnFocus
            inputValue={inputValue}
            renderInput={params => (
                <TextField
                    {...params}
                    label="Search for Location Data"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                />
            )}
            renderOption={option => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map(match => [match.offset, match.offset + match.length]),
                );

                return (
                <Grid container alignItems="center" onClick={() => handleOptionClicked(option)}>
                    <Grid item>
                        <LocationOnIcon className={classes.icon} />
                    </Grid>
                    <Grid item xs>
                        {parts.map((part, index) => (
                            <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                            {part.text}
                            </span>
                        ))}

                        <Typography variant="body2" color="textSecondary">
                            {option.structured_formatting.secondary_text}
                        </Typography>
                    </Grid>
                </Grid>);
                }}
            />
    );
};

export default withStyles(styles)(LocationAutocomplete);