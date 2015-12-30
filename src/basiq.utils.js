/**
 * @module basiq.utils
 * @version 1.0
 * @authors: @smorcuend, @jmanuel_rosa
 * @title basiq (Basic JS library)
 * @description  Prototyping without query selector section
 */
'use strict';

/** @namespace */
var $ = require('./basiq.core');

/**
 * Extend the Basiq object.
 * Merge the contents of an object onto the basiq prototype to provide new basiq instance methods.
 * params[0] = target object | boolean (deep copy)
 */
$.extend = function(objTarget, objExtra) {
  var source = {};
  var obj = objTarget;
  if (objExtra) {
    source = objTarget;
    obj = objExtra;
  }
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      source[prop] = obj[prop];
    }
  }
  return source;
};

/**
 * [clone description]
 * @date        2014-07-07
 * @anotherdate 2014-07-07T14:57:43+0100
 * @param       {Object}                 obj [description]
 * @return      {Object}                     [description]
 */
$.clone = function(obj) {
  // if (!$.isPlainObject(obj)) return obj;

  function cloneArrayDeeply() {
    var target = [];
    obj.forEach(function(item) {
      target.push($.clone(item));
    });
    return target;
  }
  if (Array.isArray(obj)) {
    return cloneArrayDeeply();
  }
  return $.extend(obj, {});
};

/**
 * [isPlainObject description]
 * @date        2014-07-07
 * @anotherdate 2014-07-07T14:57:49+0100
 * @param       {Object}                   [description]
 * @return      {Boolean}                  [description]
 */
$.isPlainObject = function(o) {
  return Object(o) === o && Object.getPrototypeOf(o) === Object.prototype;
};

/**
 * [resize event with propagation control]
 */
$.resize = function(callback) {

  var _resizeThrottler = function() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        callback();
      }, 500); // The actualResizeHandler will execute at a rate of 2fps (1/timer * 1000)
    }
  };
  window.addEventListener('resize', _resizeThrottler, false);
  var resizeTimeout;

};

/*
 * Generate custom events - Modern browsers
 * @returns {Event}
 */
$.customEvent = function(name, data) {
  //old-fashioned way - For old versions of IE
  if (!document.createEvent) {
    // Create the event
    var event = document.createEvent('Event');
    // Define that the event name is 'build'.
    event.initEvent('build', true, true);
    return event;
  } else {
    return (!data) ? new Event(name) : new CustomEvent(name, data);
  }
};

/**
 * Check Support for some functionality or property
 * @date        2014-04-16
 * @anotherdate 2014-04-16T13:21:07+0100
 * @return      {boolean}
 */
$.supports = (function() {
  var div = document.createElement('div'),
    vendors = 'Ms Moz Webkit'.split(' '),
    len = vendors.length;

  return function(prop) {
    if (prop in div.style) {
      return true;
    }
    prop = prop.replace(/^[a-z]/, function(val) {
      return val.toUpperCase();
    });

    var lenCheck = len;

    while (lenCheck--) {
      if (vendors[lenCheck] + prop in div.style) {
        return true;
      }
    }
    return false;
  };
})();

/* Network functions:
 * ajax ( url, type, data, async, arrayHeaders )
 * @returns Promise
 */
$.ajax = function(url, type, data, async, arrayHeaders, responseType) {

  // Return a new promise.
  return new Promise(function(resolve, reject) {

    try {

      var req = new XMLHttpRequest();
      async = !async ? true: async;
      type = !type ? 'GET' : type;
      req.open(type, url, async);

      if (responseType) {
        req.responseType = responseType;
      } else {
        req.responseType = 'text';
      }

      req.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      if (arrayHeaders) {
        for (var item in arrayHeaders) {
          req.setRequestHeader(item, arrayHeaders[item]);
        }
      }

      //In order to include cookies as part of the request, you need to set the XHR’s .withCredentials property to true
      if ('withCredentials' in req) {
        req.withCredentials = true;
      }

      req.onload = function() {
        //Check the status
        if (req.status === 200) {

          // var dataParsed = null;

          // if (req.responseType !== 'json' && req.getResponseHeader('Content-Type') === 'application/json') {
          //     dataParsed = JSON.parse(req.response);
          // } else {
          //     dataParsed = req.response;
          // }
          //resolve(dataParsed);

          resolve(req);

        } else {
          reject(req);
        }

      };
      // Handle network errors
      req.onerror = function() {
        reject(Error('Network Error'));
      };

      // Make the request
      if (data) {
        req.send(data);
      } else {
        req.send();
      }

    } catch (e) {
      throw new Error(e);
    }

  });

};

/*
 * runLater -> Force event added to the browser bucket event
 * @returns {callback}
 */
$.runLater = function(callback, delay) {
  if (!callback) {
    return false;
  }
  setTimeout(callback, delay || 0);
};

/* Base64 function
 * @returns {log}
 */
$.base64 = {
  encode: function(string) {
    window.btoa(window.unescape(encodeURIComponent(string)));
  },
  decode: function(string, mode) {
    if (mode === 'url') {
      // var modulus = string.length % 4;
      switch (string) {
        case 1:
          throw new Error('$.base64: Invalid token');
        case 2:
          string += '=';
          break;
        case 3:
          string += '=';
          break;
        default:
          break;
      }
    }
    return JSON.parse(decodeURIComponent(window.escape(window.atob(string))));
  }
};

/**
 *
 */
