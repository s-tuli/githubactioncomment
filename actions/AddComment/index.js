
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");
const { graphql } = require("@octokit/graphql");


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
    findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, "7c8db812cd8942b469e74a6a3ec56a6e3f5e3e0c");
    octokit.pulls.createComment({
        owner: owner,
        repo: actualRepo,
        pull_number: pull_number,
        body: bodyprime,
        commit_id: '7c8db812cd8942b469e74a6a3ec56a6e3f5e3e0c',
        path: path,
        position: position
    }).catch(err => {        
        console.log(err);
        core.setFailed(err.message);
      });
    createCheckRun(APP_ID, privateKey, sha, owner, actualRepo, 'mycheckrun', bodyprime);
} catch (error) {
    core.setFailed(error.message);
}

// get the comment without using path - use graphql

/* function graphqlWithAuth(token) {
    return graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
}
 */

function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token) {
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
    let findPullRequestIdQuery = `query FindPullRequestID ($owner: String!, $repo: String!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:7) {
      id
    }
  }
}`;

graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo
        }
    ).catch(err => console.log(err)).then(value => addCommentToPullRequest(value, graphqlWithAuth));
}


function addCommentToPullRequest(value, graphqlWithAuth){

    let obj = JSON.parse(JSON.stringify(value));


    console.log(obj.repository.pullRequest.id);

    graphqlWithAuth(mutation, {
        subjectId: obj.repository.pullRequest.id

        }
    ).catch(err => console.log(err)).then(result => console.log(result));

}



let mutation =`mutation AddPullRequestComment($subjectId: ID!) {
  addComment(input:{subjectId:$subjectId, body: Testing graphql!! $bodyprime}}) {
    commentEdge {
        node {
        createdAt
        body
      }
    }
    subject {
      id
    }
  }
}`;
octokit.search.issuesAndPullRequests({
    q: 'SHA:7c8db812cd8942b469e74a6a3ec56a6e3f5e3e0c'
})

async function createCheckRun(id, privateKey, sha, owner, repo, name, bodyprime) {
    const octokit = await octoKitHandler(id, privateKey, sha);
    const {data} = octokit.checks.create({
        owner: owner,
        repo: repo,
        name: name,
        head_sha: '7c8db812cd8942b469e74a6a3ec56a6e3f5e3e0c',
        
        output: {
            summary: `<a href=${bodyprime}> Use this Child Space</a>`,
            title: 'Child Space',
            text: "mytext"
        }


    }).catch(err => console.log(err));
    return data;
}

async function octoKitHandler(id, privateKey, owner, repo) {
    const app = new App({
        id: id,
        privateKey: privateKey
    });
    const installationId =  2575400;//getInstallationId(app, owner, repo);//2575400;
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