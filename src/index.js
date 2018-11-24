import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppRouter from './AppRouter';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as firebase from 'firebase'

ReactDOM.render(<AppRouter />, document.getElementById('root'));
serviceWorker.unregister();
