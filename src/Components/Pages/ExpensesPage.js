import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import { Grid, Paper, Typography, Card, CardContent } from '@material-ui/core';

const styles = theme => ({
    breadcrumbs: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '10px',
        paddingBottom: '10px'
    },
    flexCenter: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    },
    centerContent: {
        flex: 1,
        height: 'calc(100% - 56px - 56px)'
    },
    paper: { 
        padding: 20,  
        overflowY: 'auto',
        height: '100%', 
    }
})

const ExpensesPage = ({ expenses, classes }) => {


    return (
        <Fragment>
            <Grid container direction='column' alignItems='center' justify='center' className={classes.centerContent}>
                <Grid item xs={12}>
                    
                </Grid>
                <Grid container direction='row' justify='center' alignItems='center'>
                    { expenses 
                        ?   expenses.map((expense, index) => (
                                <Grid item xs={10}>
                                    <Card className={classes.card}>
                                        <CardContent>
                                            <Typography variant="h5" component="h2">
                                                {expense.title}
                                            </Typography>
                                            <Typography className={classes.pos} color="textSecondary">
                                                adjective
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>)) 
                        :   <Grid item xs={10}>
                                <Paper className={classes.paper}>
                                    <Typography variant='subtitle1' align='center' style={{color: '#7b7b7b'}}>
                                        Add your first expense!
                                    </Typography>
                                </Paper>
                            </Grid>
                    }
                </Grid>
            </Grid>
        </Fragment>
        
    )
}
    


export default withStyles(styles)(ExpensesPage);