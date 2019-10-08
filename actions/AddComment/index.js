
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");


try {
    const headref = process.env.GITHUB_HEAD_REF.toString();    
    const repo = process.env.GITHUB_REPOSITORY.toString();
    var repoNameWithOwnerArray = repo.split("/", 2); 
    const owner = repoNameWithOwnerArray[0];
    const actualRepo = repoNameWithOwnerArray[1];    
    const sha = process.env.GITHUB_SHA;
    const privateKey = core.getInput("input-key");
    const APP_ID = 42954;
    const path = core.getInput('path');    
    const position = core.getInput('position');    
    const nameToGreet = core.getInput('who-to-greet');    
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    core.setOutput("status", "Success");
    const pull_number = core.getInput('pull_number');    
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
   
    const token =  core.getInput('repo-token');
    var len = token.length;    
    const host = process.env.GITHUB_HOST_SUFFIX.toString();    
    const parent = process.env.GITHUB_PARENT_SPACE.toString();    
    const bodyprime = `http://${headref}.s.${parent}.bikesharingweb.${host}/`;
      
    const octokit = new Octokit({
        auth: token
    })
    octokit.pulls.createComment({
        owner: owner,
        repo: actualRepo,
        pull_number: pull_number,
        body: bodyprime,
        commit_id: 'fe5a2e1232d64dc7501e9e09ef7b4cf4d120f884',
        path: path,
        position: position
    }).catch(err => {        
        console.log(err);
        core.setFailed(err.message);
      });
    createCheckRun(APP_ID, privateKey, sha, owner, actualRepo, 'Azure Dev Spaces Review App', bodyprime);
} catch (error) {
    core.setFailed(error.message);
}

async function createCheckRun(id, privateKey, sha, owner, repo, name, bodyprime) {
    const octokit = await octoKitHandler(id, privateKey, sha);
    const {data} = octokit.checks.create({
        owner: owner,
        repo: repo,
        name: name,
        head_sha: 'fe5a2e1232d64dc7501e9e09ef7b4cf4d120f884',        
        output: {
            summary: `<a href=${bodyprime}> Use DevSpaces Review App</a>`,
            title: 'Azure Dev Spaces',
            text: bodyprime
        }


    }).catch(err => console.log(err));
    return data;
}

async function octoKitHandler(id, privateKey, owner, repo) {
    const app = new App({
        id: id,
        privateKey: privateKey
    });
    const installationId =  2575400;//getInstallationId(app, owner, repo);
        const octokit =   new Octokit({
            async auth() {
                const installationAccessToken = await app.getInstallationAccessToken({
                    installationId: installationId
                }).catch(err => {        
                    console.log(err);
                    core.setFailed(err.message);
                  });
                return `token ${installationAccessToken}`;
        }
        });
        return octokit;    
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
    console.log(`installationId: ------> ${data.id}`);     
    return  data.id;
}