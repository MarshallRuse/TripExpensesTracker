import React, { Fragment, useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu } from '@material-ui/icons';


import BreadcrumbNav from './BreadcrumbNav';
import PageContext from '../../context/pageContext';
import DrawerContext from '../../context/drawerContext';


const styles = theme => ({
    flex: {
        flex: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
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
    const { drawer, drawerDispatch } = useContext(DrawerContext);
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
    }, [page.tripID]);

    const toggleSideDrawer = () => {
        if (drawer.sideDrawerOpen){
            drawerDispatch({ type: 'SIDE_DRAWER_CLOSE'});
        } else {
            drawerDispatch({ type: 'SIDE_DRAWER_OPEN'});
        }
    }
    
    return (
        <Fragment>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h5" className={classes.flex}>
                        {page.currentPage === 'ABOUT' 
                            ? 'About'
                            :  page.tripID 
                                ?   trip.title
                                :   'Your Trips'    
                        }
                        
                    </Typography>
                    <IconButton 
                        color="inherit" 
                        aria-label="menu"
                        onClick={toggleSideDrawer}
                    >
                        <Menu />
                    </IconButton>
                </Toolbar>
                
            </AppBar>
            <div className={classes.toolbar} />
            {(page.currentPage === 'TRIPS' || page.currentPage === 'EXPENSES') 
                && <BreadcrumbNav /> 
            }         
        </Fragment>
    );
}

export default withStyles(styles)(Header);