import fs                from 'fs';
import { fileURLToPath } from 'url';

import upath             from 'upath';

import { pathSort }      from './functions-browser.js';

/**
 * Provides a few utility functions to work with files / directories.
 */

/**
 * Returns an array of all absolute directory paths found from walking the directory indicated.
 *
 * @param {object}   options - An options object.
 *
 * @param {string}   [options.dir='.'] - Directory to walk; default is CWD.
 *
 * @param {Set}      [options.skipDir] - An array or Set of directory names to skip walking.
 *
 * @param {boolean}  [options.sort=true] - Sort output array.
 *
 * @returns {Promise<Array>} An array of directories.
 */
export async function getDirList({ dir = '.', skipDir = new Set(), sort = true } = {})
{
   const results = [];

   for await (const p of walkDir(dir, skipDir))
   {
      results.push(upath.resolve(p));
   }

   return sort ? pathSort(results) : results;
}

/**
 * Returns an array of all absolute file paths found from walking the directory tree indicated.
 *
 * @param {object}   options - An options object.
 *
 * @param {string}   [options.dir='.'] - Directory to walk; default is CWD.
 *
 * @param {Set}      [options.skipDir] - A Set of directory names to skip walking.
 *
 * @param {boolean}  [options.sort=true] - Sort output array.
 *
 * @returns {Promise<Array>} An array of file paths.
 */
export async function getFileList({ dir = '.', skipDir = new Set(), sort = true } = {})
{
   const results = [];

   for await (const p of walkFiles(dir, skipDir))
   {
      results.push(upath.resolve(p));
   }

   return sort ? pathSort(results) : results;
}

/**
 * Given a base path and a file path this method will return a relative path if the file path includes the base
 * path otherwise the full absolute file path is returned.
 *
 * @param {string}   basePath - The base file path to create a relative path from `filePath`
 *
 * @param {string}   filePath - The relative path to adjust from `basePath`.
 *
 * @returns {string} A relative path based on `basePath` and `filePath`. (Unix)
 */
export function getRelativePath(basePath, filePath)
{
   let returnPath = upath.toUnix(filePath);

   // Get the relative path and append `./` if necessary.
   if (filePath.startsWith(basePath))
   {
      returnPath = upath.relative(basePath, filePath);
      returnPath = returnPath.startsWith('.') ? returnPath : `.${upath.sep}${returnPath}`;
   }

   return returnPath;
}

/**
 * Convenience method to covert a file URL into the file path of the directory
 *
 * @param {string} url - A file URL
 *
 * @param {string} [resolvePaths] - An optional list of paths to resolve against the dir path.
 *
 * @returns {string} A file path based on `url` and any `resolvePaths`.
 */
export function getURLDirpath(url, ...resolvePaths)
{
   return upath.resolve(upath.dirname(fileURLToPath(url)), ...resolvePaths);
}

/**
 * Convenience method to convert a file URL into a file path.
 *
 * @param {string} url - A file URL
 *
 * @returns {string} A file path from `url`.
 */
export function getURLFilepath(url)
{
   return fileURLToPath(url);
}

/**
 * Searches all files from starting directory skipping any directories in `skipDir` and those starting with `.`
 * in an attempt to locate a Babel configuration file. If a Babel configuration file is found `true` is
 * immediately returned.
 *
 * @param {object}   options - Options object.
 *
 * @param {Set}      options.fileList - A Set of file names to verify existence.
 *
 * @param {string}   [options.dir='.'] - Directory to walk / default is CWD.
 *
 * @param {Set}      [options.skipDir] - A Set of directory names to skip walking.
 *
 * @returns {Promise<boolean>} Whether a Babel configuration file was found.
 */
export async function hasFile({ dir = '.', fileList, skipDir = new Set() } = {})
{
   if (!(fileList instanceof Set)) { throw new TypeError(`'fileList' is not a 'Set'`); }
   if (!(skipDir instanceof Set)) { throw new TypeError(`'skipDir' is not a 'Set'`); }

   for await (const p of walkFiles(dir, skipDir))
   {
      if (fileList.has(upath.basename(p)))
      {
         return true;
      }
   }
   return false;
}

/**
 * A generator function that walks the local file tree.
 *
 * @param {string}   dir - The directory to start walking.
 *
 * @param {Set}      [skipDir] - An array or Set of directory names to skip walking.
 *
 * @returns {string} A directory path.
 * @yields
 */
export async function *walkDir(dir, skipDir = new Set())
{
   if (!(skipDir instanceof Set)) { throw new TypeError(`'skipDir' is not a 'Set'`); }

   for await (const d of await fs.promises.opendir(dir))
   {
      // Skip directories in `skipMap` or any hidden directories (starts w/ `.`).
      if (d.isDirectory() && (skipDir.has(d.name) || d.name.startsWith('.')))
      {
         continue;
      }

      const entry = upath.join(dir, d.name);

      if (d.isDirectory())
      {
         yield entry;
         yield* walkDir(entry, skipDir);
      }
   }
}

/**
 * A generator function that walks the local file tree.
 *
 * @param {string}   dir - The directory to start walking.
 *
 * @param {Set}      [skipDir] - An array or Set of directory names to skip walking.
 *
 * @returns {string} A file path.
 * @yields
 */
export async function *walkFiles(dir, skipDir = new Set())
{
   if (!(skipDir instanceof Set)) { throw new TypeError(`'skipDir' is not a 'Set'`); }

   for await (const d of await fs.promises.opendir(dir))
   {
      // Skip directories in `skipMap` or any hidden directories (starts w/ `.`).
      if (d.isDirectory() && (skipDir.has(d.name) || d.name.startsWith('.')))
      {
         continue;
      }

      const entry = upath.join(dir, d.name);

      if (d.isDirectory())
      {
         yield* walkFiles(entry, skipDir);
      }
      else if (d.isFile())
      {
         yield entry;
      }
   }
}
