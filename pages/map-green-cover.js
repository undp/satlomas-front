import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Drawer from "@material-ui/core/Drawer";
import AddIcon from "@material-ui/icons/Add";
import LayersIcon from "@material-ui/icons/Layers";
import RemoveIcon from "@material-ui/icons/Remove";
import Head from "next/head";
import React, { Component } from "react";
import SearchField from "../components/SearchField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import { withAuthSync } from "../utils/auth";
import Dashboard from "../components/Dashboard";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const drawerWidth = 450;

const styles = theme => ({
  searchAndDateControl: {
    position: "fixed",
    top: theme.spacing.unit,
    left: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300
  },
  topRightControlGroup: {
    position: "fixed",
    top: theme.spacing.unit,
    right: theme.spacing.unit
  },
  bottomLeftControlGroup: {
    position: "fixed",
    bottom: theme.spacing.unit,
    left: theme.spacing.unit
  },
  fabContainer: {
    display: "block"
  },
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  dateField: {
    padding: "2px 4px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    width: 320
  },
  selectsField: {
    padding: "2px 4px",
    margin: "10px",
    display: "flex",
    alignItems: "center",
    width: 320
  },
  textField: {
    margin: theme.spacing.unit
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  }
});

let ZoomControl = ({ classes }) => (
  <div>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Zoom in"
        className={classes.fab}
      >
        <AddIcon />
      </Fab>
    </div>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Zoom out"
        className={classes.fab}
      >
        <RemoveIcon />
      </Fab>
    </div>
  </div>
);

ZoomControl = withStyles(styles)(ZoomControl);

let DateField = ({ classes, dates, onChangeFrom, onChangeTo }) => {
  const createSelect = () => {
    let items = []
    for (let i = 0; i < dates.availableDates.length + 1; i++) {
      items.push(<MenuItem key={i} value={i}>{dates.availableDates[i]}</MenuItem>)
    }
    return items
  }

  return (<div>
    <Paper className={classes.dateField}>
      <TextField
        id="date_from"
        label="Date from"
        type="date"
        defaultValue={dates.dashboardDateFrom.toISOString().slice(0,10)}
        className={classes.textField}
        onChange={onChangeFrom}
        InputProps={{ inputProps : { 
          min : dates.initDate.toISOString().slice(0,10),
          max : dates.dashboardDateTo.toISOString().slice(0,10)
        }}}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        id="date_to"
        label="Date to"
        type="date"
        defaultValue={dates.dashboardDateTo.toISOString().slice(0,10)}
        className={classes.textField}
        onChange={onChangeTo}
        InputProps={{ inputProps: { 
          min : dates.dashboardDateFrom.toISOString().slice(0,10),
          max : dates.endDate.toISOString().slice(0,10)
        } }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Paper>
    <Paper className={classes.dateField}>
      <Select className={classes.selectsField} value={dates.availableDates[0]}>
        {createSelect()}
      </Select>
    </Paper></div>
  )} ;

DateField = withStyles(styles)(DateField);

let SearchControl = ({ classes, dates, onChangeFrom, onChangeTo }) => (
  <div className={classes.searchAndDateControl}>
    {/* <SearchField /> */}
    <Paper className={classes.selectsField}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select value="eco">
          <MenuItem value="eco">Corredores Ecológicos</MenuItem>
        </Select>
      </FormControl>
    </Paper>
    <Paper className={classes.selectsField}>
      <FormControl variant="outlined" className={classes.formControl}>
        <Select value="sur">
          <MenuItem value="sur">Lomas del Sur</MenuItem>
        </Select>
      </FormControl>
    </Paper>
    <DateField dates={dates}
      onChangeFrom={onChangeFrom} onChangeTo={onChangeTo}
    />
  </div>
);

SearchControl = withStyles(styles)(SearchControl);

let LayersControl = ({ classes }) => (
  <div>
    <div className={classes.fabContainer}>
      <Fab
        color="primary"
        size="small"
        aria-label="Toggle Layers"
        className={classes.fab}
      >
        <LayersIcon />
      </Fab>
    </div>
  </div>
);

LayersControl = withStyles(styles)(LayersControl);

let PlotsDrawer = ({ classes, dates, scope, custom_scope }) => (
  <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper
    }}
    anchor="right"
  >
    <Dashboard dateFrom={dates.dashboardDateFrom} dateTo={dates.dashboardDateTo} 
                scope={scope} custom_scope={custom_scope}/>
  </Drawer>
);

