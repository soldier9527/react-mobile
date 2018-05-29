
import React from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Loadable from 'react-loadable';
import Login from '../pages/login/login'
import Register from '../pages/login/register'
import Hall from '../pages/hall/index'; // 大厅
import OpenList from '../pages/open/index' // 开奖信息
import UserIndex from '../pages/user/index' // 开奖信息
const Loading = () => <div>Loading...</div>;
const Home = Loadable({
    loader: () => import(process.env.REACT_APP_HOME?process.env.REACT_APP_HOME:"../pages/home/home"),
    loading: Loading,
});
const PageRouter  = () =>(
    <HashRouter>
        <div>
            <Switch>
                <Redirect exact path="/" to="/home" />
                <Route path="/home" component={Home}></Route>
                <Route path="/login" component={Login}></Route>
                <Route path="/register" component={Register}></Route>
                <Route path="/hall" component={Hall}></Route>
                <Route path="/open" component={OpenList}></Route>
                <Route path="/user" component={UserIndex}></Route>
            </Switch>
        </div>
    </HashRouter>
    )

export default PageRouter;
