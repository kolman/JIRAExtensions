
function CommitsDisplayModule(commits) {
    this.commits = commits;
    this.collapsed = false;
}

CommitsDisplayModule.prototype.collapse = function() {
    if(this.collapsed) return;
    var current = { commit:null };
    $.each(this.commits, function () {
        if (current.commit == this.commit) {
            current.$branchCell.append("<br/>" + this.branchName);
            this.$table.hide();
        } else {
            current = this;
        }
    });
    this.collapsed = true;
};

CommitsDisplayModule.prototype.expand = function() {
    if(!this.collapsed) return;
    $.each(this.commits, function () {
        this.$table.show();
        this.$branchCell.text(this.branchName);
    });
    this.collapsed = false;
};

function findCommits($container) {
    var commits = $container.find('table').map(function () {
        var t = $(this);
        var branchCell = t.find('tr:eq(1) td:eq(1)');
        return {
            $table:t,
            $branchCell:branchCell,
            branchName:branchCell.text(),
            commit:t.find('tr:eq(1) td:eq(2)').text()
        };
    });
    return commits;
}

function createToolbar($container, squeezer) {
    var $toolbar = $('<div></div>')
        .prependTo($container)
        .css('margin-bottom', '5px');
    addToolbarButton($toolbar, 'expand commits', function () { squeezer.expand(); });
    addToolbarButton($toolbar, 'collapse commits', function () { squeezer.collapse(); });
};

function addToolbarButton($toolbar, label, clickFunction) {
    var $button = $('<input type="button" />')
        .attr('value', label)
        .css('margin-right', '5px');
    $toolbar.append($button);
    $button.click(clickFunction);
}

if ($('#git-commits-tabpanel').hasClass('active')) {
    var $container = $('.issuePanelContainer');
    var commits = findCommits($container);

    var squeezer = new CommitsDisplayModule(commits);
    squeezer.collapse();

    createToolbar($container, squeezer);
}