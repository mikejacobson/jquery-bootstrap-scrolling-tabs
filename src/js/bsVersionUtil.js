function _getActiveOwner($li, bsVersion) {
  if (bsVersion == 4) {
    return $li.find('a[role="tab"]');
  } else {
    return $li;
  }
}

function _getDisabledOwner($li, bsVersion) {
  if (bsVersion == 4) {
    return $li.find('a[role="tab"]');
  } else {
    return $li;
  }
}

function _getDataToggleOwner($li, bsVersion) {
  return $li.find('a[role="tab"]');
}

function isLiActive($li, bsVersion) {
  return _getActiveOwner($li, bsVersion).hasClass('active');
}

function isLiDisabled($li, bsVersion) {
  return _getDisabledOwner($li, bsVersion).hasClass('disabled');
}

function getActiveLi($scroller, bsVersion) {
  if (bsVersion == 4) {
    return $scroller.find('li[role="presentation"] > a[role="tab"].active');
  } else {
    return $scroller.find('li[role="presentation"].active');
  }
}

function setLiActive($li, state, bsVersion) {
  _getActiveOwner($li, bsVersion)[state ? 'addClass' : 'removeClass']('active');
}

function setLiDisabled($li, state, bsVersion) {
  _getActiveOwner($li, bsVersion)[state ? 'addClass' : 'removeClass']('disabled');
  _getDataToggleOwner.attr('data-toggle', state ? '' : 'tab');
}
