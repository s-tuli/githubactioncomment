const { graphql } = require("@octokit/graphql");
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");

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
const pull_number = core.getInput('pull_number');
function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token, pull_number) {
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });

    console.log(`graphqlWithAuth ---> ${graphqlWithAuth} token length: ${token.length}`);
    let findPullRequestIdQuery = `query FindPullRequestID ($owner: String!, $repo: String!, $pull_number:String!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$pull_number) {
      id
    }
  }
}`;

graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo,
            pull_number: pull_number
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
findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, actualRepo, token, pull_number);