const { graphql } = require("@octokit/graphql");
const  token = '8cfd725860dcb1c9833fc8ccfa4d7a9bbbe8eb80';
const Octokit = require("@octokit/rest");

// function graphqlWithAuth(token) {
//     return graphql.defaults({
//         headers: {
//             authorization: `token ${token}`
//         }
//     });
// }



function findPullRequestSubjectIdAndAddCommentToThatPullRequest(owner, repo, token) {
    const  graphqlWithAuth =  graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
    let findPullRequestIdQuery = `query FindPullRequestID ($owner: String!, $repo: String!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:3) {
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
findPullRequestSubjectIdAndAddCommentToThatPullRequest('caneesh', 'git-action-1', "8cfd725860dcb1c9833fc8ccfa4d7a9bbbe8eb80");