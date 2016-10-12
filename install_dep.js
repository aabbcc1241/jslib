/* base on : http://stackoverflow.com/a/38577379 */

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const root = process.cwd();
npm_install_recursive(root);

function npm_install_recursive(folder) {
  const has_package_json = fs.existsSync(path.join(folder, 'package.json'));
  const has_install_dep = fs.existsSync(path.join(folder, 'install_dep.js'));

  // if (!has_package_json && path.basename(folder) !== 'code') {
  //   return;
  // }

  var child_folder = path.relative(root, folder);

  // Since this script is intended to be run as a "preinstall" command,
  // skip the root folder, because it will be `npm install`ed in the end.
  if (folder !== root && has_package_json) {
    console.log('===================================================================');
    console.log(`Performing "npm install" inside ${folder === root ? 'root folder' : './' + child_folder}`);
    console.log('===================================================================');

    npm_install(folder)
  }

  // skip dist and build
  if (child_folder == 'build' || child_folder == 'dist')
    return;

  // skip duplicated install
  if (!(has_package_json && has_install_dep && folder != root)) {
    for (let subfolder of subfolders(folder)) {
      npm_install_recursive(subfolder)
    }
  }
}

function npm_install(where) {
  child_process.execSync('npm install', {cwd: where, env: process.env, stdio: 'inherit'})
}

function subfolders(folder) {
  return fs.readdirSync(folder)
    .filter(subfolder => fs.statSync(path.join(folder, subfolder)).isDirectory())
    .filter(subfolder => subfolder !== 'node_modules' && subfolder[0] !== '.')
    .map(subfolder => path.join(folder, subfolder))
}
