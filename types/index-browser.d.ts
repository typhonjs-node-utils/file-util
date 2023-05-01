/**
 * Finds the common base path of a collection of paths.
 *
 * @param {...string} paths - Paths to find a common base path.
 *
 * @returns {string} The common base path. (Unix)
 */
declare function commonPath(...paths: string[]): string;
/**
 * Finds the common base path of a collection of paths.
 *
 * @param {string}   key - A key to index into each object.
 *
 * @param {...object} map - Objects containing a key to holding a path.
 *
 * @returns {string} The common base path.
 */
declare function commonMappedPath(key: string, ...map: object[]): string;
/**
 * Sorts an array of file / dir paths.
 *
 * @param {string[]} paths - Array of string paths.
 *
 * @param {string}   [sep='/'] - A string path separator.
 *
 * @returns {*} Sorted array of string paths (Unix).
 */
declare function pathSort(paths: string[], sep?: string): any;

export { commonMappedPath, commonPath, pathSort };
