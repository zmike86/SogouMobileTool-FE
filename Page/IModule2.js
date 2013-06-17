/**
 * Basic IModule interface
 * @interface
 * @creator Leo
 */

dojo.declare('website.IModule', website.IDispose, {

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
    createImgLoader: function () {
        new Mocha.mod.ImageLoader({
            container       : document.body,
            failureLimit    : 10,
            event           : 'dummyScroll',
            data_attribute  : 'original',
            skipInvisible   : false,
            effect          : 'none'
        });
    },
    createScrollbar: function () {
        new Mocha.mod.Scrollbar({
            container: dojo.query('.scrollContainer')[0],
            content: dojo.query('.main')[0],
            callback: function () {
                dojo.publish('dummyScroll')
            }
        });
    }

});