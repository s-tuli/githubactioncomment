/* const Octokit = require("@octokit/rest");
const core = require('@actions/core');
const github = require('@actions/github');
const { App } = require("@octokit/app");
const { Toolkit } = require('actions-toolkit');
const toolkit = new Toolkit();


try {
    const sha = process.env.GITHUB_SHA;
    const privateKey = core.getInput("input-key");
    const APP_ID = 42954;
    console.log("SHA is-->"+sha);
    console.log("privateKey is-->"+privateKey.length);

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
    const token =  core.getInput('repo-token');
    var len = token.length;
    console.log(`Hello token's len is: ${len} and the token is ${token}`);
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
    const bodyprime = `http://${headref}.s.${parent}.bikesharingweb.${host}/`;
    console.log(`###############yes! this is the bodyprime ${bodyprime}`);
    
    const octokit = new Octokit({
        auth: token
    })
    console.log(`just before the real comment gets logged`);
    core.setOutput("result", 'success');
    octokit.pulls.createComment({
        owner: owner,
        repo: actualRepo,
        pull_number: pull_number,
        body: bodyprime,
        commit_id: '309f314673dce90d5d3e66092da0e539aea530ea',
        path: path,
        position: position
    }).catch(err => {        
        console.log(err);
        core.setFailed(err.message);
      });
      
      createCheckRun(APP_ID, privateKey, sha);
    
} catch (error) {
    core.setFailed(error.message);
}
async function createCheckRun(id, privateKey, sha) {
    const octokit = await octoKitHandler(id, privateKey, sha);
    const {data} = octokit.checks.create({
        owner: 's-tuli',
        repo: 'dev-spaces',
        name: 'test check run',
        head_sha: sha,
        actions: [
            {
                label: 'Fix Now',
                identifier: 'fix_errors',
                description: 'Allow us to fix these errors for you'
            }
        ]

    }).catch(err => console.log(err));
    return data;
} */

const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const  request  = require("@octokit/request");


try {
    const headref = process.env.GITHUB_HEAD_REF.toString();    
    console.log(`hello headref ${headref}`);
    const repo = process.env.GITHUB_REPOSITORY.toString();
    var repoNameWithOwnerArray = repo.split("/", 2); 
    const owner = repoNameWithOwnerArray[0];
    const actualRepo = repoNameWithOwnerArray[1];
    console.log(`Hello owner ${owner}!`);
    console.log(`Hello  repo ${actualRepo}!`);
    const sha = process.env.GITHUB_SHA;
    const privateKey = core.getInput("input-key");
    const APP_ID = 42954;
    console.log("SHA is-->"+sha);
    const path = core.getInput('path');
    console.log(`Hello path ${path}!`);
    const position = core.getInput('position');
    console.log(`Hello position ${position}!`);
    console.log("privateKey is-->"+privateKey.length);
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hiiiiii ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    core.setOutput("status", "Success");
    const pull_number = core.getInput('pull_number');
    console.log(`Hello pull_number ${pull_number}!`);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
    const token =  core.getInput('repo-token');
    var len = token.length;
    console.log(`Hello token's len is: ${len} and the token is ${token}`);
    const host = process.env.GITHUB_HOST_SUFFIX.toString();
    console.log(`###############yes! this is the host ${host}`);
    const parent = process.env.GITHUB_PARENT_SPACE.toString();
    console.log(`###############yes! this is the parent ${parent}`);
    if("dev"==parent)
    {
        console.log(`###############yes! this is the parent space secret`);
    }
    const bodyprime = `http://${headref}.s.${parent}.bikesharingweb.${host}/`;
    console.log(`###############yes! this is the bodyprime ${bodyprime}`);    
    const octokit = new Octokit({
        auth: token
    })
    octokit.pulls.createComment({
        owner: owner,
        repo: actualRepo,
        pull_number: pull_number,
        body: bodyprime,
        commit_id: '0f8cd4a1875c42d65ae054e29f0fa39d465d966c',
        path: path,
        position: position
    }).catch(err => {        
        console.log(err);
        core.setFailed(err.message);
      });
    createCheckRun(APP_ID, privateKey, sha, owner, repo, 'mycheckrun', bodyprime);
} catch (error) {
    core.setFailed(error.message);
}

async function createCheckRun(id, privateKey, sha, owner, repo, name, bodyprime) {
    const octokit = await octoKitHandler(id, privateKey, sha);
    const {data} = octokit.checks.create({
        owner: owner,
        repo: repo,
        name: name,
        head_sha: sha,
        actions: [
            {
                label: 'Fix Now',
                identifier: 'fix_errors',
                description: bodyprime 
            }
        ]

    }).catch(err => console.log(err));
    return data;
}

async function octoKitHandler(id, privateKey, owner, repo) {
    const app = new App({
        id: id,
        privateKey: privateKey
    });

    return new Octokit({
        async auth() {
            const installationAccessToken = await app.getInstallationAccessToken({
                installationId: getInstallationId(app, owner, repo)
            });
            return `token ${installationAccessToken}`;
        }
    }).catch(err => console.log(err));
}

async function getInstallationId(app, owner, repo){
    const  {data} = await request (`GET /repos/${owner}/${repo}/installation`, {
        owner: owner,
        repo: repo,
        headers: {
            authorization: `Bearer ${app.getSignedJsonWebToken()}`,
            accept: "application/vnd.github.machine-man-preview+json"
        }
    });
    if(data !== 'undefined'){
        return  data.id;
    }
    throw new Error("Installation id not found");
}