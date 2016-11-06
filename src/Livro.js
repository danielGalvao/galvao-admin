import React, { Component } from 'react';
import InputCustom from './components/InputCustom';
import BtnSubmitCustom from './components/BtnSubmitCustom';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import ErrorHelper from './ErrorHelper';

class BookForm extends Component {
  constructor() {
    super();
    this.state = {titulo:'',preco:'',autorId:''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
  }
  enviaForm(evento){
   evento.preventDefault();
   console.log(JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}));
   $.ajax({
     url:'http://localhost:8080/api/livros',
     contentType:'application/json',
     dataType:'json',
     type:'post',
     data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
     success: function(res){
       PubSub.publish('update-book-list', res);
       this.setState({titulo:'',preco:'',autorId:''});
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
 setTitulo(evento){
   this.setState({titulo:evento.target.value});
 }

  setPreco(evento){
    this.setState({preco:evento.target.value});
  }

  setAutorId(evento){
    this.setState({autorId:evento.target.value});
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm.bind(this)}>
          <InputCustom id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo" />
          <InputCustom id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço" />
          <div className="pure-control-group">
            <label htmlFor="autorId">Autor</label>
            <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
              <option value="">Selecione</option>
              {
                this.props.autores.map(function(autor){
                  return <option key={autor.id} value={autor.id}>{autor.nome}</option>
                })
              }
            </select>
            <span className="error">{this.state.msgErro}</span>
          </div>
          <BtnSubmitCustom label="Gravar" />
        </form>
      </div>
    );
  }
}

class BookTable extends Component {
  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Preço</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(livro) {
                return (
                  <tr key={livro.id}>
                    <td>
                      {livro.titulo}
                    </td>
                    <td>
                      {livro.preco}
                    </td>
                    <td>
                      {livro.autor.nome}
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

export default class BookBox extends Component {
  constructor() {
    super();
    this.state = {lista : [], autores: []};
  }
  componentWillMount(){
    $.ajax({
      url:"http://localhost:8080/api/livros",
      dataType: 'json',
      success:function(resp){
        this.setState({lista:resp});
      }.bind(this)
    });
    $.ajax({
      url:"http://localhost:8080/api/autores",
      dataType: 'json',
      success:function(resp){
        this.setState({autores:resp});
      }.bind(this)
    });

    PubSub.subscribe('update-book-list', function(msg, newList){
      this.setState({lista:newList});
    }.bind(this));
  }
  render() {
    return (
      <div>
        <div className="header">
            <h1>Cadastro de Livros</h1>
        </div>
        <div className="content" id="content">
          <BookForm autores={this.state.autores} />
          <BookTable lista={this.state.lista} />
        </div>
      </div>
    );
  }
}
