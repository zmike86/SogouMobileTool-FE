/**
 * @description module logic for portal page
 * @creator Leo
 */
(function (global, undefined) {

    var location = window.location;
    var BASEPATH = 'website_portal_';
    var TYPE = location.search.replace('?type=', '') || 'game';

    dojo.declare('website.Portal.Module', [website.IModule], {
        // 属性
        type: TYPE,
        IDS: {
            slide: BASEPATH + TYPE + '_slide',topAds: BASEPATH + TYPE + '_topAds',
            tabPanel: BASEPATH + TYPE + '_tabPanel',
            tabc0: BASEPATH + TYPE + '_c0',tabc1: BASEPATH + TYPE + '_c1',tabc2: BASEPATH + TYPE + '_c2',
            tabc3: BASEPATH + TYPE + '_c3',tabc4: BASEPATH + TYPE + '_c4',tabc5: BASEPATH + TYPE + '_c5',
            tabc6: BASEPATH + TYPE + '_c6',downloadRank: BASEPATH + TYPE + '_downloadRank',
            midAds: BASEPATH + TYPE + '_midAds',
            onsalePanel: BASEPATH + TYPE + '_onsalePanel',raiseRank: BASEPATH + TYPE + '_raiseRank',
            botAds: BASEPATH + TYPE + '_botAds',comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                game: {
                    website_portal_game_slide: {
                        module: 'recommendpic',
                        position: 'game_index_top',
                        start: 0,
                        limit: 4
                    },
                    website_portal_game_topAds: {
                        module: 'recommendpic',
                        position: 'game_index_top_right',
                        rand: 1
                    },
                    website_portal_game_c0: {
                        module: 'recommend',
                        position: 'game_14',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_c1: {
                        module: 'recommend',
                        position: 'game_15',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_c2: {
                        module: 'recommend',
                        position: 'game_16',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_c3: {
                        module: 'recommend',
                        position: 'game_17',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_c4: {
                        module: 'recommend',
                        position: 'game_18',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_c5: {
                        module: 'recommend',
                        position: 'game_19',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_c6: {
                        module: 'recommend',
                        position: 'game_20',
                        start: 0,
                        limit: 21
                    },
                    website_portal_game_downloadRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1014',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_portal_game_midAds: {
                        module: 'recommendpic',
                        position: 'game_index_middle',
                        start: 0,
                        limit: 3
                    },
                    website_portal_game_onsalePanel: {
                        module: 'applist',
                        type: 'category',
                        sort: 'new',
                        category_group: '1014',
                        start: 0,
                        limit: 21,
                        order: 'down'
                    },
                    website_portal_game_raiseRank: {
                        module: 'fragment',
                        frag_id: '1001'
                    },
                    website_portal_game_botAds: {
                        module: 'recommendpic',
                        position: 'game_index_middle',
                        start: 3,
                        limit: 3
                    },
                    website_portal_game_comAds: {
                        module: 'fragment',
                        frag_id: '1004'
                    }
                },
                app: {
                    website_portal_app_slide: {
                        module: 'recommendpic',
                        position: 'app_index_top',
                        start: 0,
                        limit: 4
                    },
                    website_portal_app_topAds: {
                        module: 'recommendpic',
                        position: 'app_index_top_right',
                        rand: 1
                    },
                    website_portal_app_c0: {
                        module: 'recommend',
                        position: 'app_7',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_c1: {
                        module: 'recommend',
                        position: 'app_8',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_c2: {
                        module: 'recommend',
                        position: 'app_9',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_c3: {
                        module: 'recommend',
                        position: 'app_10',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_c4: {
                        module: 'recommend',
                        position: 'app_11',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_c5: {
                        module: 'recommend',
                        position: 'app_12',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_c6: {
                        module: 'recommend',
                        position: 'app_13',
                        start: 0,
                        limit: 21
                    },
                    website_portal_app_downloadRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1002',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_portal_app_midAds: {
                        module: 'recommendpic',
                        position: 'app_index_middle',
                        start: 0,
                        limit: 3
                    },
                    website_portal_app_onsalePanel: {
                        module: 'applist',
                        type: 'category',
                        sort: 'new',
                        category_group: '1002',
                        start: 0,
                        limit: 21,
                        order: 'down'
                    },
                    website_portal_app_raiseRank: {
                        module: 'fragment',
                        frag_id: '1005'
                    },
                    website_portal_app_botAds: {
                        module: 'recommendpic',
                        position: 'app_index_middle',
                        start: 3,
                        limit: 3
                    },
                    website_portal_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID: 9,
        PAGE_ID:  'portal',
        loader: null,
        footer: dojo.query('div.footer')[0],

        // 组件
        slide:          null,
        topAds:         null,
        tabPanel:       null,
        downloadRank:   null,
        midAds:         null,
        onsalePanel:    null,
        raiseRank:      null,
        botAds:         null,
        comAds:         null,
        tooltip:        null,

        /**
         * 构造方法
         */
        constructor: function () {
            // 初始化页面组件
            this.initializeComponents();
        },

        /**
         * 初始化页面组件
         */
        initializeComponents: function () {
            this.tooltip = new website.Tooltip();
            this.slide = new website.Portal.Slide({
                parent: this,
                container: dojo.byId('slideContainer'),
                ele: dojo.byId('slide'),
                activeClassName: 'selected',
                viewSize: [541, 164]
            });
            this.topAds = new website.Portal.Ads({
                parent: this,
                tmplId: 'ads_tmpl',
                container: dojo.byId('adsContainer'),
                content: dojo.byId('ads')
            });
            this.tabPanel = new website.Portal.Tab({
                parent: this,
                tmplId: 'tuijian_tmpl',
                container: dojo.byId('recommendPanel'),
                activeClassName: 'selected',
                triggerType: 'click',
                effect: 'none',
                viewSize: [],
                useTip: true
            });
            this.downloadRank = new website.Portal.Rank({
                parent: this,
                container: dojo.byId('downloadRank'),
                tmplId: 'rank_tmpl',
                type: TYPE
            });
            this.midAds = new website.Portal.AdsBanner({
                parent: this,
                container: dojo.byId('midAds'),
                tmplId: 'adsbanner_tmpl'
            });
            this.onsalePanel = new website.Portal.Panel({
                parent: this,
                container: dojo.byId('onsalePanel'),
                tmplId: 'panel_tmpl',
                useTip: true
            });
            alert(3)
            this.raiseRank = new website.Portal.HtmlRank({
                parent: this,
                container: dojo.byId('raiseupRank'),
                tmplId: 'rank_tmpl',
                type: TYPE
            });
            this.botAds = new website.Portal.AdsBanner({
                parent: this,
                container: dojo.byId('botAds'),
                tmplId: 'adsbanner_tmpl'
            });
            this.comAds = new website.CommonAds({
                parent: this,
                container: dojo.query('div.commonAds')[0]
            });
        },

        /**
         * 设置页面组件数据源
         * @param {object} data
         */
        setData: function (data) {
            if (!data) return;
            var aggregate;
            // slide
            if (data[this.IDS.slide]) {
                this.slide.setData(data[this.IDS.slide]);
                this.slide.init();
            }
            // topAds
            if (data[this.IDS.topAds]) {
                this.topAds.setData(data[this.IDS.topAds]);
            }
            // tab
            if (data[this.IDS.tabc0]) {
                aggregate = {
                    c0: data[this.IDS.tabc0],
                    c1: data[this.IDS.tabc1],
                    c2: data[this.IDS.tabc2],
                    c3: data[this.IDS.tabc3],
                    c4: data[this.IDS.tabc4],
                    c5: data[this.IDS.tabc5],
                    c6: data[this.IDS.tabc6]
                };
                this.tabPanel.setData(aggregate);
            }
            // download rank
            if (data[this.IDS.downloadRank]) {
                this.downloadRank.setData(data[this.IDS.downloadRank]);
            }
            // middle ads
            if (data[this.IDS.midAds]) {
                this.midAds.setData(data[this.IDS.midAds]);
            }
            // onsale panel
            if (data[this.IDS.onsalePanel]) {
                this.onsalePanel.setData(data[this.IDS.onsalePanel]);
            }
            // raiseup rank
            if (data[this.IDS.raiseRank]) {
                this.raiseRank.setData(data[this.IDS.raiseRank]);
            }
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
            this.loader = this.createImgLoader();
            //this.createScrollbar();
        },

        /**
         *  发起页面数据请求
         */
        getData: function () {
            this.sendRequest();
        },

        /**
         * 启动页面逻辑
         */
        setup: function () {
            this.getData();
            // @PingBack
            // $PingBack('msite_' + this.type + '_portal_bv');
        }

    });

    var module;
    module = new website.Portal.Module();
    module.setup();

})(this);