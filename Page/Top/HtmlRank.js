dojo.declare('website.Top.HtmlRank', [website.Top.Rank], {

    setData: function (json) {
        if (!json || !json.html) return;

        this.dispose();
        var html = decodeURIComponent(json.html);
        this.content.innerHTML = html;
        this.bind();
        this.show();

        return html;
    }
});
