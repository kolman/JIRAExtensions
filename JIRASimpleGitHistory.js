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
        if(collapsed) {
            $('.jira-ext-branch-name').each(function(){
                if($(this).text().match(filter))
                    $(this).show();
                else
                    $(this).hide();
            });
        } else {
            $container.find('table').each(function() {
                var branchName = $(this).find('.jira-ext-branch-name:first').text();
                if(branchName.match(filter)) {
                    console.log('branch "' + branchName + '" matches "' + filter + '"');
                    $(this).show();
                } else {
                    console.log('branch "' + branchName + '" does not match "' + filter + '"');
                    $(this).hide();
                }
            });
        }
    }

    function collapse() {
        $container.find('table').show();
        $('.jira-ext-redundant-table').hide();
        $('.jira-ext-branch-name').show();
        collapsed = true;
        filterBranches();
    }

    function expand() {
        $container.find('table').show();
        $('.jira-ext-branch-name').show();
        $('.jira-ext-other-branch-name').hide();
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
            '#jira-ext-toolbar { margin-bottom: 5px; }' +
            '#jira-ext-toolbar input { margin-right: 5px; }' +
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

