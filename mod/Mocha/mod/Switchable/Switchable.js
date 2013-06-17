/**
 * Basic switchable component, which can be integrated into
 * Tab, Slide, Polling, Carousel
 * @creator {Person} Leo
 *
 * reference:
 * Thanks Kissy Team
 * http://kissy.googlecode.com/svn/trunk/src/switchable/
 */
;(function (global, undefined) {

    /**
     * @type {function} Generate global unique id for this control.
     */
    var gid = function () {
        return 'xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0,
                v = (c == 'x' ? r : (r & 0x3 | 0x8));
            return v.toString(16);
        }).toUpperCase();
    };

    /**
     * @type {object}
     */
    var eMap = {
        mouse: ['mouseenter', 'mouseleave'],
        hover: ['mouseover', 'mouseout'],
        click: ['click']
    };

    dojo.declare('Sogou.mod.Switchable', null, {

        // attr
        gid: null,
        activeIndex: null,
        delayTimer: null,
        config: null,
        length: null,
        // dom
        ele: null,
        triggers: null,
        panels: null,
        content: null,

        /**
         * @param  {!object} configObject
         * @constructor
         */
        constructor: function (configObject) {
            var cfg = dojo.mixin(dojo.clone(Sogou.mod.Switchable.Config), configObject);
            this.config = dojo.mixin({}, cfg);

            var config = this.config;
            this.gid = gid();
            this.ele = config.ele;
            this.triggers = config.triggers;
            this.panels = config.panels;
            this.content = config.content || this.panels[0].parentNode;
            this.activeIndex = config.activeIndex;
            this.length = this.panels.length / config.steps;
            this._init();
        },

        /**
         * Initialize every plugin
         * @private
         */
        _init: function () {
            if (this.config.switchTo) {
                this.switchTo(this.config.switchTo);
            }

            if (this.config.hasTriggers) {
                this._bind();
            }

            if (this.config.plugins.length > 0) {
                dojo.forEach(this.config.plugins, function(plugin, index) {
                    plugin.init(this);
                }, this);
            }
        },

        /**
         * Bind trigger event to each label
         * @private
         */
        _bind: function () {
            var type = eMap[this.config.triggerType][0];
            dojo.forEach(this.triggers, function(item, index) {
                dojo.connect(item, 'click', this, function(evt){
                    dojo.stopEvent(evt);
                    this._triggerOnClick(index);
                });
                if (/hover|mouse/.test(this.config.triggerType)) {
                    dojo.connect(item, type, this, function(evt) {
                        dojo.stopEvent(evt);
                        this._triggerOnMouseEnter(index);
                    });
                    dojo.connect(item, eMap[this.config.triggerType][1], this, function(evt) {
                        dojo.stopEvent(evt);
                        this._triggerOnMouseLeave(index);
                    });
                }

            }, this);
        },

        /**
         * @param {number} index Switch to which panel
         * @private
         */
        _triggerOnClick: function (index) {
            if (!this._isValidSwitch(index))
                return;
            this._cancelSwitchTimer();
            this.switchTo(index);
        },

        /**
         * @param {number} index Switch to which panel
         * @private
         */
        _triggerOnMouseEnter: function (index) {
            if (!this._isValidSwitch(index))
                return;
            var me = this;
            this.delayTimer = global.setTimeout(function() {
                me.switchTo(index);
            }, this.config.delayTime);
        },

        /**
         * @param {number} index Switch from which panel
         * @private
         */
        _triggerOnMouseLeave: function (index) {
            this._cancelSwitchTimer();
        },

        /**
         * @private
         */
        _isValidSwitch: function (index) {
            return this.activeIndex !== index;
        },

        /**
         * @private
         */
        _cancelSwitchTimer: function () {
            if (this.delayTimer) {
                global.clearTimeout(this.delayTimer);
                this.delayTimer = undefined;
            }
        },

        /**
         * Need to deal with className for labels switch
         * @param {!Element} from Which trigger switch from
         * @param {!Element} to Which trigger switch to
         * @private
         */
        _switchTrigger: function (from, to) {
            if (from) {
                var cls = this.config.activeClassName;
                dojo.removeClass(from, cls);
                dojo.addClass(to, cls);
            }
        },

        /**
         * @param {Array.<Element>} from Which panel switch from
         * @param {Array.<Element>} to Which panel switch to
         * @param {!number} index Number index container to show
         * @param {?number} direction 1 represents forward -1 represents backward
         * @private
         */
        _switchView: function (from, to, index, direction) {
            dojo.query(from).style({display: 'none'});
            dojo.query(to).style({display: 'block'});
            // fire onSwitch events
            this._fireOnSwitch(index);
        },

        _fireOnSwitch: function (index) {
            dojo.publish(this.gid + ':onswitch', [{currentIndex: index }]);
        },

        _fireOnBeforeSwitch: function (index) {
            dojo.publish(this.gid + ':onbeforeswitch', [{toIndex: index}]);
        },

        // public API belows

        /**
         * @public
         * @param {number} index Indicates which panel jump to
         * @param {!number} direction forward or backward
         */
        switchTo: function (index, direction) {
            var triggers = this.triggers,
                panels = this.panels,
                activeIndex = this.activeIndex,
                steps = this.config.steps,
                fromIndex = activeIndex * steps,
                toIndex = index * steps;

            if (!this._isValidSwitch(index))
                return this;

            this._fireOnBeforeSwitch(index);

            // switch active trigger
            if (this.config.hasTriggers) {
                this._switchTrigger(activeIndex > -1 ? triggers[activeIndex] : null, triggers[index]);
            }

            // switch active panels
            if (direction === undefined) {
                direction = index > activeIndex ? 1 : -1;
            }

            // switch view
            this._switchView(
                panels.slice(fromIndex, fromIndex + steps),
                panels.slice(toIndex, toIndex + steps),
                index,
                direction);

            // update activeIndex
            this.activeIndex = index;

            return this;
        },

        /**
         * @public
         */
        prev: function () {
            var activeIndex = this.activeIndex;
            this.switchTo(activeIndex > 0 ? activeIndex - 1 : this.length - 1, -1);
        },

        /**
         * @public
         */
        next: function () {
            var activeIndex = this.activeIndex;
            this.switchTo(activeIndex < this.length - 1 ? activeIndex + 1 : 0, 1);
        }

    });

    /**
     * Default configuration object.
     * @type {Object}
     */
    Sogou.mod.Switchable.Config = {
        triggerType: 'mouse',
        steps: 1,  // each screen show how many items
        length: 0, // how many screens in viewport
        viewSize: [],
        hasTriggers: true, // is there trigger dom?
        delayTime: 100, // trigger event after xx ms
        activeIndex: 0, // default selected trigger
        activeClassName: 'Sogou-ui-activeTrigger',
        normalClassName: 'Sogou-ui-normalTrigger',
        activePanelClass: 'Sogou-ui-activePanel',
        normalPanelClass: 'Sogou-ui-normalPanel'
    };


})(this);
