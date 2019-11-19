import React, { Fragment, useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


import Header from '../Components/Elements/Header';
import Footer from '../Components/Elements/Footer';
import SideDrawer from '../Components/Elements/SideDrawer';
import TripsPage from '../Components/Pages/TripsPage';
import ExpensesPage from '../Components/Pages/ExpensesPage';
import AboutPage from '../Components/Pages/AboutPage';
import FormDialog from '../Components/Elements/FormDialog';

// Page
import PageContext from '../context/pageContext';
import pageReducer from '../reducers/pageReducer';
// Dialog
import DialogContext from '../context/dialogContext';
import dialogReducer from '../reducers/dialogReducer';
// Drawer
import DrawerContext from '../context/drawerContext';
import drawerReducer from '../reducers/drawerReducer';

const AppRouter = () => {

    const [page, pageDispatch] = useReducer(pageReducer, {});
    const [dialog, dialogDispatch] = useReducer(dialogReducer, { 
        dialogOpen: false,
        editMode: false,
        itemToEdit: {},
        sortDialogOpen: false
    });
    const [drawer, drawerDispatch] = useReducer(drawerReducer, {
        summaryDrawerOpen: false,
        sideDrawerOpen: false
    })

    const closeDialog = () => {
        dialogDispatch({ type: 'CLOSE'});
        dialogDispatch({ type: 'SET_EDIT_MODE_FALSE' });
        dialogDispatch({ type: 'SET_ITEM_TO_EDIT', itemToEdit: undefined });
    }


    return (
        <BrowserRouter>
            <Fragment>
                <PageContext.Provider value={{ page, pageDispatch }}>
                    <DialogContext.Provider value={{ dialog, dialogDispatch }}>
                        <DrawerContext.Provider value={{ drawer, drawerDispatch }}>
                            <Header />
                                <Switch>
                                    <Route path='/' component={TripsPage} exact={true} />
                                    <Route path='/:trip/expenses' component={ExpensesPage} />
                                    <Route path='/about' component={AboutPage} />
                                </Switch>
                                <SideDrawer />
                            <Footer />
                            <FormDialog 
                                open={dialog.dialogOpen}
                                closeDialog={closeDialog}
                            />
                        </DrawerContext.Provider>
                    </DialogContext.Provider>
                </PageContext.Provider>
            </Fragment>
        </BrowserRouter>)

};
    
export default AppRouter;