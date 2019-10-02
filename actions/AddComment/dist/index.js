module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(290);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 290:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const Octokit = __webpack_require__(664);
const core = __webpack_require__(502);
const github = __webpack_require__(574);



const octokit = new Octokit({
    auth: '${token}'
});


try {
    const owner = core.getInput('repo').split('/')[0];
    console.log(`Hello ${owner}!`);
    const repo = core.getInput('repo').split('/')[1];
    console.log(`Hello ${repo}!`);
    const pull_number = core.getInput('pull_number');
    console.log(`Hello ${pull_number}!`);
    const body = core.getInput('body');
    console.log(`Hello ${body}!`);
    const commit_id = core.getInput('commit_id');
    console.log(`Hello ${commit_id}!`);
    const path = core.getInput('path');
    console.log(`Hello ${path}!`);
    const position = core.getInput('position');
    console.log(`Hello ${position}!`);
    const token = core.getInput('token');
    console.log(`Hello ${token}`);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}

octokit.pulls.createComment({
    owner: '${owner}',
    repo: '${repo}',
    pull_number: '${pull_number}',
    body: '${body}',
    commit_id: '${commit_id}',
    path: '${path}',
    position: '${position}'
});

/***/ }),

/***/ 502:
/***/ (function() {

eval("require")("@actions/core");


/***/ }),

/***/ 574:
/***/ (function() {

eval("require")("@actions/github");


/***/ }),

/***/ 664:
/***/ (function() {

eval("require")("@octokit/rest");


/***/ })

/******/ });