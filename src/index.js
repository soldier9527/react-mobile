import React from 'react';
import ReactDOM from 'react-dom';
import 'url-search-params-polyfill'; // URLSearchParams兼容
import PageRouter from './router';
import registerServiceWorker from './registerServiceWorker';
// import './css/blue/common.scss';
import(/* webpackChunkName: "app" */ './css/'+process.env.REACT_APP_THEME +'/common.scss');
registerServiceWorker();

// import './css/blue/common.scss';

import(/* webpackChunkName: "app" */ './css/'+process.env.REACT_APP_THEME +'/common.scss').then(()=>{
    ReactDOM.render(<PageRouter />, document.getElementById('root'));
})



