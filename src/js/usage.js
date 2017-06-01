/**
 * jQuery plugin version of Angular directive angular-bootstrap-scrolling-tabs:
 * https://github.com/mikejacobson/angular-bootstrap-scrolling-tabs
 *
 * Usage:
 *
 *    Use case #1: HTML-defined tabs
 *    ------------------------------
 *    Demo: http://plnkr.co/edit/thyD0grCxIjyU4PoTt4x?p=preview
 *
 *      Sample HTML:
 *
 *           <!-- Nav tabs -->
 *           <ul class="nav nav-tabs" role="tablist">
 *             <li role="presentation" class="active"><a href="#tab1" role="tab" data-toggle="tab">Tab Number 1</a></li>
 *             <li role="presentation"><a href="#tab2" role="tab" data-toggle="tab">Tab Number 2</a></li>
 *             <li role="presentation"><a href="#tab3" role="tab" data-toggle="tab">Tab Number 3</a></li>
 *             <li role="presentation"><a href="#tab4" role="tab" data-toggle="tab">Tab Number 4</a></li>
 *           </ul>
 *
 *           <!-- Tab panes -->
 *           <div class="tab-content">
 *             <div role="tabpanel" class="tab-pane active" id="tab1">Tab 1 content...</div>
 *             <div role="tabpanel" class="tab-pane" id="tab2">Tab 2 content...</div>
 *             <div role="tabpanel" class="tab-pane" id="tab3">Tab 3 content...</div>
 *             <div role="tabpanel" class="tab-pane" id="tab4">Tab 4 content...</div>
 *           </div>
 *
 *
 *      JavaScript:
 *
 *            $('.nav-tabs').scrollingTabs();
 *
 *
 *    Use Case #2: Data-driven tabs
 *    -----------------------------
 *    Demo: http://plnkr.co/edit/MWBjLnTvJeetjU3NEimg?p=preview
 *
 *      Sample HTML:
 *
 *          <!-- build .nav-tabs and .tab-content in here -->
 *          <div id="tabs-inside-here"></div>
 *
 *
 *      JavaScript:
 *
 *             $('#tabs-inside-here').scrollingTabs({
 *               tabs: tabs, // required
 *               propPaneId: 'paneId', // optional
 *               propTitle: 'title', // optional
 *               propActive: 'active', // optional
 *               propDisabled: 'disabled', // optional
 *               propContent: 'content', // optional
 *               ignoreTabPanes: false, // optional
 *               scrollToTabEdge: false, // optional
 *               disableScrollArrowsOnFullyScrolled: false, // optional
 *               reverseScroll: false // optional
 *             });
 *
 *      Settings/Options:
 *
 *        tabs:             tabs data array
 *        prop*:            name of your tab object's property name that
 *                          corresponds to that required tab property if
 *                          your property name is different than the
 *                          standard name (paneId, title, etc.)
 *        ignoreTabPanes:   relevant for data-driven tabs only--set to true if
 *                          you want the plugin to only touch the tabs
 *                          and to not generate the tab pane elements
 *                          that go in .tab-content. By default, the plugin
 *                          will generate the tab panes based on the content
 *                          property in your tab data, if a content property
 *                          is present.
 *        scrollToTabEdge:  set to true if you want to force full-width tabs
 *                          to display at the left scroll arrow. i.e., if the
 *                          scrolling stops with only half a tab showing,
 *                          it will snap the tab to its edge so the full tab
 *                          shows.
 *        disableScrollArrowsOnFullyScrolled:
 *                          set to true if you want the left scroll arrow to
 *                          disable when the tabs are scrolled fully left,
 *                          and the right scroll arrow to disable when the tabs
 *                          are scrolled fully right.
 *        reverseScroll:
 *                          set to true if you want the left scroll arrow to
 *                          slide the tabs left instead of right, and the right
 *                          scroll arrow to slide the tabs right.
 *        widthMultiplier:
 *                          set to a value less than 1 if you want the tabs
 *                          container to be less than the full width of its
 *                          parent element. For example, set it to 0.5 if you
 *                          want the tabs container to be half the width of
 *                          its parent.
 *        tabClickHandler:
 *                          a callback function to execute any time a tab is clicked.
 *                          The function is simply passed as the event handler
 *                          to jQuery's .on(), so the function will receive
 *                          the jQuery event as an argument, and the 'this'
 *                          inside the function will be the clicked tab's anchor
 *                          element.
 *        cssClassLeftArrow, cssClassRightArrow:
 *                          custom values for the class attributes for the
 *                          left and right scroll arrows. The defaults are
 *                          'glyphicon glyphicon-chevron-left' and
 *                          'glyphicon glyphicon-chevron-right'.
 *                          Using different icons might require you to add
 *                          custom styling to the arrows to position the icons
 *                          correctly; the arrows can be targeted with these
 *                          selectors:
 *                          .scrtabs-tab-scroll-arrow
 *                          .scrtabs-tab-scroll-arrow-left
 *                          .scrtabs-tab-scroll-arrow-right
 *
 *
 *      On tabs data change:
 *
 *            $('#tabs-inside-here').scrollingTabs('refresh');
 *
 *      On tabs data change, if you want the active tab to be set based on
 *      the updated tabs data (i.e., you want to override the current
 *      active tab setting selected by the user), for example, if you
 *      added a new tab and you want it to be the active tab:
 *
 *             $('#tabs-inside-here').scrollingTabs('refresh', {
 *               forceActiveTab: true
 *             });
 *
 *      Any options that can be passed into the plugin can be set on the
 *      plugin's 'defaults' object instead so you don't have to pass them in:
 *
 *             $.fn.scrollingTabs.defaults.tabs = tabs;
 *             $.fn.scrollingTabs.defaults.forceActiveTab = true;
 *             $.fn.scrollingTabs.defaults.scrollToTabEdge = true;
 *             $.fn.scrollingTabs.defaults.disableScrollArrowsOnFullyScrolled = true;
 *             $.fn.scrollingTabs.defaults.reverseScroll = true;
 *             $.fn.scrollingTabs.defaults.widthMultiplier = 0.5;
 *             $.fn.scrollingTabs.defaults.tabClickHandler = function () { };
 *
 *
 *    Methods
 *    -----------------------------
 *    - refresh
 *    On window resize, the tabs should refresh themselves, but to force a refresh:
 *
 *      $('.nav-tabs').scrollingTabs('refresh');
 *
 *    - scrollToActiveTab
 *    On window resize, the active tab will automatically be scrolled to
 *    if it ends up offscreen, but you can also programmatically force a
 *    scroll to the active tab any time (if, for example, you're
 *    programmatically setting the active tab) by calling the
 *    'scrollToActiveTab' method:
 *
 *    $('.nav-tabs').scrollingTabs('scrollToActiveTab');
 *
 *
 *    Events
 *    -----------------------------
 *    The plugin triggers event 'ready.scrtabs' when the tabs have
 *    been wrapped in the scroller and are ready for viewing:
 *
 *      $('.nav-tabs')
 *        .scrollingTabs()
 *        .on('ready.scrtabs', function() {
 *          // tabs ready, do my other stuff...
 *        });
 *
 *      $('#tabs-inside-here')
 *        .scrollingTabs({ tabs: tabs })
 *        .on('ready.scrtabs', function() {
 *          // tabs ready, do my other stuff...
 *        });
 *
 *
 *    Destroying
 *    -----------------------------
 *    To destroy:
 *
 *      $('.nav-tabs').scrollingTabs('destroy');
 *
 *      $('#tabs-inside-here').scrollingTabs('destroy');
 *
 *    If you were wrapping markup, the markup will be restored; if your tabs
 *    were data-driven, the tabs will be destroyed along with the plugin.
 *
 */
