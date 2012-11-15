# JIRA Extensions

This project contains browser extensions for working with JIRA.

## Features

* Collapsing git commit history by branch

## Installation

### Chrome

1. Open Settings - Extensions
1. Turn on "Developer Mode"
1. Click "Load unpacked extension..." and browse for the source code folder

### Firefox

1. Install [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey) extension
1. Drag'n'drop file JIRAExtensions.user.js into Firefox

This extension works only on URLs listed in manifest.json (for Chrome) or JIRAExtensions.user.js (Greasemonkey).
If it does not work, check if your JIRA URL is listed in the proper file.
Add your JIRA URL if necessary.