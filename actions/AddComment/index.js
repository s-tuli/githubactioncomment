const Octokit = require("@octokit/rest");
const core = require('@actions/core');
const github = require('@actions/github');

const { Toolkit } = require('actions-toolkit');
const toolkit = new Toolkit();

const octokit = new Octokit({
    auth: '${token}'
});

try {
    const repo = process.env.GITHUB_REPOSITORY.toString();
    var repoNameWithOwnerArray = repo.split("/", 2); 
    const owner = repoNameWithOwnerArray[0];
    const actualRepo = repoNameWithOwnerArray[1];
    console.log(`Hello owner ${owner}!`);
    console.log(`Hello  repo ${actualRepo}!`);
    const pull_number = core.getInput('pull_number');
    console.log(`Hello pull_number ${pull_number}!`);
    const body  = JSON.stringify(core.getInput('body'), undefined, 2);
    console.log(`Hello body ${body}!`);
    const commit_id = process.env.GITHUB_SHA;
    console.log(`Hello commit_id ${commit_id}!`);
    const path = core.getInput('path');
    console.log(`Hello path ${path}!`);
    const position = core.getInput('position');
    console.log(`Hello position ${position}!`);
    const token = process.env.TOKEN.toString();
    console.log(`Hello token ${token}`);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    const headref = process.env.GITHUB_HEAD_REF.toString();
    const baseref = process.env.GITHUB_BASE_REF.toString();
    console.log(`hello headref ${headref}`);
    console.log(`hello baseref ${baseref}`);
    
    const host = process.env.GITHUB_HOST_SUFFIX.toString();
    console.log(`###############yes! this is the host ${host}`);
    const parent = process.env.GITHUB_PARENT_SPACE.toString();
    console.log(`###############yes! this is the parent ${parent}`);
    if("dev"==parent)
    {
        console.log(`###############yes! this is the parent space secret`);
    }
    const bodyprime = `http://${headref}.s/${parent}.bikesharingweb.${host}/`;
    console.log(`###############yes! this is the bodyprime ${bodyprime}`);
    octokit.pulls.createComment({
        owner: '${owner}',
        repo: '${actualRepo}',
        pull_number: `${pull_number}`,
        body: '${bodyprime}',
        commit_id: '${commit_id}',
        path: '${path}',
        position: `${position}`
    });
} catch (error) {
    core.setFailed(error.message);
}

