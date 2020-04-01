import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import { withNamespaces } from "../i18n";

const styles = theme => ({
});

class Dashboard extends React.Component {
    state = {
        dateFrom : this.props.dateFrom,
        dateTo: this.props.dateTo,
        scope: this.props.scope,
        custom_scope: this.props.custom_scope,
        data : [],
        dataAvaible : false,
    };

    componentDidMount(){
        this.getTimeSeries();
    }

    getTimeSeries = async () => {
        const { dateFrom, dateTo } = this.state;
        const dataSend = {
            scope_id: 1,
            from_date: dateFrom.getFullYear() + "-" + dateFrom.getMonth() + "-1",
            end_date: dateTo.getFullYear() + "-" + dateTo.getMonth() + "-1",
        };
        const response = await axios.post(buildApiUrl("/coverage/"), dataSend);
        this.setState({data:response.data.intersection_area, dataAvaible:true});
    }


    render() {
        const { t, classes } = this.props;
        const { data, dataAvaible } = this.state;
        return (
        <div>
            { dataAvaible && 
                  <LineChart width={600} height={300} data={data} 
                  margin={{top: 5, right: 5, left: 5, bottom: 5,}}>
                    <Line dataKey="area" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis />
                  </LineChart>
            }
            
        </div>
        );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  dateFrom: PropTypes.object.isRequired,
  dateTo: PropTypes.object.isRequired,
  scope: PropTypes.number,
  custom_scope: PropTypes.string,
};

Dashboard = withStyles(styles)(Dashboard);

export default Dashboard;
