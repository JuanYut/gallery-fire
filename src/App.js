import React, { Component } from 'react';
import config from './firebase-config'
// import './App.css'
import Slider from 'react-animated-slider'
import 'react-animated-slider/build/horizontal.css'
import './app-animated.css'
  
import firebase from 'firebase'
import 'firebase/firestore'

import FileUploader from 'react-firebase-file-uploader'

firebase.initializeApp(config)

const db = firebase.firestore()

// const settings = { timestampsInSnapshots: true}
//   db.settings(settings)

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
        
        <Slider autoplay={1000}>
          {this.state.images.map((data, i) => (
            <div key={i}>
              <img className="galleryImg" src={data.imageURL} alt="" />
            </div>
          ))}
        </Slider>

        {/* <FileUploader
        accept="fotos/*"
        storageRef={firebase.storage().ref('fotos')}
        onUploadStart={this.handleUploadStart}
        onUploadSuccess={this.handleUploadSuccess}
        /> */}

        {/* <div className="container-gallery">
        {this.state.images.map((data, i) => {
          return(
            <div className="item" key={i}>
              <img className="galleryImg" src={data.imageURL} alt="" />
            </div>
          )
        })}
      </div> */}
      </div>
    );
  }
}

export default App;
