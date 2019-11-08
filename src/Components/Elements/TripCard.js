import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { 
    ButtonBase, 
    Card, 
    CardContent, 
    CardActions,
    Menu,
    MenuItem,
    Typography 
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';

const styles = theme => ({
    card: {
        width: '100%',
        textAlign: 'left',
        marginBottom: '10px',
        marginTop: '10px'
    },
    cardActions: {
        justifyContent: 'flex-end'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
})

class TripCard extends Component {

    state = {
        moreActionsOpen: false,
        anchorEl: undefined
    }

    toggleMoreActionsOpen = (event) => {

        this.setAnchorEl(event);

        this.setState((prevState) => ({ 
            moreActionsOpen: !prevState.moreActionsOpen
        }))
    }

    setAnchorEl = (event) => {
        const anchorEl = this.state.anchorEl ? undefined : event.currentTarget;

        this.setState(() => ({
            anchorEl
        }))
    }

    handleEditSelection = () => {
        this.props.editTrip(this.props.trip._id);
        this.toggleMoreActionsOpen();
    }

    handleDeleteSelection = () => {
        this.props.deleteTrip(this.props.trip._id);
        this.toggleMoreActionsOpen();
    }

    render() {

        const { classes, trip } = this.props;

        return (
            
                <ButtonBase 
                    focusRipple
                    style={{width: '100%'}}
                >
                <Card className={classes.card}>
                <Link to={`/${trip._id}/expenses`} className={classes.link}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {trip.title}
                        </Typography>
                        <Typography className={classes.pos} color="textSecondary">
                            adjective
                        </Typography>
                    </CardContent>
                    </Link>
                    <CardActions className={classes.cardActions}>
                        <MoreHoriz onClick={this.toggleMoreActionsOpen}/>
                        <Menu
                            id="long-menu"
                            anchorEl={this.state.anchorEl}
                            keepMounted
                            open={this.state.moreActionsOpen}
                            onClose={this.toggleMoreActionsOpen}
                            PaperProps={{
                            style: {
                                maxHeight: 48 * 4.5,
                                width: 200,
                            },
                            }}
                        >
                            <MenuItem  onClick={this.handleEditSelection}>
                                Edit
                            </MenuItem>
                            <MenuItem onClick={this.handleDeleteSelection}>
                                Delete
                            </MenuItem> 
                        </Menu>
                    </CardActions>
                </Card>
                </ButtonBase>
        )
    }
}

export default withStyles(styles)(TripCard);