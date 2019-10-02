const Octokit = require("@octokit/rest");
const core = require('@actions/core');
const github = require('@actions/github');



const octokit = new Octokit({
    auth: '${token}'
});


try {
    const owner = core.getInput('repo').split('/')[0];
    console.log(`Hello ${owner}!`);
    const repo = core.getInput('repo').split('/')[1];
    console.log(`Hello ${repo}!`);
    const pull_number = core.getInput('pull_number');
    console.log(`Hello ${pull_number}!`);
    const body = core.getInput('body');
    console.log(`Hello ${body}!`);
    const commit_id = core.getInput('commit_id');
    console.log(`Hello ${commit_id}!`);
    const path = core.getInput('path');
    console.log(`Hello ${path}!`);
    const position = core.getInput('position');
    console.log(`Hello ${position}!`);
    const token = core.getInput('token');
    console.log(`Hello ${token}`);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

octokit.pulls.createComment({
    owner: '${owner}',
    repo: '${repo}',
    pull_number: '${pull_number}',
    body: '${body}',
    commit_id: '${commit_id}',
    path: '${path}',
    position: '${position}'
});