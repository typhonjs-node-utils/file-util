/**
 * @param {object}                        opts - Test options
 *
 * @param {import('../../../../types')}   opts.Module - Module to test
 *
 * @param {object}                        opts.data - Extra test data.
 *
 * @param {object}                        opts.chai - Chai
 */
export function run({ Module, data, chai })
{
   const fileTreeDir = './test/fixture/input/file-tree';

   if (data.isBrowser) { return; }

   const { assert, expect } = chai;

   describe(`Node / createReadable / createWritable tests (${data.suitePrefix})`, () =>
   {
      it(`can write then read (not compressed)`, async () =>
      {
         const output = Module.createWritable({ filepath: './test/fixture/output/writable/test.txt' });

         output.write('This is test text.');

         const endPromise = new Promise((resolve, reject) =>
         {
            output.once('finish', resolve);
            output.once('error', reject);
         });

         output.end();
         await endPromise;

         const input = Module.createReadable({ filepath: './test/fixture/output/writable/test.txt' });

         let result = '';

         for await (const chunk of input)
         {
            result += typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
         }

         expect(result).to.equal('This is test text.');
      });

      it(`can write then read (compressed)`, async () =>
      {
         const output = Module.createWritable({
            filepath: './test/fixture/output/writable/test.txt.gz',
            compress: true
         });

         output.write('This is test text.');

         const endPromise = new Promise((resolve, reject) =>
         {
            output.once('end', resolve);
            output.once('error', reject);
         });

         output.end();
         await endPromise;

         const input = Module.createReadable({ filepath: './test/fixture/output/writable/test.txt.gz' });

         let result = '';

         for await (const chunk of input)
         {
            result += typeof chunk === 'string' ? chunk : chunk.toString('utf-8');
         }

         expect(result).to.equal('This is test text.');
      });
   });

   describe(`Node / getDirList tests (${data.suitePrefix})`, () =>
   {
      const fixtureDirList = [
         'one',
         'one/A',
         'one/B',
         'one/B/level-3',
         'two',
         'two/A',
         'two/A/level-3',
         'two/B'
      ];

      const fixtureDirListOnlyTopLevel = [
         'one',
         'two'
      ];

      const fixtureDirListNoLevel3 = [
         'one',
         'one/A',
         'one/B',
         'two',
         'two/A',
         'two/B'
      ];

      const fixtureDirListOnlyLevel3 = [
         'one/B/level-3',
         'two/A/level-3'
      ];

      const fixtureDirListOnlyLevel3Rel = [
         'test/fixture/input/file-tree/one/B/level-3',
         'test/fixture/input/file-tree/two/A/level-3'
      ];

      // Test each path independently with `endsWith`.
      const fixtureDirListOnlyLevel3Resolve = [
         '/file-util/test/fixture/input/file-tree/one/B/level-3',
         '/file-util/test/fixture/input/file-tree/two/A/level-3'
      ];

      it(`retrieve all directories`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, walk: true }), fixtureDirList);
      });

      it(`excludeDir - regex (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, excludeDir: /level-\d/, walk: true }),
          fixtureDirListNoLevel3);
      });

      it(`excludeDir - Set (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, excludeDir: new Set(['level-3']),
          walk: true }), fixtureDirListNoLevel3);
      });

      it(`excludeDir - string (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, excludeDir: 'level-3', walk: true }),
          fixtureDirListNoLevel3);
      });

      it(`includeDir - regex (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, includeDir: /level-\d/, walk: true }),
          fixtureDirListOnlyLevel3);
      });

      it(`includeDir - Set (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, includeDir: new Set(['level-3']),
          walk: true }), fixtureDirListOnlyLevel3);
      });

      it(`includeDir - string (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, includeDir: 'level-3', walk: true }),
          fixtureDirListOnlyLevel3);
      });

      it(`retrieve level-3 directories and relative ('.')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir, includeDir: 'level-3', relative: '.',
          walk: true }), fixtureDirListOnlyLevel3Rel);
      });

      it(`retrieve level-3 directories and resolve`, async () =>
      {
         const results = await Module.getDirList({ dir: fileTreeDir, includeDir: 'level-3', resolve: true,
          walk: true });

         assert.equal(results.length, fixtureDirListOnlyLevel3Resolve.length);

         // Only test one directory down `/file-util/<path>`.
         for (let cntr = 0; cntr < results.length; cntr++)
         {
            assert.isTrue(results[cntr].endsWith(fixtureDirListOnlyLevel3Resolve[cntr]));
         }
      });

      it(`retrieve all directories - no sort`, async () =>
      {
         // Not all OSes will return the same order of files so test against a set.
         const dirListSet = new Set(fixtureDirList);

         const dirList = await Module.getDirList({ dir: fileTreeDir, sort: false, walk: true });

         assert.equal(dirListSet.size, dirList.length);

         for (const entry of dirList) { assert.isTrue(dirListSet.has(entry)); }
      });

      it(`retrieve all directories - no walk`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: fileTreeDir }), fixtureDirListOnlyTopLevel);
      });
   });

   describe(`Node / getFileList tests (${data.suitePrefix})`, () =>
   {
      const fixtureFileList = [
         'one/A/fileA.txt',
         'one/A/fileA1.txt',
         'one/A/fileA2.txt',
         'one/B/fileB.txt',
         'one/B/fileB1.txt',
         'one/B/level-3/file-L3-B.extra.txt',
         'one/B/level-3/file-L3-B1.txt',
         'one/file1.txt',
         'two/A/fileA.txt',
         'two/A/fileA1.txt',
         'two/A/fileA2.txt',
         'two/A/level-3/file-L3-A.extra.txt',
         'two/A/level-3/file-L3-A1.txt',
         'two/B/fileB1.txt',
         'two/file2.txt'
      ];

      const fixtureFileListNotADir = [
         'one/B/fileB.txt',
         'one/B/fileB1.txt',
         'one/B/level-3/file-L3-B.extra.txt',
         'one/B/level-3/file-L3-B1.txt',
         'one/file1.txt',
         'two/B/fileB1.txt',
         'two/file2.txt'
      ];

      const fixtureFileListNoLevel3 = [
         'one/A/fileA.txt',
         'one/A/fileA1.txt',
         'one/A/fileA2.txt',
         'one/B/fileB.txt',
         'one/B/fileB1.txt',
         'one/file1.txt',
         'two/A/fileA.txt',
         'two/A/fileA1.txt',
         'two/A/fileA2.txt',
         'two/B/fileB1.txt',
         'two/file2.txt'
      ];

      const fixtureFileListOnlyLevel3 = [
         'one/B/level-3/file-L3-B.extra.txt',
         'one/B/level-3/file-L3-B1.txt',
         'two/A/level-3/file-L3-A.extra.txt',
         'two/A/level-3/file-L3-A1.txt'
      ];

      const fixtureFileListEndsWithExtraTxt = [
         'one/B/level-3/file-L3-B.extra.txt',
         'two/A/level-3/file-L3-A.extra.txt'
      ];

      const fixtureFileListNoFileA = [
         'one/A/fileA1.txt',
         'one/A/fileA2.txt',
         'one/B/fileB.txt',
         'one/B/fileB1.txt',
         'one/B/level-3/file-L3-B.extra.txt',
         'one/B/level-3/file-L3-B1.txt',
         'one/file1.txt',
         'two/A/fileA1.txt',
         'two/A/fileA2.txt',
         'two/A/level-3/file-L3-A.extra.txt',
         'two/A/level-3/file-L3-A1.txt',
         'two/B/fileB1.txt',
         'two/file2.txt'
      ];

      const fixtureFileListNoFileAOrB = [
         'one/A/fileA1.txt',
         'one/A/fileA2.txt',
         'one/B/fileB1.txt',
         'one/B/level-3/file-L3-B.extra.txt',
         'one/B/level-3/file-L3-B1.txt',
         'one/file1.txt',
         'two/A/fileA1.txt',
         'two/A/fileA2.txt',
         'two/A/level-3/file-L3-A.extra.txt',
         'two/A/level-3/file-L3-A1.txt',
         'two/B/fileB1.txt',
         'two/file2.txt'
      ];

      const fixtureFileListNoExtraTxt = [
         'one/A/fileA.txt',
         'one/A/fileA1.txt',
         'one/A/fileA2.txt',
         'one/B/fileB.txt',
         'one/B/fileB1.txt',
         'one/B/level-3/file-L3-B1.txt',
         'one/file1.txt',
         'two/A/fileA.txt',
         'two/A/fileA1.txt',
         'two/A/fileA2.txt',
         'two/A/level-3/file-L3-A1.txt',
         'two/B/fileB1.txt',
         'two/file2.txt'
      ];

      const fixtureFileListOnlyLevel3Rel = [
         'test/fixture/input/file-tree/one/B/level-3/file-L3-B.extra.txt',
         'test/fixture/input/file-tree/one/B/level-3/file-L3-B1.txt',
         'test/fixture/input/file-tree/two/A/level-3/file-L3-A.extra.txt',
         'test/fixture/input/file-tree/two/A/level-3/file-L3-A1.txt'
      ];

      // Test each path independently with `endsWith`.
      const fixtureFileListOnlyLevel3Resolve = [
         '/file-util/test/fixture/input/file-tree/one/B/level-3/file-L3-B.extra.txt',
         '/file-util/test/fixture/input/file-tree/one/B/level-3/file-L3-B1.txt',
         '/file-util/test/fixture/input/file-tree/two/A/level-3/file-L3-A.extra.txt',
         '/file-util/test/fixture/input/file-tree/two/A/level-3/file-L3-A1.txt'
      ];

      it(`retrieve all files`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, walk: true }), fixtureFileList);
      });

      it(`excludeDir - regex (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, excludeDir: /level-\d/, walk: true }),
          fixtureFileListNoLevel3);
      });

      it(`excludeDir - Set (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, excludeDir: new Set(['level-3']),
          walk: true }), fixtureFileListNoLevel3);
      });

      it(`excludeDir - string (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, excludeDir: 'level-3', walk: true }),
          fixtureFileListNoLevel3);
      });

      it(`excludeDir - string (not 'A')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, excludeDir: 'A', walk: true }),
          fixtureFileListNotADir);
      });

      it(`excludeFile - regex (not '.extra.txt')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, excludeFile: /\.extra\.txt$/, walk: true }),
          fixtureFileListNoExtraTxt);
      });

      it(`excludeFile - Set (not 'fileA.txt' or 'fileB.txt')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir,
          excludeFile: new Set(['fileA.txt', 'fileB.txt']), walk: true }), fixtureFileListNoFileAOrB);
      });

      it(`excludeFile - string (not 'fileA.txt')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, excludeFile: 'fileA.txt', walk: true }),
          fixtureFileListNoFileA);
      });

      it(`includeDir - regex (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, includeDir: /level-\d/, walk: true }),
          fixtureFileListOnlyLevel3);
      });

      it(`includeDir - Set (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, includeDir: new Set(['level-3']),
          walk: true }), fixtureFileListOnlyLevel3);
      });

      it(`includeDir - string (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, includeDir: 'level-3', walk: true }),
          fixtureFileListOnlyLevel3);
      });

      it(`includeFile - retrieve files ending in '.extra.txt'`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, includeFile: /\.extra\.txt$/, walk: true }),
          fixtureFileListEndsWithExtraTxt);
      });

      it(`retrieve level-3 files and relative ('.')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: fileTreeDir, includeDir: 'level-3', relative: '.',
          walk: true }), fixtureFileListOnlyLevel3Rel);
      });

      it(`retrieve level-3 files and resolve`, async () =>
      {
         const results = await Module.getFileList({ dir: fileTreeDir, includeDir: 'level-3', resolve: true,
          walk: true });

         assert.equal(results.length, fixtureFileListOnlyLevel3Resolve.length);

         // Only test one directory down `/file-util/<path>`.
         for (let cntr = 0; cntr < results.length; cntr++)
         {
            assert.isTrue(results[cntr].endsWith(fixtureFileListOnlyLevel3Resolve[cntr]));
         }
      });

      it(`retrieve all files - no sort`, async () =>
      {
         // We don't test a specific result as there are variations across OSes in native file order.
         assert.isDefined(await Module.getFileList({ dir: fileTreeDir, sort: false, walk: true }));
      });

      it(`retrieve all files in 'one' - no walk`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: `${fileTreeDir}/one` }), ['file1.txt']);
      });
   });

   describe(`Node / getRelativePath tests (${data.suitePrefix})`, () =>
   {
      it(`filepath - is relative`, async () =>
      {
         assert.equal(Module.getRelativePath({ filepath: './test.js' }), 'test.js');
      });

      it(`filepath - is level below`, async () =>
      {
         assert.equal(Module.getRelativePath({ filepath: '../test.js' }), '../test.js');
      });

      it(`filepath - w/ basepath`, async () =>
      {
         assert.equal(Module.getRelativePath({ basepath: fileTreeDir, filepath: './test.js' }), '../../../../test.js');
      });
   });

   describe(`Node / getURLDirpath tests (${data.suitePrefix})`, () =>
   {
      it(`URL`, () =>
      {
         const result = Module.getURLDirpath(data.filepathURL);

         assert.isTrue(result.endsWith('/test/fixture/one'));
      });

      it(`URL string`, () =>
      {
         const result = Module.getURLDirpath(data.filepathURLString);

         assert.isTrue(result.endsWith('/test/fixture/one'));
      });

      it(`URL + relative path`, () =>
      {
         const result = Module.getURLDirpath(data.filepathURL, '../test.txt');

         assert.isTrue(result.endsWith('/test/fixture/test.txt'));
      });
   });

   describe(`Node / getURLFilepath tests (${data.suitePrefix})`, () =>
   {
      it(`URL`, () =>
      {
         const result = Module.getURLFilepath(data.filepathURL);

         assert.isTrue(result.endsWith('/test/fixture/one/file1.txt'));
      });

      it(`URL string`, () =>
      {
         const result = Module.getURLFilepath(data.filepathURLString);

         assert.isTrue(result.endsWith('/test/fixture/one/file1.txt'));
      });
   });

   describe(`Node / hasFile tests (${data.suitePrefix})`, () =>
   {
      it(`retrieve all files`, async () =>
      {
         assert.isTrue(await Module.hasFile({ dir: fileTreeDir }));
      });

      it(`includeDir - regex (missing 'C')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: fileTreeDir, includeDir: /C/ }));
      });

      it(`includeDir - Set (missing 'C')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: fileTreeDir, includeDir: new Set(['C']) }));
      });

      it(`includeDir - string (missing 'C')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: fileTreeDir, includeDir: 'C' }));
      });

      it(`includeFile - regex (only '.extra.txt')`, async () =>
      {
         assert.isTrue(await Module.hasFile({ dir: fileTreeDir, includeFile: /\.extra\.txt$/ }));
      });

      it(`includeFile - regex (only '.bogus.txt')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: fileTreeDir, includeFile: /\.bogus\.txt$/ }));
      });
   });

   describe(`Node / isDirectory tests (${data.suitePrefix})`, () =>
   {
      it(`valid directory path`, () => assert.isTrue(Module.isDirectory(fileTreeDir)));

      it(`invalid directory path`, () => assert.isFalse(Module.isDirectory(`${fileTreeDir}/one/file1.txt`)));

      it(`invalid directory path from bad data`, () => assert.isFalse(Module.isDirectory(null)));
   });

   describe(`Node / isFile tests (${data.suitePrefix})`, () =>
   {
      it(`valid file path`, () => assert.isTrue(Module.isFile(`${fileTreeDir}/one/file1.txt`)));

      it(`invalid file path`, () => assert.isFalse(Module.isFile(fileTreeDir)));

      it(`invalid directory path from bad data`, () => assert.isFalse(Module.isFile(null)));
   });

   describe(`Node / isFileGzip tests (${data.suitePrefix})`, () =>
   {
      it(`invalid file path`, () => assert.isFalse(Module.isFileGzip(null)));
   });

   describe(`Node / isSubpath tests (${data.suitePrefix})`, () =>
   {
      it(`filepath w/ default basepath`, async () =>
      {
         assert.isTrue(await Module.isSubpath({ filepath: `${fileTreeDir}/one/file1.txt` }));
      });

      it(`filepath w/ specific basepath`, async () =>
      {
         assert.isTrue(await Module.isSubpath({ basepath: fileTreeDir,
          filepath: `${fileTreeDir}/one/file1.txt` }));
      });

      it(`filepath w/ not sub-path`, async () =>
      {
         assert.isFalse(await Module.isSubpath({ basepath: fileTreeDir,
          filepath: './test/bogus.txt' }));
      });
   });
}
