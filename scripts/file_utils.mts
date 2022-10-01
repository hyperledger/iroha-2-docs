/**
 * @module File_utilities
 *
 * This file contains the filesystem-related utilities, needed
 * by the other scripts.
 */

import { resolve } from 'path'
import { readFileSync, writeFileSync, PathOrFileDescriptor, PathLike, existsSync, mkdirSync, readdirSync } from 'fs'

/**
 * Write a string to a file path synchronously
 *
 * @export
 * @param {string} snippetStr
 * @param {PathOrFileDescriptor} filePath
 * @returns  {(Boolean | Error)}
 */
export function writeStrToFile(snippetStr: string, filePath: PathOrFileDescriptor): boolean | Error {
  let result: boolean | Error
  try {
    writeFileSync(filePath, snippetStr)
    result = true
  } catch (err) {
    result = err
  }
  return result
}

/**
 * Loads strings from text files.
 * Needed for file URL support.
 *
 * @export
 * @param {string} txtPath
 * @returns  {(string | Error)} file contents or an Error instance
 */
export function pathToStr(txtPath: string): string | Error {
  // Start with an exception by default
  let result: string | Error = new Error('No sources available')
  // Try to load a file, return an error instance otherwise
  try {
    const txtPathResolved = resolve(txtPath)
    result = readFileSync(txtPathResolved, 'utf8')
  } catch (error) {
    result = error
  }
  // Return the sources or an Error instance
  return result
}

/**
 * Checks if a directory exists and creates a path to it recursively
 * if it doesn't.
 *
 * @export
 * @param {PathLike} dir
 */
export function ensureDirExists(dir: PathLike) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

/**
 * Checks if a directory contains any files
 *
 * @export
 * @param {PathLike} dirname - path to a directory to check
 * @returns {Boolean} - true if there are files in a given directory
 */
export function checkDirHasContents(dirname: PathLike): boolean {
  let result: boolean
  let fileList: string[] = []
  try {
    fileList = readdirSync(dirname)
    result = fileList.length > 0
  } catch (err) {
    result = false
  }
  return result
}
