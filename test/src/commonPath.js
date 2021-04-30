// it('commonPath', () =>
// {
//    const paths =
//    [
//       '/this/is/a/test/path/one/file.js',
//       '/this/is/a/test/path/one/file2.js',
//       '/this/is/a/test/path/two/file3.js',
//       '/this/is/a/test/path/two/file4.js',
//       '/this/is/a/test/path/three/file5.js'
//    ];
//
//    const relativePaths =
//    [
//       '../../../this/is/a/test/path/one/file.js',
//       '../../../this/is/a/test/path/one/file2.js',
//       '../../this/is/a/test/path/two/file3.js',
//       '../../this/is/a/test/path/two/file4.js',
//       '../../this/is/a/test/path/three/file5.js'
//    ];
//
//    let commonPath = fileUtil.commonPath(...paths);
//
//    assert.strictEqual(commonPath, '/this/is/a/test/path/');
//
//    commonPath = fileUtil.commonPath(...relativePaths);
//
//    assert.strictEqual(commonPath, '../../');
//
//    commonPath = fileUtil.commonPath([]);
//
//    assert.strictEqual(commonPath, '');
// });
//
// it('commonMappedPath', () =>
// {
//    const paths =
//    [
//       { other: 1, path: '/this/is/a/test/path/one/file.js' },
//       { other: 1, path: '/this/is/a/test/path/one/file2.js' },
//       { other: 1, path: '/this/is/a/test/path/two/file3.js' },
//       { other: 1, path: '/this/is/a/test/path/two/file4.js' },
//       { other: 1, path: '/this/is/a/test/path/three/file5.js' }
//    ];
//
//    const relativePaths =
//    [
//       { other: 1, path: '../../../this/is/a/test/path/one/file.js' },
//       { other: 1, path: '../../../this/is/a/test/path/one/file2.js' },
//       { other: 1, path: '../../this/is/a/test/path/two/file3.js' },
//       { other: 1, path: '../../this/is/a/test/path/two/file4.js' },
//       { other: 1, path: '../../this/is/a/test/path/three/file5.js' }
//    ];
//
//    let commonPath = fileUtil.commonMappedPath('path', ...paths);
//
//    assert.strictEqual(commonPath, '/this/is/a/test/path/');
//
//    commonPath = fileUtil.commonMappedPath('path', ...relativePaths);
//
//    assert.strictEqual(commonPath, '../../');
//
//    commonPath = fileUtil.commonMappedPath('path', []);
//
//    assert.strictEqual(commonPath, '');
// });
