import fs                from 'node:fs';
import { fileURLToPath } from 'node:url';

import upath             from 'upath';

import { pathSort }      from './functions-browser.js';

/**
 * Provides a few utility functions to work with files / directories.
 */

/**
 * Returns an array of all absolute directory paths found from walking the directory indicated.
 *
 * @param {object}            [options] - An options object.
 *
 * @param {string}            [options.dir='.'] - Directory to walk; default is CWD.
 *
 * @param {ConditionTest}     [options.excludeDir] - A {@link ConditionTest} defining directory names to exclude.
 *
 * @param {ConditionTest}     [options.includeDir] - A {@link ConditionTest} defining directory names to include.
 *
 * @param {string}            [options.relative] - A specific relative path to solve against.
 *
 * @param {boolean}           [options.resolve=false] - When true paths will be fully resolved. Note: this takes
 *        precedence over any defined relative path.
 *
 * @param {boolean}           [options.sort=true] - Sort output array.
 *
 * @param {boolean}           [options.walk=true] - When true subdirectories are walked.
 *
 * @returns {Promise<string[]>} An array of directories.
 */
export async function getDirList({ dir = '.', excludeDir, includeDir, relative, resolve = false, sort = true,
 walk = true } = {})
{
   if (typeof dir !== 'string') { throw new TypeError(`'dir' is not a string.`); }

   if (!verifyConditionTest(excludeDir)) { throw new TypeError(`'excludeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeDir)) { throw new TypeError(`'includeDir' is not a RegExp, Set, or string.`); }

   if (relative !== void 0 && typeof relative !== 'string') { throw new TypeError(`'relative' is not a string.`); }
   if (typeof resolve !== 'boolean') { throw new TypeError(`'resolve' is not a boolean.`); }
   if (typeof sort !== 'boolean') { throw new TypeError(`'sort' is not a boolean.`); }
   if (typeof walk !== 'boolean') { throw new TypeError(`'walk' is not a boolean.`); }

   const results = [];

   if (resolve)
   {
      for await (const p of walkDir({ dir, excludeDir, includeDir, walk })) { results.push(upath.resolve(p)); }
   }
   else // Handle relative case.
   {
      const source = typeof relative === 'string' ? relative : dir;

      for await (const p of walkDir({ dir, excludeDir, includeDir, walk })) { results.push(upath.relative(source, p)); }
   }

   return sort ? pathSort(results) : results;
}

/**
 * Returns an array of all absolute file paths found from walking the directory tree indicated.
 *
 * @param {object}         [options] - An options object.
 *
 * @param {string}         [options.dir='.'] - Directory to walk; default is CWD.
 *
 * @param {ConditionTest}  [options.excludeDir] - A {@link ConditionTest} defining directory names to exclude.
 *
 * @param {ConditionTest}  [options.excludeFile] - A {@link ConditionTest} defining file names to exclude.
 *
 * @param {ConditionTest}  [options.includeDir] - A {@link ConditionTest} defining directory names to include.
 *
 * @param {ConditionTest}  [options.includeFile] - A {@link ConditionTest} defining file names to include.
 *
 * @param {string}         [options.relative] - A specific relative path to solve against.
 *
 * @param {boolean}        [options.resolve=false] - When true paths will be fully resolved. Provide a string and
 *        paths will be resolved against that string as a path.
 *
 * @param {boolean}        [options.sort=true] - Sort output array.
 *
 * @param {boolean}        [options.walk=true] - When true subdirectories are walked.
 *
 * @returns {Promise<string[]>} An array of resolved file paths.
 */
export async function getFileList({ dir = '.', excludeDir, excludeFile, includeDir, includeFile, relative,
 resolve = false, sort = true, walk = true } = {})
{
   if (typeof dir !== 'string') { throw new TypeError(`'dir' is not a string.`); }

   if (!verifyConditionTest(excludeDir)) { throw new TypeError(`'excludeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(excludeFile)) { throw new TypeError(`'excludeFile' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeDir)) { throw new TypeError(`'includeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeFile)) { throw new TypeError(`'includeFile' is not a RegExp, Set, or string.`); }

   if (relative !== void 0 && typeof relative !== 'string') { throw new TypeError(`'relative' is not a string.`); }
   if (typeof resolve !== 'boolean') { throw new TypeError(`'resolve' is not a boolean.`); }
   if (typeof sort !== 'boolean') { throw new TypeError(`'sort' is not a boolean.`); }
   if (typeof walk !== 'boolean') { throw new TypeError(`'walk' is not a boolean.`); }

   const results = [];

   if (resolve)
   {
      for await (const p of walkFiles({ dir, excludeDir, excludeFile, includeDir, includeFile, walk }))
      {
         results.push(upath.resolve(p));
      }
   }
   else
   {
      const source = typeof relative === 'string' ? relative : dir;

      for await (const p of walkFiles({ dir, excludeDir, excludeFile, includeDir, includeFile, walk }))
      {
         results.push(upath.relative(source, p));
      }
   }

   return sort ? pathSort(results) : results;
}

