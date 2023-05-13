/**
 * Turns an async generator into a Promise for testing.
 *
 * @param asyncGenerator
 *
 * @returns {Promise<void>}
 */
async function asyncGeneratorToPromise(asyncGenerator)
{
   try
   {
      for await (const _ of asyncGenerator) {}
   }
   catch (err)
   {
      // If the generator throws, then re-throw the error to reject the Promise.
      throw err;
   }
}

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
   const { expect } = chai;

   describe(`API Errors - common (${data.suitePrefix})`, () =>
   {
      it(`commonPath - path[0] not string`, () =>
      {
         expect(() => Module.commonPath(false)).to.throw(TypeError, `'paths[0]' is not a string.`);
      });

      it(`commonPath - path[1] not string`, () =>
      {
         expect(() => Module.commonPath('', false)).to.throw(TypeError, `'paths[1]' is not a string.`);
      });

      it(`commonMappedPath - key not string`, () =>
      {
         expect(() => Module.commonMappedPath(false)).to.throw(TypeError, `'key' is not a string.`);
      });

      it(`commonMappedPath - map[0] not object (null)`, () =>
      {
         expect(() => Module.commonMappedPath('', null)).to.throw(TypeError, `'map[0]' is not an object or Map.`);
      });

      it(`commonMappedPath - map[0] not object (false)`, () =>
      {
         expect(() => Module.commonMappedPath('', false)).to.throw(TypeError, `'map[0]' is not an object or Map.`);
      });

      it(`commonMappedPath - map[1] not object (false)`, () =>
      {
         expect(() => Module.commonMappedPath('', {}, false)).to.throw(TypeError, `'map[1]' is not an object or Map.`);
      });

      it(`pathSort - paths is not an Array`, () =>
      {
         expect(() => Module.pathSort(false)).to.throw(TypeError, `'paths' is not an array.`);
      });

      it(`pathSort - sep is not a string`, () =>
      {
         expect(() => Module.pathSort([], false)).to.throw(TypeError, `'sep' is not a string.`);
      });
   });

   if (!data.isBrowser)
   {
      describe(`API Errors - Node (${data.suitePrefix})`, () =>
      {
         it(`getDirList - dir not string`, async () =>
         {
            await expect(Module.getDirList({ dir: false })).to.be.rejectedWith(TypeError,
             `'dir' is not a string.`);
         });

         it(`getDirList - excludeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.getDirList({ excludeDir: false })).to.be.rejectedWith(TypeError,
             `'excludeDir' is not a RegExp, Set, or string.`);
         });

         it(`getDirList - includeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.getDirList({ includeDir: false })).to.be.rejectedWith(TypeError,
             `'includeDir' is not a RegExp, Set, or string.`);
         });

         it(`getDirList - relative is not a string`, async () =>
         {
            await expect(Module.getDirList({ relative: null })).to.be.rejectedWith(TypeError,
             `'relative' is not a string.`);
         });

         it(`getDirList - resolve is a boolean`, async () =>
         {
            await expect(Module.getDirList({ resolve: null })).to.be.rejectedWith(TypeError,
             `'resolve' is not a boolean.`);
         });

         it(`getDirList - sort is a boolean`, async () =>
         {
            await expect(Module.getDirList({ sort: null })).to.be.rejectedWith(TypeError,
             `'sort' is not a boolean.`);
         });


         it(`getFileList - dir not string`, async () =>
         {
            await expect(Module.getFileList({ dir: false })).to.be.rejectedWith(TypeError,
             `'dir' is not a string.`);
         });

         it(`getFileList - excludeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.getFileList({ excludeDir: false })).to.be.rejectedWith(TypeError,
             `'excludeDir' is not a RegExp, Set, or string.`);
         });

         it(`getFileList - excludeFile is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.getFileList({ excludeFile: false })).to.be.rejectedWith(TypeError,
             `'excludeFile' is not a RegExp, Set, or string.`);
         });

         it(`getFileList - includeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.getFileList({ includeDir: false })).to.be.rejectedWith(TypeError,
             `'includeDir' is not a RegExp, Set, or string.`);
         });

         it(`getFileList - includeFile is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.getFileList({ includeFile: false })).to.be.rejectedWith(TypeError,
             `'includeFile' is not a RegExp, Set, or string.`);
         });

         it(`getFileList - resolve is a boolean`, async () =>
         {
            await expect(Module.getFileList({ resolve: null })).to.be.rejectedWith(TypeError,
             `'resolve' is not a boolean.`);
         });

         it(`getFileList - sort is a boolean`, async () =>
         {
            await expect(Module.getFileList({ sort: null })).to.be.rejectedWith(TypeError,
             `'sort' is not a boolean.`);
         });


         it(`getRelativePath - basepath is not a string`, () =>
         {
            expect(() => Module.getRelativePath(false)).to.throw(TypeError, `'basepath' is not a string.`);
         });

         it(`getRelativePath - filepath is not a string`, () =>
         {
            expect(() => Module.getRelativePath('', false)).to.throw(TypeError, `'filepath' is not a string.`);
         });


         it(`getURLDirpath - url is not a string or URL`, () =>
         {
            expect(() => Module.getURLDirpath(false)).to.throw(TypeError, `'url' is not a string or URL.`);
         });


         it(`getURLFilepath - url is not a string or URL`, () =>
         {
            expect(() => Module.getURLFilepath(false)).to.throw(TypeError, `'url' is not a string or URL.`);
         });


         it(`hasFile - dir not string`, async () =>
         {
            await expect(Module.hasFile({ dir: false })).to.be.rejectedWith(TypeError,
             `'dir' is not a string.`);
         });

         it(`hasFile - excludeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.hasFile({ excludeDir: false })).to.be.rejectedWith(TypeError,
             `'excludeDir' is not a RegExp, Set, or string.`);
         });

         it(`hasFile - excludeFile is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.hasFile({ excludeFile: false })).to.be.rejectedWith(TypeError,
             `'excludeFile' is not a RegExp, Set, or string.`);
         });

         it(`hasFile - includeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.hasFile({ includeDir: false })).to.be.rejectedWith(TypeError,
             `'includeDir' is not a RegExp, Set, or string.`);
         });

         it(`hasFile - includeFile is not RegExp, Set, or string`, async () =>
         {
            await expect(Module.hasFile({ includeFile: false })).to.be.rejectedWith(TypeError,
             `'includeFile' is not a RegExp, Set, or string.`);
         });


         it(`walkDir - dir not string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkDir({ dir: false }))).to.be.rejectedWith(
             TypeError, `'dir' is not a string.`);
         });

         it(`walkDir - excludeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkDir({ excludeDir: false }))).to.be.rejectedWith(
             TypeError, `'excludeDir' is not a RegExp, Set, or string.`);
         });

         it(`walkDir - includeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkDir({ includeDir: false }))).to.be.rejectedWith(
             TypeError, `'includeDir' is not a RegExp, Set, or string.`);
         });


         it(`walkFiles - dir not string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkFiles({ dir: false }))).to.be.rejectedWith(
             TypeError, `'dir' is not a string.`);
         });

         it(`walkFiles - excludeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkFiles({ excludeDir: false }))).to.be.rejectedWith(
             TypeError, `'excludeDir' is not a RegExp, Set, or string.`);
         });

         it(`walkFiles - excludeFile is not RegExp, Set, or string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkFiles({ excludeFile: false }))).to.be.rejectedWith(
             TypeError, `'excludeFile' is not a RegExp, Set, or string.`);
         });

         it(`walkFiles - includeDir is not RegExp, Set, or string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkFiles({ includeDir: false }))).to.be.rejectedWith(
             TypeError, `'includeDir' is not a RegExp, Set, or string.`);
         });

         it(`walkFiles - includeFile is not RegExp, Set, or string`, async () =>
         {
            await expect(asyncGeneratorToPromise(Module.walkFiles({ includeFile: false }))).to.be.rejectedWith(
             TypeError, `'includeFile' is not a RegExp, Set, or string.`);
         });
      });
   }
}
