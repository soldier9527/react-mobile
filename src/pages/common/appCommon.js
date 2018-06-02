//windowOpen  window.Open
//locationHref   location.href
//documentWrite  document.write
//


import config from '../config'

export default class common{


}

const top = document.body.offsetWidth * 2 /10 ;
export function windowOpen(url,blank) {
    if(config.isAPP){
        embed=plus.webview.create(res.data.url, '',{top:top,bottom:'0px'});
        plus.webview.currentWebview().append(embed);
    }else{
        window.open(url)
    }
}


export function locationHref(url) {
    if(config.isAPP){
        embed=plus.webview.create(url, '',{top:top,bottom:'0px'});
        plus.webview.currentWebview().append(embed);
    }else{
        location.href=url
    }
}
export function documentWrite(html) {
    if(config.isAPP){
        embed=plus.webview.create("", '',{top:top,bottom:'0px'});
        plus.webview.currentWebview().append(embed);
        embed.loadData(html)
    }else{
        document.write(html);
    }
}

