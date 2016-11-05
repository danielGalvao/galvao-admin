import React, { Component } from 'react';
import InputCustom from './components/InputCustom';
import BtnSubmitCustom from './components/BtnSubmitCustom';
import $ from 'jquery';

class AuthorForm extends Component {
  constructor() {
    super();
    this.state = {nome:'',email:'',senha:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
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
       this.props.cbUpdateList(res);
     }.bind(this),
     error: function(res){
       console.log("erro");
     }
   });
 }
 setNome(evento){
   this.setState({nome:evento.target.value});
 }

  setEmail(evento){
    this.setState({email:evento.target.value});
  }

  setSenha(evento){
    this.setState({senha:evento.target.value});
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)}>
          <InputCustom id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome" />
          <InputCustom id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="Email" />
          <InputCustom id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha" />
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
                  <tr>
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
    this.updateList = this.updateList.bind(this);
  }
  componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/autores",
      dataType: 'json',
      success:function(resp){
        this.setState({lista:resp});
      }.bind(this)
    });
  }
  updateList(newList){
    this.setState({lista:newList});
  }
  render() {
    return (
      <div>
        <AuthorForm cbUpdateList={this.updateList} />
        <AuthorTable lista={this.state.lista} />
      </div>
    );
  }
}
