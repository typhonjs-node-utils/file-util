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
 * @param {...(object | Map)} map - Objects or Maps containing a key to holding a path.
 *
 * @returns {string | void} The common base path.
 */
declare function commonMappedPath(key: string, ...map: (object | Map<any, any>)[]): string | void;
/**
 * Sorts an array of file / dir paths.
 *
 * @param {string[]} paths - Array of string paths.
 *
 * @param {string}   [sep='/'] - A string path separator.
 *
 * @returns {string[]} Sorted array of string paths (Unix).
 */
declare function pathSort(paths: string[], sep?: string): string[];

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
 * @param {boolean}           [options.walk=false] - When true subdirectories are walked.
 *
 * @returns {Promise<string[]>} An array of directories.
 */
declare function getDirList({ dir, excludeDir, includeDir, relative, resolve, sort, walk }?: {
    dir?: string;
    excludeDir?: ConditionTest;
    includeDir?: ConditionTest;
    relative?: string;
    resolve?: boolean;
    sort?: boolean;
    walk?: boolean;
}): Promise<string[]>;
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
 * @param {boolean}        [options.walk=false] - When true subdirectories are walked.
 *
 * @returns {Promise<string[]>} An array of resolved file paths.
 */
declare function getFileList({ dir, excludeDir, excludeFile, includeDir, includeFile, relative, resolve, sort, walk }?: {
    dir?: string;
    excludeDir?: ConditionTest;
    excludeFile?: ConditionTest;
    includeDir?: ConditionTest;
    includeFile?: ConditionTest;
    relative?: string;
    resolve?: boolean;
    sort?: boolean;
    walk?: boolean;
}): Promise<string[]>;
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
declare function getRelativePath({ basepath, filepath }?: {
    basepath?: string;
    filepath: string;
}): string;
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
declare function getURLDirpath(url: string | URL, ...resolvePaths: string[]): string;
/**
 * Convenience method to convert a file URL into a file path.
 *
 * @param {string | URL} url - A file URL
 *
 * @returns {string} A file path from `url`.
 */
declare function getURLFilepath(url: string | URL): string;
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
declare function hasFile({ dir, excludeDir, excludeFile, includeDir, includeFile, walk }?: {
    dir?: string;
    excludeDir?: ConditionTest;
    excludeFile?: ConditionTest;
    includeDir?: ConditionTest;
    includeFile?: ConditionTest;
    walk?: boolean;
}): Promise<boolean>;
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
declare function isSubpath({ basepath, filepath }?: {
    basepath?: string;
    filepath: string;
}): boolean;
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
declare function walkDir({ dir, excludeDir, includeDir, walk }?: {
    dir?: string;
    excludeDir?: ConditionTest;
    includeDir?: ConditionTest;
    walk?: boolean;
}): AsyncGenerator<string, void, unknown>;
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
declare function walkFiles({ dir, excludeDir, excludeFile, includeDir, includeFile, walk }?: {
    dir?: string;
    excludeDir?: ConditionTest;
    excludeFile?: ConditionTest;
    includeDir?: ConditionTest;
    includeFile?: ConditionTest;
    walk?: boolean;
}): AsyncGenerator<string, void, unknown>;
type ConditionTest = RegExp | string | Set<string>;

export { ConditionTest, commonMappedPath, commonPath, getDirList, getFileList, getRelativePath, getURLDirpath, getURLFilepath, hasFile, isSubpath, pathSort, walkDir, walkFiles };
