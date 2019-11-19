//----------------------------------------------------------------------
//
// ECMAScript 5 Polyfills
//
//----------------------------------------------------------------------

//----------------------------------------------------------------------
// ES5 15.2 Object Objects
//----------------------------------------------------------------------

//
// ES5 15.2.3 Properties of the Object Constructor
//

// ES5 15.2.3.2 Object.getPrototypeOf ( O )
// From http://ejohn.org/blog/objectgetprototypeof/
// NOTE: won't work for typical function T() {}; T.prototype = {}; new T; case
// since the constructor property is destroyed.
if (!Object.getPrototypeOf) {
  Object.getPrototypeOf = function (o) {
    if (o !== Object(o)) { throw TypeError("Object.getPrototypeOf called on non-object"); }
    return o.__proto__ || o.constructor.prototype || Object.prototype;
  };
}

//    // ES5 15.2.3.3 Object.getOwnPropertyDescriptor ( O, P )
//    if (typeof Object.getOwnPropertyDescriptor !== "function") {
//        Object.getOwnPropertyDescriptor = function (o, name) {
//            if (o !== Object(o)) { throw TypeError(); }
//            if (o.hasOwnProperty(name)) {
//                return {
//                    value: o[name],
//                    enumerable: true,
//                    writable: true,
//                    configurable: true
//                };
//            }
//        };
//    }

// ES5 15.2.3.4 Object.getOwnPropertyNames ( O )
if (typeof Object.getOwnPropertyNames !== "function") {
  Object.getOwnPropertyNames = function (o) {
    if (o !== Object(o)) { throw TypeError("Object.getOwnPropertyNames called on non-object"); }
    var props = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        props.push(p);
      }
    }
    return props;
  };
}

// ES5 15.2.3.5 Object.create ( O [, Properties] )
if (typeof Object.create !== "function") {
  Object.create = function (prototype, properties) {
    if (typeof prototype !== "object") { throw TypeError(); }
    function Ctor() {}
    Ctor.prototype = prototype;
    var o = new Ctor();
    if (prototype) { o.constructor = Ctor; }
    if (properties !== undefined) {
      if (properties !== Object(properties)) { throw TypeError(); }
      Object.defineProperties(o, properties);
    }
    return o;
  };
}

// ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
// Partial support for most common case - getters, setters, and values
(function() {
  if (!Object.defineProperty ||
      !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

      if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }
}());

// ES 15.2.3.7 Object.defineProperties ( O, Properties )
if (typeof Object.defineProperties !== "function") {
  Object.defineProperties = function (o, properties) {
    if (o !== Object(o)) { throw TypeError("Object.defineProperties called on non-object"); }
    var name;
    for (name in properties) {
      if (Object.prototype.hasOwnProperty.call(properties, name)) {
        Object.defineProperty(o, name, properties[name]);
      }
    }
    return o;
  };
}


// ES5 15.2.3.14 Object.keys ( O )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = function (o) {
    if (o !== Object(o)) { throw TypeError('Object.keys called on non-object'); }
    var ret = [], p;
    for (p in o) {
      if (Object.prototype.hasOwnProperty.call(o, p)) {
        ret.push(p);
      }
    }
    return ret;
  };
}

//----------------------------------------------------------------------
// ES5 15.3 Function Objects
//----------------------------------------------------------------------

//
// ES5 15.3.4 Properties of the Function Prototype Object
//

// ES5 15.3.4.5 Function.prototype.bind ( thisArg [, arg1 [, arg2, ... ]] )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (o) {
    if (typeof this !== 'function') { throw TypeError("Bind must be called on a function"); }

    var args = Array.prototype.slice.call(arguments, 1),
        self = this,
        nop = function() {},
        bound = function () {
          return self.apply(this instanceof nop ? this : o,
                            args.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype)
      nop.prototype = this.prototype;
    bound.prototype = new nop();
    return bound;
  };
}


//----------------------------------------------------------------------
// ES5 15.4 Array Objects
//----------------------------------------------------------------------

//
// ES5 15.4.3 Properties of the Array Constructor
//


// ES5 15.4.3.2 Array.isArray ( arg )
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
Array.isArray = Array.isArray || function (o) { return Boolean(o && Object.prototype.toString.call(Object(o)) === '[object Array]'); };


//
// ES5 15.4.4 Properties of the Array Prototype Object
//

// ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (isNaN(n)) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    if (n >= len) { return -1; }

    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.4.4.15 Array.prototype.lastIndexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf) {
  Array.prototype.lastIndexOf = function (searchElement /*, fromIndex*/) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }

    var n = len;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n !== n) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }

    var k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n);

    for (; k >= 0; k--) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.4.4.16 Array.prototype.every ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
  Array.prototype.every = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t && !fun.call(thisp, t[i], i, t)) {
        return false;
      }
    }

    return true;
  };
}

// ES5 15.4.4.17 Array.prototype.some ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
  Array.prototype.some = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t && fun.call(thisp, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}

// ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        fun.call(thisp, t[i], i, t);
      }
    }
  };
}


// ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map
if (!Array.prototype.map) {
  Array.prototype.map = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var res = []; res.length = len;
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        res[i] = fun.call(thisp, t[i], i, t);
      }
    }

    return res;
  };
}

// ES5 15.4.4.20 Array.prototype.filter ( callbackfn [ , thisArg ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Filter
if (!Array.prototype.filter) {
  Array.prototype.filter = function (fun /*, thisp */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    var res = [];
    var thisp = arguments[1], i;
    for (i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}


// ES5 15.4.4.21 Array.prototype.reduce ( callbackfn [ , initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (fun /*, initialValue */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1) { throw TypeError(); }

    var k = 0;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else {
      do {
        if (k in t) {
          accumulator = t[k++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++k >= len) { throw TypeError(); }
      }
      while (true);
    }

    while (k < len) {
      if (k in t) {
        accumulator = fun.call(undefined, accumulator, t[k], k, t);
      }
      k++;
    }

    return accumulator;
  };
}


// ES5 15.4.4.22 Array.prototype.reduceRight ( callbackfn [, initialValue ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/ReduceRight
if (!Array.prototype.reduceRight) {
  Array.prototype.reduceRight = function (callbackfn /*, initialValue */) {
    if (this === void 0 || this === null) { throw TypeError(); }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof callbackfn !== "function") { throw TypeError(); }

    // no value to return if no initial value, empty array
    if (len === 0 && arguments.length === 1) { throw TypeError(); }

    var k = len - 1;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else {
      do {
        if (k in this) {
          accumulator = this[k--];
          break;
        }

        // if array contains no values, no initial value to return
        if (--k < 0) { throw TypeError(); }
      }
      while (true);
    }

    while (k >= 0) {
      if (k in t) {
        accumulator = callbackfn.call(undefined, accumulator, t[k], k, t);
      }
      k--;
    }

    return accumulator;
  };
}


//----------------------------------------------------------------------
// ES5 15.5 String Objects
//----------------------------------------------------------------------

//
// ES5 15.5.4 Properties of the String Prototype Object
//


// ES5 15.5.4.20 String.prototype.trim()
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+/, '').replace(/\s+$/, '');
  };
}



//----------------------------------------------------------------------
// ES5 15.9 Date Objects
//----------------------------------------------------------------------


//
// ES 15.9.4 Properties of the Date Constructor
//

// ES5 15.9.4.4 Date.now ( )
// From https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Date/now
if (!Date.now) {
  Date.now = function now() {
    return Number(new Date());
  };
}


//
// ES5 15.9.5 Properties of the Date Prototype Object
//

// ES5 15.9.4.43 Date.prototype.toISOString ( )
// Inspired by http://www.json.org/json2.js
if (!Date.prototype.toISOString) {
  Date.prototype.toISOString = function () {
    function pad2(n) { return ('00' + n).slice(-2); }
    function pad3(n) { return ('000' + n).slice(-3); }

    return this.getUTCFullYear() + '-' +
      pad2(this.getUTCMonth() + 1) + '-' +
      pad2(this.getUTCDate()) + 'T' +
      pad2(this.getUTCHours()) + ':' +
      pad2(this.getUTCMinutes()) + ':' +
      pad2(this.getUTCSeconds()) + '.' +
      pad3(this.getUTCMilliseconds()) + 'Z';
  };
}


