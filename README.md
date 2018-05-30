## 备注

react 项目

基于create-react-app工具，eject之后，

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
    
