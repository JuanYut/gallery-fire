import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase'

firebase.initializeApp({
  apiKey: "AIzaSyAz7VVnrLnNACEYIHAW4sRvBr9sxuDOsog",
  authDomain: "gallery-fire-f26af.firebaseapp.com",
  databaseURL: "https://gallery-fire-f26af.firebaseio.com",
  projectId: "gallery-fire-f26af",
  storageBucket: "gallery-fire-f26af.appspot.com",
  messagingSenderId: "426131609935"
})

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
