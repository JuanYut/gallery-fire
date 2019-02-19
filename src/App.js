import React, { Component } from 'react';
import config from './firebase-config'

import firebase from 'firebase'
import 'firebase/firestore'

import FileUploader from 'react-firebase-file-uploader'

firebase.initializeApp(config)

const db = firebase.firestore()

const settings = { timestampsInSnapshots: true}
  db.settings(settings)

class App extends Component {

  state = {
    images: []
  }

  handleUploadStart = () => {
    console.log('image uploading...')
  }

  handleUploadSuccess = filename => {
    console.log(filename)

    firebase.storage().ref('fotos').child(filename).getDownloadURL()
    .then((url) => {
      console.log(url)

      firebase.storage().ref('fotos').child(filename).getMetadata()
      .then((result) => {
        var newDoc = db.collection('uploadImage').doc()

        newDoc.set({
          imageName: filename,
          imageURL: url,
          docRef: newDoc.id
        })

        db.collection('uploadImage').doc(newDoc.id).get()
        .then((result) => {
          console.log(result.data())

          this.setState({
            images: this.state.images.concat(result.data())
          })
        })

        console.log(result)
      })

      // this.setState({
      //   images: this.state.images.concat(url)
      // })

      console.log(this.state.images)
    })
  }

  componentWillMount() {
    console.log('mounted')

    db.collection('uploadImage').get()
    .then((result) => {
      console.log(result + "!!!")
      result.forEach((documents) => {
        console.log(documents.data().imageName)

        this.setState({
          images: this.state.images.concat(documents.data())
        })
      })
    })

    // this.setState({
    //   images: this.state.images.concat(result.data())
    // })
  }

  render() {

    console.log(this.state.images)
    return (
      <div>
        <h3>Images</h3>
        {this.state.images.map((data, i) => {
          return(
            <div key={i}>
              <img src={data.imageURL} alt="" style={{
                width: '200px'
              }}/>
              <p>{data.imageName}</p>
            </div>
          )
        })}

        <FileUploader
        accept="fotos/*"
        storageRef={firebase.storage().ref('fotos')}
        onUploadStart={this.handleUploadStart}
        onUploadSuccess={this.handleUploadSuccess}
        />
      </div>
    );
  }
}

export default App;
