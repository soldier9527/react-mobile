import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Home from '../pages/home'
import App from '../App'



const PageRouter  = () =>(
    <HashRouter>
        <div>
            <Switch>
                <Redirect path="/" to="/home" />

                <Route path="/home" component={Home}></Route>
            </Switch>

        </div>
    </HashRouter>
    )

export default PageRouter;
