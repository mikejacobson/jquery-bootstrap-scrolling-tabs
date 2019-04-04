/* exported CONSTANTS */
var CONSTANTS = {
  CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL: 50, // timeout interval for repeatedly moving the tabs container
                                              // by one increment while the mouse is held down--decrease to
                                              // make mousedown continous scrolling faster
  SCROLL_OFFSET_FRACTION: 6, // each click moves the container this fraction of the fixed container--decrease
                             // to make the tabs scroll farther per click

  DATA_KEY_DDMENU_MODIFIED: 'scrtabsddmenumodified',
  DATA_KEY_IS_MOUSEDOWN: 'scrtabsismousedown',
  DATA_KEY_BOOTSTRAP_TAB: 'bs.tab',

  CSS_CLASSES: {
    BOOTSTRAP4: 'scrtabs-bootstrap4',
    RTL: 'scrtabs-rtl',
    SCROLL_ARROW_CLICK_TARGET: 'scrtabs-click-target',
    SCROLL_ARROW_DISABLE: 'scrtabs-disable',
    SCROLL_ARROW_WITH_CLICK_TARGET: 'scrtabs-with-click-target'
  },

  SLIDE_DIRECTION: {
    LEFT: 1,
    RIGHT: 2
  },

  EVENTS: {
    CLICK: 'click.scrtabs',
    DROPDOWN_MENU_HIDE: 'hide.bs.dropdown.scrtabs',
    DROPDOWN_MENU_SHOW: 'show.bs.dropdown.scrtabs',
    FORCE_REFRESH: 'forcerefresh.scrtabs',
    MOUSEDOWN: 'mousedown.scrtabs',
    MOUSEUP: 'mouseup.scrtabs',
    TABS_READY: 'ready.scrtabs',
    TOUCH_END: 'touchend.scrtabs',
    TOUCH_MOVE: 'touchmove.scrtabs',
    TOUCH_START: 'touchstart.scrtabs',
    WINDOW_RESIZE: 'resize.scrtabs'
  }
};
