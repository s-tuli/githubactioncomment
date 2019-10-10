
const core = require('@actions/core');
const { graphql } = require("@octokit/graphql");
const  token = core.getInput('repo-token');
const Octokit = require("@octokit/rest");
const commitId = process.env.GITHUB_SHA;
console.log(commitId);
const repo = process.env.GITHUB_REPOSITORY.toString();
const pullnumberFromyml = core.getInput('pull_number');
//const pullnumber = 7;
var repoNameWithOwnerArray = repo.split("/", 2); 
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  actualRepo ${actualRepo}!`);
console.log(`Hello  pullnumberFromyml ${pullnumberFromyml}!`);

function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token, pullnumber) {
    
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
    let findPullRequestIdQuery = `query FindPullRequestID ($owner: String!, $repo: String!, $pullnumber: Int!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$pullnumber) {
      id
    }
  }
}`;

graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo,
            pullnumber:pullnumber
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

function getNumber(value) {
    console.log(value);
    let obj = JSON.parse(JSON.stringify(value));
    console.log(obj);
    const itemsArray = obj.data.items;
    return itemsArray[0].number;
}

async function getPullNumber(commitId) {
    octokit.search.issuesAndPullRequests({
        q: `SHA:${commitId}`
    }).catch(err => console.log(err)).then(value => {
        const number = getNumber(value);
        console.log(number);
        return  getNumber(value);
    });
    return null
};

let pullnumber = getPullNumber(commitId);
console.log(pullnumber);

findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, actualRepo, token, pullnumber);