/* addStylesheetRules([
  ['h2', // Also accepts a second argument as an array of arrays instead
    ['color', 'red'],
    ['background-color', 'green', true] // 'true' for !important rules
  ],
  ['.myClass',
    ['background-color', 'yellow']
  ]
]);
type: false, internal
*/
$.addStylesheetRules = function(rules, dom, type, identifier) {

  function _insertContent(styleEl, rules) {
    if (typeof rules === 'string') {
      styleEl.innerHTML = rules;
      return;
    }
    //var s = styleEl.sheet;
    styleEl.innerHTML = '';
    for (var i = 0, rl = rules.length; i < rl; i++) {
      var j = 1,
        rule = rules[i],
        selector = rule[0],
        propStr = '';
      // If the second argument of a rule is an array of arrays, correct our variables.
      // if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
      //     rule = rule[1];
      //     j = 0;
      // }
      for (var pl = rule.length; j < pl; j++) {
        var prop = rule[j];
        //s.insertRule(selector, prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : ''), 0);
        propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
      }
      styleEl.innerHTML += selector + ' {' + propStr + '}\n';
      //s.insertRule(selector + ' {' + propStr + '} ', 0);
    }

  }

  if (undefined !== type && 'DOM' !== type && 'internal' !== type) {
    return false;
  }

  if (undefined === type || 'internal' === type) {
    var doc = dom || document;
    var styleEl = null;
    if ($(identifier, doc).length === 0) {
      styleEl = doc.createElement('style');
      styleEl.type = 'text/css';
      styleEl.id = identifier;
      doc.head.appendChild(styleEl);
      // Apparently some version of Safari needs the following line? I dunno.
      //styleEl.appendChild(doc.createTextNode(''));
      _insertContent(styleEl, rules);
      return true;
    } else {
      return false;
    }
  }

  return false;

};

/**
 * undefined: Se devuelve cuando los argumentos son incorrectos
 * false: Cuando no se cumplen las condiciones necesarias de los métodos
 * true: todo ha ido de forma correcta
 */
$.storage = {
  set: function(key, data) {
    // Los argumentos son obligatorios
    if (undefined === key || 0 === key.length || undefined === data || 0 === data.length) {
      return undefined;
    }

    // Si la clave ya existía, avisa de ello devolviendo falso
    if (false === this.get(key)) {
      return false;
    }

    localStorage.setItem(key, data);
    return true;
  },
  get: function(key) {
    if (undefined === key) {
      return undefined;
    }

    return localStorage.getItem(key);
  },
  remove: function(key) {
    if (undefined === key || 0 === key.length) {
      return undefined;
    }
    if (false === this.get(key)) {
      return false;
    }

    localStorage.removeItem(key);
    return true;
  },
  modify: function(key, data) {
    if (undefined === key || 0 === key.length || undefined === data || 0 === data.length) {
      return undefined;
    }

    localStorage.setItem(key, data);
    return true;
  }
};

/**
 * Find deeply nested objects by attrs = {property: value}
 */
$.findProp = function(items, attrs) {
  function match(value) {
    for (var key in attrs) {
      if (attrs[key] !== value[key]) {
        return false;
      }
    }
    return true;
  }

  function traverse(val) {
    var result;
    val.forEach(function(val) {
      if (match(val)) {
        result = val;
        return false;
      }
      if (val instanceof Object || Array.isArray(val)) {
        result = traverse(val);
      }
      if (result) {
        return false;
      }
    });

    return result;
  }
  return traverse(items);
};

/**
 * [contentLoaded description]
 * @param  {Window}   win [description]
 * @param  {Function} fn  [description]
 * @return {void}       [description]
 */
$.contentLoaded = function(win, fn) {

  var done = false,
    top = true,

    doc = win.document,
    root = doc.documentElement,

    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',

    init = function(e) {
      if (e.type === 'readystatechange' && doc.readyState !== 'complete') {
        return;
      }
      (e.type === 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        fn.call(win, e.type || e);
      }
    },

    poll = function() {
      try {
        root.doScroll('left');
      } catch (e) {
        setTimeout(poll, 50);
        return;
      }
      init('poll');
    };

  if (doc.readyState === 'complete') {
    fn.call(win, 'lazy');
  } else {
    if (doc.createEventObject && root.doScroll) {
      try {
        top = !win.frameElement;
      } catch (e) {}
      if (top) {
        poll();
      }
    }
    doc[add](pre + 'DOMContentLoaded', init, false);
    doc[add](pre + 'readystatechange', init, false);
    win[add](pre + 'load', init, false);
  }

};

/**
 * [getObjectType description]
 * @date        2014-07-04
 * @anotherdate 2014-07-04T13:14:58+0100
 * @param       {Object}                 obj [description]
 * @return      {String}                     [description]
 */
$.getObjectType = function(obj) {
  return Object.prototype.toString.call(obj);
};

/**
 * [getIndex description]
 * @date        2014-07-22
 * @anotherdate 2014-07-22T14:53:39+0100
 * @param       {NodeObject}                 node [description]
 * @return      {int}                      [description]
 */
$.getIndex = function(node) {
  var n = 0;
  node = node.previousSibling;
  while (node) {
    node = node.previousSibling;
    n++;
  }
  return n;
};

/**
 * [getNodeFromIndex description]
 * @date        2014-07-23
 * @anotherdate 2014-07-23T11:28:19+0100
 * @param       {NodeObject}                 parentNode [description]
 * @param       {int}                 index      [number [1-length]]
 * @return      {Node}                            [return node]
 */
$.getNodeFromIndex = function(parentNode, index) {
  return parentNode.childNodes[index - 1];
};
