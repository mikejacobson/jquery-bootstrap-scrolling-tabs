/* exported listenForDropdownMenuTabs,
            refreshTargetElementInstance,
            scrollToActiveTab */
function checkForTabAdded(refreshData) {
  var updatedTabsArray = refreshData.updatedTabsArray,
      updatedTabsLiContent = refreshData.updatedTabsLiContent || [],
      updatedTabsPostProcessors = refreshData.updatedTabsPostProcessors || [],
      propNames = refreshData.propNames,
      ignoreTabPanes = refreshData.ignoreTabPanes,
      options = refreshData.options,
      $currTabLis = refreshData.$currTabLis,
      $navTabs = refreshData.$navTabs,
      $currTabContentPanesContainer = ignoreTabPanes ? null : refreshData.$currTabContentPanesContainer,
      $currTabContentPanes = ignoreTabPanes ? null : refreshData.$currTabContentPanes,
      isInitTabsRequired = false;

  // make sure each tab in the updated tabs array has a corresponding DOM element
  updatedTabsArray.forEach(function (tab, idx) {
    var $li = $currTabLis.find('a[href="#' + tab[propNames.paneId] + '"]'),
        isTabIdxPastCurrTabs = (idx >= $currTabLis.length),
        $pane;

    if (!$li.length) { // new tab
      isInitTabsRequired = true;

      // add the tab, add its pane (if necessary), and refresh the scroller
      options.tabLiContent = updatedTabsLiContent[idx];
      options.tabPostProcessor = updatedTabsPostProcessors[idx];
      $li = tabElements.getNewElTabLi(tab, propNames, options);
      tabUtils.storeDataOnLiEl($li, updatedTabsArray, idx);

      if (isTabIdxPastCurrTabs) { // append to end of current tabs
        $li.appendTo($navTabs);
      } else {                        // insert in middle of current tabs
        $li.insertBefore($currTabLis.eq(idx));
      }

      if (!ignoreTabPanes && tab[propNames.content] !== undefined) {
        $pane = tabElements.getNewElTabPane(tab, propNames, options);
        if (isTabIdxPastCurrTabs) { // append to end of current tabs
          $pane.appendTo($currTabContentPanesContainer);
        } else {                        // insert in middle of current tabs
          $pane.insertBefore($currTabContentPanes.eq(idx));
        }
      }

    }

  });

  return isInitTabsRequired;
}

function checkForTabPropertiesUpdated(refreshData) {
  var tabLiData = refreshData.tabLi,
      ignoreTabPanes = refreshData.ignoreTabPanes,
      $li = tabLiData.$li,
      $contentPane = tabLiData.$contentPane,
      origTabData = tabLiData.origTabData,
      newTabData = tabLiData.newTabData,
      propNames = refreshData.propNames,
      isInitTabsRequired = false;

  // update tab title if necessary
  if (origTabData[propNames.title] !== newTabData[propNames.title]) {
    $li.find('a[role="tab"]')
        .html(origTabData[propNames.title] = newTabData[propNames.title]);

    isInitTabsRequired = true;
  }

  // update tab disabled state if necessary
  if (origTabData[propNames.disabled] !== newTabData[propNames.disabled]) {
    if (newTabData[propNames.disabled]) { // enabled -> disabled
      $li.addClass('disabled');
      $li.find('a[role="tab"]').attr('data-toggle', '');
    } else { // disabled -> enabled
      $li.removeClass('disabled');
      $li.find('a[role="tab"]').attr('data-toggle', 'tab');
    }

    origTabData[propNames.disabled] = newTabData[propNames.disabled];
    isInitTabsRequired = true;
  }

  // update tab active state if necessary
  if (refreshData.options.forceActiveTab) {
    // set the active tab based on the tabs array regardless of the current
    // DOM state, which could have been changed by the user clicking a tab
    // without those changes being reflected back to the tab data
    $li[newTabData[propNames.active] ? 'addClass' : 'removeClass']('active');

    $contentPane[newTabData[propNames.active] ? 'addClass' : 'removeClass']('active');

    origTabData[propNames.active] = newTabData[propNames.active];

    isInitTabsRequired = true;
  }

  // update tab content pane if necessary
  if (!ignoreTabPanes && origTabData[propNames.content] !== newTabData[propNames.content]) {
    $contentPane.html(origTabData[propNames.content] = newTabData[propNames.content]);
    isInitTabsRequired = true;
  }

  return isInitTabsRequired;
}

