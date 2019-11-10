import React, { Fragment, useContext } from 'react';
import { withStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import DialogContext from '../../context/DialogContext';


const styles = {
    appBar: {
        top: 'auto',
        bottom: 0,
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
      }
}

const Footer = ({ classes  }) => {

    const { dialogDispatch } = useContext(DialogContext);

    const openDialog = () => {
        dialogDispatch({ type: 'OPEN' });
    }

    return (
        <Fragment>
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
                </Toolbar>
            </AppBar>
        </Fragment>);
}

export default withStyles(styles)(Footer);