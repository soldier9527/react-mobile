/**
 * @author Administrator
 */

/**
 * 加载到外部URL的文件，用于下载图片；
 */
/**
 * 打开长按事件
 * http://dev.dcloud.net.cn/mui/event/#gesture
 */

var num = 0;
mui.init({
    gestureConfig: {
        longtap: true
    }
});
mui.plusReady(function() {
    document.addEventListener("longtap", function(event) {
        /**
         * 获取目标节点的tagName
         */
        var name = event.target.tagName;
        name = name.toLowerCase();
        /**
         * 如果是图片，则弹出选择框决定是否下载；
         */
        if(name === "img") {
            var imgUrl = event.target.src;
            console.log('图片地址：' + imgUrl);
            var suffix =  "img-"+new Date().getTime()+".png";

            /**
             * http://dev.dcloud.net.cn/mui/ui/#dialog
             */
            mui.confirm("是否下载此图片", "确认下载？", ["下载", "不下"], function(event) {
                /**
                 * index从0开始
                 */
                var index = event.index;
                if(index == 0) {
                    /**
                     * 创建下载任务
                     * http://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.createDownload
                     */
                    var downLoader = plus.downloader.createDownload(imgUrl, {
                        method: 'GET',
                        filename: '_downloads/image' + suffix
                    }, function(download, status) {
                        var fileName = download.filename;
                        /**
                         * 保存至本地相册
                         * http://www.html5plus.org/doc/zh_cn/gallery.html#plus.gallery.save
                         */
                        plus.gallery.save(fileName, function() {
                            mui.toast("图片已保存到相册");
                        });
                    });

                    downLoader.start();
                }
            });
        }else if(name==="canvas"){
            var  fileName = "img-"+new Date().getTime()+".png";
            var dataUrl = document.getElementById("qrcode").getElementsByTagName("canvas")[0].toDataURL();
            var b = new plus.nativeObj.Bitmap('bitblmap');

            b.loadBase64Data(dataUrl, function () {
                /*这里一定要是_doc目录*/

                b.save("_doc/" + fileName, {overwrite: true}, function (object) {
                    //保存到相册
                    plus.gallery.save("_doc/" + fileName, function () {
                        mui.toast("图片已保存到相册");
                    }, function () {
                        mui.toast("图片保存失败");
                    });
                }, function () {
                    mui.toast("图片保存失败");
                });
            }, function () {
                mui.toast("图片保存失败");
            });
        }
    });


});