function checkForTabRemoved(refreshData) {
  var tabLiData = refreshData.tabLi,
      ignoreTabPanes = refreshData.ignoreTabPanes,
      $li = tabLiData.$li,
      idxToMakeActive;

  if (tabLiData.newIdx !== -1) { // tab was not removed--it has a valid index
    return false;
  }

  // if this was the active tab, make the closest enabled tab active
  if ($li.hasClass('active')) {

    idxToMakeActive = tabUtils.getIndexOfClosestEnabledTab(refreshData.$currTabLis, tabLiData.currDomIdx);
    if (idxToMakeActive > -1) {
      refreshData.$currTabLis
        .eq(idxToMakeActive)
        .addClass('active');

      if (!ignoreTabPanes) {
        refreshData.$currTabContentPanes
          .eq(idxToMakeActive)
          .addClass('active');
      }
    }
  }

  $li.remove();

  if (!ignoreTabPanes) {
    tabLiData.$contentPane.remove();
  }

  return true;
}

function checkForTabsOrderChanged(refreshData) {
  var $currTabLis = refreshData.$currTabLis,
      updatedTabsArray = refreshData.updatedTabsArray,
      propNames = refreshData.propNames,
      ignoreTabPanes = refreshData.ignoreTabPanes,
      newTabsCollection = [],
      newTabPanesCollection = ignoreTabPanes ? null : [];

  if (!tabUtils.didTabOrderChange($currTabLis, updatedTabsArray, propNames)) {
    return false;
  }

  // the tab order changed...
  updatedTabsArray.forEach(function (t) {
    var paneId = t[propNames.paneId];

    newTabsCollection.push(
        $currTabLis
          .find('a[role="tab"][href="#' + paneId + '"]')
          .parent('li')
        );

    if (!ignoreTabPanes) {
      newTabPanesCollection.push($('#' + paneId));
    }
  });

  refreshData.$navTabs.append(newTabsCollection);

  if (!ignoreTabPanes) {
    refreshData.$currTabContentPanesContainer.append(newTabPanesCollection);
  }

  return true;
}

function checkForTabsRemovedOrUpdated(refreshData) {
  var $currTabLis = refreshData.$currTabLis,
      updatedTabsArray = refreshData.updatedTabsArray,
      propNames = refreshData.propNames,
      isInitTabsRequired = false;


  $currTabLis.each(function (currDomIdx) {
    var $li = $(this),
        origTabData = $li.data('tab'),
        newIdx = tabUtils.getTabIndexByPaneId(updatedTabsArray, propNames.paneId, origTabData[propNames.paneId]),
        newTabData = (newIdx > -1) ? updatedTabsArray[newIdx] : null;

    refreshData.tabLi = {
      $li: $li,
      currDomIdx: currDomIdx,
      newIdx: newIdx,
      $contentPane: tabElements.getElTabPaneForLi($li),
      origTabData: origTabData,
      newTabData: newTabData
    };

    if (checkForTabRemoved(refreshData)) {
      isInitTabsRequired = true;
      return; // continue to next $li in .each() since we removed this tab
    }

    if (checkForTabPropertiesUpdated(refreshData)) {
      isInitTabsRequired = true;
    }
  });

  return isInitTabsRequired;
}

