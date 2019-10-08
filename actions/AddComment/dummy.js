
const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");
const { App } = require("@octokit/app");
const { request } = require("@octokit/request");


const id = 42954;
const privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIIEogIBAAKCAQEAoNtO3JhhLbYpq4kjCQPVByACEFDIu84AXNxuNp0r+chkni46\n" +
    "PM7iyjvcEvJcKB5KB5cjrdFTjmv3oHZreVyLcmL5X2HsU0rLN494o+VJhgF0BDeS\n" +
    "W98QMGIJAdcMSxqqJ0tQsGeQCBWusCWZBUotR04SmOoIFNvjr/zeOzeTLJ1Pnr5f\n" +
    "B4q2lJYsj1pVR7DZ9Q2k9Y9XQGCLsXM3zwUBCYoTOR/iGzwjfVQIXjJ43Vq9oSPG\n" +
    "shw2z56JZHWTamZZMpyJYjZQ4pa+bKe5SOXo9kGjRfezenOEfwp9uxiYjs4eeOXE\n" +
    "GskKBl++UftiTUwaE547WjmwedD5KDnHincbzQIDAQABAoIBAGl0fXYHfCYwt47a\n" +
    "oBpn5b//DvtNStw8yGYYqTSqw8rEwpolKk71Px9gMP5G3335pYTmZCCvC/1h8PzE\n" +
    "xd7ReiYqltweYYWVkjbBm1CvoAz3ZOzi1dPfIEjn7InFRyzxtT1/lc2gh3+VX2nh\n" +
    "rDkYkSifGXggbd3m7pVQzQy7eYQUL5Mvisq60tFTnKBshr8DQ6wxkbxOBtcLIZKk\n" +
    "3Lm7R5dYRrS3VrVkwVHf+b8F5DnDBiYvsoQeW4QkHLcfC9rX+825KvIBUvQWC73f\n" +
    "rPhX+A5ybSI0eXx8xbXYi0bq7fX8Do69Mt6j34J2MIkusR8aCqZXXoJNsuepd7G6\n" +
    "G1Y2JS0CgYEA0IUXkJOBbPqlEU9oU5HED37pWyhRAZ8OF2zEi6iAdkNXb5aMrkPo\n" +
    "ZAxCIVKUeIA9zAxidDOG1wdAXyA7WyYJt693zIDl/TbKLaYTGmBxqU8RCNhvT9Oh\n" +
    "d41SpvkxUZA/XvI1NonICfFNA6fzP2g5r9n4pYREjAFxrjGydc4vhVsCgYEAxXvc\n" +
    "t7bx2yaV+VQpO8cDbzZ4MavUnuxbCVXYf2+AW389oczImsRdbQWuWM7VFzpZws6O\n" +
    "07zlhBb/DAtf10QVL8NtncCzwoR/da8BwrMcBWnvbW7Euy+RnCYxEo1096LB5CvO\n" +
    "/xj5hxWX5F7OcJ3Z141tSS2AkPs3EmlICpXGI/cCgYA1OHL+RJe5D/QHigPvqHmp\n" +
    "FtRKnuymBEmdcvZrStOW27M6WOuJIu3ycyqBxMj+RIUBSnvqeqhEw6YLYXek2P2L\n" +
    "824ZNSD+UvihVAz2I31/IB4R6uPmNPa2Q8y/r0SGM9Ho0tsAE4SJ/RuR/lDYcyqe\n" +
    "Fn0fCbZRIaE5O5f392srlwKBgFMq5rk4AoMYrPBj0Tmrhna/qb7Bbrm/MFeuH48L\n" +
    "ljLyUzJg29rR98aCLfqYoIU3vbWc5+mkE8SdKqwX3jT6JzIGS5O0JAA3bLZTDZrB\n" +
    "c3uUMZEUpSVv0xK/wsrdZ/UiRiWhjXtBOVT6cw1qH+atk6CDnxLCZvKn2XmXfQ94\n" +
    "JAnhAoGAMtWIEf51vw7uvspKGPLYHa8skUj1ze31Hscu4DSj0dLo39W7DESuPlY4\n" +
    "pyUCvdy5+wDxJKCiokSxoy59hv+ChBSI3Ftl/0/3B5D6dqxy3J7fb1au8s2rDt/o\n" +
    "B32MPfADFBPFhvv7J1I8zsB4skn3ecTeabL5iD9fmT9dIa4euxM=\n" +
    "-----END RSA PRIVATE KEY-----\n";
    const owner = 's-tuli';
    const repo = 'dev-spaces';
    const app = new App({
        id: id,
        privateKey: privateKey
    });


async function octoKitHandler(id, privateKey, owner, repo) {
    const app = new App({
        id: id,
        privateKey: privateKey
    });
    const installationId =  getInstallationId(app, owner, repo);
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
const installationId = getInstallationId(app, owner, repo);
console.log(`installationId  ${installationId}`);