PlotsDrawer = withStyles(styles)(PlotsDrawer);

class MapMockup extends Component {
  state = {
    dates : {
      dashboardDateFrom : null,
      dashboardDateTo : null,
      availableDates : [],
      allAvaibleDates : [],
      initDate : null,
      endDate: null,
    },
    selectedScope: null,
    customScope : null,
    loadDrawer : false,
    mapDate : null,
    loadSearchDate: false,
    
  };

  getDates = async () => {
    let response = await axios.get(buildApiUrl("/available-dates/"), {});
    let dates = {
      firstDate : new Date(response.data.first_date),
      lastDate : new Date(response.data.last_date),
      availables : response.data.availables,
    }
    return dates;
  }

  componentDidMount = async () => {
    let dates = await this.getDates();

    //Se obtiene el primer dia del mes actual o de la fecha mas reciente
    let today = new Date();
    today.setDate(1);
    if (today > dates.lastDate){
      today = new Date(dates.lastDate);
    }

    //Se calculan seis meses para atras, o la primer fecha posible, para generar el rango para el dashboard
    let sixmonthago = new Date();
    sixmonthago.setMonth(today.getMonth() - 6);
    if (sixmonthago < dates.firstDate){
      sixmonthago = new Date(dates.firstDate);
    }

    //Se crea el arreglo con las fechas seleccionables
    let availableDates = []
    let reference_date = new Date(sixmonthago);
    while (reference_date < today) {
      if (dates.availables.includes(reference_date.toISOString().slice(0,7))){
        availableDates.push(reference_date.toISOString().slice(0,7)); }
      reference_date.setMonth(reference_date.getMonth()+1);
    }
    this.setState(
      {
        dates: {
          dashboardDateFrom : sixmonthago, 
          dashboardDateTo: today,
          initDate: dates.firstDate,
          endDate: dates.lastDate,
          availableDates: availableDates,
          allAvaibleDates : dates.availables,
        }, 
        mapDate: today,
        selected_scope: 1,
        custom_scope : null,
        loadDrawer: true,
        loadSearchDate: true,
      });
  }

  onChangeFrom = (event) => {
    let date_from = new Date(event.target.value + " 00:00:00");
    let availableDates = []
    while (date_from < this.state.dates.endDate) { 
      if (this.state.dates.allAvaibleDates.includes(date_from.toISOString().slice(0,7))){
        availableDates.push(date_from.toISOString().slice(0,7)); }
      date_from.setMonth(date_from.getMonth()+1)
    }
    this.setState({
        dates: {
          ...this.state.dates,
          dashboardDateFrom : date_from, 
          availableDates: availableDates
    }});
  }

  onChangeTo = (event) => {
    let date_to = new Date(event.target.value + " 00:00:00");
    let availableDates = []
    let { initDate } = this.state.dates;
    while (initDate < date_to) { 
      if (this.state.dates.allAvaibleDates.includes(initDate.toISOString().slice(0,7))){
        availableDates.push(initDate.toISOString().slice(0,7)); }
      initDate.setMonth(initDate.getMonth()+1)
    }
    this.setState({
      dates: {
        ...this.state.dates,
        dashboardDateTo : date_to, 
        availableDates: availableDates
    }});
  }

  render() {
    const { classes } = this.props;
    const { dates, loadDrawer, selectedScope, customScope,
      loadSearchDate } = this.state;

    return (
      <div className="index">
        <Head>
          <title>Map</title>
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        {loadSearchDate && 
        <SearchControl dates={dates} onChangeFrom={this.onChangeFrom} onChangeTo={this.onChangeTo}/>}
        <div className={classes.bottomLeftControlGroup}>
          <ZoomControl />
          <LayersControl />
        </div>
        {loadDrawer && <PlotsDrawer dates={dates} scope={selectedScope} custom_scope={customScope}/>}
        <img id="map" src="/static/mockup/verde2.png" />
        <style jsx>
          {`
            #map {
              position: absolute;
              top: 0;
              left: 0;
              height: 100vh;
              width: 100vw;
              z-index: -1;
            }
          `}
        </style>
      </div>
    );
  }
}

MapMockup = withStyles(styles)(MapMockup);
MapMockup = withAuthSync(MapMockup, { redirect: false });

export default MapMockup;
