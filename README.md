# react 项目
https://github.com/soldier9527/react-pro.git
## 命令
    
    //比如  package.json
    {
        "scripts": {
                "start": "node scripts/start.js",
                "build": "node scripts/build.js",
                "release": "npm run build 01 && npm run build 02"
        }
    }

    npm start		//开启xy0本地服务
    npm start 01	//开启xy1本地服务 
    npm build		//打包xy0
    npm build 02	//打包xy2
    npm run release 先打包xy1,打包完成后自动打包xy2
  
各个环境的配置在`config/pankou.js`


## 优化方向

- webpack V1 比新版webpack打包速度和打包体积上还是有些差距。
- 引用了antd 和antd-mobile 造成打包体积过大
- 维护盘口：
	1. 各盘口在各分支操作，经常冲突，自定义的空间有限，比如首页改动就是冲突一片，如果其他页面各盘口也有差异，维护很麻烦
	2. 打包相关很慢，很操蛋，各种冲突，有时还有title没改，下载地址错误。
	3. 安卓包也是各种问题，各种冲突

## 优化之后

- 基于create-react-app工具 webpack V3.8 react-router V4
	1. 代码可以分割.某些模块很大，我们可以分割，按需加载。
	2. 从router V2.x升级为router V4 改动很多，有兴趣可了解下 [React Router 4.0文档](https://www.jianshu.com/p/e3adc9b5f75c/)
	3. 自定义修改的地方更多更方便
	4. 使用了PWA,有兴趣可以了解一下



## 目录结构：

    react-pro  路径说明（标注******都是比较重要的,经常会改动的）
    │  .babelrc         //babel转译规则
    │  .gitignore       //git忽略规则
    │  package-lock.json    //npm版本安装记录
    │  package.json         //包管理json
    │  README.md            //说明文件
    │  yarn-error.log       //yarn安装错误
    │  yarn.lock            //yarn版本安装记录
    │  
    ├─.idea    //ide 文件
    ├─build             //******打包后文件夹 按盘口分
    │  ├─dist_online00          //盘口0              
    │  │  │  asset-manifest.json            //PWA 相关配置
    │  │  │  favicon.ico                    //ico
    │  │  │  index.html
    │  │  │  manifest.json                  //PWA 相关配置
    │  │  │  service-worker.js              //PWA 离线服务器配置
    │  │  └─static
    │  │      ├─css
    │  │      │      main.cc6d9678.css
    │  │      ├─js
    │  │      │      0.02b3b743.chunk.js    //模块分割单独包，每个盘口不同组件都在这里
    │  │      │      main.7fc1d5fb.js       //主要js 包
    │  │      └─media       
    │  ├─dist_online01      //盘口01             
    │  └─dist_online02      //盘口02           
    ├─config        //webpack配置
    │  │  env.js            //环境变量处理 自定义环境变量必须REACT_APP_开头
    │  │  pankou.js         //******盘口配置
    │  │  paths.js          //node处理当前目录的文件 
    │  │  polyfills.js      //为了低版本支持支持es6,es7的一些方法，类似Object.assign,map,set
    │  │  webpack.config.dev.js         //开发环境
    │  │  webpack.config.prod.js        //生产环境
    │  │  webpackDevServer.config.js    //webpack devServer 的相关设置
    │  │  
    │  └─jest       //弹出配置（没用了）
    │          cssTransform.js
    │          fileTransform.js
    ├─public        //******公共文件 各个盘口单独
    │  ├─00     
    │  │      favicon.ico       //ico
    │  │      index.html        //html模板，需要配置title
    │  │      manifest.json     //PWA配置
    │  │      
    │  ├─01
    │  └─02
    ├─scripts           
    │      build.js         //npm run build  
    │      start.js         //npm run start 
    │      test.js          //自带的测试
    │      
    └─src               //******
        │  index.js         //入口js
        │  registerServiceWorker.js     //PWA服务
        │  
        ├─css
        ├─img
        ├─js        //后续如果添加redux，相关文件都会在这
        ├─pages     //pages目录接口还是跟之前类似
        └─router         //******路由统一写在这里
                index.js   //路由
                


## 需要了解的基础知识
- react-react-app 
- npm script  npm脚本 node脚本
- env node环境变量

process.env 

process是node一个全局对象， env是environment环境缩写，会经常用到，需要大家熟悉，理解。




# 代码需要修改
### 1. router
	
#### `import {} from react-router` 全部替换=>react-router-dom 

react-router 内的hashHistory 弃用

所有haahHistory 使用this.props.history 

使用时注意this的上下文

**部分地方需要加上 withRouter 具体可参考`pages/login`模块** 

----

##### 代码分割。每个盘口差异需要通过下面这个方式引入，比如首页上差异
	// src/router/index.js 
	const Home = Loadable({
	    loader: () => import(process.env.REACT_APP_HOME?process.env.REACT_APP_HOME:"../pages/home/index"),
	    loading: Loading,
	});


 
----
`<Link to="user" >路由</Link>`

和`<Link to="/user" >路由</Link>`是两个截然不同的路由希望大家注意，一个相对路径，一个绝对路径

---
路由传参

	<Link key={i} to={{pathname:'home/promodetail',query:{id:1}}></Link> //不能使用

	//全部替换为下面这种
	 <Link to={{
		pathname:"/history" ,
        search:"?id="+ item.lottery_id
     }}>
取值也和之前有区别

	//参考pages/open/lotteryTrend.js
	props.history.location.search&&new URLSearchParams(props.history.location.search).get('id') 

---
如果你是通过类似下面这样传值

	<Route path="ssc/:ltCode" component={ltSSC}></Route>
    <Route path="11x5/:ltCode" component={Lt11x5}></Route>
    <Route path="pk10/:ltCode" component={Ltpks}></Route>
    <Route path="xyft/:ltCode" component={Ltxyft}></Route>

	//参考pages/lottery/components/common.js
	this.props.match.params.ltCode


### 2. 部分提取
比如首页 各个盘口都有区别，则把home单独提取

**可以参考 home相关**


### 3. 盘口配置

所有盘口配置都在 `config/pankou.js`  


    PANKOU = {
        "00":{
            "pankou":"00", //盘口名字                                      
            "title":"xy0测试title",  //盘口title
            "api_dev":"https://api.xy0test.com/?",   //npm start 调用接口
            "api_test":"https://api.xy0test.com/?",  //测试接口
            "api_online":"https://api.xy0test.com/?", //线上接口
            "PUBLIC_URL":"https://static-pc.kst001.com/xy00000/",  //cdn地址，如果不上cdn可设置为"/”
            "home":"../pages/home/01/index", //如果首页不同,需要配置首页地址
        }
    }
    
  如果首页不同,还需要在`config/pankou.js`底部加上
 
    process.env.REACT_APP_HOME = REACT_APP_PANKOU.home?REACT_APP_PANKOU.home:""
    


原理是 这里你配置之后通过`config/env.js` 
	//把配置设置为环境变量，只有这样才能在router/index.js里面获取到process.env.REACT_APP_HOME
	process.env.REACT_APP_PANKOU = JSON.stringify(pankouConfig)


### 4.antd 模块修改

**所有页面 不允许 `import {} from "antd"`**

一律改为 
	
	import Modal from 'antd/lib/modal';
	import  Icon from 'antd/lib/icon';
	import  message from 'antd/lib/message';
	import  Select from 'antd/lib/select';
	import  Row from 'antd/lib/row';
	import  Col from 'antd/lib/col';
	import Form from 'antd/lib/form';
	import Input from 'antd/lib/input';
	import Spin from 'antd/lib/spin';
	import Slider from 'antd/lib/slider';
	import Button from 'antd/lib/button';
	import  Checkbox from 'antd/lib/checkbox';
	import  Radio from 'antd/lib/radio';
	import  Tooltip from 'antd/lib/tooltip';
	import  Progress from 'antd/lib/progress';
并且在`src/index.js`加上对应的css

	import 'antd/lib/progress/style/css';
	import 'antd/lib/modal/style/css';
	import 'antd/lib/message/style/css';
	import 'antd/lib/row/style/css';
	import 'antd/lib/col/style/css';
	import 'antd/lib/table/style/css';
	import 'antd/lib/input/style/css';
	import 'antd/lib/select/style/css';
	import 'antd/lib/checkbox/style/css';
	import './css/common.scss'    //一定要在common之前，否则会影响所有样式
		


**相反的，antd-mobile组件不再需要引入css**

	import 'antd-mobile/lib/carousel/style/css';//这个antd-mobile不要引入了


