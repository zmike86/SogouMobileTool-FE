/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-6-19
 * Time: 下午5:03
 * To change this template use File | Settings | File Templates.
 */

(function (global, undefined) {

    var span = 4;
    var condi = 0;
    var dom;
    var TAG = 'span';
    var SELECT_CLZ = 'selected',
        ABBR_CLZ = 'abbr',
        TEXT_CLZ = 'text',
        PREV_CLZ = 'prev',
        NEXT_CLZ = 'next';

    dojo.declare('website.IPager', null, {
        // 属性
        totalPageCount: null,
        // 元素
        pager: null,
        mini: null,

        constructor: function () {},

        getCurrentPage: function () {
            throw 'getCurrentPage should be implements in subClass';
        },

        setFocus: function () {
            var pageIndex = this.getCurrentPage();

            if (this.totalPageCount === 1 || this.totalPageCount === 0) {
                this.mini.style.visibility = 'hidden';
                this.pager.style.visibility = 'hidden';
                return;
            } else {
                this.mini.style.visibility = 'visible';
                this.pager.style.visibility = 'visible';
            }

            this.renderPager();

            if (pageIndex == 1) {
                dojo.query('span.prev', this.container).addClass('prevdisable');
                dojo.query('span.next', this.container).removeClass('nextdisable');
            } else if (pageIndex == this.totalPageCount) {
                dojo.query('span.prev', this.container).removeClass('prevdisable');
                dojo.query('span.next', this.container).addClass('nextdisable');
            } else {
                dojo.query('span.prev', this.container).removeClass('prevdisable');
                dojo.query('span.next', this.container).removeClass('nextdisable');
            }

            dojo.query('span.count', this.mini)[0].innerHTML = pageIndex + '/' + this.totalPageCount;
        },

        renderPager: function () {
            // 清空
            dojo.empty(this.pager);

            var pageIndex = this.getCurrentPage(), i;
            dom = document.createElement(TAG);
            dom.className = PREV_CLZ;
            this.pager.appendChild(dom);

            if (this.totalPageCount <= 6)
                condi = 1; // 全部显示

            else if (pageIndex <= 1 + span)
                condi = 2; // 前端连续显示
            else if (pageIndex >= this.totalPageCount - span)
                condi = 3; // 后端连续显示
            else
                condi = 4; // 两端均省略显示

            switch (condi) {
                case 1:
                    for (i = 0; i < this.totalPageCount; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    break;
                case 2:
                    for (i = 0; i < 5; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    this.insertAbbr();
                    this.insertSpan(this.totalPageCount - 1, -1);
                    break;
                case 3:
                    this.insertSpan(0, -1);
                    this.insertAbbr();
                    for (i = this.totalPageCount - 5; i < this.totalPageCount; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    break;
                case 4:
                    this.insertSpan(0, -1);
                    this.insertAbbr();
                    for (i = pageIndex - 3; i < pageIndex + 1; i++) {
                        this.insertSpan(i, pageIndex);
                    }
                    this.insertAbbr();
                    this.insertSpan(this.totalPageCount - 1, -1);
                    break;
            }

            dom = document.createElement(TAG);
            dom.className = NEXT_CLZ;
            this.pager.appendChild(dom);
        },

        insertSpan: function (i, index) {
            dom = document.createElement(TAG);
            dom.innerHTML = "<a href='#'>" + (i+1) + "</a>";
            dom.className = TEXT_CLZ;
            ((i + 1) == index) && (dom.className = dom.className + ' ' + SELECT_CLZ + ' ');
            this.pager.appendChild(dom);
        },

        insertAbbr: function () {
            dom = document.createElement(TAG);
            dom.innerHTML = '…';
            dom.className = TEXT_CLZ + ' ' + ABBR_CLZ;
            this.pager.appendChild(dom);
        }
    });

})(this);