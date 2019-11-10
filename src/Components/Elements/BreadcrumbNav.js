import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Breadcrumbs } from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons'; 

import { withStyles } from '@material-ui/styles';


const styles = {
    breadcrumbs: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '10px'
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    }
};


const BreadcrumbNav = ({ classes }) => {

    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={classes.breadcrumbs}>
            <Link to='/' className={classes.link}>
                <Typography color="textPrimary">Trips</Typography>
            </Link>
        </Breadcrumbs>
    )
};

export default withStyles(styles)(BreadcrumbNav);