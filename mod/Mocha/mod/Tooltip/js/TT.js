/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-6-20
 * Time: 下午8:13
 * To change this template use File | Settings | File Templates.
 */

(function (global, undefined) {

    /**
     * @param {!Element} dom
     * @return {number}
     */
    function getTopInViewport (dom) {
        var fold, off;
        fold = document.documentElement.scrollTop;
        off = dom.getBoundingClientRect().top;
        return off + fold;
    }

    /**
     * @param {!Element} dom
     * @return {number}
     */
    function getLeftInViewport (dom) {
        var fold, off;
        fold = document.documentElement.scrollLeft;
        off = dom.getBoundingClientRect().left;
        return off + fold;
    }

    dojo.declare('website.Tooltip', null, {

        container: null,
        name: null,
        score: null,
        dlcount: null,
        size: null,
        iconCount: null,
        des: null,

        constructor: function () {
            this.container = dojo.query('.tooltip')[0];
            this.name = dojo.query('.name', this.container)[0];
            this.score = dojo.query('.score', this.container)[0];
            this.dlcount = dojo.query('.dlcount', this.container)[0];
            this.size = dojo.query('.size', this.container)[0];
            this.iconCount = dojo.query('.iconcount', this.container)[0];
            this.des = dojo.query('.des', this.container)[0];
        },

        show: function () {
            this.container.style.display = 'block';
        },

        hide: function () {
            this.container.style.display = 'none';
        },

        setData: function (dom) {
            var name = dom.getAttribute('appname', 2),
                score = dom.getAttribute('score', 2),
                dlcount = dom.getAttribute('dlc', 2),
                size = dom.getAttribute('size', 2),
                iconCount = dom.getAttribute('iconCount', 2),
                des = dom.getAttribute('des', 2);

            this.name.innerHTML = name;
            this.score.innerHTML = '<div class="mark" style="width: ' + score*17 + 'px"></div>' + score + '分';
            this.dlcount.innerHTML = dlcount + '次下载';
            this.size.innerHTML = size;
            this.iconCount.innerHTML = '截图' + iconCount + '张';
            this.des.innerHTML = des;

            this.adjustPosition(dom);

            return this;
        },

        adjustPosition: function (dom) {
            var x = getLeftInViewport(dom);
            var y = getTopInViewport(dom);
            this.container.style.left = x + 73 + 'px';
            this.container.style.top = y + 'px';
        }

    });

})(this);
