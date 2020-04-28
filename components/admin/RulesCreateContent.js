import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


class ParameterRuleForm extends Component {
  render(){
    return (<div>Paramter form</div>)
  }
}

function ScopeRuleForm(){
  return (<div>Scope rule</div>)
}

function ScopeTypeRuleForm(){
  return (<div>Scope type rule</div>)
}

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

const tabs = [
    {
        'title': "Crear regla de parametros",
        'content': <ParameterRuleForm />
    },
    {
        'title': "Crear reglas por ambito",
        'content': <ScopeRuleForm />
    },
    {
        'title': "Crar regla por tipo de ambito",
        'content': <ScopeTypeRuleForm />
    }

]

class RulesCreate extends Component {
  state = {
    value: 0,
  }

  componentDidMount(){
    //TODO: Cambiar value dependiendo de query params, para setear pestaña 
  }


  handleChange = (event, value) => {
    this.setState({ value });
  };

  createTabs = () => {
    let arr = [];
    tabs.forEach(function (value, i) {
      arr.push( <Tab key={i} label={value.title}/>);
    });
    return arr;
  }
    
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange}>
            {this.createTabs()}
          </Tabs>
        </AppBar>
        {tabs[value].content}
      </div>
      
    );
  }
}

RulesCreate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RulesCreate);