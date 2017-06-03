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

        if (settings.enableSwiping) {
          $targetEl.parent().addClass('scrtabs-allow-scrollbar');
        }

console.log("NOT data-driven, calling wrapNavTabsInstanceInScroller, $targetEl.data(): ", $targetEl.data());
        wrapNavTabsInstanceInScroller($targetEl, settings, readyCallback);

        console.log("NOT data-driven, AFTER calling wrapNavTabsInstanceInScroller, $targetEl.data(): ", $targetEl.data());

        if (settings.enableSwiping) {
          $targetEl.data('scrtabs', {
            enableSwipingElement: 'parent'
          });
        }
      });

    }

    // ---- tabs data-driven -------------------------
    return $targetEls.each(function (index) {
      var $targetEl = $(this),
          readyCallback = (index < targetElsLastIndex) ? null : function() {
            $targetEls.trigger(CONSTANTS.EVENTS.TABS_READY);
          };

console.log("Data-driven, calling buildNavTabsAndTabContentForTargetElementInstance, $targetEl.data(): ", $targetEl.data());

      var $newTargetEl = buildNavTabsAndTabContentForTargetElementInstance($targetEl, settings, readyCallback);

      console.log("Data-driven, AFTER calling buildNavTabsAndTabContentForTargetElementInstance, $newTargetEl.data(): ", $newTargetEl.data());

      if (settings.enableSwiping) {
        $newTargetEl.addClass('scrtabs-allow-scrollbar');
        $newTargetEl.data('scrtabs').enableSwipingElement = 'self';
      }
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
  var $targetElInstance = $(this),
      scrtabsData = $targetElInstance.data('scrtabs'),
      $tabsContainer;

console.log("DESTROY, $targetElInstance.data(): ",$targetElInstance.data());
  if (!scrtabsData) {
    return;
  }

  if (scrtabsData.enableSwipingElement === 'self') {
    $targetElInstance.removeClass('scrtabs-allow-scrollbar');
  } else if (scrtabsData.enableSwipingElement === 'parent') {
    $targetElInstance.parent().removeClass('scrtabs-allow-scrollbar');
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

  $(window).off(CONSTANTS.EVENTS.WINDOW_RESIZE);
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
  enableSwiping: false
};
