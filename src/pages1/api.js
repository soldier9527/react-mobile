import 'whatwg-fetch';
import {JSEncrypt} from './jsencrypt';
// import {hashHistory} from 'react-router-dom';
import { Toast} from 'antd-mobile';
import CryptoJS from 'crypto-js';// 定义加/解密的
import config from './config';

// 密钥 16 位
let key = '0123456789abcdef';
key = CryptoJS.enc.Utf8.parse(key);
let token = "";
let init = 0;//页面初始化
//加密
const _fetch = function (fetch_promise, timeout=15000) {
    var abort_fn = null;

    //这是一个可以被reject的promise
    var abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject('abort promise');
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);

    setTimeout(function() {
        abort_fn();
    }, timeout);

    return abortable_promise;
}
const encryptedFunc = function (str, key) {
    let encrypted = CryptoJS.AES.encrypt(str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    encrypted = encrypted.toString();
    return encrypted
};
//解密
const decryptedFunc = function (encrypted, key) {
    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
    return decrypted
};
//isFirstTime第一次发送请求 使用cofig内部地址，3s超时，则使用/api/?,15s超时
function RSAapi(path, req, callback,isFirstTime=true) {

    let flag = getSession(isFirstTime);
    let domain = flag?config.api_domain:"/api/?";
    const encrypt = new JSEncrypt();
    let request;
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----\n' +
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCz+9OdWejOpGtxlNld9F4dFKoq\n' +
        'RKCiw+OaPXMGknERDO2sSRXM6ArIVtep4koexJSVVMKbAj+e5qFmRtDfg41ZySCm\n' +
        'MTMJWlSqlzz2cWBc9Dn1jl8WK6K89kkhoSKG5/kW5ifEuAC3M15YVp3or7lsjSfC\n' +
        'TAjDxSU7bIu0a4Q7oQIDAQAB\n' +
        '-----END PUBLIC KEY-----');

    const initData = {
        method: 'POST',
    };

    let form_data = new FormData();
    let key = req.datas.key;
    key = CryptoJS.enc.Utf8.parse(key);
    form_data.append("datas", encrypt.encrypt(JSON.stringify(req.datas)));
    initData['body'] = form_data;
    request = new Request(domain + path, initData);

    _fetch(fetch(request),flag?3000:15000).then(res => {
        res.text().then(d => {
            let data = JSON.parse(d);
            if (!data.errno) {
                let tokenData = decryptedFunc(data.data, key);
                token = JSON.parse(tokenData).token;
                sessionStorage.setItem("token",JSON.stringify(token));
                callback();
            }
        });
    }, function(err) {
        init = 0;
        RSAapi(path, req, callback,false);
        sendData(request.url,flag?"第一次rsa加密请求超时":"第二次rsa加密请求超时");

        if(flag){
            sessionStorage.setItem("countDown",new Date().getTime())
        }
        if(!isFirstTime){
            Toast.info('网络异常，正在重新获取token', 2);
        }
    });
}

