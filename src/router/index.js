
import React,{Component} from 'react';
import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import Loadable from 'react-loadable';
import config from '../pages/config'

// import Home from '../pages/home/01/index'
const Home = Loadable({
    loader: () => import(/* webpackChunkName: "app" */ process.env.REACT_APP_HOME?process.env.REACT_APP_HOME:"../pages/home/index"),
    loading: () => <div></div>,
});
// import Guidance from '../pages/home/guidance' //引导页
const Guidance = Loadable({
    loader: () => import(/* webpackChunkName: "app" */ process.env.REACT_APP_GUIDANCE?process.env.REACT_APP_GUIDANCE:"../pages/home/guidance"),
    loading:  () => <div></div>,
});
import Login from '../pages/login/login'

import getStaticData from '../pages/common/getStatic'
class Root extends Component{
    componentDidMount(){
        getStaticData("x");
        getStaticData("g");
    }
    render(){
        return null
    }
}

let indexRouter="/guidance";
if(config.isAPP){
    indexRouter="/home"
}else if(config.index){
    indexRouter= config.index
}

const PageRouter  = () =>(
    <HashRouter>
        <div>
            <Route path="/" component={Root}></Route>
            <Switch>
                <Redirect exact path="/" to={indexRouter} />
                <Route path="/guidance" component={Guidance}></Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/login" component={Login}></Route>

            </Switch>
        </div>
    </HashRouter>
    )

export default PageRouter;
