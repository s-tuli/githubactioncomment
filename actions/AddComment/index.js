const Octokit = require("@octokit/rest");
const core = require('@actions/core');
const github = require('@actions/github');

const { Toolkit } = require('actions-toolkit');
const toolkit = new Toolkit();
core.secrets
const octokit = new Octokit({
    auth: '${token}'
});


/* try {
    const owner = github.context.repo core.getInput('repo').split('/')[0];
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
} */

try {
    const repo = github.GitHub.GITHUB_REPOSITORY;
    const owner = repo.owner.toString();
    const actualRepo = repo.repo.toString();
    console.log(`Hello owner ${owner}!`);
    const private_spc = process.env['GITHUB_PRIVATE_SPACE'];
    console.log(`Hello  private ${private_spc}!`);
    console.log(`Hello  repo ${actualRepo}!`);
    const pull_number = core.getInput('pull_number');
    console.log(`Hello pull_number ${pull_number}!`);
    const body  = JSON.stringify(core.getInput('body'), undefined, 2);
    console.log(`Hello body ${body}!`);
    const commit_id = github.GitHub.GITHUB_SHA;
    console.log(`Hello commit_id ${commit_id}!`);
    const path = core.getInput('path');
    console.log(`Hello path ${path}!`);
    const position = core.getInput('position');
    console.log(`Hello position ${position}!`);
    const token = process.env['GITHUB_TOKEN'];
    console.log(`Hello token ${token}`);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    const headref = github.GitHub.GITHUB_HEAD_REF;
    const baseref = github.Github.GITHUB_BASE_REF;
    console.log(`hello headref ${headref}`);
    console.log(`hello baseref ${baseref}`);
    
    const host = process.env['GITHUB_HOST_SUFFIX'];
    
    const parent = process.env['GITHUB_PARENT_SPACE'];
    if("dev"==parent)
    {
        console.log(`###############yes! this is the parent space secret`);
    }
    const bodyprime = `http://${headref}.s/${parent}.bikesharingweb.${host}/`;
} catch (error) {
    core.setFailed(error.message);
}

octokit.pulls.createComment({
    owner: '${owner}',
    repo: '${actualRepo}',
    pull_number: '${pull_number}',
    body: '${bodyprime}',
    commit_id: '${commit_id}',
    path: '${path}',
    position: '${position}'
});