/* ***********************************************************************************
 * ScrollMovement - Class that each instance of ScrollingTabsControl will instantiate
 * **********************************************************************************/
function ScrollMovement(scrollingTabsControl) {
  var smv = this;

  smv.stc = scrollingTabsControl;
}

// prototype methods
(function (p) {

  p.continueSlideMovableContainerLeft = function () {
    var smv = this,
        stc = smv.stc;

    setTimeout(function() {
      if (stc.movableContainerLeftPos <= smv.getMinPos()  ||
          !stc.$slideLeftArrowClickTarget.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN)) {
        return;
      }

      if (!smv.incrementMovableContainerLeft()) { // haven't reached max left
        smv.continueSlideMovableContainerLeft();
      }
    }, CONSTANTS.CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL);
  };

  p.continueSlideMovableContainerRight = function () {
    var smv = this,
        stc = smv.stc;

    setTimeout(function() {
      if (stc.movableContainerLeftPos >= 0  ||
          !stc.$slideRightArrowClickTarget.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN)) {
        return;
      }

      if (!smv.incrementMovableContainerRight()) { // haven't reached max right
        smv.continueSlideMovableContainerRight();
      }
    }, CONSTANTS.CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL);
  };

  p.decrementMovableContainerLeftPos = function (minPos) {
    var smv = this,
        stc = smv.stc;

    stc.movableContainerLeftPos -= (stc.fixedContainerWidth / CONSTANTS.SCROLL_OFFSET_FRACTION);
    if (stc.movableContainerLeftPos < minPos) {
      stc.movableContainerLeftPos = minPos;
    } else if (stc.scrollToTabEdge) {
      smv.setMovableContainerLeftPosToTabEdge(CONSTANTS.SLIDE_DIRECTION.LEFT);

      if (stc.movableContainerLeftPos < minPos) {
        stc.movableContainerLeftPos = minPos;
      }
    }
  };

  p.disableSlideLeftArrow = function () {
    var smv = this,
        stc = smv.stc;

    if (!stc.disableScrollArrowsOnFullyScrolled || !stc.scrollArrowsVisible) {
      return;
    }

    stc.$slideLeftArrow.addClass(CONSTANTS.CSS_CLASSES.SCROLL_ARROW_DISABLE);
  };

  p.disableSlideRightArrow = function () {
    var smv = this,
        stc = smv.stc;

    if (!stc.disableScrollArrowsOnFullyScrolled || !stc.scrollArrowsVisible) {
      return;
    }

    stc.$slideRightArrow.addClass(CONSTANTS.CSS_CLASSES.SCROLL_ARROW_DISABLE);
  };

  p.enableSlideLeftArrow = function () {
    var smv = this,
        stc = smv.stc;

    if (!stc.disableScrollArrowsOnFullyScrolled || !stc.scrollArrowsVisible) {
      return;
    }

    stc.$slideLeftArrow.removeClass(CONSTANTS.CSS_CLASSES.SCROLL_ARROW_DISABLE);
  };

  p.enableSlideRightArrow = function () {
    var smv = this,
        stc = smv.stc;

    if (!stc.disableScrollArrowsOnFullyScrolled || !stc.scrollArrowsVisible) {
      return;
    }

    stc.$slideRightArrow.removeClass(CONSTANTS.CSS_CLASSES.SCROLL_ARROW_DISABLE);
  };

  p.getMinPos = function () {
    var smv = this,
        stc = smv.stc;

    return stc.scrollArrowsVisible ? (stc.fixedContainerWidth - stc.movableContainerWidth - stc.scrollArrowsCombinedWidth) : 0;
  };

  p.getMovableContainerCssLeftVal = function () {
    var smv = this,
        stc = smv.stc;

    return (stc.movableContainerLeftPos === 0) ? '0' : stc.movableContainerLeftPos + 'px';
  };

  p.incrementMovableContainerLeft = function () {
    var smv = this,
        stc = smv.stc,
        minPos = smv.getMinPos();

    smv.decrementMovableContainerLeftPos(minPos);
    smv.slideMovableContainerToLeftPos();
    smv.enableSlideRightArrow();

    // return true if we're fully left, false otherwise
    return (stc.movableContainerLeftPos === minPos);
  };

  p.incrementMovableContainerRight = function (minPos) {
    var smv = this,
        stc = smv.stc;

    // if minPos passed in, the movable container was beyond the minPos
    if (minPos) {
      stc.movableContainerLeftPos = minPos;
    } else {
      stc.movableContainerLeftPos += (stc.fixedContainerWidth / CONSTANTS.SCROLL_OFFSET_FRACTION);

      if (stc.movableContainerLeftPos > 0) {
        stc.movableContainerLeftPos = 0;
      } else if (stc.scrollToTabEdge) {
        smv.setMovableContainerLeftPosToTabEdge(CONSTANTS.SLIDE_DIRECTION.RIGHT);
      }
    }

    smv.slideMovableContainerToLeftPos();
    smv.enableSlideLeftArrow();

    // return true if we're fully right, false otherwise
    // left pos of 0 is the movable container's max position (farthest right)
    return (stc.movableContainerLeftPos === 0);
  };

  p.refreshScrollArrowsDisabledState = function() {
    var smv = this,
        stc = smv.stc;

    if (!stc.disableScrollArrowsOnFullyScrolled || !stc.scrollArrowsVisible) {
      return;
    }

    if (stc.movableContainerLeftPos >= 0) { // movable container fully right
      smv.disableSlideRightArrow();
      smv.enableSlideLeftArrow();
      return;
    }

    if (stc.movableContainerLeftPos <= smv.getMinPos()) { // fully left
      smv.disableSlideLeftArrow();
      smv.enableSlideRightArrow();
      return;
    }

    smv.enableSlideLeftArrow();
    smv.enableSlideRightArrow();
  };

  p.scrollToActiveTab = function () {
    var smv = this,
        stc = smv.stc,
        $activeTab,
        $activeTabAnchor,
        activeTabLeftPos,
        activeTabRightPos,
        rightArrowLeftPos,
        activeTabWidth,
        leftPosOffset,
        offsetToMiddle,
        leftScrollArrowWidth,
        rightScrollArrowWidth;

    if (!stc.scrollArrowsVisible) {
      return;
    }

    if (stc.usingBootstrap4) {
      $activeTabAnchor = stc.$tabsUl.find('li > .nav-link.active');
      if ($activeTabAnchor.length) {
        $activeTab = $activeTabAnchor.parent();
      }
    } else {
      $activeTab = stc.$tabsUl.find('li.active');
    }

    if (!$activeTab || !$activeTab.length) {
      return;
    }

    rightScrollArrowWidth = stc.$slideRightArrow.outerWidth();
    activeTabWidth = $activeTab.outerWidth();

    /**
     * @author poletaew
     * We need relative offset (depends on $fixedContainer), don't absolute
     */
    activeTabLeftPos = $activeTab.offset().left - stc.$fixedContainer.offset().left;
    activeTabRightPos = activeTabLeftPos + activeTabWidth;

    rightArrowLeftPos = stc.fixedContainerWidth - rightScrollArrowWidth;

    if (stc.rtl) {
      leftScrollArrowWidth = stc.$slideLeftArrow.outerWidth();

      if (activeTabLeftPos < 0) { // active tab off left side
        stc.movableContainerLeftPos += activeTabLeftPos;
        smv.slideMovableContainerToLeftPos();
        return true;
      } else { // active tab off right side
        if (activeTabRightPos > rightArrowLeftPos) {
          stc.movableContainerLeftPos += (activeTabRightPos - rightArrowLeftPos) + (2 * rightScrollArrowWidth);
          smv.slideMovableContainerToLeftPos();
          return true;
        }
      }
    } else {
      if (activeTabRightPos > rightArrowLeftPos) { // active tab off right side
        leftPosOffset = activeTabRightPos - rightArrowLeftPos + rightScrollArrowWidth;
        offsetToMiddle = stc.fixedContainerWidth / 2;
        leftPosOffset += offsetToMiddle - (activeTabWidth / 2);
        stc.movableContainerLeftPos -= leftPosOffset;
        smv.slideMovableContainerToLeftPos();
        return true;
      } else {
        leftScrollArrowWidth = stc.$slideLeftArrow.outerWidth();
        if (activeTabLeftPos < 0) { // active tab off left side
          offsetToMiddle = stc.fixedContainerWidth / 2;
          stc.movableContainerLeftPos += (-activeTabLeftPos) + offsetToMiddle - (activeTabWidth / 2);
          smv.slideMovableContainerToLeftPos();
          return true;
        }
      }
    }

    return false;
  };

  p.setMovableContainerLeftPosToTabEdge = function (slideDirection) {
    var smv = this,
        stc = smv.stc,
        offscreenWidth = -stc.movableContainerLeftPos,
        totalTabWidth = 0;

      // make sure LeftPos is set so that a tab edge will be against the
      // left scroll arrow so we won't have a partial, cut-off tab
      stc.$tabsLiCollection.each(function () {
        var tabWidth = $(this).width();

        totalTabWidth += tabWidth;

        if (totalTabWidth > offscreenWidth) {
          stc.movableContainerLeftPos = (slideDirection === CONSTANTS.SLIDE_DIRECTION.RIGHT) ? -(totalTabWidth - tabWidth) : -totalTabWidth;
          return false; // exit .each() loop
        }

      });
  };

  p.slideMovableContainerToLeftPos = function () {
    var smv = this,
        stc = smv.stc,
        minPos = smv.getMinPos(),
        leftOrRightVal;

    if (stc.movableContainerLeftPos > 0) {
      stc.movableContainerLeftPos = 0;
    } else if (stc.movableContainerLeftPos < minPos) {
      stc.movableContainerLeftPos = minPos;
    }

    stc.movableContainerLeftPos = stc.movableContainerLeftPos / 1;
    leftOrRightVal = smv.getMovableContainerCssLeftVal();

    smv.performingSlideAnim = true;

    var targetPos = stc.rtl ? { right: leftOrRightVal } : { left: leftOrRightVal };

    stc.$movableContainer.stop().animate(targetPos, 'slow', function __slideAnimComplete() {
      var newMinPos = smv.getMinPos();

      smv.performingSlideAnim = false;

      // if we slid past the min pos--which can happen if you resize the window
      // quickly--move back into position
      if (stc.movableContainerLeftPos < newMinPos) {
        smv.decrementMovableContainerLeftPos(newMinPos);

        targetPos = stc.rtl ? { right: smv.getMovableContainerCssLeftVal() } : { left: smv.getMovableContainerCssLeftVal() };

        stc.$movableContainer.stop().animate(targetPos, 'fast', function() {
          smv.refreshScrollArrowsDisabledState();
        });
      } else {
        smv.refreshScrollArrowsDisabledState();
      }
    });
  };

}(ScrollMovement.prototype));
