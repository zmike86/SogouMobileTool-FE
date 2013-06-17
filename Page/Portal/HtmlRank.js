dojo.declare('website.Portal.HtmlRank', website.Portal.Rank, {

    setData: function (json) {
        if (!json || !json.html) return;

        var html = decodeURIComponent(json.html);
        this.content.innerHTML = html;
        this.data = html;
        this.bind();
        this.show();

        return html;
    }
});
