import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { TextField } from '../node_modules/@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from './Card';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    gridRow: {
        marginTop: 50
    }
});

class Weather extends React.Component {
    // This API_KEY should be an active api key from openweathermap.org.  A free account API key should suffice.
    //default city is kathmandu. if you want to fetch weather data according to zip code than replace q with zip

    constructor() {
        super();
        this.state = {
            forecasts: [],
            q: 'kathmandu',
            zipCode: '52241'
        };
        this.refreshForecast = this.refreshForecast.bind(this);
    }

    componentDidMount() {
        this.refreshForecast();
    }

    refreshForecast() {
        fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + this.state.q + "&units=imperial&APPID=9d530da299c5a6b9e243b3b7e5c58203")
            .then(results => results.json()
            )
            .then(data => {
                const truncatedData = data.list.filter(entry => entry.dt_txt.includes("18:00:00"));
                const forecasts = [];

                truncatedData.forEach((element, index) => {
                    let day = (new Date(element.dt_txt)).getDay();
                    let currentElementWeather = element.weather[0];
                    let currentElementTemp = element.main.temp + '°C';
                    let dailyForecast = { 'key': index, 'day': day, 'temperature': currentElementTemp, 'weather': currentElementWeather.main, 'icon': currentElementWeather.icon }
                    forecasts.push(dailyForecast);
                });
                this.setState({ forecasts: forecasts });
            })
    }
    updateq(e) {
        this.setState({
            q: e.target.value
        })
    }
    updateZipCode(evt) {
        this.setState({
            zipCode: evt.target.value
        });
    }

    render() {
        if (!this.state.forecasts) {
            return <h1>LOADING...</h1>
        } else {
            return (
                <React.Fragment>
                    <Typography variant="display4" align="center">
                        <h1>Weather Forecast</h1>
                    </Typography>

                    <Grid container spacing={5} className={this.props.classes.root}>
                        <Grid item xs={12} className={this.props.classes.gridRow}>
                            <Grid container justify="center">
                                <TextField
                                    label="city"
                                    value={this.state.q}
                                    onChange={e => this.updateq(e)}
                                    className="mt-3" />

                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="center" >
                                <Button variant="contained" color="primary" className={this.props.classes.button} onClick={this.refreshForecast}>
                                    Refresh
                    </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} className={this.props.classes.gridRow}>
                            <Grid container justify="center" spacing={3}>
                                {this.state.forecasts.map(value => (
                                    <Grid key={value.key} item>
                                        <Card day={value.day} temperature={value.temperature} weather={value.weather} value={value.key} icon={value.icon} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>

                </React.Fragment>
            );
        }
    }
}

Weather.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Weather);