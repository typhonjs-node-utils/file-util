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
   const { assert } = chai;

   describe(`Browser / commonPath tests (${data.suitePrefix})`, () =>
   {
      const paths =
      [
         '/this/is/a/test/path/one/file.js',
         '/this/is/a/test/path/one/file2.js',
         '/this/is/a/test/path/two/file3.js',
         '/this/is/a/test/path/two/file4.js',
         '/this/is/a/test/path/three/file5.js',
      ];

      const relativePaths =
      [
         '../../../this/is/a/test/path/one/file.js',
         '../../../this/is/a/test/path/one/file2.js',
         '../../this/is/a/test/path/two/file3.js',
         '../../this/is/a/test/path/two/file4.js',
         '../../this/is/a/test/path/three/file5.js'
      ];

      it(`commonPath - no paths`, () =>
      {
         assert.isUndefined(Module.commonPath());
      });

      it(`commonPath - correct path`, () =>
      {
         assert.strictEqual(Module.commonPath(...paths), '/this/is/a/test/path/');
      });

      it(`commonPath - correct relative path`, () =>
      {
         assert.strictEqual(Module.commonPath(...relativePaths), '../../');
      });

      it(`commonPath - correct single path`, () =>
      {
         assert.strictEqual(Module.commonPath('/a/single/path'), '');
      });

      it(`commonPath - no folders`, () =>
      {
         assert.strictEqual(Module.commonPath('a-single-path-no-folders'), '');
      });
   });

   describe(`Browser / commonMappedPath tests (${data.suitePrefix})`, () =>
   {
      const paths =
      [
         { other: 1, path: '/this/is/a/test/path/one/file.js' },
         { other: 1, path: '/this/is/a/test/path/one/file2.js' },
         { other: 1, path: '/this/is/a/test/path/two/file3.js' },
         { other: 1, path: '/this/is/a/test/path/two/file4.js' },
         { other: 1, path: '/this/is/a/test/path/three/file5.js' }
      ];

      const relativePaths =
      [
         { other: 1, path: '../../../this/is/a/test/path/one/file.js' },
         { other: 1, path: '../../../this/is/a/test/path/one/file2.js' },
         { other: 1, path: '../../this/is/a/test/path/two/file3.js' },
         { other: 1, path: '../../this/is/a/test/path/two/file4.js' },
         { other: 1, path: '../../this/is/a/test/path/three/file5.js' }
      ];

      it(`commonMappedPath - no paths`, () =>
      {
         assert.isUndefined(Module.commonMappedPath('path'));
      });

      it(`commonMappedPath - correct path`, () =>
      {
         assert.strictEqual(Module.commonMappedPath('path', ...paths), '/this/is/a/test/path/');
      });

      it(`commonMappedPath - correct relative path`, () =>
      {
         assert.strictEqual(Module.commonMappedPath('path', ...relativePaths), '../../');
      });

      it(`commonMappedPath - no path`, () =>
      {
         assert.strictEqual(Module.commonMappedPath('path', {}), '');
      });
   });

   describe(`Browser / commonPath tests (${data.suitePrefix})`, () =>
   {
      const paths = [
         '/this/is/a/test/path',               // Case 1 & 3: Shorter path and lexicographically smaller
         '/this/is/a/test/path/one/file.js',   // Case 4: Lexicographically larger path
         '/this/is/a/test/path/one/file2.js',  // Case 5: Equal path
         '/this/is/a/test/path/one/file2.js',  // Case 6: Equal segments but 'a' has fewer segments
         '/this/is/a/test/path/one',           // Case 7: Equal segments but 'b' has fewer segments
         '/this/is/a/test/path/two/file3.js',  // Additional data for more variety
         '/this/is/a/test/path/two/file4.js',
         '/this/is/a/test/path/one/extra/data',
         '/this/is/a/test/path/three/file5.js',
      ];

      const sortedPaths = [
         '/this/is/a/test/path',
         '/this/is/a/test/path/one',
         '/this/is/a/test/path/one/extra/data',
         '/this/is/a/test/path/one/file.js',
         '/this/is/a/test/path/one/file2.js',
         '/this/is/a/test/path/three/file5.js',
         '/this/is/a/test/path/two/file3.js',
         '/this/is/a/test/path/two/file4.js',
      ];

      it(`pathSort - correct sorted paths`, () =>
      {
         assert.deepEqual(Module.pathSort(paths), sortedPaths);
      });
   });
}
