//=include usage.js

if (typeof jQuery === 'undefined') {
  throw new Error('jquery-bootstrap-scrolling-tabs requires jQuery');
}
if (typeof jQuery.fn.tab === 'undefined' ||
    typeof jQuery.fn.tab.Constructor === 'undefined' ||
    typeof jQuery.fn.tab.Constructor.VERSION === 'undefined') {
  throw new Error("jquery-bootstrap-scrolling-tabs requires Bootstrap's tab plugin for jQuery");
}

;(function ($, window) {
  'use strict';
  /* jshint unused:false */

  //=include bsVersionUtil.js
  //=include constants.js
  //=include smartresize.js
  //=include elementsHandler.js
  //=include eventHandlers.js
  //=include scrollMovement.js
  //=include scrollingTabsControl.js

  //=include buildTabs.js
  //=include tabListeners.js
  //=include api.js


}(jQuery,
  window)
);
