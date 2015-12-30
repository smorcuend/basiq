/* logs function
 * @returns {void}
 */
/**
 * debug mode
 * 0: Debug mode disable
 * 1: Simple debug mode
 * 2: Debug mode with trace
 */
// UMD dance - https://github.com/umdjs/umd
'use strict';
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['basiq'], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory(require('../basiq.core')); // Node
  } else {
    factory(root.basiq); // Browser global
  }
}(window, function($) {

  $.log = (function() {

    var check = function(value, code) {
      if (!$.log.debugmode || !arguments.length) {
        return;
      } else if (typeof value === 'object') { //Only one argument
        for (var i in value) {
          switch (code) {
            case 0:
              console.info(i + '->');
              console.info(value[i]);
              break;
            case 1:
              console.info(i + '->');
              console.warn(value[i]);
              break;
            case 2:
              console.info(i + '->');
              console.error(value[i]);
              break;
            default:
              console.log(value[i]);
          }
        }
      } else {
        switch (code) {
          case 0:
            console.info(value);
            break;
          case 1:
            console.warn(value);
            break;
          case 2:
            console.error(value);
            break;
          default:
            console.log(value);
        }

      }
      if (console.trace && $.log.debugmode === 2) {
        console.trace();
      }
    };
    var err = function(value) {
      check(value, 2);
    };
    var warn = function(value) {
      check(value, 1);
    };
    var info = function(value) {
      check(value, 0);
    };

    return {
      debugmode: 0,
      err: err,
      warn: warn,
      info: info
    };

  })();

}));
