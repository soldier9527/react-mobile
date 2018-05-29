import React from 'react';
import ReactDOM from 'react-dom';
import PageRouter from './router';
import registerServiceWorker from './registerServiceWorker';
import 'antd/lib/progress/style/css';
import './css/common.scss'
ReactDOM.render(<PageRouter />, document.getElementById('root'));
registerServiceWorker();
