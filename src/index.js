import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import PageRouter from './router';
import registerServiceWorker from './registerServiceWorker';
import './css/common.scss'
ReactDOM.render(<PageRouter />, document.getElementById('root'));
registerServiceWorker();
