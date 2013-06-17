/**
 * @description {string} module logic for Required page
 * @creator {*} Leo
 */

(function () {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_required_';
    var TYPE = 'app';
    var SORT = location.hash.replace('#', '') || '1045';

    // Store for pager's localStorage path
    var PATH = '';

    dojo.declare('website.Required.Module', [website.IModule], {
        // attr
        type:   'app',
        sort:   SORT,

        IDS: {
            botAds: BASEPATH + TYPE + '_botAds',
            comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                app: {
                    website_required_app_botAds: {
                        module: 'fragment',
                        frag_id: '1007'
                    },
                    website_required_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'required',
        footer: dojo.query('div.footer')[0],

        // components
        tab:            null,
        botAds:         null,
        comAds:         null,

        constructor: function () {
            // this.getPDAInfor();
            this.type = TYPE;
            this.sort = SORT;

            PATH = BASEPATH + this.type + LinkerChar + this.sort;
            this.IDS.tab = PATH;
            this.postData.data[this.type][PATH] = {
                module: 'applist',
                type: 'normal',
                sort: 'download',
                categoryid: this.sort,
                category_group: '1002',
                start: 0,
                limit: 54,
                order: 'down'
            };
            var self = this;
            // cross domain ajax request callback
            window.jsonCallback = function (data) {
                if (!data) {
                    if (self.errorCallback && (typeof self.errorCallback === 'function'))
                        self.errorCallback();
                    return;
                }

                var serialization;
                try {
                    serialization = JSON.parse(data);
                } catch (e) {
                    throw new Error("request HomePage data from server format error");
                }
                self.setData(serialization);
            };
            this.initializeComponents();
        },
        /**
         * initialize included components
         */
        initializeComponents: function () {
            this.tab = new website.Required.Tab({
                parent: this,
                container: dojo.byId('container'),
                tmplId: 'panel_tmpl'
            });
            this.botAds = new website.AdsBanner({
                parent: this,
                container: dojo.byId('botAds'),
                tmplId: 'ads_tmpl'
            });
            this.comAds = new website.CommonAds({
                parent: this,
                container: dojo.query('div.commonAds')[0]
            });
        },
        /**
         * Data from server side fills in page components
         * @param data
         */
        setData: function (data) {
            if (!data) return;
            var me = this;
            var useBotAds = false,
                useComAds = false;

            // tab
            if (data[this.IDS.tab]) {
                this.tab.setData(data[this.IDS.tab]);
            }
            // bottom ads
            if (data[this.IDS.botAds]) {
                this.botAds.setData(data[this.IDS.botAds]);
                useBotAds = true;
            }
            // common ads
            if (data[this.IDS.comAds]) {
                this.comAds.setData(data[this.IDS.comAds]);
                useComAds = true;
            }

            this.footer.style.display = 'block';
            // 放在这里才是网页上面所有的img元素都被渲染出来的时机
            // 所以ImageLoader在页面的生命周期中应该在此刻初始化
            if (this.loader) {
                this.loader.destroy();
            }
            this.loader = this.createImgLoader();

            setTimeout(function() {
                var lc = LocalStorage,
                    str = JSON.stringify;

                useBotAds && lc.write(me.IDS.botAds, str(data[me.IDS.botAds]));
                useComAds && lc.write(me.IDS.comAds, str(data[me.IDS.comAds]));

                me.data = data;
            }, 100);
        },
        /**
         *  First time load page to check whether there
         *  has data in localStorage
         */
        getData: function () {
            var data,
                i = 0;
            // tab
            data = LocalStorage.read(this.IDS.tab);
            if (data) {
                this.tab.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.tab];
                ++i;
            }
            // bottom ads
            data = LocalStorage.read(this.IDS.botAds);
            if (data) {
                this.botAds.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.botAds];
                ++i;
            }
            // common ads
            data = LocalStorage.read(this.IDS.comAds);
            if (data) {
                this.comAds.setData(JSON.parse(data));
                delete this.postData['data'][this.type][this.IDS.comAds];
                ++i;
            }

            if (i === 3) {
                this.footer.style.display = 'block';

                if (this.loader) {
                    this.loader.destroy();
                }
                this.loader = this.createImgLoader();
            } else {
                this.sendRequest();
            }
        },
        /**
         * set up module app
         */
        setup: function () {
            this.getData();
            //@PingBack
            $PingBack('msite_app_required_bv');
        }

    });
})();

var module;
module = new website.Required.Module(this);
module.setup();