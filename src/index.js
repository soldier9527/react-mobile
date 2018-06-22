import React from 'react';
import ReactDOM from 'react-dom';
import 'url-search-params-polyfill'; // URLSearchParams兼容
import PageRouter from './router';
import registerServiceWorker from './registerServiceWorker';
// import './css/blue/common.scss';

registerServiceWorker();

// import './css/blue/common.scss';

ReactDOM.render(<PageRouter />, document.getElementById('root'));



