/* ***********************************************************************************
 * ElementsHandler - Class that each instance of ScrollingTabsControl will instantiate
 * **********************************************************************************/
function ElementsHandler(scrollingTabsControl) {
  var ehd = this;

  ehd.stc = scrollingTabsControl;
}

// ElementsHandler prototype methods
(function (p) {
    p.initElements = function (options) {
      var ehd = this;

      ehd.setElementReferences(options);
      ehd.setEventListeners(options);
    };

    p.listenForTouchEvents = function () {
      var ehd = this,
          stc = ehd.stc,
          smv = stc.scrollMovement,
          ev = CONSTANTS.EVENTS;

      var touching = false;
      var touchStartX;
      var startingContainerLeftPos;
      var newLeftPos;

      stc.$movableContainer
        .on(ev.TOUCH_START, function (e) {
          touching = true;
          startingContainerLeftPos = stc.movableContainerLeftPos;
          touchStartX = e.originalEvent.changedTouches[0].pageX;
        })
        .on(ev.TOUCH_END, function () {
          touching = false;
        })
        .on(ev.TOUCH_MOVE, function (e) {
          if (!touching) {
            return;
          }

          var touchPageX = e.originalEvent.changedTouches[0].pageX;
          var diff = touchPageX - touchStartX;
          if (stc.rtl) {
            diff = -diff;
          }
          var minPos;

          newLeftPos = startingContainerLeftPos + diff;
          if (newLeftPos > 0) {
            newLeftPos = 0;
          } else {
            minPos = smv.getMinPos();
            if (newLeftPos < minPos) {
              newLeftPos = minPos;
            }
          }
          stc.movableContainerLeftPos = newLeftPos;

          var leftOrRight = stc.rtl ? 'right' : 'left';
          stc.$movableContainer.css(leftOrRight, smv.getMovableContainerCssLeftVal());
          smv.refreshScrollArrowsDisabledState();
        });
    };

    p.refreshAllElementSizes = function () {
      var ehd = this,
          stc = ehd.stc,
          smv = stc.scrollMovement,
          scrollArrowsWereVisible = stc.scrollArrowsVisible,
          actionsTaken = {
            didScrollToActiveTab: false
          },
          isPerformingSlideAnim = false,
          minPos;

      ehd.setElementWidths();
      ehd.setScrollArrowVisibility();

      // this could have been a window resize or the removal of a
      // dynamic tab, so make sure the movable container is positioned
      // correctly because, if it is far to the left and we increased the
      // window width, it's possible that the tabs will be too far left,
      // beyond the min pos.
      if (stc.scrollArrowsVisible) {
        // make sure container not too far left
        minPos = smv.getMinPos();

        isPerformingSlideAnim = smv.scrollToActiveTab({
          isOnWindowResize: true
        });

        if (!isPerformingSlideAnim) {
          smv.refreshScrollArrowsDisabledState();

          if (stc.rtl) {
            if (stc.movableContainerRightPos < minPos) {
              smv.incrementMovableContainerLeft(minPos);
            }
          } else {
            if (stc.movableContainerLeftPos < minPos) {
              smv.incrementMovableContainerRight(minPos);
            }
          }
        }

        actionsTaken.didScrollToActiveTab = true;

      } else if (scrollArrowsWereVisible) {
        // scroll arrows went away after resize, so position movable container at 0
        stc.movableContainerLeftPos = 0;
        smv.slideMovableContainerToLeftPos();
      }

      return actionsTaken;
    };

    p.setElementReferences = function (settings) {
      var ehd = this,
          stc = ehd.stc,
          $tabsContainer = stc.$tabsContainer,
          $leftArrow,
          $rightArrow,
          $leftArrowClickTarget,
          $rightArrowClickTarget;

      stc.isNavPills = false;

      if (stc.rtl) {
        $tabsContainer.addClass(CONSTANTS.CSS_CLASSES.RTL);
      }

      if (stc.usingBootstrap4) {
        $tabsContainer.addClass(CONSTANTS.CSS_CLASSES.BOOTSTRAP4);
      }

      stc.$fixedContainer = $tabsContainer.find('.scrtabs-tabs-fixed-container');
      $leftArrow = stc.$fixedContainer.prev();
      $rightArrow = stc.$fixedContainer.next();

      // if we have custom arrow content, we might have a click target defined
      if (settings.leftArrowContent) {
        $leftArrowClickTarget = $leftArrow.find('.' + CONSTANTS.CSS_CLASSES.SCROLL_ARROW_CLICK_TARGET);
      }

      if (settings.rightArrowContent) {
        $rightArrowClickTarget = $rightArrow.find('.' + CONSTANTS.CSS_CLASSES.SCROLL_ARROW_CLICK_TARGET);
      }

      if ($leftArrowClickTarget && $leftArrowClickTarget.length) {
        $leftArrow.addClass(CONSTANTS.CSS_CLASSES.SCROLL_ARROW_WITH_CLICK_TARGET);
      } else {
        $leftArrowClickTarget = $leftArrow;
      }

      if ($rightArrowClickTarget && $rightArrowClickTarget.length) {
        $rightArrow.addClass(CONSTANTS.CSS_CLASSES.SCROLL_ARROW_WITH_CLICK_TARGET);
      } else {
        $rightArrowClickTarget = $rightArrow;
      }

      stc.$movableContainer = $tabsContainer.find('.scrtabs-tabs-movable-container');
      stc.$tabsUl = $tabsContainer.find('.nav-tabs');

      // check for pills
      if (!stc.$tabsUl.length) {
        stc.$tabsUl = $tabsContainer.find('.nav-pills');

        if (stc.$tabsUl.length) {
          stc.isNavPills = true;
        }
      }

      stc.$tabsLiCollection = stc.$tabsUl.find('> li');

      stc.$slideLeftArrow = stc.reverseScroll ? $leftArrow : $rightArrow;
      stc.$slideLeftArrowClickTarget = stc.reverseScroll ? $leftArrowClickTarget : $rightArrowClickTarget;
      stc.$slideRightArrow = stc.reverseScroll ? $rightArrow : $leftArrow;
      stc.$slideRightArrowClickTarget = stc.reverseScroll ? $rightArrowClickTarget : $leftArrowClickTarget;
      stc.$scrollArrows = stc.$slideLeftArrow.add(stc.$slideRightArrow);

      stc.$win = $(window);
    };

    p.setElementWidths = function () {
      var ehd = this,
          stc = ehd.stc;

      stc.winWidth = stc.$win.width();
      stc.scrollArrowsCombinedWidth = stc.$slideLeftArrow.outerWidth() + stc.$slideRightArrow.outerWidth();

      ehd.setFixedContainerWidth();
      ehd.setMovableContainerWidth();
    };

    p.setEventListeners = function (settings) {
      var ehd = this,
          stc = ehd.stc,
          evh = stc.eventHandlers,
          ev = CONSTANTS.EVENTS,
          resizeEventName = ev.WINDOW_RESIZE + stc.instanceId;

      if (settings.enableSwiping) {
        ehd.listenForTouchEvents();
      }

      stc.$slideLeftArrowClickTarget
        .off('.scrtabs')
        .on(ev.MOUSEDOWN, function (e) { evh.handleMousedownOnSlideMovContainerLeftArrow.call(evh, e); })
        .on(ev.MOUSEUP, function (e) { evh.handleMouseupOnSlideMovContainerLeftArrow.call(evh, e); })
        .on(ev.CLICK, function (e) { evh.handleClickOnSlideMovContainerLeftArrow.call(evh, e); });

      stc.$slideRightArrowClickTarget
        .off('.scrtabs')
        .on(ev.MOUSEDOWN, function (e) { evh.handleMousedownOnSlideMovContainerRightArrow.call(evh, e); })
        .on(ev.MOUSEUP, function (e) { evh.handleMouseupOnSlideMovContainerRightArrow.call(evh, e); })
        .on(ev.CLICK, function (e) { evh.handleClickOnSlideMovContainerRightArrow.call(evh, e); });

      if (stc.tabClickHandler) {
        stc.$tabsLiCollection
          .find('a[data-toggle="tab"]')
          .off(ev.CLICK)
          .on(ev.CLICK, stc.tabClickHandler);
      }

      if (settings.handleDelayedScrollbar) {
        ehd.listenForDelayedScrollbar();
      }

      stc.$win
        .off(resizeEventName)
        .smartresizeScrtabs(function (e) { evh.handleWindowResize.call(evh, e); }, resizeEventName);

      $('body').on(CONSTANTS.EVENTS.FORCE_REFRESH, stc.elementsHandler.refreshAllElementSizes.bind(stc.elementsHandler));
    };

    p.listenForDelayedScrollbar = function () {
      var iframe = document.createElement('iframe');
      iframe.id = "scrtabs-scrollbar-resize-listener";
      iframe.style.cssText = 'height: 0; background-color: transparent; margin: 0; padding: 0; overflow: hidden; border-width: 0; position: absolute; width: 100%;';
      iframe.onload = function() {
        var timeout;

        function handleResize() {
          try {
            $(window).trigger('resize');
            timeout = null;
          } catch(e) {}
        }

        iframe.contentWindow.addEventListener('resize', function() {
          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(handleResize, 100);
        });
      };
      
      document.body.appendChild(iframe);
    };

    p.setFixedContainerWidth = function () {
      var ehd = this,
          stc = ehd.stc,
          tabsContainerRect = stc.$tabsContainer.get(0).getBoundingClientRect();
      /**
       * @author poletaew
       * It solves problem with rounding by jQuery.outerWidth
       * If we have real width 100.5 px, jQuery.outerWidth returns us 101 px and we get layout's fail
       */
      stc.fixedContainerWidth = tabsContainerRect.width || (tabsContainerRect.right - tabsContainerRect.left);
      stc.fixedContainerWidth = stc.fixedContainerWidth * stc.widthMultiplier;

      stc.$fixedContainer.width(stc.fixedContainerWidth);
    };

    p.setFixedContainerWidthForHiddenScrollArrows = function () {
      var ehd = this,
          stc = ehd.stc;

      stc.$fixedContainer.width(stc.fixedContainerWidth);
    };

    p.setFixedContainerWidthForVisibleScrollArrows = function () {
      var ehd = this,
          stc = ehd.stc;

      stc.$fixedContainer.width(stc.fixedContainerWidth - stc.scrollArrowsCombinedWidth);
    };

    p.setMovableContainerWidth = function () {
      var ehd = this,
          stc = ehd.stc,
          $tabLi = stc.$tabsUl.find('> li');

      stc.movableContainerWidth = 0;

      if ($tabLi.length) {

        $tabLi.each(function () {
          var $li = $(this),
              totalMargin = 0;

          if (stc.isNavPills) { // pills have a margin-left, tabs have no margin
            totalMargin = parseInt($li.css('margin-left'), 10) + parseInt($li.css('margin-right'), 10);
          }

          stc.movableContainerWidth += ($li.outerWidth() + totalMargin);
        });

        stc.movableContainerWidth += 1;

        // if the tabs don't span the width of the page, force the
        // movable container width to full page width so the bottom
        // border spans the page width instead of just spanning the
        // width of the tabs
        if (stc.movableContainerWidth < stc.fixedContainerWidth) {
          stc.movableContainerWidth = stc.fixedContainerWidth;
        }
      }

      stc.$movableContainer.width(stc.movableContainerWidth);
    };

    p.setScrollArrowVisibility = function () {
      var ehd = this,
          stc = ehd.stc,
          shouldBeVisible = stc.movableContainerWidth > stc.fixedContainerWidth;

      if (shouldBeVisible && !stc.scrollArrowsVisible) {
        stc.$scrollArrows.show();
        stc.scrollArrowsVisible = true;
      } else if (!shouldBeVisible && stc.scrollArrowsVisible) {
        stc.$scrollArrows.hide();
        stc.scrollArrowsVisible = false;
      }

      if (stc.scrollArrowsVisible) {
        ehd.setFixedContainerWidthForVisibleScrollArrows();
      } else {
        ehd.setFixedContainerWidthForHiddenScrollArrows();
      }
    };

}(ElementsHandler.prototype));
