
const core = require('@actions/core');
const { graphql } = require("@octokit/graphql");
const  token = core.getInput('repo-token');
const Octokit = require("@octokit/rest");

const repo = process.env.GITHUB_REPOSITORY.toString();
var repoNameWithOwnerArray = repo.split("/", 2); 
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  actualRepo ${actualRepo}!`);

function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token) {
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
    let findPullRequestIdQuery = `query FindPullRequestID ($owner: String!, $repo: String!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:74) {
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


// SHA
// q=GitHub+Octocat+in:readme+user:defunkt
findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, actualRepo, token);