/**
 * Given a base path and a file path this method will return a relative path if the file path includes the base
 * path otherwise the full absolute file path is returned.
 *
 * @param {object}   options - Options
 *
 * @param {string}   [options.basepath] - The base path to create a relative path from `filepath`; default is CWD.
 *
 * @param {string}   options.filepath - The path to solve from `basepath`.
 *
 * @returns {string} A relative path based on `basePath` and `filePath`. (Unix)
 */
export function getRelativePath({ basepath = '.', filepath } = {})
{
   if (typeof basepath !== 'string') { throw new TypeError(`'basepath' is not a string.`); }
   if (typeof filepath !== 'string') { throw new TypeError(`'filepath' is not a string.`); }

   return upath.toUnix(upath.relative(basepath, filepath));
}

/**
 * Convenience method to covert a file URL into the file path of the directory
 *
 * @param {string | URL} url - A file URL
 *
 * @param {...string} resolvePaths - An optional list of paths to resolve against the dir path.
 *
 * @returns {string} A file path based on `url` and any `resolvePaths`. With no `resolvePaths` returns the URL
 *          directory path.
 */
export function getURLDirpath(url, ...resolvePaths)
{
   if (typeof url !== 'string' && !(url instanceof URL)) { throw new TypeError(`'url' is not a string or URL.`); }

   return upath.resolve(upath.dirname(fileURLToPath(url)), ...resolvePaths);
}

/**
 * Convenience method to convert a file URL into a file path.
 *
 * @param {string | URL} url - A file URL
 *
 * @returns {string} A file path from `url`.
 */
export function getURLFilepath(url)
{
   if (typeof url !== 'string' && !(url instanceof URL)) { throw new TypeError(`'url' is not a string or URL.`); }

   return upath.toUnix(fileURLToPath(url));
}

/**
 * Searches all files from starting directory skipping any directories in `skipDir` and those starting with `.`
 * in an attempt to locate a Babel configuration file. If a Babel configuration file is found `true` is
 * immediately returned.
 *
 * @param {object}         [options] - Options object.
 *
 * @param {string}         [options.dir='.'] - The directory to start walking; default is CWD / `.`.
 *
 * @param {ConditionTest}  [options.excludeDir] - A {@link ConditionTest} defining directory names to exclude.
 *
 * @param {ConditionTest}  [options.excludeFile] - A {@link ConditionTest} defining file names to exclude.
 *
 * @param {ConditionTest}  [options.includeDir] - A {@link ConditionTest} defining directory names to include.
 *
 * @param {ConditionTest}  [options.includeFile] - A {@link ConditionTest} defining file names to include.
 *
 * @param {boolean}        [options.walk=true] - When true subdirectories are walked.
 *
 * @returns {Promise<boolean>} Whether a file passes the condition tests provided.
 */
