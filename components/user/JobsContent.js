import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import React from "react";
import Moment from "react-moment";
import { i18n, withTranslation } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { logout } from "../../utils/auth";
import TableRowSkeleton from "../TableRowSkeleton";
import moment from "moment";

const RUNNING_STATES = ["PENDING", "STARTED"];

const styles = (theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  table: {
    minWidth: 700,
  },
});

const JobProgress = ({ job }) => {
  const duration = job.duration || job.estimated_duration;
  if (duration) {
    const created_at = moment(job.created_at);
    const progressSeconds = moment().diff(created_at, "seconds");
    const progress = Math.min(
      Math.round((progressSeconds / duration) * 100),
      100
    );
    return <LinearProgress variant="determinate" value={progress} />;
  } else {
    return <LinearProgress />;
  }
};

class JobsContent extends React.Component {
  state = {
    loading: true,
    jobs: [],
  };

  async componentDidMount() {
    await this.getJobs();
    this.setState({ loading: false });

    this.interval = setInterval(() => this.getJobs(), 5000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  async getJobs() {
    const { token } = this.props;
    try {
      const response = await axios.get(buildApiUrl("/jobs/"), {
        params: { page_size: 20 },
        headers: { Authorization: token },
      });
      this.setState({
        jobs: response.data.results,
      });
    } catch (err) {
      const response = err.response;
      if (response && response.status === 401) {
        logout();
      } else {
        console.error(response);
        this.props.enqueueSnackbar("Error al listar trabajos", {
          variant: "error",
        });
      }
    }
  }

  render() {
    const { t, classes } = this.props;
    const { loading, jobs } = this.state;

    const runningJobs = jobs.filter((job) =>
      RUNNING_STATES.includes(job.state)
    );
    const stoppedJobs = jobs.filter(
      (job) => !RUNNING_STATES.includes(job.state)
    );

    const locale = i18n.language;

    return (
      <div>
        <Typography variant="h6" gutterBottom component="h3">
          Trabajos en ejecución
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Progreso</TableCell>
                <TableCell>Comenzó</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableRowSkeleton cols={5} />}
              {!loading && runningJobs.length === 0 && (
                <TableRow>
                  <TableCell>No hay trabajos en ejecución.</TableCell>
                </TableRow>
              )}
              {runningJobs.map((job, i) => (
                <TableRow key={i}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{t(`jobs.states.${job.state}`)}</TableCell>
                  <TableCell>
                    <JobProgress job={job} />
                  </TableCell>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {job.created_at}
                    </Moment>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <Typography variant="h6" gutterBottom component="h3">
          Trabajos anteriores
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Comenzó</TableCell>
                <TableCell>Terminó</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && <TableRowSkeleton cols={5} />}
              {!loading && stoppedJobs.length === 0 && (
                <TableRow>
                  <TableCell>No hay trabajos detenidos.</TableCell>
                </TableRow>
              )}
              {stoppedJobs.map((job, i) => (
                <TableRow key={i}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.name}</TableCell>
                  <TableCell>{t(`jobs.states.${job.state}`)}</TableCell>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {job.created_at}
                    </Moment>
                  </TableCell>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {job.finished_at}
                    </Moment>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

JobsContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

JobsContent = withStyles(styles)(JobsContent);
JobsContent = withTranslation("me")(JobsContent);
JobsContent = withSnackbar(JobsContent);

export default JobsContent;
