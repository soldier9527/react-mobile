import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Home from '../pages/home'
import Login from '../pages/login/index'
import Hall from '../pages/hall/index'; // 大厅
import OpenList from '../pages/open/index' // 开奖信息
const PageRouter  = () =>(
    <HashRouter>
        <div>
            <Switch>
                <Redirect exact path="/" to="/home" />
                <Route path="/home" component={Home}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/hall" component={Hall}></Route>
                <Route path="/open" component={OpenList}></Route>
            </Switch>

        </div>
    </HashRouter>
    )

export default PageRouter;
