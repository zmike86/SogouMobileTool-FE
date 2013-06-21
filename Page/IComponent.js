/**
 * Basic IComponent interface
 * @interface
 * @creator Leo
 */

dojo.declare('website.IComponent', [website.IDispose], {

    /**
     * @typedef {Object} most outer wrapper dom of this component
     */
    container: null,
    /**
     * self data
     */
    data: null,

    constructor: function () {},

    /**
     * for data management
     * @param {Object} json
     */
    setData: function (json) {
        throw new Error('setData should be implements by subClass');
    },

    getData: function () {
        return this.data;
    },

    show: function () {
        this.container.style.visibility = 'visible';
    },

    hide: function () {
        this.container.style.visibility = 'hidden';
    }
});