/**
 * Basic IModule interface
 * @interface
 * @creator Leo
 */
(function (global, undefined) {
    var URL = "http://zhushou.sogou.com/data/data.html?callback=jsonCallback&data={returnFormat:jsonp,data:[]}]";

    dojo.declare('website.IModule', null, {

        data:       null,
        PDAInfor:   null,
        PAGE_ID:    '',

        constructor: function () {},

        setup: function () {},
        /**
         * get current pda's identifier
         * @return {String}
         */
        getPDAInfor: function () {
            var PDAInformation = function (info) {
                this.PDAInfo = info;
            };
            var frame;
            if (this.PDAInfor && this.PDAInfor.PDAInfo) {
                return this.PDAInfor.PDAInfo;
            } else {
                this.PDAInfor = new PDAInformation();
                // register document to host environment
                registerPDAInfo(this, function(browser) {
                    frame = browser.child('state1').child('App_Page').child('WebBrowser1');
                    frame.RegisterFrameInternalJSDisp(this.PAGE_ID, document);
                });
                return this.PDAInfor.PDAInfo;
            }
        },
        setData: function (data) {},
        getData: function () {},
        /**
         * create image loader
         */
        createImgLoader: function () {
            return new Mocha.mod.ImageLoader({
                container       : document.body,
                failureLimit    : 10,
                event           : 'scroll',
                data_attribute  : 'original',
                skipInvisible   : false,
                effect          : 'none'
            });
        },
        /**
         * 发送请求到服务端
         */
        sendRequest: function () {
            var json = this.generatePostJson();
            window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
        },
        /**
         * 生成http请求的json数据格式
         * @return {json}
         */
        generatePostJson: function () {
            var o = {data:{}}, hasOwn = Object.prototype.hasOwnProperty;
            for (var n in this.postData.data[this.type]) {
                if (hasOwn.call(this.postData.data[this.type], n) && this.postData.data[this.type][n])
                    o.data[n] = this.postData.data[this.type][n];
            }
            return JSON.stringify(o);
        }
    });
})(this);
