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
 */
export function writeStrToFile(snippetStr: string, filePath: PathOrFileDescriptor): void {
  writeFileSync(filePath, snippetStr)
}

/**
 * Loads strings from text files.
 * Needed for file URL support.
 */
export function pathToStr(txtPath: string): string {
  const txtPathResolved = resolve(txtPath)
  return readFileSync(txtPathResolved, 'utf8')
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
 */
export function checkDirHasContents(dirname: PathLike): boolean {
  try {
    const fileList = readdirSync(dirname)
    return fileList.length > 0
  } catch {
    return false
  }
}
