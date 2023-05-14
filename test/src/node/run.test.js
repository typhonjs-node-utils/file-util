import path             from 'node:path';
import url              from 'node:url';

import fs               from 'fs-extra';

import * as Module      from '../../../src/index.js';

import TestSuiteRunner  from '../runner/TestSuiteRunner.js';

fs.ensureDirSync('./.nyc_output');
fs.emptyDirSync('./.nyc_output');

fs.ensureDirSync('./coverage');
fs.emptyDirSync('./coverage');

const filepathURL = url.pathToFileURL(path.resolve('./test/fixture/one/file1.txt'));

const data = {
   suitePrefix: 'node',
   isBrowser: false,
   filepathURL,
   filepathURLString: filepathURL.toString()
};

TestSuiteRunner.run({ Module, data });
