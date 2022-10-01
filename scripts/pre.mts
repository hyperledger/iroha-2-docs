/**
 * @module Prebuild
 *
 * This file checks that the examples are available
 * before the build process is starting.
 *
 * It would automatically download the examples for CI
 * and would interact with the user when a normal build happens.
 */

import ci from "ci-info";
import ora from "ora";
import { SNIPPET_SRC_DIR } from "./constants.mjs";
import { ensureDirExists, checkDirHasContents } from "./file_utils.mjs";
import { main as get_examples_main } from "./get_snippets.mjs";

export type PreprocessingState = {
  error: Error | null;
  outputDirHasContents: boolean;
};

/**
 * Checks if the snippet output directory exists,
 * creates it if it doesn't.
 *
 * @param {PreprocessingState} pState - current execution state
 */
let ensureOutputDirAccessible = async (pState: PreprocessingState) => {
  const spinner = ora({
    isEnabled: !ci.isCI,
    text: "Locating the output file…"
  }).start();
  try {
    ensureDirExists(SNIPPET_SRC_DIR);
    spinner.succeed("An output directory is available.");
  } catch (ode) {
    spinner.fail(
      "Unable to access or create the output directory.\n" + ode.message
    );
  }
};

/**
 * Checks if the snippet output directory contains any files.
 *
 * @param {PreprocessingState} pState - current execution state
 */
let ensureOutputDirHasContents = async (pState: PreprocessingState) => {
  const spinner = ora({
    isEnabled: !ci.isCI,
    text: "Checking if the output directory contains snippets…"
  }).start();
  pState.outputDirHasContents = checkDirHasContents(SNIPPET_SRC_DIR);
  if (pState.outputDirHasContents) {
    spinner.succeed("Snippet directory has contents.");
  } else {
    spinner.fail("Snippet directory is empty.");
  }
};

/**
 * Updates the contents of an output ESM JS file.
 *
 * @param pState - current execution state
 */
let updateOutputIfNotExists = async (pState: PreprocessingState) => {
  if (!pState.outputDirHasContents) {
    console.log("Downloading the examples.\n");
    await get_examples_main();
  }
};

/**
 * Makes a Proc class instance execute
 * all the required steps for a prebuilder code.
 *
 * @export
 */
export async function preMain() {
  let pState: PreprocessingState = {
    error: null,
    outputDirHasContents: false
  };
  await ensureOutputDirAccessible(pState);
  await ensureOutputDirHasContents(pState);
  await updateOutputIfNotExists(pState);
}
