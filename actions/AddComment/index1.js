const { graphql } = require("@octokit/graphql");
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");
const { graphql } = require("@octokit/graphql");
//const  token = '6be84391790e226043a53c9a20d502ca5fe559b7';
const token =  core.getInput('repo-token');

// function graphqlWithAuth(token) {
//     return graphql.defaults({
//         headers: {
//             authorization: `token ${token}`
//         }
//     });
// }

const repo = process.env.GITHUB_REPOSITORY.toString();
var repoNameWithOwnerArray = repo.split("/", 2); 
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  repo ${actualRepo}!`);
const sha = process.env.GITHUB_SHA;

function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token) {
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
    console.log(`graphqlWithAuth ---> ${graphqlWithAuth} token length: ${token.length}`);
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


    //console.log(obj.repository.pullRequest.id);

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
findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token);