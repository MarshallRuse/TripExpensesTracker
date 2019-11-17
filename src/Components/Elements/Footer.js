import React, { Fragment, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    AppBar, 
    Toolbar, 
    Fab, 
    IconButton, 
} from '@material-ui/core';
import { Add, BarChart, FilterList } from '@material-ui/icons';

import DialogContext from '../../context/DialogContext';
import SummaryDrawerContext from '../../context/SummaryDrawerContext';


const styles = theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
       // zIndex: [theme.zIndex.modal + 10, '!important']
      },
      grow: {
        flexGrow: 1,
      },
      fabButton: {
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
      },
      toolbar: theme.mixins.toolbar
});

const Footer = ({ classes  }) => {

    const { summaryDrawer, summaryDrawerDispatch } = useContext(SummaryDrawerContext); 

    const { dialogDispatch } = useContext(DialogContext);

    const openDialog = () => {
        dialogDispatch({ type: 'OPEN' });
    }

    const toggleDrawer = () => {
        if (summaryDrawer.drawerOpen){
            summaryDrawerDispatch({ type: 'CLOSE' });
        } else {
            summaryDrawerDispatch({ type: 'OPEN' });
        }
    }
    return (
        <Fragment>
            <div className={classes.toolbar} />
            <div className={classes.toolbar} />
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                    <Fab 
                        color="secondary" 
                        aria-label="add" 
                        className={classes.fabButton} 
                        onClick={openDialog}
                    >
                        <Add />
                    </Fab>
                    <IconButton color='inherit'>
                        <FilterList />
                    </IconButton>
                    <div className={classes.grow} />
                    <IconButton color='inherit' onClick={toggleDrawer}>
                        <BarChart />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Fragment>);
}

export default withStyles(styles)(Footer);