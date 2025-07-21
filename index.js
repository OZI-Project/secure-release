const core = require('@actions/core');
const { exec } = require('@actions/exec');
const sdist = core.getBooleanInput('sdist');
const debug = core.getBooleanInput('debug');
const oziInternal = core.getBooleanInput('ozi-internal');
if (core.getInput('wheel-sign-token')) {
  core.setSecret(core.getInput('wheel-sign-token'));
  if (debug) core.info('wheel-sign-token will be ignored because user set debug.');
}
const build = async function(){
  var args = [
    '-m',
    'invoke',
    `--search-root=.tox/invoke/tmp/${oziInternal ? 'ozi' : 'subprojects/ozi/ozi'}`,
    'release',
    sdist ? ['--sdist'] : [],
    core.getInput('wheel-sign-token') & !debug ? `--wheel-sign-token=${core.getInput('wheel-sign-token')}` : [],
  ];
  try {
    await exec('python', args.flat(), {silent: !debug});
  } catch (error) {
    core.setFailed(error.message);
  }
}
build()
