import React from 'react';
import ReactDOM from 'react-dom';
import PageRouter from './router';
import registerServiceWorker from './registerServiceWorker';
// import 'url-search-params-polyfill'; // URLSearchParams兼容
import 'antd/lib/progress/style/css';
import 'antd/lib/modal/style/css';
import 'antd/lib/message/style/css';
import 'antd/lib/row/style/css';
import 'antd/lib/col/style/css';
import 'antd/lib/table/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/select/style/css';
import 'antd/lib/checkbox/style/css';
import './css/common.scss'
ReactDOM.render(<PageRouter />, document.getElementById('root'));
registerServiceWorker();
