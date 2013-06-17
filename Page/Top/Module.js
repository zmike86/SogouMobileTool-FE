/**
 * @description module logic for portal page
 * @creator Leo
 */

(function () {

    var location = window.location;
    var BASEPATH = 'website_top_';
    var TYPE = location.search.replace('?type=', '') || 'game';

    // 方便遍历的数组
    var ADSRanks = ['botAds', 'comAds'];
    var AppRanks = ['downloadRank', 'raiseRank', 'bestRank', 'keywordRank', 'girlsloveRank', 'hdRank'].concat(ADSRanks);
    var GameRanks = AppRanks.concat(['childloveRank', 'singlegameRank', 'onlinegameRank']);

    dojo.declare('website.Top.Module', [website.IModule], {
        // attr
        type: TYPE,
        IDS: {
            downloadRank: BASEPATH + TYPE + '_downloadRank',
            raiseRank: BASEPATH + TYPE + '_raiseRank',
            bestRank: BASEPATH + TYPE + '_bestRank',
            keywordRank: BASEPATH + TYPE + '_keywordRank',
            girlsloveRank: BASEPATH + TYPE + '_girlsloveRank',
            childloveRank: BASEPATH + TYPE + '_childloveRank',
            hdRank: BASEPATH + TYPE + '_hdRank',
            singlegameRank: BASEPATH + TYPE + '_singlegameRank',
            onlinegameRank: BASEPATH + TYPE + '_onlinegameRank',
            botAds: BASEPATH + TYPE + '_botAds',
            comAds: BASEPATH + TYPE + '_comAds'
        },
        postData: {
            data: {
                game: {
                    website_top_game_downloadRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1014',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_game_raiseRank: {
                        module: 'fragment',
                        frag_id: '1001'
                    },
                    website_top_game_bestRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'hot',
                        category_group: '1014',
                        start: 0,
                        limit: 10,
                        order: 'down',
                        timeline: 1209600
                    },
                    website_top_game_keywordRank: {
                        module: 'fragment',
                        frag_id: '1002'
                    },
                    website_top_game_girlsloveRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1025',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_game_childloveRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1033',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_game_hdRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1014',
                        hd: 1,
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_game_singlegameRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1107',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_game_onlinegameRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1105',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_game_botAds: {
                        module: 'fragment',
                        frag_id: '1003'
                    },
                    website_top_game_comAds: {
                        module: 'fragment',
                        frag_id: '1004'
                    }
                },
                app: {
                    website_top_app_downloadRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1002',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_app_raiseRank: {
                        module: 'fragment',
                        frag_id: '1005'
                    },
                    website_top_app_bestRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'hot',
                        category_group: '1002',
                        start: 0,
                        limit: 10,
                        order: 'down',
                        timeline: 1209600
                    },
                    website_top_app_keywordRank: {
                        module: 'fragment',
                        frag_id: '1006'
                    },
                    website_top_app_girlsloveRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1052',
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_app_hdRank: {
                        module: 'applist',
                        type: 'normal',
                        sort: 'download',
                        category_group: '1002',
                        hd: 1,
                        start: 0,
                        limit: 10,
                        order: 'down'
                    },
                    website_top_app_botAds: {
                        module: 'fragment',
                        frag_id: '1007'
                    },
                    website_top_app_comAds: {
                        module: 'fragment',
                        frag_id: '1008'
                    }
                }
            }
        },
        systemID:       9,
        PAGE_ID:        'top',
        footer: dojo.query('div.footer')[0],

        // components
        downloadRank:   null,
        raiseRank:      null,
        bestRank:       null,
        keywordRank:    null,
        girlsloveRank:  null,
        childloveRank:  null,
        hdRank:         null,
        singlegameRank: null,
        onlinegameRank: null,
        botAds:         null,
        comAds:         null,

        constructor: function () {
            //this.getPDAInfor();
            var self = this;
            // cross domain ajax request callback
            window.jsonCallback = function (data) {
                if (!data) {
                    if(self.errorCallback && (typeof self.errorCallback === 'function'))
                        self.errorCallback();
                    return;
                }

                var serialization;
                try {
                    serialization = JSON.parse(data);
                } catch(e) {
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
            this.downloadRank = new website.Top.Rank({
                parent: this,
                container: dojo.byId('downloadRank'),
                tmplId: 'rank_tmpl',
                className: TYPE + '_downloadRank'
            });
            this.raiseRank = new website.Top.HtmlRank({
                parent: this,
                container: dojo.byId('raiseupRank'),
                tmplId: 'rank_tmpl',
                className: TYPE + '_raiseRank'
            });
            this.bestRank = new website.Top.Rank({
                parent: this,
                container: dojo.byId('bestRank'),
                tmplId: 'rank_tmpl',
                className: TYPE + '_bestRank'
            });
            this.keywordRank = new website.Top.KeywordRank({
                parent: this,
                container: dojo.byId('keywordRank'),
                tmplId: 'plainrank_tmpl',
                className: TYPE + '_keywordRank'
            });
            this.girlsloveRank = new website.Top.Rank({
                parent: this,
                container: dojo.byId('girlsloveRank'),
                tmplId: 'rank_tmpl',
                className: TYPE + '_girlsloveRank'
            });

            if (TYPE === 'game') {
                this.hdRank = new website.Top.Rank({
                    parent: this,
                    container: dojo.byId('hdRank'),
                    tmplId: 'rank_tmpl',
                    className: TYPE + '_hdRank'
                });
                this.singlegameRank = new website.Top.Rank({
                    parent: this,
                    container: dojo.byId('singlegameRank'),
                    tmplId: 'rank_tmpl'
                });
                this.childloveRank = new website.Top.Rank({
                    parent: this,
                    container: dojo.byId('childloveRank'),
                    tmplId: 'rank_tmpl'
                });
                this.onlinegameRank = new website.Top.Rank({
                    parent: this,
                    container: dojo.byId('onlinegameRank'),
                    tmplId: 'rank_tmpl'
                });
                dojo.byId('hdApp').style.display = 'none';

            } else if (TYPE === 'app') {
                this.hdRank = new website.Top.Rank({
                    parent: this,
                    container: dojo.byId('hdApp'),
                    tmplId: 'rank_tmpl'
                });
                dojo.byId('hdRank').style.display = 'none';
                dojo.byId('singlegameRank').style.display = 'none';
                dojo.byId('childloveRank').style.display = 'none';
                dojo.byId('onlinegameRank').style.display = 'none';
            }

            this.botAds = new website.AdsBanner({
                parent: this,
                container: dojo.byId('botAds')
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
            if (!data)
                return;

            var me = this;
            var len = (TYPE === 'game' ? GameRanks : AppRanks),
                j = 0;
            var lc = LocalStorage,
                str = JSON.stringify;

            for (; j < len.length; j++) {
                if (data[this.IDS[len[j]]]) {
                    this[len[j]].setData(data[this.IDS[len[j]]]);
                    (function(index){
                        setTimeout(function() {
                            lc.write(me.IDS[len[index]], str(data[me.IDS[len[index]]]));
                        }, 100);
                    })(j);
                }
            }

            this.footer.style.display = 'block';
            // 放在这里才是网页上面所有的img元素都被渲染出来的时机
            // 所以ImageLoader在页面的生命周期中应该在此刻初始化
            this.createImgLoader();
            me.data = data;
        },

        /**
         *  First time load page to check whether there
         *  has data in localStorage
         */
        getData: function () {
            var data,
                judge = (TYPE === 'game' ? 11 : 8),
                len = (TYPE === 'game' ? GameRanks : AppRanks),
                i = j = 0;

            for (; j < len.length; j++) {
                data = LocalStorage.read(this.IDS[len[j]]);
                if (data) {
                    this[len[j]].setData(JSON.parse(data));
                    delete this.postData['data'][this.type][this.IDS[len[j]]];
                    ++i;
                }
            }

            if (i === judge) {
                this.footer.style.display = 'block';
                this.createImgLoader();
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
            $PingBack('msite_' + this.type + '_top_bv');
        }

    });
})();

var module;
module = new website.Top.Module(this);
module.setup();