/* **********************************************************************
 * ScrollingTabsControl - Class that each directive will instantiate
 * **********************************************************************/
function ScrollingTabsControl($tabsContainer) {
  var stc = this;

  stc.$tabsContainer = $tabsContainer;
  stc.instanceId = $.fn.scrollingTabs.nextInstanceId++;

  stc.movableContainerLeftPos = 0;
  stc.scrollArrowsVisible = false;
  stc.scrollToTabEdge = false;
  stc.disableScrollArrowsOnFullyScrolled = false;
  stc.reverseScroll = false;
  stc.widthMultiplier = 1;

  stc.scrollMovement = new ScrollMovement(stc);
  stc.eventHandlers = new EventHandlers(stc);
  stc.elementsHandler = new ElementsHandler(stc);
}

// prototype methods
(function (p) {
  p.initTabs = function (options, $scroller, readyCallback, attachTabContentToDomCallback) {
    var stc = this,
        elementsHandler = stc.elementsHandler,
        num;

    if (options.enableRtlSupport && $('html').attr('dir') === 'rtl') {
      stc.rtl = true;
    }

    if (options.scrollToTabEdge) {
      stc.scrollToTabEdge = true;
    }

    if (options.disableScrollArrowsOnFullyScrolled) {
      stc.disableScrollArrowsOnFullyScrolled = true;
    }

    if (options.reverseScroll) {
      stc.reverseScroll = true;
    }

    if (options.widthMultiplier !== 1) {
      num = Number(options.widthMultiplier); // handle string value

      if (!isNaN(num)) {
        stc.widthMultiplier = num;
      }
    }

    if (options.bootstrapVersion.toString().charAt(0) === '4') {
      stc.usingBootstrap4 = true;
    }

    setTimeout(initTabsAfterTimeout, 100);

    function initTabsAfterTimeout() {
      var actionsTaken;

      // if we're just wrapping non-data-driven tabs, the user might
      // have the .nav-tabs hidden to prevent the clunky flash of
      // multi-line tabs on page refresh, so we need to make sure
      // they're visible before trying to wrap them
      $scroller.find('.nav-tabs').show();

      elementsHandler.initElements(options);
      actionsTaken = elementsHandler.refreshAllElementSizes();

      $scroller.css('visibility', 'visible');

      if (attachTabContentToDomCallback) {
        attachTabContentToDomCallback();
      }

      if (readyCallback) {
        readyCallback();
      }
    }
  };

  p.scrollToActiveTab = function(options) {
    var stc = this,
        smv = stc.scrollMovement;

    smv.scrollToActiveTab(options);
  };
}(ScrollingTabsControl.prototype));
