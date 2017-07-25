var CONSTANTS = {
  CONTINUOUS_SCROLLING_TIMEOUT_INTERVAL: 50, // timeout interval for repeatedly moving the tabs container
                                              // by one increment while the mouse is held down--decrease to
                                              // make mousedown continous scrolling faster
  SCROLL_OFFSET_FRACTION: 6, // each click moves the container this fraction of the fixed container--decrease
                             // to make the tabs scroll farther per click

  DATA_KEY_DDMENU_MODIFIED: 'scrtabsddmenumodified',
  DATA_KEY_IS_MOUSEDOWN: 'scrtabsismousedown',

  CSS_CLASSES: {
    ALLOW_SCROLLBAR: 'scrtabs-allow-scrollbar',
    SCROLL_ARROW_DISABLE: 'scrtabs-disable'
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
    MOUSEDOWN: 'mousedown.scrtabs touchstart.scrtabs',
    MOUSEUP: 'mouseup.scrtabs touchend.scrtabs',
    WINDOW_RESIZE: 'resize.scrtabs',
    TABS_READY: 'ready.scrtabs'
  }
};
