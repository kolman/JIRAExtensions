var simpleGitHistory = function($) {

    var collapsed = false;

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

    function augmentCommitTables(commits) {
        var current = { commit: null };
        $.each(commits, function() {
            this.$table.next('br').remove();
            if (current.commit == this.commit) {
                current.$branchCell.append('<div class="jira-ext-branch-name jira-ext-other-branch-name">' + this.branchName + '</div>');
                this.$table.addClass('jira-ext-redundant-table');
            } else {
                current = this;
                this.$branchCell.html('<div class="jira-ext-branch-name">' + this.branchName + '</div>');
            }
        });
    }

    function collapse() {
        $('.jira-ext-redundant-table').hide();
        $('.jira-ext-other-branch-name').show();
        collapsed = true;
    }

    function expand() {
        $('.jira-ext-redundant-table').show();
        $('.jira-ext-other-branch-name').hide();
        collapsed = false;
    }

    function createToolbar($container) {
        var $toolbar = $('<div id="jira-ext-toolbar"></div>')
            .prependTo($container);
        addToolbarButton($toolbar, 'expand commits', function (event) {
            if (collapsed) {
                expand();
                $(event.target).attr('value', 'collapse commits');
            } else {
                collapse();
                $(event.target).attr('value', 'expand commits');
            }
        });
    };

    function addToolbarButton($toolbar, label, clickFunction) {
        var $button = $('<input type="button" />')
            .attr('value', label);
        $toolbar.append($button);
        $button.click(clickFunction);
    }

    function createCssStyles() {
        $('<style type="text/css">' +
            '.issuePanelContainer table { margin-bottom: 1.5em } ' +
            '#jira-ext-toolbar { margin-bottom: 5px; }' +
            '#jira-ext-toolbar input { margin-right: 5px; }' +
            '.jira-ext-redundant-table { display: none; }' +
          '</style>').appendTo('head');
    }

    if ($('#git-commits-tabpanel').hasClass('active')) {
        createCssStyles();
        var $container = $('.issuePanelContainer');
        var commits = findCommits($container);
        augmentCommitTables(commits);

        collapse();

        createToolbar($container);
    }

};

simpleGitHistory(jQuery);

