// smartresize from Paul Irish (debounced window resize)
(function (sr) {
  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this, args = arguments;
      function delayed() {
        if (!execAsap) {
          func.apply(obj, args);
        }
        timeout = null;
      }

      if (timeout) {
        clearTimeout(timeout);
      } else if (execAsap) {
        func.apply(obj, args);
      }

      timeout = setTimeout(delayed, threshold || 100);
    };
  };
  $.fn[sr] = function (fn) { return fn ? this.bind(CONSTANTS.EVENTS.WINDOW_RESIZE, debounce(fn)) : this.trigger(sr); };

})('smartresize');
