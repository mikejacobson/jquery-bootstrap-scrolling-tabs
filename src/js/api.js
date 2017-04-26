var methods = {
  destroy: function() {
    var $targetEls = this;

    return $targetEls.each(destroyPlugin);
  },

  init: function(options) {
    var $targetEls = this,
        targetElsLastIndex = $targetEls.length - 1,
        settings = $.extend({}, $.fn.scrollingTabs.defaults, options || {});

    // ---- tabs NOT data-driven -------------------------
    if (!settings.tabs) {

      // just wrap the selected .nav-tabs element(s) in the scroller
      return $targetEls.each(function(index) {
        var dataObj = {
              isWrapperOnly: true
            },
            $targetEl = $(this).data({ scrtabs: dataObj }),
            readyCallback = (index < targetElsLastIndex) ? null : function() {
              $targetEls.trigger(CONSTANTS.EVENTS.TABS_READY);
            };

        wrapNavTabsInstanceInScroller($targetEl, settings, readyCallback);
      });

    }

    // ---- tabs data-driven -------------------------
    return $targetEls.each(function (index) {
      var $targetEl = $(this),
          readyCallback = (index < targetElsLastIndex) ? null : function() {
            $targetEls.trigger(CONSTANTS.EVENTS.TABS_READY);
          };

      buildNavTabsAndTabContentForTargetElementInstance($targetEl, settings, readyCallback);
    });
  },

  refresh: function(options) {
    var $targetEls = this,
        settings = $.extend({}, $.fn.scrollingTabs.defaults, options || {});

    return $targetEls.each(function () {
      refreshTargetElementInstance($(this), settings);
    });
  },

  scrollToActiveTab: function() {
    return this.each(scrollToActiveTab);
  }
};


$.fn.scrollingTabs = function(methodOrOptions) {

  if (methods[methodOrOptions]) {
    return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (!methodOrOptions || (typeof methodOrOptions === 'object')) {
    return methods.init.apply(this, arguments);
  } else {
    $.error('Method ' + methodOrOptions + ' does not exist on $.scrollingTabs.');
  }
};

$.fn.scrollingTabs.defaults = {
  tabs: null,
  propPaneId: 'paneId',
  propTitle: 'title',
  propActive: 'active',
  propDisabled: 'disabled',
  propContent: 'content',
  ignoreTabPanes: false,
  scrollToTabEdge: false,
  disableScrollArrowsOnFullyScrolled: false,
  forceActiveTab: false,
  reverseScroll: false,
  widthMultiplier: 1,
  tabClickHandler: null,
  cssClassLeftArrow: 'glyphicon glyphicon-chevron-left',
  cssClassRightArrow: 'glyphicon glyphicon-chevron-right'
};
