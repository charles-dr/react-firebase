import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './styles/tailwind.css';
import './index.scss';

import { render } from 'react-dom';
import { Provider } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';
import { createStore, combineReducers, compose } from 'redux';
import {
  ReactReduxFirebaseProvider,
  firebaseReducer
} from 'react-redux-firebase';

const fbConfig = {
  apiKey: "AIzaSyDgHWQSTmSyWXur0Zy1Iv2T_IYcAyzEuH4",
  authDomain: "safika-health-shop.firebaseapp.com",
  databaseURL: "https://safika-health-shop.firebaseio.com",
  projectId: "safika-health-shop",
  storageBucket: "safika-health-shop.appspot.com",
  messagingSenderId: "822207857109",
  appId: "1:822207857109:web:4267a5829774122a203d5c",
  measurementId: "G-KS98MY8MFF"
};
const rrfConfig = {
  userProfile: 'users'
}

firebase.initializeApp(fbConfig);

const rootReducer = combineReducers({
  firebase: firebaseReducer
  // firestore: firestoreReducer // <- needed if using firestore
})

const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch
  // createFirestoreInstance // <- needed if using firestore
}



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