export async function hasFile({ dir = '.', excludeDir, excludeFile, includeDir, includeFile, walk = true } = {})
{
   if (typeof dir !== 'string') { throw new TypeError(`'dir' is not a string.`); }

   if (!verifyConditionTest(excludeDir)) { throw new TypeError(`'excludeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(excludeFile)) { throw new TypeError(`'excludeFile' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeDir)) { throw new TypeError(`'includeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeFile)) { throw new TypeError(`'includeFile' is not a RegExp, Set, or string.`); }

   if (typeof walk !== 'boolean') { throw new TypeError(`'walk' is not a boolean.`); }

   const results = [];

   for await (const p of walkFiles({ dir, excludeDir, excludeFile, includeDir, includeFile, walk }))
   {
      results.push(p);
   }

   // Based on the condition tests if any results are returned then the file specified exists.
   return results.length > 1;
}

/**
 * Returns whether the given filepath is a sub-path to the given base path.
 *
 * @param {object}   options - Options.
 *
 * @param {string}   [options.basepath] - The base path to test against `filepath`; default is CWD.
 *
 * @param {string}   options.filepath - The path to test from `basepath`.
 *
 * @returns {boolean} Is `filepath` a sub-path of `basepath`.
 */
export function isSubpath({ basepath = '.', filepath } = {})
{
   if (typeof basepath !== 'string') { throw new TypeError(`'basepath' is not a string.`); }
   if (typeof filepath !== 'string') { throw new TypeError(`'filepath' is not a string.`); }

   // Normalize and resolve paths to get absolute paths.
   const absoluteBasepath = upath.resolve(upath.normalize(basepath));
   const absolutePath = upath.resolve(upath.normalize(filepath));

   // Check if absolutePath starts with absoluteBasepath.
   return absolutePath.startsWith(absoluteBasepath);
}

/**
 * A generator function that walks the local file tree.
 *
 * @param {object}         [options] - Options.
 *
 * @param {string}         [options.dir='.'] - The directory to start walking; default is CWD / `.`.
 *
 * @param {ConditionTest}  [options.excludeDir] - A {@link ConditionTest} defining directory names to exclude.
 *
 * @param {ConditionTest}  [options.includeDir] - A {@link ConditionTest} defining directory names to include.
 *
 * @param {boolean}        [options.walk=true] - When true subdirectories are walked.
 *
 * @returns {AsyncGenerator<string, void, unknown>} Generator
 * @yields {string}
 */
export async function *walkDir({ dir = '.', excludeDir, includeDir, walk = true } = {})
{
   if (typeof dir !== 'string') { throw new TypeError(`'dir' is not a string.`); }

   if (!verifyConditionTest(excludeDir)) { throw new TypeError(`'excludeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeDir)) { throw new TypeError(`'includeDir' is not a RegExp, Set, or string.`); }

   if (typeof walk !== 'boolean') { throw new TypeError(`'walk' is not a boolean.`); }

   for await (const d of await fs.promises.opendir(dir))
   {
      let yieldEntry = true;

      // Skip directories.
      if (d.isDirectory())
      {
         // Skip default navigation directories / sanity case.
         /* c8 ignore next 1 */
         if (d.name === '.' || d.name === '..') { continue; }

         if (excludeDir && testCondition(excludeDir, d.name)) { continue; }
         if (includeDir && !testCondition(includeDir, d.name)) { yieldEntry = false; }
      }

      const entry = upath.join(dir, d.name);

      if (d.isDirectory())
      {
         if (yieldEntry) { yield entry; }
         if (walk) { yield* walkDir({ dir: entry, excludeDir, includeDir }); }
      }
   }
}

/**
 * A generator function that walks the local file tree.
 *
 * @param {object}         [options] - Options.
 *
 * @param {string}         [options.dir='.'] - The directory to start walking; default is CWD / `.`.
 *
 * @param {ConditionTest}  [options.excludeDir] - A {@link ConditionTest} defining directory names to exclude.
 *
 * @param {ConditionTest}  [options.excludeFile] - A {@link ConditionTest} defining file names to exclude.
 *
 * @param {ConditionTest}  [options.includeDir] - A {@link ConditionTest} defining directory names to include.
 *
 * @param {ConditionTest}  [options.includeFile] - A {@link ConditionTest} defining file names to include.
 *
 * @param {boolean}        [options.walk=true] - When true subdirectories are walked.
 *
 * @returns {AsyncGenerator<string, void, unknown>} Generator
 * @yields {string}
 */
export async function *walkFiles({ dir = '.', excludeDir, excludeFile, includeDir, includeFile, walk = true } = {})
{
   if (typeof dir !== 'string') { throw new TypeError(`'dir' is not a string.`); }

   if (!verifyConditionTest(excludeDir)) { throw new TypeError(`'excludeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(excludeFile)) { throw new TypeError(`'excludeFile' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeDir)) { throw new TypeError(`'includeDir' is not a RegExp, Set, or string.`); }
   if (!verifyConditionTest(includeFile)) { throw new TypeError(`'includeFile' is not a RegExp, Set, or string.`); }

   if (typeof walk !== 'boolean') { throw new TypeError(`'walk' is not a boolean.`); }

   for await (const d of await fs.promises.opendir(dir))
   {
      const entry = upath.join(dir, d.name);

      if (d.isDirectory())
      {
         // Skip default navigation directories / sanity case.
         /* c8 ignore next 1 */
         if (d.name === '.' || d.name === '..') { continue; }

         if (excludeDir && testCondition(excludeDir, d.name)) { continue; }

         if (walk) { yield* walkFiles({ dir: entry, excludeDir, excludeFile, includeDir, includeFile }); }
      }
      else if (d.isFile())
      {
         let yieldEntry = true;

         const dirBasename = upath.basename(dir);

         if (includeDir && !testCondition(includeDir, dirBasename)) { yieldEntry = false; }

         if (excludeFile && testCondition(excludeFile, d.name)) { yieldEntry = false; }
         if (includeFile && !testCondition(includeFile, d.name)) { yieldEntry = false; }

         if (yieldEntry) { yield entry; }
      }
   }
}

// Module private helper functions -----------------------------------------------------------------------------------

/**
 * @param {ConditionTest}  condition - Condition to test.
 *
 * @param {string}         value - Value to test against condition.
 *
 * @returns {boolean} If the value passes the condition.
 */
function testCondition(condition, value)
{
   if (typeof condition === 'string' && value === condition) { return true; }
   if (condition instanceof Set && condition.has(value)) { return true; }
   if (condition instanceof RegExp && condition.test(value)) { return true; }

   return false;
}

/**
 * @param {ConditionTest}  condition - A condition test to verify.
 *
 * @returns {boolean} True if the condition is define and is a RegExp, Set, or string.
 */
function verifyConditionTest(condition)
{
   return condition === void 0 || typeof condition === 'string' || condition instanceof Set ||
    condition instanceof RegExp;
}

/**
 * @typedef {RegExp | string | Set<string>} ConditionTest
 */
