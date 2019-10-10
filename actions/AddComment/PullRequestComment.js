
const core = require('@actions/core');
const { graphql } = require("@octokit/graphql");
const  token = core.getInput('repo-token');
const Octokit = require("@octokit/rest");
const commitId = process.env.GITHUB_REF;
var PRArray = commitId.split("/", 2);
const pullNumber = parseInt(PRArray[2],10); 
console.log(pullNumber);
const repo = process.env.GITHUB_REPOSITORY.toString();
const pullnumberFromyml = core.getInput('pull_number');
const host = process.env.GITHUB_HOST_SUFFIX.toString();
console.log(`###############yes! this is the host ${host}`);
const parent = process.env.GITHUB_PARENT_SPACE.toString();
console.log(`###############yes! this is the parent ${parent}`);
if("dev"==parent)
{
    console.log(`###############yes! this is the parent space secret`);
}
const headref = process.env.GITHUB_HEAD_REF.toString();    
    console.log(`hello headref ${headref}`);
var repoNameWithOwnerArray = repo.split("/", 2); 
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  actualRepo ${actualRepo}!`);
console.log(`Hello  pullnumberFromyml ${pullnumberFromyml}!`);
const bodyprime = `http://${headref}.s.${parent}.bikesharingweb.${host}/`;
const octokit = new Octokit({
    auth: token
})
function findPullRequestAndAddComment(graphqlWithAuth, findPullRequestIdQuery, owner, repo, pullNumber, commentBody) {
    graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo,
            pullNumber: pullNumber
        }
    ).catch(err => console.log(err)).then(value => addCommentToPullRequest(value, graphqlWithAuth, commentBody));
}

function getGraphqlWithAuth(token) {
    return graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
}



function addComment(owner, repo, token, pullNumber, commentBody) {
    const  graphqlWithAuth =  getGraphqlWithAuth(token);
    let findPullRequestIdQuery = findPullRequestQuery();

findPullRequestAndAddComment(graphqlWithAuth, findPullRequestIdQuery, owner, repo, pullNumber, commentBody);

}


function addCommentToPullRequest(value, graphqlWithAuth, body){

    let obj = JSON.parse(JSON.stringify(value));


    console.log(obj.repository.pullRequest.id);

    graphqlWithAuth(pullRequestCommentMutation, {
        subjectId: obj.repository.pullRequest.id,
        body: body

        }
    ).catch(err => console.log(err)).then(result => getPullNumber(result));

}

let pullRequestCommentMutation = addPullRequestCommentMutation()
function getNumber(value) {
    console.log(value);
    let obj = JSON.parse(JSON.stringify(value));

    console.log(`this is the json ***************${obj}`);
    const itemsArray = obj.data.items;
    //const convertToArray=itemsArray.parse
    for (let item in itemsArray){         
        console.log(item);     
    }   
    return itemsArray[0].number;
}

async function getPullNumber(commitId, owner, repo, token, commentBody) {
    octokit.search.issuesAndPullRequests({
        q: `SHA:${commitId}`
    }).catch(err => console.log(err)).then(value => {

        addComment(owner, repo, token, getNumber(value), commentBody);

    });

}
function addPullRequestCommentMutation() {
    return `mutation AddPullRequestComment($subjectId: ID!, $body: String!) {
  addComment(input:{subjectId:$subjectId, body: $body}) {
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
}

function findPullRequestQuery() {
    return `query FindPullRequestID ($owner: String!, $repo: String!, $pullNumber: Int!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$pullNumber) {
      id
    }
  }
}`;
}

getPullNumber(commitId, owner, actualRepo, token, bodyprime);