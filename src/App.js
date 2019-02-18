import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import firebase from 'firebase'
import FileUpload from './FileUpload'

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null
    }
    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user }) // user: user
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
    .then(result => console.log(`${result.user.email} ha iniciado sesion.`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  handleLogout() {
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha cerrado sesion.`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`))
  }

  renderLoginButton() {
    if(this.state.user) {
      // Si esta logueado.
      return(
        <div className="App-intro">
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p className="App-intro">Hola { this.state.user.displayName}!</p>
          <button onClick={this.handleLogout} className="App-btn">Bye bye</button>
          <FileUpload />
        </div>
      )
    } else {
      // Si no esta logueado.
      return(
        <div>
          <button onClick={this.handleAuth} className="App-btn">Iniciar sesion con Google</button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Gallery-Fire</h2>
        </div>
        { this.renderLoginButton() }
      </div>
    );
  }
}

export default App;
