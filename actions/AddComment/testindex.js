const Octokit = require("@octokit/rest");
const core = require('@actions/core');
const github = require('@actions/github');

//const { Toolkit } = require('actions-toolkit');
//const toolkit = new Toolkit();

const octokit = new Octokit({
    auth: '50629db6834009d9118b3a1473272d6c6fc0afcd'
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



