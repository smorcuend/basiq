# basiq.js 
basiq is a cross-platform JavaScript minimal library inspired by jQuery and based on new ES6 recommendation. Like as jQuery, basiq is designed to simplify the client-side scripting of HTML.

This library provides basic utilities as:
* DOM selector elements
* handle events
* helpers for develop Ajax applications

Also provides capabilities for developers to create plugins on top of the JavaScript library.(basiq plugins)

    Creator: @smorcuend
    Contributors: @jmanuel_rosa
    Source code: https://smorcuend.github.io/basiq

##Browser support
* Chrome 9+ 
* Firefox 6+
* Opera 11.6+
* Safari 6+
* IE 10+ (9 with polyfills)

##Changelog
* v0.0.1(work in progress)
    - Initial draft version
    - Gruntfile & bower.json added
    - source code scaffold added
    - dist & demo folder added

## Polyfills ES6

* String.prototype.contains

* String.prototype.starsWith

* Promise Object - https://github.com/jakearchibald/es6-promise

## Other functions

* supports: Check Support for some functionality or CSS property (detect CSS prefixes)    

* addWheelListener: Listener for mouse wheel action

## API Documentation

### Query selector "$(selector)" function

    .all()
Get all element(s) from DOM query selector
@returns {Array}
<br><br>

    .append()
Append HTML Elements from string to DOM query selector
<br><br>

    .addClass()
addClass to HTMLElement from DOM query selector
<br><br>

    .removeClass()
removeClass to HTMLElement from DOM query selector
<br><br>

    .toggleClass()
toggleClass to HTMLElement from DOM query selector
<br><br>

    .css()
Css apply styles function. Example: {'color':'red','fontSize':'16px'}
<br><br>

    .closest(pivot)
Get if element from DOM query selector have parent {pivot}
@return {[basiq]}
<br><br>

    .parent()
Get parent from element from DOM query selector
@return {[basiq]}
<br><br>

    .columnizr(numberOfCols, columnGap, columnRule)
CSS3 Columnizr function. Params -> numberOfCols: {int},columnGap:{css string  style},columnRule:{css string style}
<br><br>

    .resize( callback )
Detect resize event
<br><br>

### basiq helpers

    $.customEvent(name,data)
Generate custom events - Modern browsers. Params = name:{string}, data:{function}
<br><br>

    $.ajax( url, type, data, async, arrayHeaders, responseType)
XHR helper<br>
@return {native Promise}
<br><br>

    $.runLater(callback)
Force event added to the browser bucket event
<br><br>

### basiq plugins

###basiq.logger (basic logging helper):
    $.log
<br>
.err() - Error console log<br>
.warn() - warning console log <br>
info() - info console log<br>
<br><br>

####Set up debug mode:
$.log.debugmode:[debug mode]
[debug mode]
    0: Debug mode disable
    1: Simple debug mode
    2: Debug mode with trace
<br>

###basiq.browser (basic browser detect helper):
    $.browser
<br>
.{
    browser,
    version,
    name
}
<br><br>











