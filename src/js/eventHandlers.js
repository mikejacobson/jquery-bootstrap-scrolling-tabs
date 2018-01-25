/* ***********************************************************************************
 * EventHandlers - Class that each instance of ScrollingTabsControl will instantiate
 * **********************************************************************************/
function EventHandlers(scrollingTabsControl) {
  var evh = this;

  evh.stc = scrollingTabsControl;
}

// prototype methods
(function (p){
  p.handleClickOnSlideMovContainerLeftArrow = function () {
    var evh = this,
        stc = evh.stc;

    stc.scrollMovement.incrementMovableContainerLeft();
  };

  p.handleClickOnSlideMovContainerRightArrow = function () {
    var evh = this,
        stc = evh.stc;

    stc.scrollMovement.incrementMovableContainerRight();
  };

  p.handleMousedownOnSlideMovContainerLeftArrow = function () {
    var evh = this,
        stc = evh.stc;

    stc.$slideLeftArrowClickTarget.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, true);
    stc.scrollMovement.continueSlideMovableContainerLeft();
  };

  p.handleMousedownOnSlideMovContainerRightArrow = function () {
    var evh = this,
        stc = evh.stc;

    stc.$slideRightArrowClickTarget.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, true);
    stc.scrollMovement.continueSlideMovableContainerRight();
  };

  p.handleMouseupOnSlideMovContainerLeftArrow = function () {
    var evh = this,
        stc = evh.stc;

    stc.$slideLeftArrowClickTarget.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, false);
  };

  p.handleMouseupOnSlideMovContainerRightArrow = function () {
    var evh = this,
        stc = evh.stc;

    stc.$slideRightArrowClickTarget.data(CONSTANTS.DATA_KEY_IS_MOUSEDOWN, false);
  };

  p.handleWindowResize = function () {
    var evh = this,
        stc = evh.stc,
        newWinWidth = stc.$win.width();

    if (newWinWidth === stc.winWidth) {
      return false;
    }

    stc.winWidth = newWinWidth;
    stc.elementsHandler.refreshAllElementSizes();
  };

}(EventHandlers.prototype));
