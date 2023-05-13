import fs                  from 'fs-extra';
import { BrowserRunner }   from '@typhonjs-build-test/node-browser';

fs.ensureDirSync('./coverage-browser');
fs.emptyDirSync('./coverage-browser');

(async () =>
{
   await BrowserRunner.runServerAndTestSuite({ reportDir: './coverage-browser' });

   // Uncomment to keep live server alive; useful when manually testing Firefox, etc.
   // await BrowserRunner.runServerAndTestSuite({
   //    reportDir: './coverage-browser',
   //    keepAlive: true,
   //    stdinLatch: true
   // });
})().catch((err) =>
{
   console.log(err);
   process.exit(1);
});
