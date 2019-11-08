import React, { Component, Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/styles';
import 'typeface-roboto';

import AppRouter from './routers/AppRouter';

const styles = theme => ({
  '@global': {
    'html, body, #root': {
        height: '100%'
    }
  }
});

class App extends Component {

  state = {
    createDialogOpen: false
  }

  toggleCreateDialog = () => this.setState((prevState) => ({ createDialogOpen: !prevState.createDialogOpen}))

  render(){
    return (
      <Fragment>
        <CssBaseline>
          <AppRouter 
            toggleCreateDialog={this.toggleCreateDialog}
          />
        </CssBaseline>
      </Fragment>
    );
  }
}

export default withStyles(styles)(App);
