import React, { Fragment} from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import { Menu } from '@material-ui/icons'; 
import BreadcrumbNav from './BreadcrumbNav';

const styles = {
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
        <BreadcrumbNav />
    </Fragment>
);

export default withStyles(styles)(Header);