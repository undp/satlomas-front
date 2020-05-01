import { Slider, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
  title: {
    textShadow: '-1px 0 #ddd, 0 1px #ddd, 1px 0 #ddd, 0 -1px #ddd'
  },
});

const boxShadow = '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)';

const CustomSlider = withStyles({
  thumb: { boxShadow },
  track: { boxShadow },
  rail: { boxShadow },
  mark: { boxShadow },
})(Slider);

export default function PeriodSlider({ periods, periodLabels, onChange }) {
  const classes = useStyles();

  const max = periods ? periods.length - 1 : 0;

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider" gutterBottom className={classes.title}>
        Período
      </Typography>
      <CustomSlider
        defaultValue={max}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        valueLabelFormat={i => periodLabels ? `${periodLabels[i][0]} - ${periodLabels[i][1]}` : i}
        onChange={onChange}
        step={1}
        marks
        min={0}
        max={max}
      />
    </div>
  );
}

PeriodSlider.propTypes = {
  periods: PropTypes.array,
  periodLabels: PropTypes.array,
  onChange: PropTypes.func,
}

PeriodSlider.defaultProps = {
  periods: [],
  periodLabels: [],
  onChange: () => { }
}