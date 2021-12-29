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
   if (!Array.isArray(paths)) { throw new TypeError(`'paths' is not an 'array'.`); }

   if (paths.length <= 1) { return ''; }

   let commonPath = '';

   const unixPaths = paths.map((entry) => toUnix(entry));

   const folders = [];

   for (let i = 0; i < unixPaths.length; i++)
   {
      if (typeof paths[i] === 'string')
      {
         folders.push(paths[i].split(s_SEP));     // Split on file separator.
      }
   }

   if (folders.length === 0) { return commonPath; }

   for (let j = 0; j < folders[0].length; j++)
   {
      const thisFolder = folders[0][j];         // Assign the next folder name in the first path.
      let allMatched = true;                    // Assume all have matched in case there are no more paths.

      for (let i = 1; i < folders.length && allMatched; i++)   // Look at the other paths.
      {
         if (folders[i].length < j)             // If there is no folder here.
         {
            allMatched = false;                 // No match.
            break;                              // Reached end of folders.
         }

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
   if (typeof key !== 'string') { throw new TypeError(`'key' is not a 'string'.`); }
   if (!Array.isArray(map)) { throw new TypeError(`'map' is not an 'array'.`); }

   let commonPath = '';

   const folders = [];

   for (let i = 0; i < map.length; i++)
   {
      if (typeof map[i][key] === 'string')
      {
         // TODO: Validate on Windows as toUnix likely needs to be used here.
         folders.push(map[i][key].split(s_SEP)); // Split on file separator.
      }
   }

   if (folders.length === 0) { return commonPath; }

   for (let j = 0; j < folders[0].length; j++)
   {
      const thisFolder = folders[0][j];         // Assign the next folder name in the first path.
      let allMatched = true;                    // Assume all have matched in case there are no more paths.

      for (let i = 1; i < folders.length && allMatched; i++)   // Look at the other paths.
      {
         if (folders[i].length < j)             // If there is no folder here.
         {
            allMatched = false;                 // No match.
            break;                              // Reached end of folders.
         }

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
 * @returns {*} Sorted array of string paths (Unix).
 */
export function pathSort(paths, sep = s_SEP)
{
   const unixPaths = paths.map((entry) => toUnix(entry));
   return unixPaths.map((elem) => elem.split(sep)).sort(s_SORTER).map((elem) => elem.join(sep));
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

   if (a.length < b.length) { return -1; }
   if (a.length > b.length) { return +1; }

   return 0;
}
