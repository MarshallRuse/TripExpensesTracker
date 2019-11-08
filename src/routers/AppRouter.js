import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Header from '../Components/Elements/Header';
import Footer from '../Components/Elements/Footer';
import TripsPage from '../Components/Pages/TripsPage';
import ExpensesPage from '../Components/Pages/ExpensesPage';

class AppRouter extends Component{


    render(){
        return (
        <BrowserRouter>
            <Fragment>
                <Header />
                    <Switch>
                        <Route path='/' component={TripsPage} exact={true} />
                        <Route path='/:trip/expenses' component={ExpensesPage} />
                    </Switch>
                <Footer 
                    openDialog={this.openTripDialog}
                />
            </Fragment>
        </BrowserRouter>)
    }

};
    
export default AppRouter;