function listenForDropdownMenuTabs($scroller, stc) {
  var $ddMenu;

  // for dropdown menus to show, we need to move them out of the
  // scroller and append them to the body
  $scroller
    .on(CONSTANTS.EVENTS.DROPDOWN_MENU_SHOW, handleDropdownShow)
    .on(CONSTANTS.EVENTS.DROPDOWN_MENU_HIDE, handleDropdownHide);

  function handleDropdownHide(e) {
    // move the dropdown menu back into its tab
    $(e.target).append($ddMenu.off(CONSTANTS.EVENTS.CLICK));
  }

  function handleDropdownShow(e) {
    var $ddParentTabLi = $(e.target),
        ddLiOffset = $ddParentTabLi.offset(),
        $currActiveTab = $scroller.find('li[role="presentation"].active'),
        ddMenuRightX,
        tabsContainerMaxX,
        ddMenuTargetLeft;

    $ddMenu = $ddParentTabLi
                .find('.dropdown-menu')
                .attr('data-' + CONSTANTS.DATA_KEY_DDMENU_MODIFIED, true);

    // if the dropdown's parent tab li isn't already active,
    // we need to deactivate any active menu item in the dropdown
    if ($currActiveTab[0] !== $ddParentTabLi[0]) {
      $ddMenu.find('li.active').removeClass('active');
    }

    // we need to do our own click handling because the built-in
    // bootstrap handlers won't work since we moved the dropdown
    // menu outside the tabs container
    $ddMenu.on(CONSTANTS.EVENTS.CLICK, 'a[role="tab"]', handleClickOnDropdownMenuItem);

    $('body').append($ddMenu);

    // make sure the menu doesn't go off the right side of the page
    ddMenuRightX = $ddMenu.width() + ddLiOffset.left;
    tabsContainerMaxX = $scroller.width() - (stc.$slideRightArrow.outerWidth() + 1);
    ddMenuTargetLeft = ddLiOffset.left;

    if (ddMenuRightX > tabsContainerMaxX) {
      ddMenuTargetLeft -= (ddMenuRightX - tabsContainerMaxX);
    }

    $ddMenu.css({
      'display': 'block',
      'top': ddLiOffset.top + $ddParentTabLi.outerHeight() - 2,
      'left': ddMenuTargetLeft
    });

    function handleClickOnDropdownMenuItem() {
      /* jshint validthis: true */
      var $selectedMenuItemAnc = $(this),
          $selectedMenuItemLi = $selectedMenuItemAnc.parent('li'),
          $selectedMenuItemDropdownMenu = $selectedMenuItemLi.parent('.dropdown-menu'),
          targetPaneId = $selectedMenuItemAnc.attr('href');

      if ($selectedMenuItemLi.hasClass('active')) {
        return;
      }

      // once we select a menu item from the dropdown, deactivate
      // the current tab (unless it's our parent tab), deactivate
      // any active dropdown menu item, make our parent tab active
      // (if it's not already), and activate the selected menu item
      $scroller
        .find('li.active')
        .not($ddParentTabLi)
        .add($selectedMenuItemDropdownMenu.find('li.active'))
        .removeClass('active');

      $ddParentTabLi
        .add($selectedMenuItemLi)
        .addClass('active');

      // manually deactivate current active pane and activate our pane
      $('.tab-content .tab-pane.active').removeClass('active');
      $(targetPaneId).addClass('active');
    }

  }
}

function refreshDataDrivenTabs($container, options) {
  var instanceData = $container.data().scrtabs,
      scroller = instanceData.scroller,
      $navTabs = $container.find('.scrtabs-tab-container .nav-tabs'),
      $currTabContentPanesContainer = $container.find('.tab-content'),
      isInitTabsRequired = false,
      refreshData = {
        options: options,
        updatedTabsArray: instanceData.tabs,
        updatedTabsLiContent: instanceData.tabsLiContent,
        updatedTabsPostProcessors: instanceData.tabsPostProcessors,
        propNames: instanceData.propNames,
        ignoreTabPanes: instanceData.ignoreTabPanes,
        $navTabs: $navTabs,
        $currTabLis: $navTabs.find('> li'),
        $currTabContentPanesContainer: $currTabContentPanesContainer,
        $currTabContentPanes: $currTabContentPanesContainer.find('.tab-pane')
      };

  // to preserve the tab positions if we're just adding or removing
  // a tab, don't completely rebuild the tab structure, but check
  // for differences between the new tabs array and the old
  if (checkForTabAdded(refreshData)) {
    isInitTabsRequired = true;
  }

  if (checkForTabsOrderChanged(refreshData)) {
    isInitTabsRequired = true;
  }

  if (checkForTabsRemovedOrUpdated(refreshData)) {
    isInitTabsRequired = true;
  }

  if (isInitTabsRequired) {
    scroller.initTabs();
  }

  return isInitTabsRequired;
}

function refreshTargetElementInstance($container, options) {
  if (!$container.data('scrtabs')) { // target element doesn't have plugin on it
    return;
  }

  // force a refresh if the tabs are static html or they're data-driven
  // but the data didn't change so we didn't call initTabs()
  if ($container.data('scrtabs').isWrapperOnly || !refreshDataDrivenTabs($container, options)) {
    $('body').trigger(CONSTANTS.EVENTS.FORCE_REFRESH);
  }
}

function scrollToActiveTab() {
  /* jshint validthis: true */
  var $targetElInstance = $(this),
      scrtabsData = $targetElInstance.data('scrtabs');

  if (!scrtabsData) {
    return;
  }

  scrtabsData.scroller.scrollToActiveTab();
}
