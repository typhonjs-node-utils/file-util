/**
 * Provides a few utility functions to work with unix style paths.
 */

/**
 * Unix path separator.
 *
 * @type {string}
 */
const s_SEP = '/';

/**
 * upath.toUnix provided here for browser usage.
 *
 * @param {string}   p - A path.
 *
 * @returns {*} Unix path.
 */
const toUnix = (p) => {
   p = p.replace(/\\/g, "/");
   p = p.replace(/(?<!^)\/+/g, "/");
   return p;
};

/**
 * Finds the common base path of a collection of paths.
 *
 * @param {...string} paths - Paths to find a common base path.
 *
 * @returns {string} The common base path. (Unix)
 */
export function commonPath(...paths)
{
   /* c8 ignore next 1 */
   if (!Array.isArray(paths)) { throw new TypeError(`'paths' is not an array.`); }

   if (paths.length === 0) { return void 0; }

   if (typeof paths[0] !== 'string') { throw new TypeError(`'paths[0]' is not a string.`); }

   if (paths.length === 1) { return ''; }

   let commonPath = '';

   const unixPaths = paths.map((entry, index) => {
      if (typeof entry !== 'string') { throw new TypeError(`'paths[${index}]' is not a string.`); }
      return toUnix(entry)
   });

   const folders = [];

   for (let i = 0; i < unixPaths.length; i++)
   {
      if (typeof unixPaths[i] === 'string')
      {
         folders.push(unixPaths[i].split(s_SEP));     // Split on file separator.
      }
   }

   /* c8 ignore next 1 */
   if (folders.length === 0) { return commonPath; } // Never reached / sanity case.

   for (let j = 0; j < folders[0].length; j++)
   {
      const thisFolder = folders[0][j];         // Assign the next folder name in the first path.
      let allMatched = true;                    // Assume all have matched in case there are no more paths.

      for (let i = 1; i < folders.length && allMatched; i++)   // Look at the other paths.
      {
         allMatched &= folders[i][j] === thisFolder; // Check if it matched.
      }

      if (allMatched)                           // If they all matched this folder name.
      {
         commonPath += `${thisFolder}${s_SEP}`; // Add it to the common path.
      }
      else
      {
         break;                                 // Stop looking
      }
   }

   return commonPath;
}

/**
 * Finds the common base path of a collection of paths.
 *
 * @param {string}   key - A key to index into each object.
 *
 * @param {...object} map - Objects containing a key to holding a path.
 *
 * @returns {string} The common base path.
 */
export function commonMappedPath(key, ...map)
{
   if (typeof key !== 'string') { throw new TypeError(`'key' is not a string.`); }

   /* c8 ignore next 1 */
   if (!Array.isArray(map)) { throw new TypeError(`'map' is not an array.`); }

   if (map.length === 0) { return void 0; }

   let commonPath = '';

   const folders = [];

   for (let i = 0; i < map.length; i++)
   {
      if (map[i] === null || typeof map[i] !== 'object') { throw new TypeError(`'map[${i}]' is not an object.`); }

      if (typeof map[i][key] === 'string')
      {
         folders.push(toUnix(map[i][key]).split(s_SEP)); // Split on file separator.
      }
   }

   if (folders.length === 0) { return commonPath; }

   for (let j = 0; j < folders[0].length; j++)
   {
      const thisFolder = folders[0][j];         // Assign the next folder name in the first path.
      let allMatched = true;                    // Assume all have matched in case there are no more paths.

      for (let i = 1; i < folders.length && allMatched; i++)   // Look at the other paths.
      {
         allMatched &= folders[i][j] === thisFolder; // Check if it matched.
      }

      if (allMatched)                           // If they all matched this folder name.
      {
         commonPath += `${thisFolder}${s_SEP}`;        // Add it to the common path.
      }
      else
      {
         break;                                 // Stop looking
      }
   }

   return commonPath;
}

/**
 * Sorts an array of file / dir paths.
 *
 * @param {string[]} paths - Array of string paths.
 *
 * @param {string}   [sep='/'] - A string path separator.
 *
 * @returns {string[]} Sorted array of string paths (Unix).
 */
export function pathSort(paths, sep = s_SEP)
{
   if (!Array.isArray(paths)) { throw new TypeError(`'paths' is not an array.`); }
   if (typeof sep !== 'string') { throw new TypeError(`'sep' is not a string.`); }

   const unixPaths = paths.map((entry) => toUnix(entry));
   const sortedPaths = unixPaths.map((elem) => elem.split(sep)).sort(s_SORTER).map((elem) => elem.join(sep));

   // Remove duplicates.
   return [...new Set(sortedPaths)];
}

// Module Private ----------------------------------------------------------------------------------------------------

/**
 * Provides a sorting function for Array.sort() for file / dir paths.
 *
 * @param {string[]}   a - left side
 * @param {string[]}   b - right side
 *
 * @returns {number} sort priority.
 */
function s_SORTER(a, b)
{
   const length = Math.max(a.length, b.length);

   for (let i = 0; i < length; i += 1)
   {
      if (!(i in a)) { return -1; }
      if (!(i in b)) { return +1; }
      if (a[i].toUpperCase() > b[i].toUpperCase()) { return +1; }
      if (a[i].toUpperCase() < b[i].toUpperCase()) { return -1; }
   }

   return 0;
}
