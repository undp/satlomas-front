import React from "react";
import { withStyles } from "@material-ui/core/styles";

import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Button from "@material-ui/core/Button";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const lastTimeItems = {
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
};

const aggregationFuncItems = {
  avg: "Promedio",
  min: "Mínimo",
  max: "Máximo",
  sum: "Suma",
  count: "Conteo",
};

const groupingIntervalItems = {
  hour: "Hora",
  day: "Día",
  week: "Semana",
  month: "Mes",
  year: "Año",
};

const styles = (theme) => ({
  buttonIcon: {
    marginRight: theme.spacing.unit,
  },
  popover: {
    margin: theme.spacing.unit * 2,
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    width: 300,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 290,
  },
  inputLabel: {
    height: 40,
  },
});

let SelectControl = ({ classes, id, label, items, value, onChange }) => (
  <FormControl component="fieldset" className={classes.formControl}>
    <InputLabel className={classes.inputLabel} htmlFor={id}>
      {label}
    </InputLabel>
    <Select
      value={value}
      onChange={onChange}
      inputProps={{
        name: id,
        id,
      }}
    >
      {Object.entries(items).map(([value, name]) => (
        <MenuItem key={value} value={value}>
          {name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

SelectControl = withStyles(styles)(SelectControl);

const LastTimeControl = ({ value, onChange }) => (
  <SelectControl
    id="last-time"
    label="Últimos"
    items={lastTimeItems}
    value={value}
    onChange={onChange}
  />
);

const AggregationFunctionControl = ({ value, onChange }) => (
  <SelectControl
    id="aggr-func"
    label="Función de agregación de tiempo"
    items={aggregationFuncItems}
    value={value}
    onChange={onChange}
  />
);

const GroupingIntervalControl = ({ value, onChange }) => (
  <SelectControl
    id="group-interval"
    label="Intervalo de agrupación"
    items={groupingIntervalItems}
    value={value}
    onChange={onChange}
  />
);

class TimeRangeSelectorButton extends React.Component {
  render() {
    const {
      value,
      classes,
      popoverOpen,
      anchorEl,
      onClick,
      onPopoverClose,
      onLastTimeSelectChange,
      onAggregationFunctionSelectChange,
      onGroupingIntervalSelectChange,
    } = this.props;

    const { lastTime, aggregationFunc, groupingInterval } = value || {};

    return (
      <>
        <Tooltip
          title="Configurar filtro de tiempo"
          aria-label="Configurar filtro de tiempo"
          enterDelay={500}
        >
          <Button
            aria-owns={popoverOpen ? "simple-popper" : undefined}
            aria-haspopup="true"
            onClick={onClick}
            color="inherit"
          >
            <AccessTimeIcon className={classes.buttonIcon} />
            {`Tiempo real - ${lastTimeItems[lastTime]}`}
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
          </div>
        </Popover>
      </>
    );
  }
}

TimeRangeSelectorButton = withStyles(styles)(TimeRangeSelectorButton);

export default TimeRangeSelectorButton;
