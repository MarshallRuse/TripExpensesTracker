import React, { Fragment} from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, IconButton, Typography, Button, Breadcrumbs } from '@material-ui/core';
import { Menu, NavigateNext } from '@material-ui/icons'; 

const styles = {
    breadcrumbs: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '10px'
    },
    flex: {
        flex: 1
    }
}

const Header = ({ classes }) => (
    <Fragment>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Menu />
                </IconButton>
                <Typography variant="h5" className={classes.flex}>
                    Trip Tracker
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={classes.breadcrumbs}>
            <Typography color="textPrimary">Trips</Typography>
        </Breadcrumbs>
    </Fragment>
);

export default withStyles(styles)(Header);