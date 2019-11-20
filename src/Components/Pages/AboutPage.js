import React, { useEffect, useContext} from 'react';
import { Divider, Grid, Paper, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { DiReact, DiMongodb, DiNodejsSmall } from "react-icons/di";
import PageContext from '../../context/pageContext';

const styles = theme => ({
    divider: {
        [theme.breakpoints.down('xs')]: {
            marginTop: '20px',
            marginBottom: '20px'
        },
        [theme.breakpoints.up('sm')]: {
            marginTop: '50px',
            marginBottom: '50px'
        }
    },
    listText: {
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingLeft: '20px',
        paddingRight: '20px',
    },
    page: {
        color: theme.palette.primary,
        height: 'calc(100% - 56px - 56px)',
        overflowY: 'auto'
    },
    pageText: {
        padding: '20px'
    },
    paper: {
        [theme.breakpoints.down('xs')]: {
            marginLeft: '10px',
            marginRight: '10px'
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: '100px',
            marginRight: '100px'
        }
        
    },
    toolbar: theme.mixins.toolbar
})

const AboutPage = ({ classes }) => {

    const { pageDispatch } = useContext(PageContext);

    useEffect(() => {
        pageDispatch({ type: 'SET_CURRENT_PAGE', currentPage: 'ABOUT'});
        
    }, [pageDispatch]);

    return (
        <Grid container className={classes.page}>
            <Grid item xs={12} >
                <Typography variant='h4' className={classes.pageText} align='center'>
                    About <em>Trip Tracker</em>
                </Typography>
                <Typography variant='subtitle1' align='center'>
                    Created by Marshall Ruse
                </Typography>
                <Typography variant='subtitle2' align='center'>
                    <strong>Source: </strong>
                    <a 
                        href='https://github.com/MarshallRuse/TripExpensesTracker' 
                        rel='noopener noreferrer'
                        target='_blank'
                    >GitHub</a>
                </Typography>
                <Typography variant='body1'className={classes.pageText}>
                    <em>Trip Tracker</em> arose out of a desire to organize and summarize all of our expense information from a recent
                    trip abroad.  While there are countless expense-tracking apps out there, I chose the much less
                    efficient - but ultimately more rewarding - route of creating my own.
                </Typography>
                <Divider variant='middle' className={classes.divider} />
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.paper}>
                <Typography variant='h5' align='center' className={classes.pageText}>
                    Features
                </Typography>
                <Typography variant='body1' className={classes.pageText}>
                    <em>Trip Tracker</em> acts as a summarizer for each of your trips expenses. For each trip,
                    a preferred (eg. home) currency can be set, with which all of the expenses entered therein will 
                    converted to.  
                    <br />
                    <br />
                    For each expense, a user may enter a number of metrics, a few of which are required for summarizing actions.
                    </Typography>
                    <ul>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Expense Title (Optional)</em> - a quick descriptor of the expense.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Cost <strong>(Required)</strong></em> - the value of the expense.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Category <strong>(Required)</strong></em> - a general category for the expense. 
                                Required for summaries about the types of expenses you generally incurred on your trip 
                                (ie. Food, Transport, Hotels, etc.).
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Currency <strong>(Required)</strong></em> - the original currency the expense was paid in.  Defaults to the trip's preferred currency.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Payment Method (Optional)</em> - the means of transaction (ie. cash, debit, credit, etc.).
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Description (Optional)</em> - An optional expansion upon the brief detail of the title.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Date & Time <strong>(Required)</strong></em> - The date and time of the expense. Defaults to the current date and time.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                <em>Location</em> - Where the expense occurred. Use Google Places search input to autocomplete the fields.
                            </Typography>
                            <ul>
                                <li>
                                    <Typography variant='body1' className={classes.listText}>
                                        <em>Business (Optional)</em> - The business the transaction occurred with.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant='body1' className={classes.listText}>
                                        <em>City <strong>(Required)</strong></em> - The city the transaction occurred in.
                                    </Typography>
                                </li>
                                <li>
                                    <Typography variant='body1' className={classes.listText}>
                                        <em>Country <strong>(Required)</strong></em> - The country the transaction occurred in.
                                    </Typography>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    
                    <Typography variant='body1' className={classes.pageText}>
                    The list of expenses can be <strong>sorted</strong> by <em>Date</em>, <em>Cost</em>, <em>Country</em>, and <em>Category</em>.
                    </Typography>

                    <Typography variant='h6' color='textSecondary' align='center'>
                        Expenses Summary
                    </Typography>
                    
                    <Typography variant='body1' className={classes.pageText}>
                    Each trip has a summary of the Expenses page.  
                    <br />The total spent is summarized in the trips preferred currency.  This currency can be changed at any 
                    time from the summary so that the metrics can be viewed however makes sense to you, whether it be CAD, USD, EUR, or <strong>30</strong> other currencies!
                    <br />The summary also contains other interesting metrics, such as: 
                    </Typography>
                    <ul>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                total number of expenses,
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                the average expense value,
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                the number of expenses per day,
                            </Typography>
                        </li>
                        <li>
                            <Typography variant='body1' className={classes.listText}>
                                and the expenses subdivided by <em>Category</em>, <em>Date</em>, <em>City</em>, and <em>Country</em>.
                            </Typography>
                        </li>
                    </ul>                   
                </Paper>
                <Divider variant='middle' className={classes.divider} />
                <Paper className={classes.paper}>
                    <Typography variant='h5' align='center' className={classes.pageText}>
                        Development
                    </Typography>
                    <Typography variant='h4' align='center'>
                        <DiReact />
                        <DiMongodb />
                        <DiNodejsSmall />
                    </Typography>
                    <Typography variant='body1' className={classes.pageText}>
                    Trip Tracker is developed as a <strong>full stack MERN (MongoDB, Express, React, Node.js)</strong> app.  
                    </Typography>
                    <Typography variant='h6' align='center' className={classes.pageText}>Front End</Typography>
                    <Typography variant='body1' className={classes.pageText}>
                    The React front-end primarily utilizes components from <strong>Material UI</strong>, a component library implementing Google’s Material Design visual language.  
                    Where components need more custom styling, Material UI’s supported <strong>JSS</strong> styling solutions are used.  
                    The front-end makes liberal use of <strong>React Hooks</strong> and <strong>React’s Context API</strong> to allow most components written by myself to remain as decoupled, light-weight functional components.  
                    Trip Tracker is a <strong>single-page application</strong>, as it uses <strong>React Router</strong> as its routing solution, only fetching the index html page on initial loading.
                    <br />
                    <br />
                    The app makes use of <strong>Google Maps Javascript API Autocomplete </strong> library to search for the location of the user’s expense, and autofills the locations section of the form after a Place Details request.  
                    The app also uses the <strong>Exchangeratesapi.io</strong> to fetch conversion rates between two currencies for the particular date specified for the expense, as well as for the Expenses Summary.
                    </Typography>
                    <Typography variant='h6' align='center' className={classes.pageText}>Back End</Typography>
                    <Typography variant='body1' className={classes.pageText}>
                    The backend is a <strong>Node.js</strong> server using MongoDB for its NoSQL database and <strong>Express</strong> for routing.  
                    The <strong>Mongoose</strong> library is used as the interface to <strong>MongoDB</strong>, as well as for schema construction and validation.  
                    The production build of the app uses <strong>MongoDB Atlas</strong> as its hosted database.  
                    As Trip Tracker is a single-page application, the Express routing is used primarily  for API endpoints for the front-end.
                    </Typography>
                </Paper>
                <div className={classes.toolbar} />
            </Grid>
        </Grid>
    )
};

export default withStyles(styles)(AboutPage);