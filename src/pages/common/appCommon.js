//windowOpen  window.Open
//locationHref   location.href
//documentWrite  document.write
//


import config from '../config'

export default class common{


}
//window.open 打开新窗口
const top = document.body.offsetWidth * 1 /10 ;
export function windowOpen(url,blank) {
    if(config.isAPP){
        window.embed=plus.webview.create(res.data.url, '',{top:top,bottom:'0px'});
        plus.webview.currentWebview().append(window.embed);
    }else{
        window.open(url)
    }
}

//普通跳转
export function locationHref(url) {
    if(config.isAPP){
        window.embed=plus.webview.create(url, '',{top:top,bottom:'0px'});
        plus.webview.currentWebview().append(window.embed);
    }else{
        location.href=url
    }
}
//document.write
export function documentWrite(html) {
    if(config.isAPP){
        window.embed=plus.webview.create("", '',{top:top,bottom:'0px'});
        plus.webview.currentWebview().append(window.embed);
        window.embed.loadData(html)
    }else{
        document.write(html);
    }
}

