<<<<<<< HEAD
/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
'use strict';

require('babel-polyfill');
const os = require('os');
const webpack = require('webpack');
const electronCfg = require('./webpack.config.electron.js');
const cfg = require('./webpack.config.production.js');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));
const pkg = require('./package.json');
const deps = Object.keys(pkg.dependencies);
const devDeps = Object.keys(pkg.devDependencies);
=======
/* eslint-disable strict, no-shadow, no-unused-vars, no-console */

'use strict';

/** Build file to package the app for release */

require('babel-polyfill');
const os = require('os');
const webpack = require('webpack');
const electronCfg = require('./webpack.config.electron');
const cfg = require('./webpack.config.production');
const packager = require('electron-packager');
const del = require('del');
const exec = require('child_process').exec;
const pkg = require('./package.json');

/**
 * First two values are node path and current script path
 * https://nodejs.org/docs/latest/api/process.html#process_process_argv
 */
const argv = require('minimist')(process.argv.slice(2));

/**
 * Do not package node modules from 'devDependencies'
 * and 'dependencies' that are set as external
 */
const toNodePath = name => `/node_modules/${name}($|/)`;
const devDeps = Object
  .keys(pkg.devDependencies)
  .map(toNodePath);

const depsExternal = Object
  .keys(pkg.dependencies)
  .filter(name => !electronCfg.externals.includes(name))
  .map(toNodePath);

>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3

const appName = argv.name || argv.n || pkg.productName;
const shouldUseAsar = argv.asar || argv.a || false;
const shouldBuildAll = argv.all || false;


const DEFAULT_OPTS = {
  dir: './',
  name: appName,
  asar: shouldUseAsar,
  ignore: [
    '^/test($|/)',
<<<<<<< HEAD
    '^/tools($|/)',
    '^/release($|/)',
    '^/main.development.js'
  ].concat(devDeps.map(name => `/node_modules/${name}($|/)`))
  .concat(
    deps.filter(name => !electronCfg.externals.includes(name))
      .map(name => `/node_modules/${name}($|/)`)
  )
};

const icon = argv.icon || argv.i || 'app/app';

if (icon) {
  DEFAULT_OPTS.icon = icon;
}

const version = argv.version || argv.v;

=======
    '^/release($|/)',
    '^/main.development.js'
  ]
  .concat(devDeps)
  .concat(depsExternal)
};

const icon = argv.icon || argv.i || 'app/app';
if (icon) DEFAULT_OPTS.icon = icon;

const version = argv.version || argv.v;
>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3
if (version) {
  DEFAULT_OPTS.version = version;
  startPack();
} else {
  // use the same version as the currently-installed electron-prebuilt
<<<<<<< HEAD
  exec('npm list electron-prebuilt --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '1.2.0';
    } else {
      DEFAULT_OPTS.version = stdout.split('electron-prebuilt@')[1].replace(/\s/g, '');
=======
  exec('npm list electron --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '1.2.0';
    } else {
      DEFAULT_OPTS.version = stdout.split('electron@')[1].replace(/\s/g, '');
>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3
    }

    startPack();
  });
}


<<<<<<< HEAD
=======
/**
 * @desc Execute the webpack build process on given config object
 * @param {Object} cfg
 * @return {Promise}
 */
>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3
function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) return reject(err);
      resolve(stats);
    });
  });
}

<<<<<<< HEAD
function startPack() {
  console.log('start pack...');
  build(electronCfg)
    .then(() => build(cfg))
    .then(() => del('release'))
    .then(paths => {
      if (shouldBuildAll) {
        // build for all platforms
        const archs = ['ia32', 'x64'];
        const platforms = ['linux', 'win32', 'darwin'];

        platforms.forEach(plat => {
          archs.forEach(arch => {
            pack(plat, arch, log(plat, arch));
          });
        });
      } else {
        // build for current platform only
        pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
      }
    })
    .catch(err => {
      console.error(err);
    });
}

=======

/** @desc Build, clear previous releases and pack new versions */
async function startPack() {
  console.log('start pack...');

  try {
    /**
     * - Build the 'Main process' and 'Renderer Process' files.
     * - Clear the ./release directory
     */
    await build(electronCfg);
    await build(cfg);
    const paths = await del('release');

    // Start the packing process
    if (shouldBuildAll) {
      // build for all platforms
      const archs = ['ia32', 'x64'];
      const platforms = ['linux', 'win32', 'darwin'];

      platforms.forEach(plat => {
        archs.forEach(arch => {
          pack(plat, arch, log(plat, arch));
        });
      });
    } else {
      // build for current platform only
      pack(os.platform(), os.arch(), log(os.platform(), os.arch()));
    }
  } catch (error) {
    console.error(error);
  }
}


/**
 * @desc
 * @param {String} plat
 * @param {String} arch
 * @param {Function} cb
 */
>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3
function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') return;

  const iconObj = {
    icon: DEFAULT_OPTS.icon + (() => {
      let extension = '.png';
<<<<<<< HEAD
      if (plat === 'darwin') {
        extension = '.icns';
      } else if (plat === 'win32') {
        extension = '.ico';
      }
=======
      if (plat === 'darwin') extension = '.icns';
      if (plat === 'win32') extension = '.ico';

>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3
      return extension;
    })()
  };

  const opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
    platform: plat,
    arch,
    prune: true,
    'app-version': pkg.version || DEFAULT_OPTS.version,
    out: `release/${plat}-${arch}`
  });

  packager(opts, cb);
}


<<<<<<< HEAD
=======
/**
 * @desc Log out success / error of building for given platform and architecture
 * @param {String} plat
 * @param {String} arch
 * @return {Function}
 */
>>>>>>> dce208267ef1890cdb3c2af7f944d82b5ab502a3
function log(plat, arch) {
  return (err, filepath) => {
    if (err) return console.error(err);
    console.log(`${plat}-${arch} finished!`);
  };
}
