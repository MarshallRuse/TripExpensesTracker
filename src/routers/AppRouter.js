import React, { Fragment, useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from '../Components/Elements/Header';
import Footer from '../Components/Elements/Footer';
import TripsPage from '../Components/Pages/TripsPage';
import ExpensesPage from '../Components/Pages/ExpensesPage';
import FormDialog from '../Components/Elements/FormDialog';

// Page
import PageContext from '../context/pageContext';
import pageReducer from '../reducers/pageReducer';
// Dialog
import DialogContext from '../context/dialogContext';
import dialogReducer from '../reducers/dialogReducer';
// Summary Drawer
import SummaryDrawerContext from '../context/SummaryDrawerContext';
import summaryDrawerReducer from '../reducers/summaryDrawerReducer';

const AppRouter = () => {

    const [page, pageDispatch] = useReducer(pageReducer, {});
    const [dialog, dialogDispatch] = useReducer(dialogReducer, { 
        dialogOpen: false,
        editMode: false,
        itemToEdit: {},
        sortDialogOpen: false
    });
    const [summaryDrawer, summaryDrawerDispatch] = useReducer(summaryDrawerReducer, {
        drawerOpen: false
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
                        <SummaryDrawerContext.Provider value={{ summaryDrawer, summaryDrawerDispatch }}>
                            <Header />
                                <Switch>
                                    <Route path='/' component={TripsPage} exact={true} />
                                    <Route path='/:trip/expenses' component={ExpensesPage} />
                                </Switch>
                            <Footer />
                            <FormDialog 
                                open={dialog.dialogOpen}
                                closeDialog={closeDialog}
                            />
                        </SummaryDrawerContext.Provider>
                    </DialogContext.Provider>
                </PageContext.Provider>
            </Fragment>
        </BrowserRouter>)

};
    
export default AppRouter;