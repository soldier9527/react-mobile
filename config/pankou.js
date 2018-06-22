'use strict';

const PANKOU = {
    "00":{
        "pankou":"00",  //必要
        "title":"xy0测试title",  //必要
        "web":"https://m.xy0test.com", //必要  手机站域名
        "api_dev":"https://api.xy0test.com/?", //必要 npm start 接口
        "api_online":"https://api.xy0test.com/?",//必要  npm build 使用的
        "PUBLIC_URL":"/",//必要 cdn 地址
        "android": "https://www.baidu.com",//必要 安卓下载地址
        "apple": "https://www.bilibili.com",//必要 apple下载地址

        "index":"",//选填 首屏加载路由 默认 /guidance
        "theme":"",//选填 主色调 默认 default    可选项：default /blue
        "home": "",//选填 首页地址 默认 xy0的首页地址

    },
    "01": {
        "pankou": "01",//必要
        "title": "幸运彩票", //必要
        "web":"https://m.91966.com",//必要  手机站域名
        "api_dev": "http://192.168.25.52:83/?",//npm start 接口
        "api_test": "https://api.xy1test.com/?",
        "api_online": "https://vov1dd.jaxfangchan.com/?",//npm build 使用的
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00001/",//cdn 地址
        "home": "../pages/home/01/index",
    },
    "02": {
        "pankou": "02",
        "title": "500彩票",
        "api_dev": "http://192.168.25.52:83/?",
        "api_test": "https://api.xy2test.com/?",
        "api_online": "https://xox2ff.dlxtdktv.com/?",
        "home": "../pages/home/02/index",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00002/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00002/caipiaoAPP/xy00002.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00002/caipiaoAPP/manifest.plist",//apple下载地址

    },
    "04":{
        "pankou":"04",
        "title":"腾讯彩票",
        "api_dev":"http://192.168.25.52:83/?",//本地开发
        "api_test":"https://api.xy4test.com/?",//测试接口
        "web":"https://m.95301.com", //必要  手机站域名
        "api_online":"https://bfb4dd.myhouseofhellohk.com/?",//线上API
        "PUBLIC_URL":"https://static-pc.kst001.com/xy00004/",//cdn地址
        "home":"../pages/home/04/index",//首页路径
        "index":"/guidance",//首屏加载路由
        "android":"itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00004/caipiaoAPP/manifest.plist",//安卓下载地址
        "apple":"https://static-pc.0631110.com/xy00004/caipiaoAPP/04txcp.apk",//apple下载地址
    },
    "07": {
        "pankou": "07",
        "title": "亿彩堂",
        "web": "https://m.yct5.com", //必要
        "api_dev": "http://192.168.25.52:83/?", //npm start 接口
        "api_test": "https://api.xy7test.com/?",
        "api_online": "https://vmv7ee.dlxtdktv.com/?",
        "home": "",//
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00007/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00007/caipiaoAPP/xy00007.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00007/caipiaoAPP/manifest.plist",//apple下载地址
    },
    "08": {
        "pankou": "08",
        "title": "500彩票官网",
        "web": "https://m.5009863.com", //必要
        "api_dev": "https://api.xy8test.com/?", //npm start 接口
        "api_test": "https://api.xy8test.com/?",
        "api_online": "https://hqh8ff.jaxfangchan.com/?",
        "home": "../pages/home/08/index",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00008/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00008/caipiaoAPP/xy00008.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00008/caipiaoAPP/manifest.plist",//apple下载地址
    },
    "10": {
        "pankou": "10",
        "title": "大旺彩票",
        "web": "https://m.dwcp505.com", //必要
        "api_dev": "http://192.168.25.52:83/?",
        "api_test": "https://api.xy10test.com/?",
        "api_online": "https://kek10e.myhouseofhellohk.com/?",
        "home": "",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00010/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00010/caipiaoAPP/xy00010.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00010/caipiaoAPP/manifest.plist",//apple下载地址
    },
    "11":{
        "pankou":"11",
        "title":"500彩票",
        "web":"", //必要  手机站域名
        "api_dev":"http://192.168.25.52:83/?",//本地开发
        "api_test":"https://api.xy11test.com/?",//测试接口
        "api_online":"https://cac11p.prismmarketingpty.com/?",//线上API
        "PUBLIC_URL":"https://static-pc.kst001.com/xy00011/",//cdn地址
        "theme":"blue",//选填 主色调 默认 default    可选项：default /blue
        "home":"../pages/home/11/index",//首页路径
        "index":"/guidance",//首屏加载路由
        "android":"itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00004/caipiaoAPP/manifest.plist",//安卓下载地址
        "apple":"https://static-pc.0631110.com/xy00004/caipiaoAPP/04txcp.apk",//apple下载地址
    },
    "12": {
        "pankou": "12",
        "title": "500彩票",
        "web":"", //必要  手机站域名
        "api_dev": "http://192.168.25.52:83/?",//npm start 接口
        "api_test": "https://api.xy12test.com/?",
        "api_online": "https://awa12c.dlxtdktv.com/?",//npm build 使用的
        "home": "",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00012/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00012/caipiaoAPP/xy00012.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00012/caipiaoAPP/manifest.plist",//apple下载地址

    },
    "13": {
        "pankou": "13",
        "title": "人人彩票",
        "web":"https://m.48665.com", //必要  手机站域名
        "api_dev": "http://192.168.25.52:83/?",//npm start 接口
        "api_test": "https://api.xy13test.com/?",
        "api_online": "https://kak13q.jaxfangchan.com/?",//npm build 使用的
        "home": "",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00013/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00013/caipiaoAPP/xy00013.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00013/caipiaoAPP/manifest.plist",//apple下载地址

    },

    "14": {
        "pankou": "14",
        "title": "大赢家彩票",
        "web": "https://m.71195.com", //必要  手机站域名
        "api_dev": "http://192.168.25.52:83/?",//npm start 接口
        "api_test": "https://api.xy14test.com/?",
        "api_online": "https://htr14b.blackmykobeagain.com/?",//npm build 使用的
        "home": "",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00014/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00014/caipiaoAPP/xy00014.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00014/caipiaoAPP/manifest.plist",//apple下载地址
    },
    "17": {
        "pankou": "17",
        "title": "双彩娱乐",
        "web": "https://m.79366f.com", //必要
        "api_dev": "http://192.168.25.52:83/?",
        "api_test": "https://api.xy17test.com/?",
        "api_online": "https://bpd17i.dlxtdktv.com/?",
        "home": "",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00017/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00017/caipiaoAPP/xy00017.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00017/caipiaoAPP/manifest.plist",//apple下载地址
    },
    "18": {
        "pankou": "18",
        "title": "500彩票",
        "web": "", //必要
        "api_dev": "http://192.168.25.52:83/?",
        "api_test": "https://api.xy18test.com/?",
        "api_online": "https://vfd18w.jaxfangchan.com/?",
        "home": "",
        "index": "/guidance",//首屏加载路由
        "PUBLIC_URL": "https://static-pc.kst001.com/xy00018/",//cdn地址
        "android": "https://static-pc.0631110.com/xy00018/caipiaoAPP/xy00018.apk",//安卓下载地址
        "apple": "itms-services://?action=download-manifest&url=https://static-pc.0631110.com/xy00018/caipiaoAPP/manifest.plist",//apple下载地址
    }
}


