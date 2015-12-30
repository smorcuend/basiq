'use strict';
/**
 * @module basiq.core
 * @version 1.0
 * @authors: @smorcuend, @jmanuel_rosa
 * @title basiq (Basic JS library)
 * @description  basiq CORE DEFINITION. Represents a Basiq object. In our Library we get our selector with querySelectorAll (we do not support < ie8).
 * We also add selector length, version and twitter/github or whatever you like as information about your library.
 */
(function() {

	if (typeof window.define === 'function' && window.define.amd) {
		window.define('basiq', [], function() {
			return window.basiq;
		});
	}

	//es6-shim promises
	if (typeof Promise === 'undefined' && Promise.toString().indexOf('[native code]') === -1) {
		var es6Shim = document.createElement('script');
		es6Shim.setAttribute('src', '//cdn.rawgit.com/jakearchibald/es6-promise/master/dist/es6-promise.min.js');
		document.body.appendChild(es6Shim);
	}

	/** @class */
	function Basiq(params, ctx) {

		//context
		this.ctx = ctx || document;
		var selector = null;
		this.length = 0;

		//Check type of params
		if (typeof params === 'string') {
			// Get string params
			try {
				selector = this.ctx.querySelectorAll(params);
			} catch (e) {
				console.error(e + ' - ctx must be a valid DOM element');
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
	}

  //$ returns new Library object that hold our selector. Ex: $('.wrapper')
  function $(params, ctx) {
    return new Basiq(params, ctx);
  }

  // Assign our $ alias object to global window object.
  if (!window.basiq || !window.$) {
    window.basiq = window.$ = $;
  }

	/** @namespace */
	$.fn = Basiq.prototype = {
		/**
    *
		 * Check global window object
		 * @returns {object}
		 */
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
			var arr = [],
				len = this.length;
			while (len--) {
				arr.push(this[len]);
			}
			return arr;
		},
		/**
		 * Get first element from DOM query selector
		 * @returns {DOMElement}
		 */
		first: function() {
			return this.get(0);
		},
		/**
		 * Get last element from DOM query selector
		 * @returns {DOMElement}
		 */
		last: function() {
			return this.get(this.length - 1);
		},
		/**
		 * Get custom element from DOM query selector
		 * @returns {Element}
		 */
		get: function(index) {
			var len = this.length;
			return len > 0 && index >= 0 && index < len ? this[index] : null;
		},
		/**
		 * Looking for a selector inside an element
		 * @return {Object}
		 */
		find: function(element) {
			if (!this.length) {
				return new Basiq();
			} else if (this.length === 1) {
				return new Basiq(element, this[0]);
			} else {
				//TODO: Extender un objeto basiq con más elementos
				var obj = {};
				for (var i = 0; i < this.length; i++) {
					$.extend(obj, new Basiq(element, this[i]));
				}
				return obj;
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
		 * Set one or more properties for the set of matched elements.
		 * $(elem).prop(propertyName, value)
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
		 * Remove a property for the set of matched elements.
		 * $(elem).removeProp(propertyName)
		 * @returns {*}
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
		/**
		 * Append HTML Elements from string to DOM query selector
		 * @returns {*}
		 */
		append: function(stringHtml) {
			for (var i = 0; i < this.length; i++) {
				this[i].innerHTML += stringHtml;
			}
		},
		/**
		 * Render template function
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
		/**
		 * Css apply styles function
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
		 * @return {Object}
		 */
		parent: function() {
			if (this.length > 0) {
				return new Basiq(this[0].parentNode);
			} else {
				return new Basiq();
			}
		},
		/**
		 * Check if element is parent
		 * @return {Object}
		 */
		closest: function(pivot) {
			if (!this.length) {
				return new Basiq();
			}
			var now = this[0];
			var found = (now === pivot);
			while (!found && now !== this.ctx.body) {
				now = now.parentNode;
				if (now === null) {
					return new Basiq();
				}
				found = (now === pivot);
			}
			if (found) {
				return new Basiq(now);
			}
			return new Basiq();
		},
		/**
		 * CSS3 Columnizr function
		 * @returns {*}
		 */
		columnizr: function(numberOfCols, columnGap, columnRule) {

			if ($.supports('columnCount')) {

				if (typeof columnGap === 'number' || columnGap.indexOf('px') > -1) {
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

	module.exports = {
		basiq: $
	};

})();