(function(global) {
  'use strict';
  if (!('window' in global && 'document' in global))
    return;

  //----------------------------------------------------------------------
  //
  // DOM
  // https://dom.spec.whatwg.org/
  //
  //----------------------------------------------------------------------

  // Document.querySelectorAll method
  // http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
  // Needed for: IE7-
  if (!document.querySelectorAll) {
    document.querySelectorAll = function(selectors) {
      var style = document.createElement('style'), elements = [], element;
      document.documentElement.firstChild.appendChild(style);
      document._qsa = [];

      style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
      window.scrollBy(0, 0);
      style.parentNode.removeChild(style);

      while (document._qsa.length) {
        element = document._qsa.shift();
        element.style.removeAttribute('x-qsa');
        elements.push(element);
      }
      document._qsa = null;
      return elements;
    };
  }

  // Document.querySelector method
  // Needed for: IE7-
  if (!document.querySelector) {
    document.querySelector = function(selectors) {
      var elements = document.querySelectorAll(selectors);
      return (elements.length) ? elements[0] : null;
    };
  }

  // Document.getElementsByClassName method
  // Needed for: IE8-
  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(classNames) {
      classNames = String(classNames).replace(/^|\s+/g, '.');
      return document.querySelectorAll(classNames);
    };
  }

  // Node interface constants
  // Needed for: IE8-
  global.Node = global.Node || function() { throw TypeError("Illegal constructor"); };
  [
    ['ELEMENT_NODE', 1],
    ['ATTRIBUTE_NODE', 2],
    ['TEXT_NODE', 3],
    ['CDATA_SECTION_NODE', 4],
    ['ENTITY_REFERENCE_NODE', 5],
    ['ENTITY_NODE', 6],
    ['PROCESSING_INSTRUCTION_NODE', 7],
    ['COMMENT_NODE', 8],
    ['DOCUMENT_NODE', 9],
    ['DOCUMENT_TYPE_NODE', 10],
    ['DOCUMENT_FRAGMENT_NODE', 11],
    ['NOTATION_NODE', 12]
  ].forEach(function(p) { if (!(p[0] in global.Node)) global.Node[p[0]] = p[1]; });

  // DOMException constants
  // Needed for: IE8-
  global.DOMException = global.DOMException || function() { throw TypeError("Illegal constructor"); };
  [
    ['INDEX_SIZE_ERR', 1],
    ['DOMSTRING_SIZE_ERR', 2],
    ['HIERARCHY_REQUEST_ERR', 3],
    ['WRONG_DOCUMENT_ERR', 4],
    ['INVALID_CHARACTER_ERR', 5],
    ['NO_DATA_ALLOWED_ERR', 6],
    ['NO_MODIFICATION_ALLOWED_ERR', 7],
    ['NOT_FOUND_ERR', 8],
    ['NOT_SUPPORTED_ERR', 9],
    ['INUSE_ATTRIBUTE_ERR', 10],
    ['INVALID_STATE_ERR', 11],
    ['SYNTAX_ERR', 12],
    ['INVALID_MODIFICATION_ERR', 13],
    ['NAMESPACE_ERR', 14],
    ['INVALID_ACCESS_ERR', 15]
  ].forEach(function(p) { if (!(p[0] in global.DOMException)) global.DOMException[p[0]] = p[1]; });

  // Event and EventTargets interfaces
  // Needed for: IE8
  (function(){
    if (!('Element' in global) || Element.prototype.addEventListener || !Object.defineProperty)
      return;

    // interface Event

    // PhaseType (const unsigned short)
    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET       = 2;
    Event.BUBBLING_PHASE  = 3;

    Object.defineProperties(Event.prototype, {
      CAPTURING_PHASE: { get: function() { return 1; } },
      AT_TARGET:       { get: function() { return 2; } },
      BUBBLING_PHASE:   { get: function() { return 3; } },
      target: {
        get: function() {
          return this.srcElement;
        }},
      currentTarget: {
        get: function() {
          return this._currentTarget;
        }},
      eventPhase: {
        get: function() {
          return (this.srcElement === this.currentTarget) ? Event.AT_TARGET : Event.BUBBLING_PHASE;
        }},
      bubbles: {
        get: function() {
          switch (this.type) {
            // Mouse
          case 'click':
          case 'dblclick':
          case 'mousedown':
          case 'mouseup':
          case 'mouseover':
          case 'mousemove':
          case 'mouseout':
          case 'mousewheel':
            // Keyboard
          case 'keydown':
          case 'keypress':
          case 'keyup':
            // Frame/Object
          case 'resize':
          case 'scroll':
            // Form
          case 'select':
          case 'change':
          case 'submit':
          case 'reset':
            return true;
          }
          return false;
        }},
      cancelable: {
        get: function() {
          switch (this.type) {
            // Mouse
          case 'click':
          case 'dblclick':
          case 'mousedown':
          case 'mouseup':
          case 'mouseover':
          case 'mouseout':
          case 'mousewheel':
            // Keyboard
          case 'keydown':
          case 'keypress':
          case 'keyup':
            // Form
          case 'submit':
            return true;
          }
          return false;
        }},
      timeStamp: {
        get: function() {
          return this._timeStamp;
        }},
      stopPropagation: {
        value: function() {
          this.cancelBubble = true;
        }},
      preventDefault: {
        value: function() {
          this.returnValue = false;
        }},
      defaultPrevented: {
        get: function() {
          return this.returnValue === false;
        }}
    });

    // interface EventTarget

    function addEventListener(type, listener, useCapture) {
      if (typeof listener !== 'function') return;
      if (type === 'DOMContentLoaded') type = 'load';
      var target = this;
      var f = function(e) {
        e._timeStamp = Date.now();
        e._currentTarget = target;
        listener.call(this, e);
        e._currentTarget = null;
      };
      this['_' + type + listener] = f;
      this.attachEvent('on' + type, f);
    }

    function removeEventListener(type, listener, useCapture) {
      if (typeof listener !== 'function') return;
      if (type === 'DOMContentLoaded') type = 'load';
      var f = this['_' + type + listener];
      if (f) {
        this.detachEvent('on' + type, f);
        this['_' + type + listener] = null;
      }
    }

    [Window, HTMLDocument, Element].forEach(function(o) {
      o.prototype.addEventListener = addEventListener;
      o.prototype.removeEventListener = removeEventListener;
    });
  }());

  // CustomEvent
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  // Needed for: IE
  (function () {
    if ('CustomEvent' in global && typeof global.CustomEvent === "function")
      return;
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }
    CustomEvent.prototype = global.Event.prototype;
    global.CustomEvent = CustomEvent;
  })();

  // Shim for DOM Events for IE7-
  // http://www.quirksmode.org/blog/archives/2005/10/_and_the_winner_1.html
  // Use addEvent(object, event, handler) instead of object.addEventListener(event, handler)
  window.addEvent = function(obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false);
    } else if (obj.attachEvent) {
      obj["e" + type + fn] = fn;
      obj[type + fn] = function() {
        var e = window.event;
        e.currentTarget = obj;
        e.preventDefault = function() { e.returnValue = false; };
        e.stopPropagation = function() { e.cancelBubble = true; };
        e.target = e.srcElement;
        e.timeStamp = Date.now();
        obj["e" + type + fn].call(this, e);
      };
      obj.attachEvent("on" + type, obj[type + fn]);
    }
  };

  window.removeEvent = function(obj, type, fn) {
    if (obj.removeEventListener) {
      obj.removeEventListener(type, fn, false);
    } else if (obj.detachEvent) {
      obj.detachEvent("on" + type, obj[type + fn]);
      obj[type + fn] = null;
      obj["e" + type + fn] = null;
    }
  };

  // DOMTokenList interface and Element.classList / Element.relList
  // Needed for: IE9-
  // Use getClassList(elem) instead of elem.classList() if IE7- support is needed
  // Use getRelList(elem) instead of elem.relList() if IE7- support is needed
  (function() {
    function DOMTokenListShim(o, p) {
      function split(s) { return s.length ? s.split(/\s+/g) : []; }

      // NOTE: This does not exactly match the spec.
      function removeTokenFromString(token, string) {
        var tokens = split(string),
            index = tokens.indexOf(token);
        if (index !== -1) {
          tokens.splice(index, 1);
        }
        return tokens.join(' ');
      }

      Object.defineProperties(
        this,
        {
          length: {
            get: function() { return split(o[p]).length; }
          },

          item: {
            value: function(idx) {
              var tokens = split(o[p]);
              return 0 <= idx && idx < tokens.length ? tokens[idx] : null;
            }
          },

          contains: {
            value: function(token) {
              token = String(token);
              if (token.length === 0) { throw SyntaxError(); }
              if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
              var tokens = split(o[p]);

              return tokens.indexOf(token) !== -1;
            }
          },

          add: {
            value: function(/*tokens...*/) {
              var tokens = Array.prototype.slice.call(arguments).map(String);
              if (tokens.some(function(token) { return token.length === 0; })) {
                throw SyntaxError();
              }
              if (tokens.some(function(token) { return (/\s/).test(token); })) {
                throw Error("InvalidCharacterError");
              }

              try {
                var underlying_string = o[p];
                var token_list = split(underlying_string);
                tokens = tokens.filter(function(token) { return token_list.indexOf(token) === -1; });
                if (tokens.length === 0) {
                  return;
                }
                if (underlying_string.length !== 0 && !(/\s$/).test(underlying_string)) {
                  underlying_string += ' ';
                }
                underlying_string += tokens.join(' ');
                o[p] = underlying_string;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          remove: {
            value: function(/*tokens...*/) {
              var tokens = Array.prototype.slice.call(arguments).map(String);
              if (tokens.some(function(token) { return token.length === 0; })) {
                throw SyntaxError();
              }
              if (tokens.some(function(token) { return (/\s/).test(token); })) {
                throw Error("InvalidCharacterError");
              }

              try {
                var underlying_string = o[p];
                tokens.forEach(function(token) {
                  underlying_string = removeTokenFromString(token, underlying_string);
                });
                o[p] = underlying_string;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          toggle: {
            value: function(token/*, force*/) {
              var force = arguments[1];
              try {
                token = String(token);
                if (token.length === 0) { throw SyntaxError(); }
                if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
                var tokens = split(o[p]),
                    index = tokens.indexOf(token);

                if (index !== -1 && (!force || force === (void 0))) {
                  o[p] = removeTokenFromString(token, o[p]);
                  return false;
                }
                if (index !== -1 && force) {
                  return true;
                }
                var underlying_string = o[p];
                if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
                  underlying_string += ' ';
                }
                underlying_string += token;
                o[p] = underlying_string;
                return true;
              } finally {
                var length = split(o[p]).length;
                if (this.length !== length) { this.length = length; }
              }
            }
          },

          toString: {
            value: function() {
              return o[p];
            }
          }
        });
      if (!('length' in this)) {
        // In case getters are not supported
        this.length = split(o[p]).length;
      } else {
        // If they are, shim in index getters (up to 100)
        for (var i = 0; i < 100; ++i) {
          Object.defineProperty(this, String(i), {
            get: (function(n) { return function() { return this.item(n); }; }(i))
          });
        }
      }
    }

    function addToElementPrototype(p, f) {
      if ('Element' in global && Element.prototype && Object.defineProperty) {
        Object.defineProperty(Element.prototype, p, { get: f });
      }
    }

    // HTML - https://html.spec.whatwg.org
    // Element.classList
    if ('classList' in document.createElement('span')) {
      window.getClassList = function(elem) { return elem.classList; };
    } else {
      window.getClassList = function(elem) { return new DOMTokenListShim(elem, 'className'); };
      addToElementPrototype('classList', function() { return new DOMTokenListShim(this, 'className'); } );
    }

    // HTML - https://html.spec.whatwg.org
    // HTMLAnchorElement.relList
    // HTMLLinkElement.relList
    if ('relList' in document.createElement('link')) {
      window.getRelList = function(elem) { return elem.relList; };
    } else {
      window.getRelList = function(elem) { return new DOMTokenListShim(elem, 'rel'); };
      addToElementPrototype('relList', function() { return new DOMTokenListShim(this, 'rel'); } );
    }

    // Add second argument to native DOMTokenList.toggle() if necessary
    (function() {
      if (!('DOMTokenList' in global)) return;
      var e = document.createElement('span');
      if (!('classList' in e)) return;
      e.classList.toggle('x', false);
      if (!e.classList.contains('x')) return;
      global.DOMTokenList.prototype.toggle = function toggle(token/*, force*/) {
        var force = arguments[1];
        if (force === undefined) {
          var add = !this.contains(token);
          this[add ? 'add' : 'remove'](token);
          return add;
        }
        force = !!force;
        this[force ? 'add' : 'remove'](token);
        return force;
      };
    }());


    // DOM - Interface NonDocumentTypeChildNode
    // Interface NonDocumentTypeChildNode
    // previousElementSibling / nextElementSibling - for IE8

    if (!('previousElementSibling' in document.documentElement)) {
      addToElementPrototype('previousElementSibling', function() {
        var n = this.previousSibling;
        while (n && n.nodeType !== Node.ELEMENT_NODE)
          n = n.previousSibling;
        return n;
      });
    }

    if (!('nextElementSibling' in document.documentElement)) {
      addToElementPrototype('nextElementSibling', function() {
        var n = this.nextSibling;
        while (n && n.nodeType !== Node.ELEMENT_NODE)
          n = n.nextSibling;
        return n;
      });
    }
  }());

  // Element.matches
  // https://developer.mozilla.org/en/docs/Web/API/Element/matches
  // Needed for: IE, Firefox 3.6, early Webkit and Opera 15.0
  // Use msMatchesSelector(selector) for IE
  // Use oMatchesSelector(selector) for Opera 15.0
  // Use mozMatchesSelector(selector) for Firefox 3.6
  // Use webkitMatchesSelector(selector) for early Webkit
  // Use polyfill if no matches() support, but querySelectorAll() support
  if ('Element' in global && !Element.prototype.matches) {
    if (Element.prototype.msMatchesSelector) {
      Element.prototype.matches = Element.prototype.msMatchesSelector;
    } else if (Element.prototype.oMatchesSelector) {
      Element.prototype.matches = Element.prototype.oMatchesSelector;
    } else if (Element.prototype.mozMatchesSelector) {
      Element.prototype.matches = Element.prototype.mozMatchesSelector;
    } else if (Element.prototype.webkitMatchesSelector) {
      Element.prototype.matches = Element.prototype.webkitMatchesSelector;
    } else if (document.querySelectorAll) {
      Element.prototype.matches = function matches(selector) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(selector),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
    }
  }

  // Element.closest
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {};
      } while ((i < 0) && (el = el.parentElement));
      return el;
    };
  }

  function mixin(o, ps) {
    if (!o) return;
    Object.keys(ps).forEach(function(p) {
      if ((p in o) || (p in o.prototype)) return;
      try {
        Object.defineProperty(
          o.prototype,
          p,
          Object.getOwnPropertyDescriptor(ps, p)
        );
      } catch (ex) {
        // Throws in IE8; just copy it
        o[p] = ps[p];
      }
    });
  }

  // Mixin ParentNode
  // https://dom.spec.whatwg.org/#interface-parentnode

  function convertNodesIntoANode(nodes) {
    var node = null;
    nodes = nodes.map(function(node) {
      return !(node instanceof Node) ? document.createTextNode(node) : node;
    });
    if (nodes.length === 1) {
      node = nodes[0];
    } else {
      node = document.createDocumentFragment();
      nodes.forEach(function(n) { node.appendChild(n); });
    }
    return node;
  }

  var ParentNode = {
    prepend: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      nodes = convertNodesIntoANode(nodes);
      this.insertBefore(nodes, this.firstChild);
    },
    append: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      nodes = convertNodesIntoANode(nodes);
      this.appendChild(nodes);
    }
  };

  mixin(global.Document || global.HTMLDocument, ParentNode); // HTMLDocument for IE8
  mixin(global.DocumentFragment, ParentNode);
  mixin(global.Element, ParentNode);

  // Mixin ChildNode
  // https://dom.spec.whatwg.org/#interface-childnode

  var ChildNode = {
    before: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      var parent = this.parentNode;
      if (!parent) return;
      var viablePreviousSibling = this.previousSibling;
      while (nodes.indexOf(viablePreviousSibling) !== -1)
        viablePreviousSibling = viablePreviousSibling.previousSibling;
      var node = convertNodesIntoANode(nodes);
      parent.insertBefore(node, viablePreviousSibling ?
                          viablePreviousSibling.nextSibling : parent.firstChild);
    },
    after: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      var parent = this.parentNode;
      if (!parent) return;
      var viableNextSibling = this.nextSibling;
      while (nodes.indexOf(viableNextSibling) !== -1)
        viableNextSibling = viableNextSibling.nextSibling;
      var node = convertNodesIntoANode(nodes);
      parent.insertBefore(node, viableNextSibling);
    },
    replaceWith: function(/*...nodes*/) {
      var nodes = [].slice.call(arguments);
      var parent = this.parentNode;
      if (!parent) return;
      var viableNextSibling = this.nextSibling;
      while (nodes.indexOf(viableNextSibling) !== -1)
        viableNextSibling = viableNextSibling.nextSibling;
      var node = convertNodesIntoANode(nodes);

      if (this.parentNode === parent)
        parent.replaceChild(node, this);
      else
        parent.insertBefore(node, viableNextSibling);
    },
    remove: function() {
      if (!this.parentNode) return;
      this.parentNode.removeChild(this);
    }
  };

  mixin(global.DocumentType, ChildNode);
  mixin(global.Element, ChildNode);
  mixin(global.CharacterData, ChildNode);

}(self));
