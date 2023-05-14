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
   if (data.isBrowser) { return; }

   const { assert } = chai;

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
         'test/fixture/one/B/level-3',
         'test/fixture/two/A/level-3'
      ];

      // Test each path independently with `endsWith`.
      const fixtureDirListOnlyLevel3Resolve = [
         '/file-util/test/fixture/one/B/level-3',
         '/file-util/test/fixture/two/A/level-3'
      ];

      it(`retrieve all directories`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture' }), fixtureDirList);
      });

      it(`excludeDir - regex (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', excludeDir: /level-\d/ }),
          fixtureDirListNoLevel3);
      });

      it(`excludeDir - Set (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', excludeDir: new Set(['level-3']) }),
          fixtureDirListNoLevel3);
      });

      it(`excludeDir - string (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', excludeDir: 'level-3' }),
          fixtureDirListNoLevel3);
      });

      it(`includeDir - regex (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', includeDir: /level-\d/ }),
          fixtureDirListOnlyLevel3);
      });

      it(`includeDir - Set (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', includeDir: new Set(['level-3']) }),
          fixtureDirListOnlyLevel3);
      });

      it(`includeDir - string (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', includeDir: 'level-3' }),
          fixtureDirListOnlyLevel3);
      });

      it(`retrieve level-3 directories and relative ('.')`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', includeDir: 'level-3', relative: '.' }),
          fixtureDirListOnlyLevel3Rel);
      });

      it(`retrieve level-3 directories and resolve`, async () =>
      {
         const results = await Module.getDirList({ dir: './test/fixture', includeDir: 'level-3', resolve: true });

         assert.equal(results.length, fixtureDirListOnlyLevel3Resolve.length);

         // Only test one directory down `/file-util/<path>`.
         for (let cntr = 0; cntr < results.length; cntr++)
         {
            assert.isTrue(results[cntr].endsWith(fixtureDirListOnlyLevel3Resolve[cntr]));
         }
      });

      it(`retrieve all directories - no sort`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', sort: false }), fixtureDirList);
      });

      it(`retrieve all directories - no walk`, async () =>
      {
         assert.deepEqual(await Module.getDirList({ dir: './test/fixture', walk: false }), fixtureDirListOnlyTopLevel);
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
         'test/fixture/one/B/level-3/file-L3-B.extra.txt',
         'test/fixture/one/B/level-3/file-L3-B1.txt',
         'test/fixture/two/A/level-3/file-L3-A.extra.txt',
         'test/fixture/two/A/level-3/file-L3-A1.txt'
      ];

      // Test each path independently with `endsWith`.
      const fixtureFileListOnlyLevel3Resolve = [
         '/file-util/test/fixture/one/B/level-3/file-L3-B.extra.txt',
         '/file-util/test/fixture/one/B/level-3/file-L3-B1.txt',
         '/file-util/test/fixture/two/A/level-3/file-L3-A.extra.txt',
         '/file-util/test/fixture/two/A/level-3/file-L3-A1.txt'
      ];

      it(`retrieve all files`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture' }), fixtureFileList);
      });

      it(`excludeDir - regex (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', excludeDir: /level-\d/ }),
          fixtureFileListNoLevel3);
      });

      it(`excludeDir - Set (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', excludeDir: new Set(['level-3']) }),
          fixtureFileListNoLevel3);
      });

      it(`excludeDir - string (no 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', excludeDir: 'level-3' }),
          fixtureFileListNoLevel3);
      });

      it(`excludeDir - string (not 'A')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', excludeDir: 'A' }),
          fixtureFileListNotADir);
      });

      it(`excludeFile - regex (not '.extra.txt')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', excludeFile: /\.extra\.txt$/ }),
          fixtureFileListNoExtraTxt);
      });

      it(`excludeFile - Set (not 'fileA.txt' or 'fileB.txt')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture',
          excludeFile: new Set(['fileA.txt', 'fileB.txt']) }), fixtureFileListNoFileAOrB);
      });

      it(`excludeFile - string (not 'fileA.txt')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', excludeFile: 'fileA.txt' }),
          fixtureFileListNoFileA);
      });

      it(`includeDir - regex (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', includeDir: /level-\d/ }),
          fixtureFileListOnlyLevel3);
      });

      it(`includeDir - Set (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', includeDir: new Set(['level-3']) }),
          fixtureFileListOnlyLevel3);
      });

      it(`includeDir - string (only 'level-3')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', includeDir: 'level-3' }),
          fixtureFileListOnlyLevel3);
      });

      it(`includeFile - retrieve files ending in '.extra.txt'`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', includeFile: /\.extra\.txt$/ }),
          fixtureFileListEndsWithExtraTxt);
      });

      it(`retrieve level-3 files and relative ('.')`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', includeDir: 'level-3', relative: '.' }),
          fixtureFileListOnlyLevel3Rel);
      });

      it(`retrieve level-3 files and resolve`, async () =>
      {
         const results = await Module.getFileList({ dir: './test/fixture', includeDir: 'level-3', resolve: true });

         assert.equal(results.length, fixtureFileListOnlyLevel3Resolve.length);

         // Only test one directory down `/file-util/<path>`.
         for (let cntr = 0; cntr < results.length; cntr++)
         {
            assert.isTrue(results[cntr].endsWith(fixtureFileListOnlyLevel3Resolve[cntr]));
         }
      });

      it(`retrieve all files - no sort`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture', sort: false }), fixtureFileList);
      });

      it(`retrieve all files in 'one' - no walk`, async () =>
      {
         assert.deepEqual(await Module.getFileList({ dir: './test/fixture/one', walk: false }), ['file1.txt']);
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
         assert.equal(Module.getRelativePath({ basepath: './test/fixture', filepath: './test.js' }), '../../test.js');
      });
   });

   describe(`Node / getURLDirpath tests (${data.suitePrefix})`, () =>
   {
      it(`URL`, () =>
      {
         const result = Module.getURLDirpath(data.filepathURL);

         assert.isTrue(result.endsWith('/test/fixture/one'))
      });

      it(`URL string`, () =>
      {
         const result = Module.getURLDirpath(data.filepathURLString);

         assert.isTrue(result.endsWith('/test/fixture/one'))
      });

      it(`URL + relative path`, () =>
      {
         const result = Module.getURLDirpath(data.filepathURL, '../test.txt');

         assert.isTrue(result.endsWith('/test/fixture/test.txt'))
      });
   });

   describe(`Node / getURLFilepath tests (${data.suitePrefix})`, () =>
   {
      it(`URL`, () =>
      {
         const result = Module.getURLFilepath(data.filepathURL);

         assert.isTrue(result.endsWith('/test/fixture/one/file1.txt'))
      });

      it(`URL string`, () =>
      {
         const result = Module.getURLFilepath(data.filepathURLString);

         assert.isTrue(result.endsWith('/test/fixture/one/file1.txt'))
      });
   });

   describe(`Node / hasFile tests (${data.suitePrefix})`, () =>
   {
      it(`retrieve all files`, async () =>
      {
         assert.isTrue(await Module.hasFile({ dir: './test/fixture' }));
      });

      it(`includeDir - regex (missing 'C')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: './test/fixture', includeDir: /C/ }));
      });

      it(`includeDir - Set (missing 'C')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: './test/fixture', includeDir: new Set(['C']) }));
      });

      it(`includeDir - string (missing 'C')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: './test/fixture', includeDir: 'C' }));
      });

      it(`includeFile - regex (only '.extra.txt')`, async () =>
      {
         assert.isTrue(await Module.hasFile({ dir: './test/fixture', includeFile: /\.extra\.txt$/ }));
      });

      it(`includeFile - regex (only '.bogus.txt')`, async () =>
      {
         assert.isFalse(await Module.hasFile({ dir: './test/fixture', includeFile: /\.bogus\.txt$/ }));
      });
   });

   describe(`Node / isSubpath tests (${data.suitePrefix})`, () =>
   {
      it(`filepath w/ default basepath`, async () =>
      {
         assert.isTrue(await Module.isSubpath({ filepath: './test/fixture/one/file1.txt' }));
      });

      it(`filepath w/ specific basepath`, async () =>
      {
         assert.isTrue(await Module.isSubpath({ basepath: './test/fixture/',
          filepath: './test/fixture/one/file1.txt' }));
      });

      it(`filepath w/ not sub-path`, async () =>
      {
         assert.isFalse(await Module.isSubpath({ basepath: './test/fixture/',
          filepath: './test/bogus.txt' }));
      });
   });
}
