/** ********************************
 * basiq (Basic JS library)
 * Authors: @smorcuend,@jmanuel_rosa
 ***********************************
 * basiq CORE DEFINITION
 ********************************** */
/*jshint -W055 */
/* global basiq */
'use strict';
if (typeof window.define === 'function' && window.define.amd) {
    window.define('basiq', [], function() {
        return window.basiq;
    });
}
(function() {
    // $ returns new Library object that hold our selector. Ex: $('.wrapper')
    var $ = function(params, ctx) {
        return new basiq(params, ctx);
    };

    // In our Library we get our selector with querySelectorAll (we do not support < ie8)
    // We also add selector length, version and twitter/github or whatever you like as information about your library.
    var basiq = function(params, ctx) {

        //ctx
        this.ctx = ctx || document;
        var selector = null;
        this.length = 0;

        //Check type of params
        if (typeof params === 'string') {
            // Get string params
            try {
                selector = this.ctx.querySelectorAll(params);
            } catch (e) {
                console.log(e + ' - ctx must be a valid DOM element');
            }
            // Get selector length
            this.length = selector.length;
            // Add selector to object for method chaining
            for (var i = 0; i < this.length; i++) {
                this[i] = selector[i];
            }

        } else if (params instanceof NodeList) {
            for (var cont = 0; cont < params.length; cont++) {
                if (params[cont].nodeType === 3) {
                    continue;
                }
                this[this.length + cont] = params[cont];
            }
            this.length += cont;
        } else if (typeof params === 'object') {
            if (!(params.nodeType && params.nodeType === 3)) {
                // Get params as object
                this[0] = params;
                this.length = 1;
            }
        }
        // Return as object
        return this;
    };

    // Assign our $ alias object to global window object.
    if (!window.basiq || !window.$) {
        window.basiq = window.$ = $;
    }
    //Add version
    window.basiq.version = 'master';

    window.$.fn = basiq.prototype = {

        isWindow: function() {
            return this[0] !== null && this[0] === window;
        },
        /**
         * Hide element(s) from DOM
         * @returns {*}
         */
        hide: function() {
            var len = this.length;
            // Here we simply loop through our object (this) and set the css to display none.
            //If you got more that 1 node from DOM selected with querySelectorAll, you would hide them all.
            while (len--) {
                this[len].style.display = 'none';
            }

            // It's important to return this if you want to chain methods!
            return this;
        },
        /**
         * Show element(s) from DOM
         * @returns {*}
         */
        show: function() {
            var len = this.length;
            while (len--) {
                this[len].style.display = 'block';
            }

            return this;
        },
        /**
         * Get all element(s) from DOM query selector
         * @returns {Array}
         */
        all: function() {
            return this;
        },
        /**
         * Get first element from DOM query selector
         * @returns {Element}
         */
        first: function() {
            return this;
        },
        /**
         * Looking for a selector inside an element
         * @return {[basiq]}
         */
        find: function(element) {
            if (!this.length) {
                return new basiq(undefined);
            } else if (this.length === 1) {
                return new basiq(element, this[0]);
            } else {
                //TODO: Extender un objeto basiq con más elementos
                var obj = {};
                for (var i = 0; i < this.length; i++) {
                    $.extend(obj, new basiq(element, this[i]));
                }
                return obj;
            }
        },
        /**
         * Get last element from DOM query selector
         * @returns {Element}
         */
        last: function() {
            return this.length > 0 ? this[this.length - 1] : null;
        },
        /**
         * Get custom element from DOM query selector
         * @returns {Element}
         */
        get: function(index) {
            if (index === -1) {
                return this.last();
            } else {
                return this[index];
            }
        },
        /**
         * Remove all child nodes from query DOM selector
         * @returns {*}
         */
        empty: function() {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = null;
            }
        },
        /**
         * Remove element from DOM
         * @returns {*}
         */
        remove: function() {
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
        },
        /**
         * hasClass
         * @returns {Boolean}
         */
        hasClass: function(className) {
            for (var i = 0; i < this.length; i++) {
                return this[i].classList.contains(className);
            }
            return false;
        },
        /*
         * addClass, removeClass, toggleClass from DOM query selector
         * @returns {*}
         */
        addClass: function(className) {
            for (var i = 0; i < this.length; i++) {
                this[i].classList.add(className);
            }
        },
        removeClass: function(className) {
            for (var i = 0; i < this.length; i++) {
                this[i].classList.remove(className);
            }
        },
        toggleClass: function(className) {
            for (var i = 0; i < this.length; i++) {
                this[i].classList.toggle(className);
            }
        },
        /**
         *Set one or more properties for the set of matched elements.
         *$(elem).prop(propertyName, value)
         */
        prop: function(propertyName, value) {
            var arrProperties = [];
            for (var i = 0; i < this.length; i++) {
                var nType = this[i].nodeType;
                // don't get/set properties on text, comment and attribute nodes
                if (!this[i] || nType === 3 || nType === 8 || nType === 2) {
                    return;
                }
                if (value !== undefined) {
                    this[i].setAttribute(propertyName, value);
                } else {
                    value = this[i].getAttribute(propertyName);
                    arrProperties.push(value);
                }
            }
            if (!arrProperties.lenght) {
                return arrProperties;
            }
        },
        /**
         *Remove a property for the set of matched elements.
         *$(elem).removeProp(propertyName)
         */
        removeProp: function(propertyName) {
            for (var i = 0; i < this.length; i++) {
                var nType = this[i].nodeType;
                // don't get/set properties on text, comment and attribute nodes
                if (!this[i] || nType === 3 || nType === 8 || nType === 2) {
                    return;
                }
                this[i].removeAttribute(propertyName);
            }
        },
        /*
         * append HTML Elements from string to DOM query selector
         * @returns {*}
         */
        append: function(stringHtml) {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML += stringHtml;
            }
        },
        /* Render template function
         * @returns {*}
         */
        render: function(html) {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = html;
            }
        },
        outerHeight: function() {
            if (!this.length) {
                return null;
            }
            return this[0].getBoundingClientRect().height;
        },
        outerWidth: function() {
            if (!this.length) {
                return null;
            }
            return this[0].getBoundingClientRect().width;
        },
        position: function() {
            if (!this.length) {
                return null;
            }
            var positions = this[0].getBoundingClientRect();
            return {
                top: positions.top,
                left: positions.left,
                bottom: positions.bottom,
                right: positions.right
            };
        },
        /* Css apply styles function
         * @returns {*}
         */
        css: function(cssObjectStyles) {
            for (var prop in cssObjectStyles) {
                if (cssObjectStyles.hasOwnProperty(prop)) {
                    for (var i = 0; i < this.length; i++) {
                        this[i].style[prop] = cssObjectStyles[prop];
                    }

                }
            }
        },
        /**
         * Get parent from element
         * @return {[basiq]}
         */
        parent: function() {
            if (this.length > 0) {
                return new basiq(this[0].parentNode);
            } else {
                return new basiq(undefined);
            }
        },
        /**
         * Check if element is parent
         * @return {[basiq]}
         */
        closest: function(pivot) {
            if (!this.length) {
                return new basiq(undefined);
            }
            var now = this[0];
            var found = (now === pivot);
            while (!found && now !== this.ctx.body) {
                now = now.parentNode;
                if (now === null) {
                    return new basiq(undefined);
                }
                found = (now === pivot);
            }
            if (found) {
                return new basiq(now);
            }
            return new basiq(undefined);
        },
        /* CSS3 Columnizr function
         * @returns {*}
         */
        columnizr: function(numberOfCols, columnGap, columnRule) {

            if ($.supports('columnCount')) {

                if (typeof columnGap === 'number' || !columnGap.contains('px')) {
                    columnGap = columnGap + 'px';
                }
                //when number of cols is one, use columnWidth instead columnCount
                if (numberOfCols === 1) {
                    this[0].style.WebkitColumnWidth = this[0].clientWidth + 'px';
                    this[0].style.MozColumnWidth = this[0].clientWidth + 'px';
                    this[0].style.columnWidth = this[0].clientWidth + 'px';
                } else {
                    this[0].style.WebkitColumnWidth = 'auto';
                    this[0].style.MozColumnWidth = 'auto';
                    this[0].style.columnWidth = 'auto';

                    this[0].style.MozColumnCount = numberOfCols;
                    this[0].style.WebkitColumnCount = numberOfCols;
                    this[0].style.columnCount = numberOfCols;
                }

                if (columnRule) {
                    this[0].style.MozColumnRule = columnRule;
                    this[0].style.WebkitColumnRule = columnRule;
                    this[0].style.columnRule = columnRule;
                }

                if (columnGap) {
                    this[0].style.MozColumnGap = columnGap;
                    this[0].style.WebkitColumnGap = columnGap;
                    this[0].style.columnGap = columnGap;
                }

                //Check if exists scrollable content on current chapter
                var absoluteLeftValue = Math.abs(parseInt(this[0].style.left.replace('px', '')));
                return (this[0].scrollWidth + absoluteLeftValue) > this[0].clientWidth;

            } else {
                $.log.warn('Your browser not support CSS3 columns');
                return false;
            }

        }
    }; //end of basiq object



    /** ----------------------------------------
     *Prototyping without query selector section
     * ------------------------------------------ */

    /**Extend the Library object.
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
     * @param       {[type]}                 obj [description]
     * @return      {[type]}                     [description]
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
     * @param       {[type]}                 o [description]
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
     * @return      {[boolean]}
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
                async = !async ? true : async;
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
     * @param  {[type]}   win [description]
     * @param  {Function} fn  [description]
     * @return {[type]}       [description]
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
     * @param       {[type]}                 obj [description]
     * @return      {[String]}                     [description]
     */
    $.getObjectType = function(obj) {
        return Object.prototype.toString.call(obj);
    };

    /**
     * [getIndex description]
     * @date        2014-07-22
     * @anotherdate 2014-07-22T14:53:39+0100
     * @param       {[type]}                 node [description]
     * @return      {[type]}                      [description]
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
     * @param       {[type]}                 parentNode [description]
     * @param       {[type]}                 index      [number [1-length]]
     * @return      {[Node]}                            [return node]
     */
    $.getNodeFromIndex = function(parentNode, index) {
        return parentNode.childNodes[index - 1];
    };

})();
