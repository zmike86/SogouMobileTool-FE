dojo.declare('website.Top.KeywordRank', website.Top.HtmlRank, {

    bind: function () {
        dojo.query('li', this.content)
            .onmouseenter(function(e) {
                dojo.addClass(e.target, 'hover');
            }).onmouseleave(function(e) {
                dojo.removeClass(e.target, 'hover');
            });
    }
});
