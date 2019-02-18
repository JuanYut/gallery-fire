import React, { Component } from 'react';
import firebase from 'firebase'
import FileUpload from './FileUpload'

class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      pictures: []
    }
    this.handleAuth = this.handleAuth.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user }) // user: user
    })

    firebase.database().ref('pictures').on('child_added', spashot => {
      this.setState({
        pictures: this.state.pictures.concat(spashot.val())
      })
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

  handleUpload(event) {
    const file = event.target.files[0]
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`)
    const task = storageRef.put(file)

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.byteTransferred / snapshot.totalBytes) * 100
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => storageRef.getDownloadURL().then(url => {
      const record = {
        photoURL: this.state.user.photoURL,
        displayName: this.state.user.displayName,
        image: task.snapshot.downloadURL
      }
      const dbRef = firebase.database().ref('pictures')
      const newPicture = dbRef.push()
      newPicture.set(record)
    }))
  }

  renderLoginButton() {
    if(this.state.user) {
      // Si esta logueado.
      return(
        <div className="App-intro">
          <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p className="App-intro">Hola { this.state.user.displayName}!</p>
          <button onClick={this.handleLogout} className="App-btn">Bye bye</button>

          <FileUpload onUpload={this.handleUpload} uploadValue={this.state.uploadValue} />

          {
            this.state.pictures.map(picture => (
              <div>
                <img src={ picture.image } />
                <br/>
                <img width="48" src={ picture.photoURL } alt={ picture.displayName } />
                <br/>
                <span>{ picture.displayName }</span>
              </div>
            ))
          }

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
