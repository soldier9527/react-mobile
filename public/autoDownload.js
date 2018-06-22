/**
 * 自动下载更新包
 */

var wgtVer = null;

function plusReady() {
// 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid, function (inf) {
        wgtVer = inf.version;
        localStorage.setItem('newVer', wgtVer);
        console.log(localStorage.getItem('newVer'));
        console.log("当前应用版本：" + wgtVer);
        console.log("=============版本测试=============");
        var version = {
            'version': wgtVer
        };
        appCallServer(wgtVer,function (data) {
            console.log("版本查询成功");
            if(parseFloat(wgtVer) >= parseFloat(data.latest)){
                return
            }
            
            plus.nativeUI.alert("自动更新中...", function (e) {
                 console.log("确定更新！");
                    downWgt(data); // 下载升级包
            });
        });
    });
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 下载新版本
function downWgt(data) {
   let versionArr = data.version;
    var vNum = 0;
    startDownload(vNum, versionArr)


}

//递归下载
function startDownload(num, data) {
    var len = data.length;
    plus.nativeUI.showWaiting("下载" + data[num].version + "文件...");

    plus.downloader.createDownload(data[num].url, {filename: "_doc/update/"}, function (d, status) {
        var isLatest = false;
        console.log("num="+num)
        console.log("len="+len)
        if(num+1>=len){
        	console.log("xxxxxxxx")
            isLatest = true;
        }
        if (status == 200) {
            console.log("下载wgt成功：" + d.filename);

            installWgt(d.filename, data[num].version,isLatest,function () {
        		num++
            	startDownload(num, data)
               
            });// 安装wgt包
        } else {
            console.log("下载wgt失败！");
            plus.nativeUI.alert("下载" + data[num].version + "失败！请到官网下载");
        }

        plus.nativeUI.closeWaiting();

    }).start();
}

// 更新应用资源
function installWgt(path, newVer,isLatest,callback) {
    plus.nativeUI.showWaiting("安装"+newVer+"版本...");
// force:false进行版本号校验，如果将要安装应用的版本号不高于现有应用的版本号则终止安装，并返回安装失败
    plus.runtime.install(path, {force: false}, function () {
        plus.nativeUI.closeWaiting();
        console.log("安装"+newVer+"成功！");
        localStorage.setItem('newVer', newVer);
// H5 plus事件处理,弹出提示信息对话框
        if(isLatest){
            plus.nativeUI.alert("应用资源更新完成,点击重新打开应用", function (e) {
                   plus.runtime.restart();
            });
        }else{
            callback();
        }
    }, function (e) {
        plus.nativeUI.closeWaiting();
        console.log("安装文件失败[" + e.code + "]：" + e.message);
        plus.nativeUI.alert("安装wgt文件失败[" + e.code + "]：" + e.message);
    });
}

function appCallServer(v,callback) {
    console.log(localStorage.getItem("config"))
    var config = JSON.parse(config)
    // fetch(config.web+'/api/?c=default&a=getAppToken', {
    fetch('http://192.168.25.52:83/?c=default&a=getAppVersion&v='+v, {
        method: 'GET',
        headers: new Headers({
            'Accept': 'application/json' // 通过头指定，获取的数据类型是JSON
        })
    }).then((res) => {
        return res.text()
    }).then((res) => {
        console.log(JSON.parse(res))
        var data = {
            errno: 0,
            data:{
                version:[
                    {version: "1.2", url: "http://192.168.0.117:8080/1.2.wgt"},
                    {version: "1.4", url: "http://192.168.0.117:8080/1.4.wgt"}
                ],
                latest:"1.0"
            },
            errstr: "",

        }
        callback(data.data)
    });
}


//
window.embed=null;

mui.back = function() {
    if(window.location.href.indexOf("home?")<0){
        var backBtnEle = document.getElementsByClassName("arrow-left");
        if(backBtnEle&&backBtnEle[0]){
            backBtnEle[0].click();
        }else{
            history.go(-1);
        }
    }
};