//AES加密解密
function AESApi(path, req, callback,isFirstTime=true) {

    let flag = getSession(isFirstTime);
    //重发请求需要rePath
    var rePath=path;

    let domain = flag?config.api_domain:"/api/?";

    let request;
    const user = JSON.parse(sessionStorage.getItem("user"));
    // path最后参数&remind=0  不提醒
    let remind = true;
    if (path.substr(-9) === "&remind=0") {
        remind = false;
        path = path.substr(0, path.length - 9);
    }
    if (user !== null && user.sid !== undefined && user.user_id !== undefined) {
        if(path.indexOf("c=user&a=childList&user_id")>-1||path.indexOf("c=user&a=membershipTransferAgent&user_id")>-1){
            path+='&sid=' + user.sid;
        }else{
            path += '&sid=' + user.sid + '&user_id=' + user.user_id;
        }

    }
    if (req !== null) {
        let form_data = new FormData();
        form_data.append("datas", encryptedFunc(JSON.stringify(req), key));
        request = new Request(domain + path + "&is_wap=3&apiToken=" + token, {
            method: 'POST',
            body:form_data
        });
    } else {
        request = new Request(domain + path + "&is_wap=3&entryption=no&apiToken=" + token, {
            method: 'GET',
        });
    }
    _fetch(fetch(request),flag?3000:15000).then(res => {
        res.text().then(d => {
            try {
                d = JSON.parse(d);
            } catch (err) {
                sendData(request.url,'请求接口返回不是一个合法的json字符串'+d);
                d=d.substr(d.indexOf("{"));
                d = JSON.parse(d);
            }
            if (d.errno === 7032) {
                //获取apiToken失败
                //重发请求需要rePath
                token = "";
                sessionStorage.setItem("token","");
                init = 0;
                Api(rePath, req, callback,flag);
            } else if (d.errno === 0) {
                if(request.method==='POST'){
                    if (d.data) {
                        d.data = JSON.parse(decryptedFunc((d.data).replace(/\\/g, ""), key));
                    }
                }
                callback(d);
            } else if (d.errno === 7001 || d.errno === 7006) {
                //实现不累加显示，重复点击只显示一个
                Toast.info(d.errstr,3.5);
                sessionStorage.setItem("welcome","");
                setTimeout(function () {
                    sessionStorage.removeItem("user");
                    localStorage.removeItem('sid');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('username');
                    localStorage.removeItem('checked');
                    // hashHistory.push('login');
                }, 3000);

            } else if (d.errno === 99999) {
                //维护页面跳转
                let result= d.data;
                //通过路由传递解密后的参数
                var data = {time:result.time, localtion: result.localtion, content: result.content};
                var path =
                    {
                        pathname: "/vindicate",
                        state: data   //state类似于表单post方法,query类似于get方法
                    };
                // hashHistory页面不会刷新
                // hashHistory.push(path);
            } else {
                if (remind) {
                    //实现不累加显示，重复点击只显示一个
                    Toast.info(d.errstr,3.5);
                }
                callback(d);
            }
        });
    }, function(err) {
        if(remind){

            if(!flag){
                message.warning("网络异常，请重新刷新",2)
            }
        }
        if(flag){
            sessionStorage.setItem("countDown",new Date().getTime())
            AESApi(rePath, req, callback,false);
        }
        sendData(request.url,flag?"3s请求超时":"15s请求超时");

    });
}

export default function Api(path, req, callback) {

    if (token) {
        AESApi(path, req, callback);
    } else {
        if (init === 0) {
            init = 1;
            RSAapi("c=default&a=getAppToken", {
                datas: {key: "0123456789abcdef"}
            }, () => {
                AESApi(path, req, callback);
            })
        } else {
            setTimeout(() => {
                Api(path, req, callback);
            }, 50)
        }
    }
}

let num = 0;
export function sendData(api,err){
    num++;
    if(num>100){
        return;
    }
    const token = sessionStorage.getItem("token");
    let user = sessionStorage.getItem("user");
    let data={
        "api":api,
        "token":token,
        "web":document.location.href,
        "err":err?err:"",
        "num":num
    };
    if(token){
        data["token"]=token;
    }
    if(user){
        user=JSON.parse(user);
        data["user_id"]=user.user_id;
        data["nick_name"]=user.nick_name;
    }
    let request;
    const initData = {
        method: 'POST',
    };
    let form_data = new FormData();
    form_data.append("info",JSON.stringify(data));
    initData['body'] = form_data;
    request = new Request("http://111.230.42.74:9745/pay/singleLog.php", initData);
    fetch(request).then(res => {

    })
}

function getSession(type) {

    let countDown = sessionStorage.getItem("countDown");
    let now = new Date().getTime();
    //有请求不成功，半小时之内都用api/?
    if(countDown&&(now-countDown<20*60*10000000)){
        return false;
    }else{
        return type;
    }

}
