/* global define*/
/**
 * [creates a event support for 'mouse wheel listener']
 * @param  {Function} callback   [handler callback for the event trigger]
 * @param  {boolean}   useCapture [stop or non stop propagation]
 * @return {basiq object}
 */

// UMD dance - https://github.com/umdjs/umd
'use strict';
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['basiq'], factory); // AMD
    } else if (typeof exports === 'object') {
        module.exports = factory(require('basiq')); // Node
    } else {
        factory(root.basiq); // Browser global
    }
}(window, function($) {

    var prefix = '',
        _addEventListener, support;

    // detect event model
    if (window.addEventListener) {
        _addEventListener = 'addEventListener';
    } else {
        _addEventListener = 'attachEvent';
        prefix = 'on';
    }

    function _addWheelListener(elem, eventName, callback, useCapture) {
        elem[_addEventListener](prefix + eventName, support === 'wheel' ? callback : function(originalEvent) {

            if (!originalEvent) {
                originalEvent = window.event;
            }

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: 'wheel',
                deltaMode: originalEvent.type === 'MozMousePixelScroll' ? 0 : 1,
                deltaX: 0,
                delatZ: 0,
                preventDefault: function() {
                    originalEvent.returnValue = originalEvent.preventDefault ? originalEvent.preventDefault() : false;
                }
            };

            // calculate deltaY (and deltaX) according to the event
            if (support === 'mousewheel') {
                event.deltaY = -1 / 40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                if (originalEvent.wheelDeltaX) {
                    event.deltaX = -1 / 40 * originalEvent.wheelDeltaX;
                }
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback(event);

        }, useCapture || false);
    }

    // detect available wheel event
    support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support 'wheel'
        document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least 'mousewheel'
        'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox

    $.fn.mousewheel = function(callback, useCapture) {
        //Get first element from basiq DOM selector
        if (support !== 'DOMMouseScroll') {
            _addWheelListener(this[0], support, callback, useCapture);
        } else {
            // handle MozMousePixelScroll in older Firefox
            _addWheelListener(this[0], 'MozMousePixelScroll', callback, useCapture);
        }
    };

}));
