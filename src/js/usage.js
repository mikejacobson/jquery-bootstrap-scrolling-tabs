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
 *        tabsLiContent:
 *                          optional string array used to define custom HTML
 *                          for each tab's <li> element. Each entry is an HTML
 *                          string defining the tab <li> element for the
 *                          corresponding tab in the tabs array.
 *                          The default for a tab is:
 *                          '<li role="presentation" class=""></li>'
 *                          So, for example, if you had 3 tabs and you needed
 *                          a custom 'tooltip' attribute on each one, your
 *                          tabsLiContent array might look like this:
 *                            [
 *                              '<li role="presentation" tooltip="Custom TT 1" class="custom-li"></li>',
 *                              '<li role="presentation" tooltip="Custom TT 2" class="custom-li"></li>',
 *                              '<li role="presentation" tooltip="Custom TT 3" class="custom-li"></li>'
 *                            ]
 *                          This plunk demonstrates its usage (in conjunction
 *                          with tabsPostProcessors):
 *                          http://plnkr.co/edit/ugJLMk7lmDCuZQziQ0k0
 *        tabsPostProcessors:
 *                          optional array of functions, each one associated
 *                          with an entry in the tabs array. When a tab element
 *                          has been created, its associated post-processor
 *                          function will be called with two arguments: the
 *                          newly created $li and $a jQuery elements for that tab.
 *                          This allows you to, for example, attach a custom
 *                          event listener to each anchor tag.
 *                          This plunk demonstrates its usage (in conjunction
 *                          with tabsLiContent):
 *                          http://plnkr.co/edit/ugJLMk7lmDCuZQziQ0k0
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
 *        enableSwiping:
 *                          set to true if you want to enable horizontal swiping
 *                          for touch screens.
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
 *        leftArrowContent, rightArrowContent:
 *                          custom HTML string for the left and right scroll
 *                          arrows. This will override any custom cssClassLeftArrow
 *                          and cssClassRightArrow settings.
 *                          For example, if you wanted to use svg icons, you
 *                          could set them like so:
 *
 *                           leftArrowContent: [
 *                               '<div class="custom-arrow">',
 *                               '  <svg class="icon icon-point-left">',
 *                               '    <use xlink:href="#icon-point-left"></use>',
 *                               '  </svg>',
 *                               '</div>'
 *                             ].join(''),
 *                             rightArrowContent: [
 *                               '<div class="custom-arrow">',
 *                               '  <svg class="icon icon-point-right">',
 *                               '    <use xlink:href="#icon-point-right"></use>',
 *                               '  </svg>',
 *                               '</div>'
 *                             ].join('')
 *
 *                          You would then need to add some CSS to make them
 *                          work correctly if you don't give them the
 *                          default scrtabs-tab-scroll-arrow classes.
 *                          This plunk shows it working with svg icons:
 *                          http://plnkr.co/edit/2MdZCAnLyeU40shxaol3?p=preview
 *
 *                          When using this option, you can also mark a child
 *                          element within the arrow content as the click target
 *                          if you don't want the entire content to be
 *                          clickable. You do that my adding the CSS class
 *                          'scrtabs-click-target' to the element that should
 *                          be clickable, like so:
 *
 *                           leftArrowContent: [
 *                               '<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-left">',
 *                               '  <button class="scrtabs-click-target" type="button">',
 *                               '    <i class="custom-chevron-left"></i>',
 *                               '  </button>',
 *                               '</div>'
 *                             ].join(''),
 *                             rightArrowContent: [
 *                               '<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-right">',
 *                               '  <button class="scrtabs-click-target" type="button">',
 *                               '    <i class="custom-chevron-right"></i>',
 *                               '  </button>',
 *                               '</div>'
 *                             ].join('')
 *
 *        enableRtlSupport:
 *                          set to true if you want your site to support
 *                          right-to-left languages. If true, the plugin will
 *                          check the page's <html> tag for attribute dir="rtl"
 *                          and will adjust its behavior accordingly.
 *        handleDelayedScrollbar:
 *                          set to true if you experience a situation where the
 *                          right scroll arrow wraps to the next line due to a
 *                          vertical scrollbar coming into existence on the page
 *                          after the plugin already calculated its width without
 *                          a scrollbar present. This would occur if, for example,
 *                          the bulk of the page's content loaded after a delay, 
 *                          and only then did a vertical scrollbar become necessary.
 *                          It would also occur if a vertical scrollbar only appeared 
 *                          on selection of a particular tab that had more content 
 *                          than the default tab.
 *        bootstrapVersion:
 *                          set to 4 if you're using Boostrap 4. Default is 3.
 *                          Bootstrap 4 handles some things differently than 3
 *                          (e.g., the 'active' class gets applied to the tab's
 *                          'li > a' element rather than the 'li' itself).
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
