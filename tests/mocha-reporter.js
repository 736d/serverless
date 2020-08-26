'use strict';

const path = require('path');
const disableServerlessStatsRequests = require('@serverless/test/disable-serverless-stats-requests');
const { _ensureArtifact } = require('../lib/utils/getEnsureArtifact');
const { triggeredDeprecations } = require('../lib/utils/logDeprecation');

disableServerlessStatsRequests(path.resolve(__dirname, '..'));

module.exports = require('@serverless/test/setup/mocha-reporter');

module.exports.deferredRunner.then(runner => {
  runner.on('suite end', suite => {
    if (!suite.parent || !suite.parent.root) return;

    // Ensure to reset memoization on artifacts generation after each test file run.
    // Reason is that homedir is automatically cleaned for each test,
    // therefore eventually built custom resource file is also removed
    _ensureArtifact.clear();
    // Ensure to reset information on triggered deprecations, after each test file is run
    triggeredDeprecations.clear();
  });
});
