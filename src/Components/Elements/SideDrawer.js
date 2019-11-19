import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Info, Subject } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';
import DrawerContext from '../../context/drawerContext';
import PageContext from '../../context/pageContext';

const styles = theme => ({
    drawer: {
        flexShrink: 0, 
        zIndex: [theme.zIndex.appBar - 10, '!important']
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    },
    listIcon: {
        minWidth: '40px'
    },
    listText: {
        minWidth: '60px',
        textDecoration: 'none'
    },
    paper: {
        background: theme.palette.primary.light,
        zIndex: [theme.zIndex.appBar - 10, '!important']
    },
    toolbar: theme.mixins.toolbar
})

const SideDrawer = ({ classes }) => {
    const {drawer, drawerDispatch} = useContext(DrawerContext);
    const { page } = useContext(PageContext);

    const closeSideDrawer = () => {
        drawerDispatch({ type: 'SIDE_DRAWER_CLOSE' });
    }

    return (
        <Drawer 
            anchor='right'
            open={drawer.sideDrawerOpen} 
            onClose={closeSideDrawer} 
            className={[classes.drawer, classes.paper].join(' ')}
        >
            <div className={classes.toolbar} />
            <List>
                <Link to='/' className={classes.link}>
                    <ListItem button selected={page.currentPage === 'TRIPS'} onClick={closeSideDrawer}>
                        <ListItemIcon className={classes.listIcon} >
                            <Subject />
                        </ListItemIcon>
                        <ListItemText primary='Trips' className={classes.listText} />
                    </ListItem>
                </Link>
                <Link to='/about' className={classes.link}>
                    <ListItem button selected={page.currentPage === 'ABOUT'} onClick={closeSideDrawer}>
                        <ListItemIcon className={classes.listIcon}>
                            <Info />
                        </ListItemIcon>
                        <ListItemText primary='About' className={classes.listText} />
                    </ListItem>
                </Link>
            </List>
        </Drawer>
    )
}

export default withStyles(styles)(SideDrawer);