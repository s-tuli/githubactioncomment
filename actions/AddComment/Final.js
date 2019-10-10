const core = require('@actions/core');
const { graphql } = require("@octokit/graphql");
const  token = core.getInput('repo-token');
const commitId = process.env.GITHUB_REF;
const PRArray = commitId.split("/", 3);
const pullNumber = PRArray[2]; 
console.log(pullNumber);
const repo = process.env.GITHUB_REPOSITORY.toString();
const pullnumberFromyml = core.getInput('pull_number');

let repoNameWithOwnerArray = repo.split("/", 2);
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  actualRepo ${actualRepo}!`);
console.log(`Hello  pullnumberFromyml ${pullnumberFromyml}!`);

function getGraphqlWithAuth(token) {
    return graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
}

function addCommentToPullRequest(body, pullRequestId){
    const  graphqlWithAuth =  getGraphqlWithAuth(token);
    graphqlWithAuth(pullRequestCommentMutation, {
            subjectId:pullRequestId,
            body: body

        }
    ).catch(err => console.log(err)).then(result => console.log(result));

}
function findPullRequestAndAddComment(owner, repo, commentBody, pullNumber) {

    const  graphqlWithAuth =  getGraphqlWithAuth(token);
    const  findPullRequestIdQuery = findPullRequestQuery();
    graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo,
            pullNumber: pullNumber 
        }
    ).catch(err => console.log(err)).then(pullRequestId => addCommentToPullRequest(commentBody, pullRequestId));
}


let pullRequestCommentMutation = addPullRequestCommentMutation();
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

findPullRequestAndAddComment(owner,actualRepo,'More comments....', pullNumber);