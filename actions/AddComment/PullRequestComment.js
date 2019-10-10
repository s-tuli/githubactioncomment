
const core = require('@actions/core');
const { graphql } = require("@octokit/graphql");
const  token = core.getInput('repo-token');
const Octokit = require("@octokit/rest");
const commitId = 'fe2dda5bcd1794e85f7d04ab48986783010a008e';//process.env.GITHUB_SHA;//'dceb353398405283d101aafff1e1ff4180cc476d';//
                   //this is github_sha-->'bb7dfbac158e6d66a57d6ac135a182eaedf4e94e'
                   //fe2dda5bcd1794e85f7d04ab48986783010a008e
console.log(commitId);
const repo = process.env.GITHUB_REPOSITORY.toString();
const pullnumberFromyml = core.getInput('pull_number');
//const pullnumber = 7;
const commentBody = "This is a comment ***********";
var repoNameWithOwnerArray = repo.split("/", 2); 
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];
console.log(`Hello owner ${owner}!`);
console.log(`Hello  actualRepo ${actualRepo}!`);
console.log(`Hello  pullnumberFromyml ${pullnumberFromyml}!`);
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
    const itemsArray = obj.data.items;
    
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

getPullNumber(commitId, owner, actualRepo, token, commentBody);