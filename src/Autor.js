import React, { Component } from 'react';
import InputCustom from './components/InputCustom';
import BtnSubmitCustom from './components/BtnSubmitCustom';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import ErrorHelper from './ErrorHelper';

class AuthorForm extends Component {
  constructor() {
    super();
    this.state = {nome:'',email:'',senha:''};
    this.enviaForm = this.enviaForm.bind(this);
  }
  enviaForm(evento){
   evento.preventDefault();
   $.ajax({
     url:'http://localhost:8080/api/autores',
     contentType:'application/json',
     dataType:'json',
     type:'post',
     data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
     success: function(res){
       PubSub.publish('update-author-list', res);
       this.setState({nome:'',email:'',senha:''});
     }.bind(this),
     error: function(res){
       if(res.status === 400){
         new ErrorHelper().publishError(res.responseJSON);
       }
     },
     beforeSend: function() {
       PubSub.publish('cleanError',{});
     }
   });
 }

 updateField(inputName, event) {
  var field = {};
  field[inputName] = event.target.value;
  this.setState(field);
 }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)}>
          <InputCustom id="nome" type="text" name="nome" value={this.state.nome} onChange={this.updateField.bind(this,'nome')} label="Nome" />
          <InputCustom id="email" type="email" name="email" value={this.state.email} onChange={this.updateField.bind(this,'email')} label="Email" />
          <InputCustom id="senha" type="password" name="senha" value={this.state.senha} onChange={this.updateField.bind(this,'senha')} label="Senha" />
          <BtnSubmitCustom label="Gravar" />
        </form>
      </div>
    );
  }
}

class AuthorTable extends Component {
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(autor) {
                return (
                  <tr key={autor.id}>
                    <td>
                      {autor.nome}
                    </td>
                    <td>
                      {autor.email}
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default class AuthorBox extends Component {
  constructor() {
    super();
    this.state = {lista : []};
  }
  componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/autores",
      dataType: 'json',
      success:function(resp){
        this.setState({lista:resp});
      }.bind(this)
    });

    PubSub.subscribe('update-author-list', function(msg, newList){
      this.setState({lista:newList});
    }.bind(this));
  }
  render() {
    return (
      <div>
        <div className="header">
            <h1>Cadastro de Autor</h1>
        </div>
        <div className="content" id="content">
          <AuthorForm cbUpdateList={this.updateList} />
          <AuthorTable lista={this.state.lista} />
        </div>
      </div>
    );
  }
}
