/* Task Description */
/*
 * Create an object domElement, that has the following properties and methods:
 * use prototypal inheritance, without function constructors
 * method init() that gets the domElement type
 * i.e. `Object.create(domElement).init('div')`
 * property type that is the type of the domElement
 * a valid type is any non-empty string that contains only Latin letters and digits
 * property innerHTML of type string
 * gets the domElement, parsed as valid HTML
 * <type attr1="value1" attr2="value2" ...> .. content / children's.innerHTML .. </type>
 * property content of type string
 * sets the content of the element
 * works only if there are no children
 * property attributes
 * each attribute has name and value
 * a valid attribute has a non-empty string for a name that contains only Latin letters and digits or dashes (-)
 * property children
 * each child is a domElement or a string
 * property parent
 * parent is a domElement
 * method appendChild(domElement / string)
 * appends to the end of children list
 * method addAttribute(name, value)
 * throw Error if type is not valid
 * method removeAttribute(attribute)
 * throw Error if attribute does not exist in the domElement
 */


/* Example
 var meta = Object.create(domElement)
 .init('meta')
 .addAttribute('charset', 'utf-8');
 var head = Object.create(domElement)
 .init('head')
 .appendChild(meta)
 var div = Object.create(domElement)
 .init('div')
 .addAttribute('style', 'font-size: 42px');
 div.content = 'Hello, world!';
 var body = Object.create(domElement)
 .init('body')
 .appendChild(div)
 .addAttribute('id', 'cuki')
 .addAttribute('bgcolor', '#012345');
 var root = Object.create(domElement)
 .init('html')
 .appendChild(head)
 .appendChild(body);
 console.log(root.innerHTML);
 Outputs:
 <html><head><meta charset="utf-8"></meta></head><body bgcolor="#012345" id="cuki"><div style="font-size: 42px">Hello, world!</div></body></html>
 */


function solve() {
    var domElement = (function () {
        function validateIsStringIsOfLatinLetters(string, name) {
            if (!/^[A-Z0-9]+$/i.test(string) || typeof string !== 'string') {
                throw new Error(name + ' must contain only Latin letters!');
            }

        }

        function checkIfStringIsEmpty(string, name) {
            if (string === '') {
                throw new Error(name + ' must not be an empty string!');
            }
        }

        function validateStringWithLatinLettersAndDigits(string, name) {
            if (!/^[A-Z0-9\-]+$/i.test(string) || typeof name !== 'string') {
                throw new Error(name + ' must contain only Latin letters and digits!');
            }

        }

        function getSortedAttributes(attributes) {
            var result = '',
                attributesKeys = [];

            for (var key in attributes) {
                attributesKeys.push(key);
            }

            attributesKeys.sort();
            var currentKey,
                i,
                keysLength = attributesKeys.length;

            for (i = 0;  i < keysLength; i += 1) {
                currentKey = attributesKeys[i];
                result += ' ' + currentKey + '="' + attributes[currentKey] + '"';
            }

            return result;

        }

        var domElement = {
            init: function (type) {
                this.type = type;
                this.attributes = [];
                this.content = '';
                this.parent;
                this.children = [];

                return this;
            },

            get type() {
                return this._type;
            },
            set type(value) {
                checkIfStringIsEmpty(value, 'Type');
                validateIsStringIsOfLatinLetters(value, 'Type');

                this._type = value;

            },

            get content() {
                if (this.children.length) {
                    return '';
                }

                return this._content;
            },

            set content(value) {
                this._content = value;
            },

            get attributes() {
                return this._attributes;
            },

            set attributes(value) {

                this._attributes = value;
            },

            get children() {
                return this._children;
            },
            set children(value) {
                this._children = value;
            },

            get parent() {
                return this._parent;
            },
            set parent(value) {
                this._parent = value;
            },

            appendChild: function (child) {
                this.children.push(child);

                if (typeof child === 'object') {
                    child.parent = this;
                }

                return this;
            },
            addAttribute: function (name, value) {
                checkIfStringIsEmpty(name, 'attribute');
                validateStringWithLatinLettersAndDigits(name, 'attribute');

                this.attributes[name] = value;

                return this;
            },

            removeAttribute: function (attribute) {
                if (!this.attributes[attribute]) {
                    throw new Error('The attribute doesn\'t exist!');
                }

                delete this.attributes[attribute];

                return this;
            },

            get innerHTML() {
                var innerHTML = '<' + this.type,
                    resultString = getSortedAttributes(this.attributes),
                    child,
                    len = this.children.length,
                    j;
                innerHTML += resultString + '>';

                for (j = 0; j < len; j += 1) {
                    child = this.children[j];

                    if (typeof child === 'string') {
                        innerHTML += child;
                    } else {
                        innerHTML += child.innerHTML;
                    }
                }

                innerHTML += this.content;
                innerHTML += '</' + this.type + '>';

                return innerHTML;
            }
        };
        return domElement;
    }());
    return domElement;
}

module.exports = solve;