let REACT_APP_PANKOU = {};
let pankou = "00";
let isApp = false
process.argv.forEach((val, index) => {
    if (val.length === 2) {
        pankou = val
    }
    if (val === "app") {
        isApp = true
    }
});
REACT_APP_PANKOU = PANKOU[pankou]
if (process.env.NODE_ENV === 'development') {
    REACT_APP_PANKOU["api_domain"] = REACT_APP_PANKOU.api_dev
    if (isApp) {
        REACT_APP_PANKOU.isAPP = true
    }
} else {
    REACT_APP_PANKOU["api_domain"] = REACT_APP_PANKOU.api_online

    if (isApp) {
        process.env.PUBLIC_URL = "./"
        REACT_APP_PANKOU.isAPP = true
    } else {
        process.env.PUBLIC_URL = REACT_APP_PANKOU.PUBLIC_URL
    }
}

console.log("正在打包盘口" + pankou);
console.log(REACT_APP_PANKOU)


/**  单独打包 x1不同
 * */
//首页
process.env.REACT_APP_HOME = REACT_APP_PANKOU.home ? REACT_APP_PANKOU.home : "";
//引导页
process.env.REACT_APP_GUIDANCE = REACT_APP_PANKOU.guidance ? REACT_APP_PANKOU.guidance : "";
//盘口名称
process.env.REACT_APP_NAME = pankou;

//是否app
process.env.REACT_APP_ISAPP = REACT_APP_PANKOU.isAPP?REACT_APP_PANKOU.isAPP:"";
// theme 主色调

process.env.REACT_APP_THEME = REACT_APP_PANKOU.theme==="blue"?"blue":"default";






module.exports = REACT_APP_PANKOU