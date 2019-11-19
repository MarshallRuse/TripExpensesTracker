import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Breadcrumbs } from '@material-ui/core';
import { NavigateNext } from '@material-ui/icons'; 

import { withStyles } from '@material-ui/styles';

import PageContext from '../../context/pageContext';


const styles = theme => ({
    breadcrumbs: {
        backgroundColor: '#fafafa',
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        // paddingTop: '10px',
        // paddingBottom: '10px',
        width: '100%',
        zIndex: 100
    },
    link: {
        textDecoration: 'none',
        color: 'inherit'
    },
    toolbar: theme.mixins.toolbar
});


const BreadcrumbNav = ({ classes }) => {

    const { page } = useContext(PageContext);

    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb" className={[classes.breadcrumbs, classes.toolbar].join(' ')}>
            <Link to='/' className={classes.link}>
                <Typography 
                    color={page.currentPage === 'EXPENSES' ? 'textSecondary' : 'textPrimary'}
                >Trips
                </Typography>
            </Link>
            {page.currentPage === 'EXPENSES' && <Typography color='textPrimary'>Expenses</Typography> }
        </Breadcrumbs>
    )
};

export default withStyles(styles)(BreadcrumbNav);