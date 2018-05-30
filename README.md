## react 项目

整个项目搭建基于create-react-app工具，eject之后的结构，简单修改了一点结构：

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
                






需要了解 
- react-react-app 
- npm script  npm脚本 node脚本
- env node环境变量

    
    //比如  package.json
    {
        "scripts": {
                "start": "node scripts/start.js",
                "build": "node scripts/build.js",
                "release": "npm run build 01 && npm run build 02"
        }
    }

    npm start //本地服务，xy0
    npm start 01 //本地服务, xy1
    npm build //打包xy0
    npm build 02 //打包xy2
    npm run release 先打包xy1,打包完成后自动打包xy2
  
各个环境的配置在`config/pankou.js`

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
    
