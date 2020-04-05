import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const styles = theme => ({
});

class Dashboard extends React.Component {
    state = {
        data : [],
        dataAvaible : false,
    };

    componentDidMount(){
        this.getTimeSeries();
    }

    getTimeSeries = async () => {
        const { dateFrom, dateTo, scope, custom_scope } = this.props;
        if (scope > 0){
            const dataSend = {
                scope_id: scope,
                from_date: dateFrom.getFullYear() + "-" + (dateFrom.getMonth()+1) + "-1",
                end_date: dateTo.getFullYear() + "-" + (dateTo.getMonth()+1) + "-1",
            };
            const response = await axios.post(buildApiUrl("/coverage/"), dataSend);
            this.setState({data:response.data.intersection_area, dataAvaible:true});
        }
        
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.getTimeSeries();
        }
    }


    render() {
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
