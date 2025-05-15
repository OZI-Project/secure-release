const core = require('@actions/core');
const { exec } = require('@actions/exec');

if (core.getInput('wheel-sign-token')) {
  core.setSecret(core.getInput('wheel-sign-token'));
}
const build = async function(){
  var args = [
    '-m',
    'invoke',
    `--search-root=.tox/invoke/tmp/${core.getBooleanInput('ozi-internal') ? 'ozi' : 'subprojects/ozi/ozi'}`,
    'release',
    core.getBooleanInput('sdist') ? ['--sdist'] : [],
    core.getInput('wheel-sign-token') ? `--wheel-sign-token=${core.getInput('wheel-sign-token')}` : [],
  ];
  try {
    await exec('python', args.flat(), {silent: true});
  } catch (error) {
    core.setFailed(error.message);
  }
}
build()
