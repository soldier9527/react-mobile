import React from 'react';
import {
    HashRouter,
    Route,
    Switch
} from 'react-router-dom';
import Home from '../pages/home'
import App from '../App'
const PageRouter  = () =>(
    <HashRouter>
        <div>
            <Switch>
                <Route exact path="/" component={App}></Route>
                <Route path="/home" component={Home}></Route>
            </Switch>
        </div>
    </HashRouter>
    )

export default PageRouter;
