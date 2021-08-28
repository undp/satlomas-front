import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Moment from "react-moment";
import {
  Button,
  Popover,
  Tooltip,
  FormControl,
  Tabs,
  Tab,
} from "@material-ui/core";
import SelectControl from "./SelectControl";
import { KeyboardDatePicker } from "@material-ui/pickers";

export const DEFAULT_MODE = "realtime";
export const DEFAULT_RT_LAST_TIME = "1-year";
export const DEFAULT_HISTORIC_START = "2019-01-01T00:00";
export const DEFAULT_HISTORIC_END = "2020-01-01T00:00";
export const DEFAULT_AGG_FUNC = "avg";
export const DEFAULT_GROUP_INT = "month";

export const lastTimeItems = {
  "1-hour": "1 hora",
  "2-hour": "2 horas",
  "3-hour": "3 horas",
  "6-hour": "6 horas",
  "12-hour": "12 horas",
  "1-day": "1 día",
  "2-day": "2 días",
  "1-week": "1 semana",
  "2-week": "2 semanas",
  "1-month": "1 mes",
  "2-month": "2 meses",
  "1-year": "1 año",
};

export const aggregationFuncItems = {
  avg: "Promedio",
  min: "Mínimo",
  max: "Máximo",
  sum: "Suma",
  count: "Conteo",
};

export const groupingIntervalItems = {
  minute: "Minuto",
  hour: "Hora",
  day: "Día",
  week: "Semana",
  month: "Mes",
  year: "Año",
};

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing(1),
  },
  popover: {
    margin: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    width: 300,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 290,
  },
});

const LastTimeControl = ({ value, onChange }) => (
  <SelectControl
    id="last-time"
    label="Desde hace"
    items={Object.entries(lastTimeItems).map(([id, name]) => ({ id, name }))}
    value={value}
    onChange={onChange}
  />
);

let DateTimeControl = ({ classes, id, label, value, onChange }) => (
  <FormControl component="fieldset" className={classes.formControl}>
    <KeyboardDatePicker
      ampm={false}
      autoOk={true}
      variant="inline"
      format="YYYY-MM-DD HH:mm"
      margin="normal"
      id={id}
      label={label}
      value={value}
      onChange={onChange}
    />
  </FormControl>
);

DateTimeControl = withStyles(styles)(DateTimeControl);

const AggregationFunctionControl = ({ value, onChange }) => (
  <SelectControl
    id="aggr-func"
    label="Función de agregación de tiempo"
    items={Object.entries(aggregationFuncItems).map(([id, name]) => ({
      id,
      name,
    }))}
    value={value}
    onChange={onChange}
  />
);

const GroupingIntervalControl = ({ value, onChange }) => (
  <SelectControl
    id="group-interval"
    label="Intervalo de agrupación"
    items={Object.entries(groupingIntervalItems).map(([id, name]) => ({
      id,
      name,
    }))}
    value={value}
    onChange={onChange}
  />
);

class TimeRangeSelectorButton extends React.Component {
  modes = [
    { key: "realtime", label: "Tiempo Real" },
    { key: "historic", label: "Histórico" },
  ];

  handleTabChange = (_event, value) => {
    const { onModeChange } = this.props;
    if (onModeChange) onModeChange(this.modes[value].key);
  };

  render() {
    const {
      mode,
      realtimeParams,
      historicParams,
      aggregationFunc,
      groupingInterval,
      classes,
      popoverOpen,
      anchorEl,
      onClick,
      onPopoverClose,
      onLastTimeSelectChange,
      onAggregationFunctionSelectChange,
      onGroupingIntervalSelectChange,
      onStartTimeChange,
      onEndTimeChange,
    } = this.props;

    const { lastTime } = realtimeParams;
    const { start, end } = historicParams;

    const title = mode === "realtime" ? `Tiempo real:` : `Histórico:`;
    const tabIndex = this.modes.findIndex((m) => m.key === mode);

    return (
      <>
        <Tooltip
          title="Configurar filtro de tiempo"
          aria-label="Configurar filtro de tiempo"
        >
          <Button
            aria-owns={popoverOpen ? "simple-popper" : undefined}
            aria-haspopup="true"
            onClick={onClick}
            color="inherit"
          >
            <AccessTimeIcon className={classes.buttonIcon} />
            {title}
            {` `}
            {mode === "realtime" ? (
              lastTimeItems[lastTime]
            ) : (
              <>
                <Moment format="YYYY-MM-DD HH:mm">{start}</Moment> -{" "}
                <Moment format="YYYY-MM-DD HH:mm">{end}</Moment>
              </>
            )}
          </Button>
        </Tooltip>
        <Popover
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={onPopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <div className={classes.popover}>
            <Tabs value={tabIndex} onChange={this.handleTabChange}>
              {this.modes.map((mode) => (
                <Tab key={mode.key} label={mode.label} />
              ))}
            </Tabs>
            {mode === "realtime" && (
              <form className={classes.form} autoComplete="off">
                <LastTimeControl
                  value={lastTime}
                  onChange={onLastTimeSelectChange}
                />
                <AggregationFunctionControl
                  value={aggregationFunc}
                  onChange={onAggregationFunctionSelectChange}
                />
                <GroupingIntervalControl
                  value={groupingInterval}
                  onChange={onGroupingIntervalSelectChange}
                />
              </form>
            )}
            {mode === "historic" && (
              <form className={classes.form} autoComplete="off">
                <DateTimeControl
                  id="start"
                  label="Desde"
                  value={start}
                  onChange={onStartTimeChange}
                />
                <DateTimeControl
                  id="end"
                  label="Hasta"
                  value={end}
                  onChange={onEndTimeChange}
                />
                <AggregationFunctionControl
                  value={aggregationFunc}
                  onChange={onAggregationFunctionSelectChange}
                />
                <GroupingIntervalControl
                  value={groupingInterval}
                  onChange={onGroupingIntervalSelectChange}
                />
              </form>
            )}
          </div>
        </Popover>
      </>
    );
  }
}

TimeRangeSelectorButton = withStyles(styles)(TimeRangeSelectorButton);

export default TimeRangeSelectorButton;
