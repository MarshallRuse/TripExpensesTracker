import React, { Fragment, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import { 
    AppBar, 
    Toolbar, 
    Fab, 
    IconButton, 
} from '@material-ui/core';
import { Add, BarChart, FilterList } from '@material-ui/icons';

import PageContext from '../../context/pageContext';
import DialogContext from '../../context/dialogContext';
import DrawerContext from '../../context/drawerContext';


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

    const { drawer, drawerDispatch } = useContext(DrawerContext); 

    const { page } = useContext(PageContext);
    const { dialogDispatch } = useContext(DialogContext);

    const openDialog = () => {
        dialogDispatch({ type: 'OPEN' });
    }

    const toggleSortDialog = () => {
        dialogDispatch({ type: 'OPEN_SORT_DIALOG' });
    }

    const toggleDrawer = () => {
        if (drawer.summaryDrawerOpen){
            drawerDispatch({ type: 'SUMMARY_CLOSE' });
        } else {
            drawerDispatch({ type: 'SUMMARY_OPEN' });
        }
    }

    return (
        <Fragment>
            <div className={classes.toolbar} />
            {page.currentPage !== 'ABOUT' && <div className={classes.toolbar} />}
            <AppBar position="fixed" color="primary" className={classes.appBar}>
                <Toolbar>
                {page.currentPage !== 'ABOUT' && 
                    <>
                        <Fab 
                            color="secondary" 
                            aria-label="add" 
                            className={classes.fabButton} 
                            onClick={openDialog}
                        >
                            <Add />
                        </Fab>
                        <IconButton color='inherit' onClick={toggleSortDialog}>
                            <FilterList />
                        </IconButton>
                    </>
                }     
                {page.currentPage === 'EXPENSES' && 
                    <>
                        <div className={classes.grow} />
                        <IconButton color='inherit' onClick={toggleDrawer}>
                            <BarChart />
                        </IconButton>
                    </>
                }
                </Toolbar>
            </AppBar>
        </Fragment>);
}

export default withStyles(styles)(Footer);