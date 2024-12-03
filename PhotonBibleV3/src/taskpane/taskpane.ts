/* global Word console */
export async function insertText(text: string) {
  // Write text to the document.
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}

export async function registerOnTextChanged(callbackFunction: any) {
  try {
    await Word.run(async (context) => {
      context.document.onParagraphAdded.add(callbackFunction);
      context.document.onParagraphChanged.add(callbackFunction);
      context.document.onParagraphDeleted.add(callbackFunction);
      await context.sync();
    });
  } catch (error) {
    console.log("Error: " + error);
  }
}
