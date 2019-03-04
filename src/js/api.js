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

function destroyPlugin() {
  /* jshint validthis: true */
  var $targetElInstance = $(this),
      scrtabsData = $targetElInstance.data('scrtabs'),
      $tabsContainer;

  if (!scrtabsData) {
    return;
  }

  if (scrtabsData.enableSwipingElement === 'self') {
    $targetElInstance.removeClass(CONSTANTS.CSS_CLASSES.ALLOW_SCROLLBAR);
  } else if (scrtabsData.enableSwipingElement === 'parent') {
    $targetElInstance.closest('.scrtabs-tab-container').parent().removeClass(CONSTANTS.CSS_CLASSES.ALLOW_SCROLLBAR);
  }

  scrtabsData.scroller
    .off(CONSTANTS.EVENTS.DROPDOWN_MENU_SHOW)
    .off(CONSTANTS.EVENTS.DROPDOWN_MENU_HIDE);

  // if there were any dropdown menus opened, remove the css we added to
  // them so they would display correctly
  scrtabsData.scroller
    .find('[data-' + CONSTANTS.DATA_KEY_DDMENU_MODIFIED + ']')
    .css({
      display: '',
      left: '',
      top: ''
    })
    .off(CONSTANTS.EVENTS.CLICK)
    .removeAttr('data-' + CONSTANTS.DATA_KEY_DDMENU_MODIFIED);

  if (scrtabsData.scroller.hasTabClickHandler) {
    $targetElInstance
      .find('a[data-toggle="tab"]')
      .off('.scrtabs');
  }

  if (scrtabsData.isWrapperOnly) { // we just wrapped nav-tabs markup, so restore it
    // $targetElInstance is the ul.nav-tabs
    $tabsContainer = $targetElInstance.parents('.scrtabs-tab-container');

    if ($tabsContainer.length) {
      $tabsContainer.replaceWith($targetElInstance);
    }

  } else { // we generated the tabs from data so destroy everything we created
    if (scrtabsData.scroller && scrtabsData.scroller.initTabs) {
      scrtabsData.scroller.initTabs = null;
    }

    // $targetElInstance is the container for the ul.nav-tabs we generated
    $targetElInstance
      .find('.scrtabs-tab-container')
      .add('.tab-content')
      .remove();
  }

  $targetElInstance.removeData('scrtabs');

  while(--$.fn.scrollingTabs.nextInstanceId >= 0) {
    $(window).off(CONSTANTS.EVENTS.WINDOW_RESIZE + $.fn.scrollingTabs.nextInstanceId);
  }

  $('body').off(CONSTANTS.EVENTS.FORCE_REFRESH);
}


$.fn.scrollingTabs = function(methodOrOptions) {

  if (methods[methodOrOptions]) {
    return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
  } else if (!methodOrOptions || (typeof methodOrOptions === 'object')) {
    return methods.init.apply(this, arguments);
  } else {
    $.error('Method ' + methodOrOptions + ' does not exist on $.scrollingTabs.');
  }
};

$.fn.scrollingTabs.nextInstanceId = 0;

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
  cssClassRightArrow: 'glyphicon glyphicon-chevron-right',
  leftArrowContent: '',
  rightArrowContent: '',
  tabsLiContent: null,
  tabsPostProcessors: null,
  enableSwiping: false,
  enableRtlSupport: false,
  handleDelayedScrollbar: false,
  bootstrapVersion: 3
};
