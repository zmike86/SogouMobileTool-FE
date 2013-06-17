/**
 * Basic IDispose interface
 * @interface
 * @creator Leo
 */

dojo.declare('website.IDispose', null, {

    /**
     * @private
     * @typedef {Boolean}
     */
    dispose_: false,

    constructor: function () {},
    /**
     * @public
     */
    dispose: function () {
        this.dispose_ = true;
        this.disposeInternal_();
    },
    /**
     * @private
     */
    disposeInternal_: function () {
        if (!this.dispose_) {
            // 这里需要做5件事
            // 1. 调用父类的dispose方法
            // 2. 释放可释放的普通对象
            // 3. 为dom清除绑定的handler
            // 4. 所有引用dom的属性需要释放
            // 5. 所有引用COM对象的属性需释放
        }
    }
});