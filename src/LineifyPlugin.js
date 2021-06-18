class LineifyPlugin {

    constructor(callback, callbackOptions) {
      this.callback = callback;
      this.callbackOptions = callbackOptions;
    }
   
    'after:highlightElement'({ el }) {
       this._lineify(el);
    }
   
    _lineify(element) {
       if (typeof(element) == "string") {
          element = document.getElementById(element);
       }
       let lineElements = [ this.createSpan("code-line") ];
       this._lineifyHelper(element, [], lineElements);
       // remove children
       while (element.firstChild) {
          element.removeChild(element.lastChild);
       }
       // allow callback to modify the line elements
       // note that the element has been emptied and the line elements not yet added
       // the plugin is provided as this, to provide access to utility methods,
       // like createSpan
       this.callback.call(this, element, lineElements, this.callbackOptions);
       // add new line elements
       for (let i = 0; i < lineElements.length; i++) {
          element.appendChild(lineElements[i]);
       }
    }
 
    _lineifyHelper(element, elementStack, lineNodes) {
       let children = Array.from(element.childNodes)
       while (children.length > 0) {
          let child = children.shift();
          if (child.nodeType === Node.ELEMENT_NODE) {
             // element
             let childCopy = this._copyElementAndAttributes(child);
             this._appendChildCopyHelper(childCopy, elementStack, lineNodes);
             elementStack.push(childCopy)
             this._lineifyHelper(child, elementStack, lineNodes);
             elementStack.pop();
          } else if (child.nodeType === Node.TEXT_NODE) {
             // text
             let pos = child.data.indexOf("\n");
             if (pos < 0) {
                 let childCopy = document.createTextNode(child.data);
                 this._appendChildCopyHelper(childCopy, elementStack, lineNodes);
             } else {
                // append final text node
                let childCopy = document.createTextNode(child.data.substring(0, pos + 1));
                this._appendChildCopyHelper(childCopy, elementStack, lineNodes);
                // add new empty line node, that collects subsequent elements
                let lineNode = this.createSpan("code-line");
                lineNodes.push(lineNode);
                // create new element stack representing start of new line
                for (let i = 0; i < elementStack.length; i++) {
                   let elementCopy = this._copyElementAndAttributes(elementStack[i]);
                   if (i === 0) {
                      lineNode.appendChild(elementCopy);
                   } else {
                      elementStack[i - 1].appendChild(elementCopy)
                   }
                   elementStack[i] = elementCopy;
                }
                // enqueue rest of text node
                if (pos + 1 < child.data.length) {
                   children.unshift(document.createTextNode(child.data.substring(pos + 1)));
                }
             }
          }
       }
    }
 
   _appendChildCopyHelper(copy, elementStack, lineNodes) {
       let arr = (elementStack.length > 0 ? elementStack : lineNodes);
       arr[arr.length - 1].appendChild(copy);
    }
 
    _copyElementAndAttributes(element) {
       let copy = document.createElement(element.nodeName);
       for (var attr of element.attributes) {
          copy.setAttribute(attr.nodeName, attr.nodeValue);
       }
       return copy;
    }
 
    // provided for use by the callback 
 
    createSpan(classAttr, text) {
       let span = document.createElement("span");
       if (classAttr) {
          span.setAttribute("class", classAttr);
       }
       if (text) {
          span.appendChild(document.createTextNode(text));
       }
       return span;
    }
 
    createLineNumSpan(lineNum, separator, width, lineNumClass) {
       let lineNumText = lineNum + "";
       if (width > lineNumText.length) {
          lineNumText = " ".repeat(width - lineNumText.length) + lineNumText;
       }
       lineNumText = lineNumText + (separator || "\t");
       return this.createSpan(lineNumClass, lineNumText);
    }
 }

export default LineifyPlugin