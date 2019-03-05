jquery-bootstrap-scrolling-tabs
================================

jQuery plugin for making Bootstrap 3 Tabs scroll horizontally rather than wrap.

Here's what they look like:

![](https://raw.githubusercontent.com/mikejacobson/jquery-bootstrap-scrolling-tabs/master/st-screenshot1.png)


And here are plunks showing them working with:

* <a href="http://plnkr.co/edit/iMJ435SFXjIX18YEM4Z4?p=preview" target="_blank">HTML-defined Tabs</a>
* <a href="http://plnkr.co/edit/4SCaNOWyB8IsZSVlRXIz?p=preview" target="_blank">Data-driven Tabs</a>

Use Cases
---------
* [Use Case #1: Wrap HTML-defined Tabs](#uc1)
* [Use Case #2: Create Data-driven Tabs](#uc2)



Optional Features
-----------------
There are also optional features available:
* [Reverse Scroll](#reverseScroll)
* [Force Scroll to Tab Edge](#scrollToTabEdge)
* [Disable Scroll Arrows on Fully Scrolled](#disableScrollArrowsOnFullyScrolled)
* [Handle Delayed Scrollbar](#handleDelayedScrollbar)
* [Width Multiplier](#widthMultiplier)
* [Tab Click Handler](#tabClickHandler)
* [Custom Scroll Arrow classes](#cssClassArrows)
* [Custom Scroll Arrow content](#customArrowsContent)
* [Custom Tab LI content](#customTabLiContent)
* [Tab LI and Anchor Post-Processors](#postProcessors)
* [Enable Horizontal Swiping for Touch Screens](#enableSwiping)
* [Enable Right-to-Left Language Support](#enableRtlSupport)


Usage
-----
1. Download it or install it using bower: `bower install jquery-bootstrap-scrolling-tabs` or npm: `npm install jquery-bootstrap-scrolling-tabs`
2. Include `dist/jquery.scrolling-tabs.min.css` (or `dist/jquery.scrolling-tabs.css`) on your page *after* Bootstrap's CSS
3. Include `dist/jquery.scrolling-tabs.min.js` (or `dist/jquery.scrolling-tabs.js`) on your page (make sure that jQuery is included before it, of course)


Breaking Change for v2.0.0: Only affects swiping for touch screens
--
Swiping functionality is now handled via code rather than the browser's built-in scrolling with a scrollbar due to conflicts that occurred if, on a touch screen, you performed a combination of swiping and pressing the scroll arrows.
If you enabled swiping by passing in option `enableSwiping: true`, this change should not break anything, and should, in fact, fix a problem. However, if instead you enabled swiping by manually adding CSS class `scrtabs-allow-scrollbar` to a parent element of the scrolling tabs, that will no longer trigger a horizontal scrollbar for the tabs, so swiping will not be active. To enable swiping, you will need to pass in option `enableSwiping: true`.

Breaking Change for v1.0.0
--
* The plugin files, `jquery.scrolling-tabs.js` and `jquery.scrolling-tabs.css`, have been moved from the project root into `<root>/dist/`.

Possible Breaking Change for v1.0.0
--
* The jQuery dependency has been bumped from `<3.0.0` to `<4.0.0`.

Overview
--------
If you're using Bootstrap Tabs (`nav-tabs`) and you don't want them to wrap if the page is too narrow to accommodate them all in one row, you can use this plugin to keep them in a row that scrolls horizontally without a scrollbar.

It adjusts itself on window resize (debounced to prevent resize event wackiness), so if the window is widened enough to accommodate all tabs, scrolling will deactivate and the scroll arrows will disappear. (And, of course, vice versa if the window is narrowed.)

Note: Similar to [Bootstrap tabs](https://getbootstrap.com/docs/3.3/javascript/#tabs), nested tabs are not supported.

Use Cases
---------
#### <a id="uc1"></a>Use Case #1: HTML-defined Tabs

If your `nav-tabs` markup looks like this:
```html
<!-- Nav tabs -->
<ul class="nav nav-tabs" role="tablist">
  <li role="presentation" class="active"><a href="#tab1" role="tab" data-toggle="tab">Tab Number 1</a></li>
  <li role="presentation"><a href="#tab2" role="tab" data-toggle="tab">Tab Number 2</a></li>
  <li role="presentation"><a href="#tab3" role="tab" data-toggle="tab">Tab Number 3</a></li>
  <li role="presentation"><a href="#tab4" role="tab" data-toggle="tab">Tab Number 4</a></li>
  <li role="presentation"><a href="#tab5" role="tab" data-toggle="tab">Tab Number 5</a></li>
</ul>

<!-- Tab panes -->
<div class="tab-content">
  <div role="tabpanel" class="tab-pane active" id="tab1">Tab 1 content...</div>
  <div role="tabpanel" class="tab-pane" id="tab2">Tab 2 content...</div>
  <div role="tabpanel" class="tab-pane" id="tab3">Tab 3 content...</div>
  <div role="tabpanel" class="tab-pane" id="tab4">Tab 4 content...</div>
  <div role="tabpanel" class="tab-pane" id="tab5">Tab 5 content...</div>
</div>
```

you can wrap the tabs in the scroller like this:
```javascript
$('.nav-tabs').scrollingTabs();
```


##### Bootstrap 4 Support

If you're using Bootstrap 4, you need to pass in option `bootstrapVersion: 4` (the default is `3`):
```javascript
$('.nav-tabs').scrollingTabs({
  bootstrapVersion: 4  
});
```
Bootstrap 4 handles some things differently than 3 (e.g., the `active` class gets applied to the tab's `li > a` element rather than the `li` itself)

##### reverseScroll Option

You can also pass in the `reverseScroll` option:
```javascript
$('.nav-tabs').scrollingTabs({
  reverseScroll: true  
});
```
This will reverse the direction the tabs slide when you click a scroll arrow. More details [here](#reverseScroll).


##### scrollToTabEdge Option

You can also pass in the `scrollToTabEdge` option:
```javascript
$('.nav-tabs').scrollingTabs({
  scrollToTabEdge: true  
});
```
This will force the scrolling to always end with a tab edge aligned with the left scroll arrow. More details [here](#scrollToTabEdge).


##### disableScrollArrowsOnFullyScrolled Option

You can also pass in the `disableScrollArrowsOnFullyScrolled` option:
```javascript
$('.nav-tabs').scrollingTabs({
  disableScrollArrowsOnFullyScrolled: true  
});
```
If you're using the default scroll setting, this will cause the left scroll arrow to disable when the tabs are scrolled fully left (on page load, for example), and the right scroll arrow to disable when the tabs are scrolled fully right.

If you have the `reverseScroll` option set to `true`, the opposite arrows will disable.


##### widthMultiplier Option

You can also pass in the `widthMultiplier` option:
```javascript
$('.nav-tabs').scrollingTabs({
  widthMultiplier: 0.5
});
```
Pass in a value less than 1 if you want the tabs container to be less than the full width of its parent element. For example, if you want the tabs container to be half the width of its parent, pass in `0.5`.


##### tabClickHandler Option

You can also use the `tabClickHandler` option to pass in a callback function to execute any time a tab is clicked:
```javascript
$('.nav-tabs').scrollingTabs({
  tabClickHandler: function (e) {
    var clickedTabElement = this;
  }
});
```
The callback function is simply passed as the event handler to jQuery's .on(), so the function will receive the jQuery event as an argument, and 'this' inside the function will be the clicked tab's anchor element.



##### Preventing Flash of Unwrapped Tabs

To prevent a flash of the tabs on page load/refresh before they get wrapped
inside the scroller, you can hide your `.nav-tabs` and `.tab-content` with
some CSS (`display: none`).

The plugin will automatically unhide the `.nav-tabs` when they're ready,
and you can hook into the [`ready.scrtabs` event](#events) (which gets fired when
the tabs are ready) to unhide your `.tab-content`:

```javascript
$('.nav-tabs')
  .scrollingTabs()
  .on('ready.scrtabs', function() {
    $('.tab-content').show();
  });
```



##### Forcing a Refresh

The scrolling container should automatically refresh itself on window resize, but to manually force a refresh you can call the plugin's `refresh` method:
```javascript
$('.nav-tabs').scrollingTabs('refresh');
```

##### Forcing a Scroll to the Active Tab

On window resize, the scrolling container should automatically scroll to the active tab if it's offscreen, but you can also programmatically force a scroll to the active tab any time (if, for example, you're programmatically setting the active tab) by calling the plugin's `scrollToActiveTab` method:
```javascript
$('.nav-tabs').scrollingTabs('scrollToActiveTab');
```


#### <a id="uc2"></a>Use Case #2: Data-driven Tabs

If your tabs are data-driven rather than defined in your markup, you just need to pass your tabs array to the plugin and it will generate the tab elements for you.

So your tabs data should look something like this (note that the tab titles can contain HTML):
```javascript
var myTabs = [
  { paneId: 'tab01', title: 'Tab <em>1</em> of 12', content: 'Tab Number 1 Content', active: true, disabled: false },
  { paneId: 'tab02', title: 'Tab 2 of 12', content: 'Tab Number 2 Content', active: false, disabled: false },
  { paneId: 'tab03', title: 'Tab 3 of 12', content: 'Tab Number 3 Content', active: false, disabled: false },
  { paneId: 'tab04', title: 'Tab 4 of 12', content: 'Tab Number 4 Content', active: false, disabled: false },
  { paneId: 'tab05', title: 'Tab 5 of 12', content: 'Tab Number 5 Content', active: false, disabled: false }
];

```

You would then need a target element to append the tabs and panes to, like this:

```html
<!-- build .nav-tabs and .tab-content in here -->
<div id="tabs-inside-here"></div>
```


Then just call the plugin on that element, passing a settings object with a `tabs` property pointing to your tabs array:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs
});

```

##### Required Tab Data Properties

Each tab object in the array must have a property for
* the tab title (text or HTML)
* the ID of its target pane (text)
* its active state (bool)

Optionally, it can also have a boolean for its `disabled` state.


##### 'Content' Property for Tab Panes

If you want the plugin to generate the tab panes also, include a `content` property on the tab objects.

If your tab objects have a `content` property but you *don't* want the plugin to generate the panes, pass in plugin option `ignoreTabPanes: true` when calling the plugin.

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  ignoreTabPanes: true
});

```

##### Custom Tab Data Property Names

By default, the plugin assumes those properties will be named `title`, `paneId`, `active`, `disabled`, and `content`, but if you want to use different property names, you can pass your property names in as properties on the settings object:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs, // required,
  propTitle: 'myTitle', // required if not 'title'
  propPaneId: 'myPaneId', // required if not 'paneId'
  propActive: 'myActive', // required if not 'active'
  propDisabled: 'myDisabled', // required if not 'disabled'
  propContent: 'myContent' // required if not 'content'
});
```javascript



So, for example, if your tab objects used the property name `label` for their titles instead of `title`, you would need to pass property `propTitle: 'label'` in your settings object.

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  propTitle: 'label'
});

```

##### scrollToTabEdge Option

And just like in Use Case #1, you can also pass in the `scrollToTabEdge` option if you want to force the scrolling to always end with a tab edge aligned with the left scroll arrow:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  scrollToTabEdge: true  
});
```

You can also pass in the `disableScrollArrowsOnFullyScrolled` option if you want the scroll arrow to disable when the tabs are fully scrolled in that direction:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  disableScrollArrowsOnFullyScrolled: true  
});
```


##### Refreshing after Tab Data Change

On `tabs` data change, just call the plugin's `refresh` method to refresh the tabs on the page:
```javascript
$('#tabs-inside-here').scrollingTabs('refresh');
```


##### forceActiveTab Option

On `tabs` data change, if you want the active tab to be set based on the updated tabs data (i.e., you want to override the current active tab setting selected by the user), for example, if you added a new tab and you want it to be the active tab, pass the `forceActiveTab` flag on refresh:
```javascript
$('#tabs-inside-here').scrollingTabs('refresh', {
  forceActiveTab: true
});
```

#### <a id="reverseScroll"></a>Reverse Scroll

By default, on page load, if there are tabs hidden off the right side of the page, you would click the right scroll arrow to slide those tabs into view (and vice versa for the left scroll arrow, of course, if there are tabs hidden off the left side of the page).

You can reverse the direction the tabs slide when an arrow is clicked by passing in option `reverseScroll: true`:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  reverseScroll: true  
});
```

This might be the more intuitive behavior for mobile devices.


#### <a id="scrollToTabEdge"></a>Force Scroll to Tab Edge

If you want to ensure the scrolling always ends with a tab edge aligned with the left scroll arrow so there won't be a partially hidden tab, pass in option `scrollToTabEdge: true`:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  scrollToTabEdge: true  
});
```

There's no way to guarantee the left *and* right edges will be full tabs because that's dependent on the the width of the tabs and the window. So this just makes sure the left side will be a full tab.


#### <a id="disableScrollArrowsOnFullyScrolled"></a>Disable Scroll Arrows on Fully Scrolled

If you want the left scroll arrow to disable when the tabs are scrolled fully left (the way they would be on page load, for example), and the right scroll arrow to disable when the tabs are scrolled fully right, pass in option `disableScrollArrowsOnFullyScrolled: true`:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  disableScrollArrowsOnFullyScrolled: true  
});
```

Note that if you have the `reverseScroll` option set to `true`, the opposite arrows will disable.


#### <a id="handleDelayedScrollbar"></a>Handle Delayed Scrollbar

If you experience a situation where the right scroll arrow wraps to the next line due to a vertical scrollbar coming into existence on the page *after* the plugin already calculated its width without a scrollbar present, pass in option `handleDelayedScrollbar: true`:

```javascript
$('.nav-tabs').scrollingTabs({
  handleDelayedScrollbar: true  
});
```

This would occur if, for example, the bulk of the page's content loaded after a delay, and only then did a vertical scrollbar become necessary.

It would also occur if a vertical scrollbar only appeared on selection of a particular tab that had more content than the default tab.

This is not enabled by default because, since a window resize event is not triggered by a vertical scrollbar appearing, it requires adding an iframe to the page that listens for resize events because a scrollbar appearing in the parent window *does* trigger a resize event in the iframe, which then dispatches a resize event to the parent, triggering the plugin to recalculate its width.


#### <a id="widthMultiplier"></a>Width Multiplier

If you want the tabs container to be less than the full width of its parent element, pass in a `widthMultiplier` value that's less than 1. For example, if you want the tabs container to be half the width of its parent, pass in option `widthMultiplier: 0.5`:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  widthMultiplier: 0.5  
});
```

#### <a id="tabClickHandler"></a>Tab Click Handler

You can pass in a callback function that executes any time a tab is clicked using the `tabClickHandler` option.
The callback function is simply passed as the event handler to jQuery's .on(), so the function will receive the jQuery event as an argument, and 'this' inside the function will be the clicked tab's anchor element.

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  tabClickHandler: function (e) {
    var clickedTabElement = this;
  }  
});
```

#### <a id="cssClassArrows"></a>Custom Scroll Arrow classes

You can pass in custom values for the class attributes for the left- and right scroll arrows using options `cssClassLeftArrow` and `cssClassRightArrow`.

The defaults are `glyphicon glyphicon-chevron-left` and `glyphicon glyphicon-chevron-right`.

Using different icons might require you to add custom styling to the arrows to position the icons correctly; the arrows can be targeted with these selectors:

`.scrtabs-tab-scroll-arrow`

`.scrtabs-tab-scroll-arrow-left`

`.scrtabs-tab-scroll-arrow-right`


```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  cssClassLeftArrow: 'fa fa-chevron-left',
  cssClassRightArrow: 'fa fa-chevron-right'
});
```

#### <a id="customArrowsContent"></a>Custom Scroll Arrow content

You can pass in custom values for the left- and right scroll arrow HTML using options `leftArrowContent` and `rightArrowContent`. This will override any custom `cssClassLeftArrow` and `cssClassRightArrow` settings.

For example, if you wanted to use svg icons, you could set them like so:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  leftArrowContent: [
    '<div class="custom-arrow">',
    '  <svg class="icon icon-point-left">',
    '    <use xlink:href="#icon-point-left"></use>',
    '  </svg>',
    '</div>'
  ].join(''),
  rightArrowContent: [
    '<div class="custom-arrow">',
    '  <svg class="icon icon-point-right">',
    '    <use xlink:href="#icon-point-right"></use>',
    '  </svg>',
    '</div>'
  ].join('')
});
```

You would then need to add some CSS to make them work correctly if you don't give them the default `scrtabs-tab-scroll-arrow` classes. This plunk shows it working with svg icons:
http://plnkr.co/edit/2MdZCAnLyeU40shxaol3?p=preview

When using this option, you can also mark a child element within the arrow content as the click target if you don't want the entire content to be clickable. You do that my adding the CSS class `scrtabs-click-target` to the element that should be clickable, like so:

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  leftArrowContent: [
    '<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-left">',
    '  <button class="scrtabs-click-target" type="button">',
    '    <i class="custom-chevron-left"></i>',
    '  </button>',
    '</div>'
  ].join(''),
  rightArrowContent: [
    '<div class="scrtabs-tab-scroll-arrow scrtabs-tab-scroll-arrow-right">',
    '  <button class="scrtabs-click-target" type="button">',
    '    <i class="custom-chevron-right"></i>',
    '  </button>',
    '</div>'
  ].join('')
});
```


#### <a id="customTabLiContent"></a>Custom Tab LI content

To specify custom HTML for the tabs' LI elements, you can pass in option `tabsLiContent`.

It must be a string array, each entry being an HTML string that defines the tab LI element for the corresponding tab (i.e., same index) in the `tabs` array.

These entries will override the default `<li role="presentation" class=""></li>`.

So, for example, if you had 3 tabs and you needed a custom `tooltip` attribute on each one, your `tabsLiContent` array might look like this (although you would probably build the array dynamically using the `myTabs` data):

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  tabsLiContent: [
    '<li role="presentation" tooltip="Custom TT 1" class="custom-li"></li>',
    '<li role="presentation" tooltip="Custom TT 2" class="custom-li"></li>',
    '<li role="presentation" tooltip="Custom TT 3" class="custom-li"></li>'
  ]
});
```

This plunk demonstrates its usage (in conjunction with `tabsPostProcessors`):
http://plnkr.co/edit/ugJLMk7lmDCuZQziQ0k0


#### <a id="postProcessors"></a>Tab LI and Anchor Post-Processors

To perform additional processing on the tab LI and/or Anchor elements after they've been created, you can pass in option `tabsPostProcessors`.

This is an array of functions, each one associated with an entry in the tabs array. When a tab element has been created, its associated post-processor function will be called with two arguments: the newly created $li and $a jQuery elements for that tab.

This allows you to, for example, attach a custom click handler to each anchor tag.

```javascript
$('#tabs-inside-here').scrollingTabs({
  tabs: myTabs,
  tabsPostProcessors: [
    function ($li, $a) { console.log("Tab 1 clicked. $a.href: ", $a.attr('href')); },
    function ($li, $a) { console.log("Tab 2 clicked. $a.href: ", $a.attr('href')); },
    function ($li, $a) { console.log("Tab 3 clicked. $a.href: ", $a.attr('href')); }
  ]
});
```
This plunk demonstrates its usage (in conjunction with `tabsLiContent`):
http://plnkr.co/edit/ugJLMk7lmDCuZQziQ0k0



#### <a id="enableSwiping"></a>Enable Horizontal Swiping for Touch Screens

To enable horizontal swiping for touch screens, pass in option `enableSwiping: true` when initializing the plugin:
```javascript
$('.nav-tabs').scrollingTabs({
  enableSwiping: true  
});
```
This will enable swiping for any browser that supports [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events).

#### <a id="enableRtlSupport"></a>Enable Right-to-Left Language Support

To enable support for right-to-left languages, pass in option `enableRtlSupport: true` when initializing the plugin:
```javascript
$('.nav-tabs').scrollingTabs({
  enableRtlSupport: true  
});
```

With this option enabled, the plugin will check the page's `<html>` tag for attribute `dir="rtl"` and will adjust its behavior accordingly.



#### Setting Defaults
Any options that can be passed into the plugin can also be set on the plugin's `defaults` object:
```javascript
$.fn.scrollingTabs.defaults.tabs = myTabs;
$.fn.scrollingTabs.defaults.forceActiveTab = true;
$.fn.scrollingTabs.defaults.scrollToTabEdge = true;
$.fn.scrollingTabs.defaults.disableScrollArrowsOnFullyScrolled = true;
$.fn.scrollingTabs.defaults.handleDelayedScrollbar = true;
$.fn.scrollingTabs.defaults.reverseScroll = true;
$.fn.scrollingTabs.defaults.widthMultiplier = 0.5;
$.fn.scrollingTabs.defaults.enableSwiping = true;
$.fn.scrollingTabs.defaults.enableRtlSupport = true;
```



#### <a id="events"></a>Events
The plugin triggers event `ready.scrtabs` when the tabs have been wrapped in
the scroller and are ready for viewing:

```javascript
$('.nav-tabs')
  .scrollingTabs()
  .on('ready.scrtabs', function() {
    // tabs ready, do my other stuff...
  });

$('#tabs-inside-here')
  .scrollingTabs({ tabs: tabs })
  .on('ready.scrtabs', function() {
    // tabs ready, do my other stuff...
  });
```


#### Destroying the Plugin
To destroy the plugin, call its `destroy` method:
```javascript
$('#tabs-inside-here').scrollingTabs('destroy');
```

If you were wrapping markup, the markup will be restored; if your tabs were data-driven, the tabs will be destroyed along with the plugin.


Custom SCSS
-----------
Customise the SCSS by including `jquery.scrolling-tabs.scss` and overriding the following variables:
* `$scrtabs-tabs-height` - The height of the tabs.
* `$scrtabs-border-color` - The tabs border color.
* `$scrtabs-foreground-color` - The text color.
* `$scrtabs-background-color-hover` - The background color of the tabs when hovered over.


License
-------
MIT License.
