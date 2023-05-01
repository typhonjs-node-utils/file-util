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

/**
 * Provides a few utility functions to work with files / directories.
 */
/**
 * Returns an array of all absolute directory paths found from walking the directory indicated.
 *
 * @param {object}      options - An options object.
 *
 * @param {string}      [options.dir='.'] - Directory to walk; default is CWD.
 *
 * @param {Set<string>} [options.skipDir] - An array or Set of directory names to skip walking.
 *
 * @param {boolean}     [options.sort=true] - Sort output array.
 *
 * @returns {Promise<Array>} An array of directories.
 */
declare function getDirList({ dir, skipDir, sort }?: {
    dir?: string;
    skipDir?: Set<string>;
    sort?: boolean;
}): Promise<any[]>;
/**
 * Returns an array of all absolute file paths found from walking the directory tree indicated.
 *
 * @param {object}      options - An options object.
 *
 * @param {string}      [options.dir='.'] - Directory to walk; default is CWD.
 *
 * @param {Set<string>} [options.skipDir] - A Set of directory names to skip walking.
 *
 * @param {boolean}     [options.sort=true] - Sort output array.
 *
 * @returns {Promise<Array>} An array of file paths.
 */
declare function getFileList({ dir, skipDir, sort }?: {
    dir?: string;
    skipDir?: Set<string>;
    sort?: boolean;
}): Promise<any[]>;
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
declare function getRelativePath(basePath: string, filePath: string): string;
/**
 * Convenience method to covert a file URL into the file path of the directory
 *
 * @param {string} url - A file URL
 *
 * @param {...string} resolvePaths - An optional list of paths to resolve against the dir path.
 *
 * @returns {string} A file path based on `url` and any `resolvePaths`.
 */
declare function getURLDirpath(url: string, ...resolvePaths: string[]): string;
/**
 * Convenience method to convert a file URL into a file path.
 *
 * @param {string} url - A file URL
 *
 * @returns {string} A file path from `url`.
 */
declare function getURLFilepath(url: string): string;
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
declare function hasFile({ dir, fileList, skipDir }?: {
    fileList: Set<any>;
    dir?: string;
    skipDir?: Set<any>;
}): Promise<boolean>;
/**
 * A generator function that walks the local file tree.
 *
 * @param {string}      dir - The directory to start walking.
 *
 * @param {Set<string>} [skipDir] - An array or Set of directory names to skip walking.
 *
 * @yields {string}
 */
declare function walkDir(dir: string, skipDir?: Set<string>): any;
/**
 * A generator function that walks the local file tree.
 *
 * @param {string}      dir - The directory to start walking.
 *
 * @param {Set<string>} [skipDir] - An array or Set of directory names to skip walking.
 *
 * @yields {string}
 */
declare function walkFiles(dir: string, skipDir?: Set<string>): any;

export { commonMappedPath, commonPath, getDirList, getFileList, getRelativePath, getURLDirpath, getURLFilepath, hasFile, pathSort, walkDir, walkFiles };
