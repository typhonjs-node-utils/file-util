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

   describe(`API Structure (${data.suitePrefix})`, () =>
   {
      it(`has commonPath`, () => assert.typeOf(Module.commonPath, 'function'));
      it(`has commonMappedPath`, () => assert.typeOf(Module.commonMappedPath, 'function'));
      it(`has pathSort`, () => assert.typeOf(Module.pathSort, 'function'));

      if (!data.isBrowser)
      {
         it(`has getDirList`, () => assert.typeOf(Module.getDirList, 'function'));
         it(`has getFileList`, () => assert.typeOf(Module.getFileList, 'function'));
         it(`has getRelativePath`, () => assert.typeOf(Module.getRelativePath, 'function'));
         it(`has getURLDirpath`, () => assert.typeOf(Module.getURLDirpath, 'function'));
         it(`has getURLFilepath`, () => assert.typeOf(Module.getURLFilepath, 'function'));
         it(`has hasFile`, () => assert.typeOf(Module.hasFile, 'function'));
         it(`has walkDir`, () => assert.typeOf(Module.walkDir, 'function'));
         it(`has walkFiles`, () => assert.typeOf(Module.walkFiles, 'function'));
      }
   });
}
