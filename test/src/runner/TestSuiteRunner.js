import { TestsuiteRunner }    from '@typhonjs-build-test/testsuite-runner';

import * as APIErrors         from './tests/APIErrors.js';
import * as APIStructure      from './tests/APIStructure.js';
import * as BrowserTests      from './tests/BrowserTests.js';
import * as NodeTests         from './tests/NodeTests.js';

export default new TestsuiteRunner({
   APIStructure,
   APIErrors,
   BrowserTests,
   NodeTests
});
