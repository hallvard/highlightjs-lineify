[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/hallvard/highlightjs-lineify)

# highlightjs-lineify
Highlightjs plugin that transforms highlighted HTML to a line-oriented structure, e.g. to add line numbers.

## How it works

As a plugin it kicks in after highlightjs has created its structure of span elements.
Lineify chops this structure up into span elements that at most span one line each and
wrap text and span elements in another level of single line span elements.

The plugin is configured with a callback that can modify the line-oriented span elements before
they're finally added to the surrounding elements that highlightjs operated on.

## Usage

Import the hljs object as usual from the highlightjs module, and then import the LineifyPlugin class.
Then register the plugin as follows:

```
hljs.addPlugin(new LineifyPlugin(lineifyCallback, lineifyCallbackConfig));
```

`lineifyCallback` is a function taking three arguments, 1) the surrounding element that highlightjs operated on,
2) the array of line-oriented span elements that was output by the LineifyPlugin, and 3) the lineifyCallbackConfig
object given to the LineifyPlugin constructor. `this` is bound to an object providing some handy utility methods,
including `createSpan` and `createLineNumSpan`.

One usage is to add line numbers. This can be done by the following function:

```
function lineifyCallback(element, lineElements, config) {
   for (let i = 0; i < lineElements.length; i++) {
      let lineElement = lineElements[i];
      lineElement.insertBefore(this.createLineNumSpan(i + 1), lineElement.firstChild);
   }
}
```

Here we iterator over all line span elements and insert a new span element with the line number, as a new first element in the line.
