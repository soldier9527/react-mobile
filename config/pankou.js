'use strict';

const PANKOU = {
    "00":{
        "pankou":"00",
        "title":"xy0",
        "api_dev":"http://192.168.25.52:83/?",
        "api_test":"https://api.xy0test.com/?",
        "api_online":"https://api.xy0test.com/?",
        "PUBLIC_URL":"/",
    },
    "01":{
        "pankou":"01",
        "title":"Pankou1的title",
        "api_dev":"http://192.168.25.52:83/?",
        "api_test":"https://api.xy1test.com/?",
        "api_online":"https://vov1dd.jaxfangchan.com/?",
        "PUBLIC_URL":"https://static-pc.kst001.com/xy00001/",
        "home":"../pages/home/01/home",
    },
    "02":{
        "title":"Pankou2的title",
        "api_dev":"http://192.168.25.52:83/?",
        "api_test":"https://api.xy2test.com/?",
        "api_online":"https://xox2ff.dlxtdktv.com/?",
    }
}


let REACT_APP_PANKOU;
let pankou = "00";
process.argv.forEach((val, index) => {
    if(val.length===2){
        pankou = val
    }
});

console.log("正在打包盘口"+pankou);
REACT_APP_PANKOU =  PANKOU[pankou]
console.log(REACT_APP_PANKOU)
if(process.env.NODE_ENV === 'development'){
    REACT_APP_PANKOU["api_domain"]=REACT_APP_PANKOU.api_dev
}else{
    REACT_APP_PANKOU["api_domain"]=REACT_APP_PANKOU.api_online
    process.env.PUBLIC_URL = REACT_APP_PANKOU.PUBLIC_URL
}

/**  单独打包 x1不同
 * */
//首页
process.env.REACT_APP_HOME = REACT_APP_PANKOU.home?REACT_APP_PANKOU.home:""






module.exports = REACT_APP_PANKOU