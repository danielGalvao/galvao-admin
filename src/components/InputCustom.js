import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputCustom extends Component{
  constructor() {
    super();
    this.state = {msgErro: ""};
  }
  render() {
    return (
      <div className="pure-control-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input id={this.props.id} type={this.props.type} name={this.props.name} value={this.props.value} onChange={this.props.onChange}  />
        <span className="error">{this.state.msgErro}</span>
      </div>
    );
  }
  componentDidMount() {
    PubSub.subscribe('errorValidation', function(msg,error){
      if(error.field === this.props.name){
        this.setState({msgErro: error.defaultMessage});
      }
    }.bind(this));
    PubSub.subscribe('cleanError', function(msg){
        this.setState({msgErro: ''});
    }.bind(this));
  }
}
