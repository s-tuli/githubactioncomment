const Octokit = require("@octokit/rest");
const core = require('@actions/core');
const github = require('@actions/github');

//const { Toolkit } = require('actions-toolkit');
//const toolkit = new Toolkit();

const octokit = new Octokit({
    auth: 'a32eb8b2f746f01a8634798f5fc39cb1d935d169'
});

octokit.pulls.createComment({
    owner: 's-tuli',
    repo: 'dev-spaces',
    pull_number: '3',
    body: 'hi',
    commit_id: 'f766cbc9702276705ad8f45ad2b0a9143b856c2f',
    path: 'samples/BikeSharingApp/Bikes/server.js',
    position: '1'
});



