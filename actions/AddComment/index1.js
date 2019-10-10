
const { graphql } = require("@octokit/graphql");
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");

const token =  core.getInput('repo-token');

const repo = process.env.GITHUB_REPOSITORY.toString();
const commitId = process.env.GITHUB_REF;
var PRArray = commitId.split("/", 3);
const pullNumber = PRArray[2]; 
console.log(pullNumber);
var repoNameWithOwnerArray = repo.split("/", 2); 
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  repo ${actualRepo}!`);

function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token, pullNumber) {
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });

    console.log(`graphqlWithAuth ---> ${graphqlWithAuth} token length: ${token.length}`);
    let findPullRequestIdQuery = `query FindPullRequestID ($owner: String!, $repo: String!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$pullnumber) {
      id
  }
}`;


graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo,
            pullNumber:pullNumber
        }
    ).catch(err => console.log(err)).then(value => addCommentToPullRequest(value, graphqlWithAuth));
}

function addCommentToPullRequest(value, graphqlWithAuth){

    let obj = JSON.parse(JSON.stringify(value));
    
    graphqlWithAuth(mutation, {
        subjectId: obj.repository.pullRequest.id

        }
    ).catch(err => console.log(err)).then(result => console.log(result));

}
let mutation =`mutation AddPullRequestComment($subjectId: ID!) {
  addComment(input:{subjectId:$subjectId, body: "This is a comment....!!"}) {
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
// octokit.search.issuesAndPullRequests({
//     q: 'SHA:24d0bc69863c9c66bb3fa9259747b7c041832f11'
// })

// SHA
// q=GitHub+Octocat+in:readme+user:defunkt

findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, actualRepo, token, pullNumber);
