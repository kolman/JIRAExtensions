var simpleGitHistory = function($) {

    var collapsed = false;
    var $container;
    var $branchFilter;

    function findCommits() {
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

    function augmentCommitTables(commits) {
        var current = { commit: null };
        $.each(commits, function() {
            this.$table.next('br').remove();
            if (current.commit == this.commit) {
                current.$branchCell.append('<div class="jira-ext-branch-name jira-ext-other-branch-name">' + this.branchName + '</div>');
                this.$branchCell.html('<div class="jira-ext-branch-name">' + this.branchName + '</div>');
                this.$table.addClass('jira-ext-redundant-table');
            } else {
                current = this;
                this.$branchCell.html('<div class="jira-ext-branch-name">' + this.branchName + '</div>');
            }
        });
    }

    function filterBranches() {
        var filter = $branchFilter.val();
        $('.jira-ext-branch-name').each(function(){
                if($(this).text().match(filter)) {
                    $(this).removeClass('jira-ext-filtered-out');
                } else {
                    $(this).addClass('jira-ext-filtered-out');
                }
            });
        $container.find('table')
            .addClass('jira-ext-filtered-out')
            .filter(':has(.jira-ext-branch-name:not(.jira-ext-filtered-out):not(.jira-ext-collapsed))')
            .removeClass('jira-ext-filtered-out');
    }

    function collapse() {
        $('.jira-ext-redundant-table').addClass('jira-ext-collapsed');
        $('.jira-ext-other-branch-name').removeClass('jira-ext-collapsed');
        collapsed = true;
        filterBranches();
    }

    function expand() {
        $('.jira-ext-redundant-table').removeClass('jira-ext-collapsed');
        $('.jira-ext-other-branch-name').addClass('jira-ext-collapsed');
        collapsed = false;
        filterBranches();
    }

    function createToggleButton($toolbar) {
        var $button = $('<input type="button" />')
            .attr('value', 'expand commits');
        $toolbar.append($button);
        $button.click(function (event) {
            if (collapsed) {
                expand();
                $(event.target).attr('value', 'collapse commits');
            } else {
                collapse();
                $(event.target).attr('value', 'expand commits');
            }
        });
    }

    function createBranchFilter($toolbar) {
        $branchFilter = $('<input type="text" value="^rel" />');
        $toolbar.append('Show only branches: ').append($branchFilter);
        $branchFilter.keyup(filterBranches);
    }

    function createToolbar() {
        var $toolbar = $('<div id="jira-ext-toolbar"></div>')
            .prependTo($container);
        createToggleButton($toolbar);
        createBranchFilter($toolbar);
    };

    function createCssStyles() {
        $('<style type="text/css">' +
            '.issuePanelContainer table { margin-bottom: 1.5em } ' +
            '#jira-ext-toolbar { margin-bottom: 0.7em; padding: 0.7em; border-radius: 5px; ' +
            'background: -webkit-linear-gradient(top, #ffff88 0%,#fcdc3a 100%); ' +
            '}' +
            '#jira-ext-toolbar input { margin-right: 1.7em; }' +
            '.jira-ext-filtered-out,.jira-ext-collapsed { display: none; }' +
            '.jira-ext-branch-name { white-space:nowrap; } ' +
          '</style>').appendTo('head');
    }

    if ($('#git-commits-tabpanel').hasClass('active')) {
        createCssStyles();
        $container = $('.issuePanelContainer');
        var commits = findCommits();
        augmentCommitTables(commits);
        createToolbar();

        collapse();
    }

};

simpleGitHistory(jQuery);

