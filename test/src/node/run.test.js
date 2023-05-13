import fs               from 'fs-extra';

import * as Module      from '../../../src/index.js';

import TestSuiteRunner  from '../runner/TestSuiteRunner.js';

fs.ensureDirSync('./.nyc_output');
fs.emptyDirSync('./.nyc_output');

fs.ensureDirSync('./coverage');
fs.emptyDirSync('./coverage');

const data = {
   suitePrefix: 'node',
   isBrowser: false,
};

TestSuiteRunner.run({ Module, data });
