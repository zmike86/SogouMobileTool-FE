/**
 * @description module logic for Category page
 * @creator Leo
 */
(function () {

    var location = window.location;
    var LinkerChar = '_';
    var BASEPATH = 'website_newarrival_';
    var TYPE = location.hash.split('/')[0].replace('#', '') || 'game';

    dojo.declare('website.NewArrival.Module', [website.IModule], {
        // attr
        type:   null,
        pageIndex: null,
        // com
        storePath: null,
        loader: null,

        IDS: {
            banner: BASEPATH + TYPE + '_banner',
            updatePanel: BASEPATH + TYPE + '_updatePanel',
            pager: '',
            botAds: BASEPATH + TYPE + '_botAds',
            comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                game: {
                    website_newarrival_game_banner: {
                        module: 'recommendpic',
                        position: 'game_new',
                        limit: 1
                    },
                    website_newarrival_game_updatePanel: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'new',
                        category_group: '1014',
                        bigicon: 1,
                        start: 0,
                        limit: 6,
                        order: 'down'
                    },
                    website_newarrival_game_botAds: {
                        module: 'fragment',
                        frag_id: '1003'
                    },
                    website_newarrival_game_comAds: {
                        module: 'fragment',
                        frag_id: '1004'
                    }
                },
                app: {
                    website_newarrival_app_banner: {
                        module: 'recommendpic',
                        position: 'app_new',
                        limit: 1
                    },
                    website_newarrival_app_updatePanel: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'new',
                        bigicon: 1,
                        category_group: '1002',
                        start: 0,
                        limit: 6,
                        order: 'down'
                    },
                    website_newarrival_app_botAds: {
                        module: 'fragment',
                        frag_id: '1007'
                    },
                    website_newarrival_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'newarrival',
        footer: dojo.query('div.footer')[0],

        // components
        banner:         null,
        pager:          null,
        botAds:         null,
        comAds:         null,

        constructor: function () {
            // this.getPDAInfor();
            this.resolveHash();
            this.resolvePath();

            this.IDS.pager = this.storePath;
            // adjust post json data
            this.postData.data[this.type][this.storePath] = {
                module: 'applist',
                type: 'category',
                sort: 'new',
                category_group: this.type === 'app' ? '1002' : '1014',
                start: (this.pageIndex - 1) * 36,
                limit: this.pageIndex == 1 ? 42 : 36,
                order: 'down',
                timeline: 1296000
            };
            // 不是第一页就不显示最新上架面板
            if (this.pageIndex != 1) {
                delete this.postData.data[this.type][this.IDS.updatePanel];
            }

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

            dojo.subscribe('/dojo/hashchange', function (hash) {
                self.resolveHash();
                self.resolvePath();
                self.IDS.pager = self.storePath;
                    // 发送请求
                    var data = LocalStorage.read(self.IDS.pager);
                    if (data) {
                        self.pager.setData(JSON.parse(data));
                    } else {
                        // 生成请求json
                        var o = {data:{}},
                            json;
                        o.data[self.storePath] = {
                            module: 'applist',
                            type: 'category',
                            sort: 'new',
                            category_group: self.type === 'app' ? '1002' : '1014',
                            start: (self.pageIndex - 1) * 36,
                            limit: self.pageIndex == 1 ? 42 : 36,
                            order: 'down',
                            timeline: 1296000
                        };
                        // 是第一页就显示最新上架面板
                        if (self.pageIndex == 1) {
                            o.data[self.IDS.updatePanel] = {
                                module: 'applist',
                                type: 'normal',
                                sort: 'new',
                                bigicon: 1,
                                category_group: self.type === 'app' ? '1002' : '1014',
                                start: 0,
                                limit: 6,
                                order: 'down'
                            };
                        }
                        json = JSON.stringify(o);
                        window.external.GetWebsiteAPPInfo_Async(json, 'jsonCallback', document);
                    }
            });
        },
        /**
         * initialize included components
         */
        initializeComponents: function () {
            this.banner = new website.NewArrival.Banner({
                parent: this,
                container: dojo.byId('banner'),
                tmplId: 'banner_tmpl'
            });
            this.pager = new website.NewArrival.Pager({
                parent: this,
                container: dojo.byId('container'),
                tmplId: 'panel_tmpl',
                up_tmplId: 'updatepanel_tmpl'
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
         * 根据hash取得各种排序属性
         */
        resolveHash: function () {
            // rules of hash like #app/2
            var hash = location.hash.replace('#', ''),
                rules = hash.split('/');

            // 页面类型
            this.type = rules[0] || 'game';
            // 当前页码
            this.pageIndex = rules[1] || 1;
        },

        /**
         * 生成localStorage的翻页存储地址
         */
        resolvePath: function () {
            this.storePath = BASEPATH + this.type + LinkerChar + this.pageIndex;
        },

        /**
         * Data from server side fills in page components
         * @param data
         */
        setData: function (data) {
            if (!data) return;

            var usePager = false;

            // banner
            if (data[this.IDS.banner]) {
                this.banner.setData(data[this.IDS.banner]);
            }
            // updatePanel & pager
            if (data[this.IDS.updatePanel]) {
                usePager = usePager || {};
                usePager[this.IDS.updatePanel] = data[this.IDS.updatePanel];
            }
            if (data[this.IDS.pager]) {
                usePager = usePager || {};
                usePager[this.IDS.pager] = data[this.IDS.pager];
            }
            this.pager.setData(usePager);
            // bottom ads
            if (data[this.IDS.botAds]) {
                this.botAds.setData(data[this.IDS.botAds]);
            }
            // common ads
            if (data[this.IDS.comAds]) {
                this.comAds.setData(data[this.IDS.comAds]);
            }

            this.footer.style.display = 'block';
            // 放在这里才是网页上面所有的img元素都被渲染出来的时机
            // 所以ImageLoader在页面的生命周期中应该在此刻初始化
            if (this.loader) {
                this.loader.destroy();
            }
            this.loader = this.createImgLoader();
        },
        /**
         *  First time load page to check whether there
         *  has data in localStorage
         */
        getData: function () {
            this.sendRequest();
        },
        /**
         * set up module app
         */
        setup: function () {
            this.getData();
            //@PingBack
            $PingBack('msite_' + this.type + '_newarrival_bv');
        }

    });
})();

var module;
module = new website.NewArrival.Module(this);
module.setup();
