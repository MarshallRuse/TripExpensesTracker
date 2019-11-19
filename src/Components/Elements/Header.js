import React, { Fragment, useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';


import BreadcrumbNav from './BreadcrumbNav';
import PageContext from '../../context/pageContext';


const styles = theme => ({
    flex: {
        flex: 1
    },
    title: {
        backgroundColor: '#fafafa',
        marginBottom: '15px',
        paddingBottom: '10px',
        position: 'fixed',
        width: '100%'
    },
    toolbar: theme.mixins.toolbar
})

const Header = ({ classes }) => {

    const { page } = useContext(PageContext);
    const [trip, setTrip] = useState({});

    useEffect(() => {
        if (page.tripID){
            async function getTripOnPageLoad(){
                const response = await fetch(`/get_trip/${page.tripID}`);
                const trip = await response.json();
                setTrip(trip);
            }
            getTripOnPageLoad();
        } else {
            setTrip({});
        }
    }, [page.tripID])
    
    return (
        <Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h5" className={classes.flex}>
                        {page.tripID 
                            ?   trip.title
                            :   'Your Trips'
                        }
                    </Typography>
                </Toolbar>
                
            </AppBar>
            <div className={classes.toolbar} />
            <BreadcrumbNav />          
        </Fragment>
    );
}

export default withStyles(styles)(Header);