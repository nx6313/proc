var PullToRefresh = (function () {
  var _ptrMarkup = function () { return "<div class=\"__PREFIX__box\"><div class=\"__PREFIX__content\"><div class=\"__PREFIX__icon animated\"></div><div class=\"__PREFIX__text\"></div></div></div>"; };

  var _ptrStyles = function () { return "_PAGE_ID_ABOUT_ .__PREFIX__ptr {\n __PULLWRAPBG__\n  __PULLWRAPBOXSHADOW__\n  pointer-events: none;\n  font-size: 0.85em;\n  font-weight: bold;\n  top: 0;\n  height: 0;\n  transition: height 0.3s, min-height 0.3s;\n  text-align: center;\n  width: 100%;\n  overflow: hidden;\n  display: flex;\n  align-items: flex-end;\n  align-content: stretch;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__box {\n  padding: 6px;\n  flex-basis: 100%;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__pull {\n  transition: none;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__text {\n  margin-top: .33em;\n  color: _REF_TXT_TIP_COLOR_;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__icon {\n color: rgba(252, 252, 252, 0.8);\n  transition: transform .3s;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__top {\n  touch-action: pan-x pan-down pinch-zoom;\n}\n_PAGE_ID_ABOUT_ .__PREFIX__release .__PREFIX__icon {\n  transform: rotate(180deg);\n}\n_PAGE_ID_ABOUT_ .__PREFIX__ptr-after{\n box-shadow: none !important;\n __PULLAFTERBG__\n}"; };

  /* eslint-disable import/no-unresolved */

  var _SETTINGS = {};
  let pageSettingsContainer = {}; // 存放所有页面的各自参数容器

  var _defaults = {
    distThreshold: 66,
    distMax: 74,
    distReload: 62,
    bodyOffset: 20,
    pullAreaBg: '',
    elasticityTopAreaBg: '',
    elasticityAreaBg: '',
    mainElement: 'body',
    triggerElement: 'body',
    ptrElement: '.ptr',
    ptrAfterElement: '.ptr-after',
    classPrefix: 'ptr--',
    pageIdName: '',
    cssProp: 'min-height',
    iconArrow: '&#8675;',
    iconRefreshing: '&hellip;',
    iconZoomRate: 0.1,
    refTxtColor: 'rgba(252, 252, 252, 0.8)',
    instructionsPullToRefresh: 'Pull down to refresh',
    instructionsReleaseToRefresh: 'Release to refresh',
    instructionsRefreshing: 'Refreshing',
    refreshTimeout: 200,
    getMarkup: _ptrMarkup,
    getStyles: _ptrStyles,
    onInit: function () { },
    onRefresh: function () { },
    onRefreshAfter: function () { },
    resistanceFunction: function (t) { return Math.min(1, t / 4); },
    shouldPullToRefresh: function () { return !window.scrollY; },
    shouldUpToElasticity: function () { return !window.scrollY; },
    onlyElasticity: true,
    scrollViewHeight: -1,
    titleBarHeight: 0,
    footerBarHeight: 0,
    otherElmHeight: 0,
    offsetWidth: -1,
    offsetTop: 0,
    offsetLeft: 0
  };

  var pullStartY = null;
  var pullMoveY = null;
  var dist = 0;
  var distResisted = 0;

  var _setup = false;
  var _enable = false;
  var _timeout = null;

  var canPull = false;
  var canElasticity = false;

  var supportsPassive = false;

  try {
    window.addEventListener('test', null, {
      get passive() {
        supportsPassive = true;
      },
    });
  } catch (e) {
    // do nothing
  }

  function _update() {
    let curPageIdName = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').parent().get(0).localName;
    var onlyElasticity = pageSettingsContainer[curPageIdName].onlyElasticity;
    if (!onlyElasticity) {
      var classPrefix = _SETTINGS.classPrefix;
      var ptrElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').find('div.' + classPrefix + 'ptr').get(0); // _SETTINGS.ptrElement;
      var ptrAfterElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.' + classPrefix + 'ptr-after').get(0); // _SETTINGS.ptrAfterElement;
      var iconArrow = _SETTINGS.iconArrow;
      var iconRefreshing = _SETTINGS.iconRefreshing;
      var iconZoomRate = _SETTINGS.iconZoomRate;
      var instructionsRefreshing = pageSettingsContainer[curPageIdName].instructionsRefreshing;
      var instructionsPullToRefresh = pageSettingsContainer[curPageIdName].instructionsPullToRefresh;
      var instructionsReleaseToRefresh = pageSettingsContainer[curPageIdName].instructionsReleaseToRefresh;

      var iconEl = ptrElement.querySelector(("." + classPrefix + "icon"));
      var textEl = ptrElement.querySelector(("." + classPrefix + "text"));

      if (pageSettingsContainer[curPageIdName]._state === 'refreshing') {
        iconEl.classList.add('rotate');
        iconEl.innerHTML = '<img style="width: ' + (iconZoomRate * 100) + '%;" src="' + iconRefreshing + '"/>';
      } else {
        iconEl.classList.remove('rotate');
        iconEl.innerHTML = '<img style="width: ' + (iconZoomRate * 100) + '%;" src="' + iconArrow + '"/>';
      }

      if (pageSettingsContainer[curPageIdName]._state === 'releasing') {
        textEl.innerHTML = instructionsReleaseToRefresh;
      }

      if (pageSettingsContainer[curPageIdName]._state === 'pulling' || pageSettingsContainer[curPageIdName]._state === 'pending') {
        textEl.innerHTML = instructionsPullToRefresh;
      }

      if (pageSettingsContainer[curPageIdName]._state === 'refreshing') {
        textEl.innerHTML = instructionsRefreshing;
      }
    }
  }

  function _setupEvents() {
    function onReset() {
      let curPageIdName = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').parent().get(0).localName;
      var classPrefix = _SETTINGS.classPrefix;
      var cssProp = _SETTINGS.cssProp;
      var ptrElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').find('div.' + classPrefix + 'ptr').get(0); // _SETTINGS.ptrElement;

      ptrElement.classList.remove((classPrefix + "refresh"));
      ptrElement.style[cssProp] = '0px';

      pageSettingsContainer[curPageIdName]._state = 'pending';
      _update();
    }

    function _onTouchStart(e) {
      let curPageIdName = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').parent().get(0).localName;
      var shouldPullToRefresh = pageSettingsContainer[curPageIdName].shouldPullToRefresh;
      var shouldUpToElasticity = pageSettingsContainer[curPageIdName].shouldUpToElasticity;
      var triggerElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').get(0); // _SETTINGS.mainElement

      if (!triggerElement.contains(e.target)) {
        return;
      }

      canPull = false;
      canElasticity = false;
      if (shouldPullToRefresh() || shouldUpToElasticity()) {
        pullStartY = e.touches[0].screenY;
        if (shouldPullToRefresh() && !shouldUpToElasticity()) {
          canPull = true;
        } else if (!shouldPullToRefresh() && shouldUpToElasticity()) {
          canElasticity = true;
        } else {
          canPull = true;
          canElasticity = true;
        }
      }

      if (pageSettingsContainer[curPageIdName]._state !== 'pending') {
        return;
      }
      if (triggerElement !== document.body) {
        triggerElement.style.transition = '';
      }

      clearTimeout(_timeout);

      _enable = triggerElement.contains(e.target);
      pageSettingsContainer[curPageIdName]._state = 'pending';
      _update();
    }

    function _onTouchMove(e) {
      let curPageIdName = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').parent().get(0).localName;
      var classPrefix = _SETTINGS.classPrefix;
      var cssProp = _SETTINGS.cssProp;
      var distMax = _SETTINGS.distMax;
      var distThreshold = _SETTINGS.distThreshold;
      var ptrElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').find('div.' + classPrefix + 'ptr').get(0); // _SETTINGS.ptrElement;
      var ptrAfterElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.' + classPrefix + 'ptr-after').get(0); // _SETTINGS.ptrAfterElement;
      var triggerElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').get(0); // _SETTINGS.mainElement
      var resistanceFunction = _SETTINGS.resistanceFunction;
      var onlyElasticity = pageSettingsContainer[curPageIdName].onlyElasticity;

      if (!triggerElement.contains(e.target)) {
        return;
      }

      if (!pullStartY) {
        if (canPull || canElasticity) {
          pullStartY = e.touches[0].screenY;
        }
      } else {
        pullMoveY = e.touches[0].screenY;
      }

      if (!_enable || pageSettingsContainer[curPageIdName]._state === 'refreshing') {
        if (canPull && pullStartY < pullMoveY) {
          e.preventDefault();
        }
        if (canElasticity && pullStartY > pullMoveY) {
          e.preventDefault();
        }
        return;
      }

      if (pullStartY && pullMoveY) {
        dist = pullMoveY - pullStartY;
      }

      if (canPull && dist > 0) {
        if (pageSettingsContainer[curPageIdName]._state === 'pending') {
          ptrElement.classList.add((classPrefix + "pull"));
          pageSettingsContainer[curPageIdName]._state = 'pulling';
          _update();
        }

        e.preventDefault();

        ptrElement.style[cssProp] = distResisted + "px";

        if (!onlyElasticity) {
          distResisted = resistanceFunction(dist / distThreshold) * Math.min(distMax, dist);
        } else {
          let disRatio = dist / 200;
          distResisted = Math.min(1, dist / 80 / 6.5) * Math.min(100, dist) * 0.8;
        }

        if (!onlyElasticity) {
          if (pageSettingsContainer[curPageIdName]._state === 'pulling' && distResisted > distThreshold) {
            ptrElement.classList.add((classPrefix + "release"));
            pageSettingsContainer[curPageIdName]._state = 'releasing';
            _update();
          }

          if (pageSettingsContainer[curPageIdName]._state === 'releasing' && distResisted < distThreshold) {
            ptrElement.classList.remove((classPrefix + "release"));
            pageSettingsContainer[curPageIdName]._state = 'pulling';
            _update();
          }
        }
      } else if (canElasticity && dist < 0) {
        if (triggerElement !== document.body) {
          if (pageSettingsContainer[curPageIdName]._state === 'pending' && onlyElasticity) {
            ptrAfterElement.classList.add((classPrefix + "pull"));
            pageSettingsContainer[curPageIdName]._state = 'pulling';
            _update();
          }

          e.preventDefault();

          triggerElement.style.transform = 'translate3d(0px, ' + (- distResisted) + 'px, 0px)';

          distResisted = Math.abs(dist) * 0.2;
        }
      }
    }

    function _onTouchEnd(e) {
      let curPageIdName = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').parent().get(0).localName;
      var classPrefix = _SETTINGS.classPrefix;
      var ptrElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').find('div.' + classPrefix + 'ptr').get(0); // _SETTINGS.ptrElement;
      var ptrAfterElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.' + classPrefix + 'ptr-after').get(0); // _SETTINGS.ptrAfterElement;
      var triggerElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').get(0); // _SETTINGS.mainElement
      var onRefresh = pageSettingsContainer[curPageIdName].onRefresh;
      var onRefreshAfter = pageSettingsContainer[curPageIdName].onRefreshAfter;
      var refreshTimeout = _SETTINGS.refreshTimeout;
      var distThreshold = _SETTINGS.distThreshold;
      var distReload = _SETTINGS.distReload;
      var cssProp = _SETTINGS.cssProp;
      var onlyElasticity = pageSettingsContainer[curPageIdName].onlyElasticity;

      if (!triggerElement.contains(e.target)) {
        return;
      }

      if (pageSettingsContainer[curPageIdName]._state === 'releasing' && distResisted > distThreshold) {
        pageSettingsContainer[curPageIdName]._state = 'refreshing';

        ptrElement.style[cssProp] = distReload + "px";
        ptrElement.classList.add((classPrefix + "refresh"));

        _timeout = setTimeout(function () {
          var retval = onRefresh();

          if (retval && typeof retval.then === 'function') {
            retval.then(function (thenReturn) {
              onReset();
              return onRefreshAfter(thenReturn);
            });
          }

          if (!retval && !onRefresh.length) {
            onReset();
            onRefreshAfter();
          }
        }, refreshTimeout);
      } else {
        if (pageSettingsContainer[curPageIdName]._state === 'refreshing') {
          return;
        }

        ptrElement.style[cssProp] = '0px';
        if (triggerElement !== document.body) {
          triggerElement.style.transition = '0.3s ease';
          triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
        }

        pageSettingsContainer[curPageIdName]._state = 'pending';
      }

      _update();

      ptrElement.classList.remove((classPrefix + "release"));
      ptrElement.classList.remove((classPrefix + "pull"));
      if (onlyElasticity) {
        ptrAfterElement.classList.remove((classPrefix + "release"));
        ptrAfterElement.classList.remove((classPrefix + "pull"));
      }

      pullStartY = pullMoveY = null;
      dist = distResisted = 0;
    }

    function _onScroll() {
      let curPageIdName = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').parent().get(0).localName;
      var mainElement = $('ion-tabs').find('ion-tab.show-tab').find('ion-content').find('scrollview').find('div.pullRefWrap').get(0); // _SETTINGS.mainElement
      var classPrefix = _SETTINGS.classPrefix;
      var shouldPullToRefresh = pageSettingsContainer[curPageIdName].shouldPullToRefresh;
      var triggerElement = mainElement;
      mainElement = $(triggerElement).find('div.mainContent').get(0);

      mainElement.classList.toggle((classPrefix + "top"), shouldPullToRefresh());
    }

    window.addEventListener('touchend', _onTouchEnd);
    window.addEventListener('touchstart', _onTouchStart);
    window.addEventListener('touchmove', _onTouchMove, supportsPassive
      ? { passive: _SETTINGS.passive || false }
      : undefined);

    window.addEventListener('scroll', _onScroll);

    // Store event handlers to use for teardown later
    return {
      onTouchStart: _onTouchStart,
      onTouchMove: _onTouchMove,
      onTouchEnd: _onTouchEnd,
      onScroll: _onScroll,
    };
  }

  function _run() {
    var mainElement = _SETTINGS.mainElement
    var getMarkup = _SETTINGS.getMarkup;
    var getStyles = _SETTINGS.getStyles;
    var classPrefix = _SETTINGS.classPrefix;
    var pageIdName = _SETTINGS.pageIdName;
    var onInit = _SETTINGS.onInit;
    var pullAreaBg = _SETTINGS.pullAreaBg;
    var elasticityTopAreaBg = _SETTINGS.elasticityTopAreaBg;
    var elasticityAreaBg = _SETTINGS.elasticityAreaBg;
    var onlyElasticity = _SETTINGS.onlyElasticity;
    var titleBarHeight = _SETTINGS.titleBarHeight;
    var footerBarHeight = _SETTINGS.footerBarHeight;
    var otherElmHeight = _SETTINGS.otherElmHeight;
    var offsetWidth = _SETTINGS.offsetWidth;
    var offsetTop = _SETTINGS.offsetTop;
    var offsetLeft = _SETTINGS.offsetLeft;
    var scrollViewHeight = _SETTINGS.scrollViewHeight;
    var refTxtColor = _SETTINGS.refTxtColor;
    var triggerElement = mainElement;
    mainElement = $(triggerElement).find('div.mainContent').get(0);
    if (footerBarHeight == 'auto') {
      footerBarHeight = $('div.tabbar').height();
    }
    // 保存各页面参数
    if (pageIdName) {
      let curPageSettings = {};

      var instructionsRefreshing = _SETTINGS.instructionsRefreshing;
      curPageSettings['instructionsRefreshing'] = instructionsRefreshing;
      var instructionsPullToRefresh = _SETTINGS.instructionsPullToRefresh;
      curPageSettings['instructionsPullToRefresh'] = instructionsPullToRefresh;
      var instructionsReleaseToRefresh = _SETTINGS.instructionsReleaseToRefresh;
      curPageSettings['instructionsReleaseToRefresh'] = instructionsReleaseToRefresh;
      curPageSettings['onlyElasticity'] = onlyElasticity;
      var shouldPullToRefresh = _SETTINGS.shouldPullToRefresh;
      var shouldUpToElasticity = _SETTINGS.shouldUpToElasticity;
      curPageSettings['shouldPullToRefresh'] = shouldPullToRefresh;
      curPageSettings['shouldUpToElasticity'] = shouldUpToElasticity;
      var onRefresh = _SETTINGS.onRefresh;
      var onRefreshAfter = _SETTINGS.onRefreshAfter;
      curPageSettings['onRefresh'] = onRefresh;
      curPageSettings['onRefreshAfter'] = onRefreshAfter;

      curPageSettings['_state'] = 'pending';

      pageSettingsContainer[pageIdName] = curPageSettings;
    }

    if (!triggerElement.querySelector(("." + classPrefix + "ptr"))) {
      var ptr = document.createElement('div');
      var ptrAfter = document.createElement('div');

      mainElement.parentNode.insertBefore(ptr, mainElement);
      ptrAfter.style.position = 'absolute';
      ptrAfter.style.left = offsetLeft + 'px';
      ptrAfter.style.zIndex = -1;
      if (offsetWidth > 0 && offsetLeft > 0) {
        ptrAfter.style.width = offsetWidth + 'px';
      }
      let pageHeight = $(triggerElement).parents('ion-content').get(0).clientHeight;
      if (scrollViewHeight > 0 && scrollViewHeight < pageHeight) {
        ptrAfter.style.height = (scrollViewHeight) + 'px';
      } else {
        ptrAfter.style.height = (pageHeight - titleBarHeight - offsetTop - Number(otherElmHeight)) - footerBarHeight + 'px';
      }
      mainElement.parentNode.parentNode.appendChild(ptrAfter);
      if (triggerElement !== document.body) {
        triggerElement.style.transition = '';
        triggerElement.style.transform = 'translate3d(0px, 0px, 0px)';
      }
      if (scrollViewHeight > 0 && scrollViewHeight < pageHeight) {
        triggerElement.style.height = (scrollViewHeight) + 'px';
      } else {
        triggerElement.style.height = (pageHeight - titleBarHeight - offsetTop - Number(otherElmHeight)) - footerBarHeight + 'px';
      }
      triggerElement.style.overflowX = 'hidden';
      triggerElement.style.overflowY = 'auto';
      triggerElement.parentNode.style.position = 'relative';
      triggerElement.parentNode.style.overflow = 'hidden';

      if (!onlyElasticity) {
        ptr.innerHTML = getMarkup()
          .replace(/__PREFIX__/g, classPrefix);
      }

      ptr.classList.add((classPrefix + "ptr"));
      ptrAfter.classList.add(classPrefix + "ptr");
      ptrAfter.classList.add(classPrefix + "ptr-after");
      _SETTINGS.ptrAfterElement = ptrAfter;

      _SETTINGS.ptrElement = ptr;
    }

    // Add the css styles to the style node, and then
    // insert it into the dom
    // ========================================================
    var styleEl;
    let pageIdNameForStyle = '';
    pageIdName != '' ? pageIdNameForStyle = pageIdName + '-' : {};
    let styleId = pageIdNameForStyle + 'pull-to-refresh-js-style';
    if (!document.querySelector('#' + styleId)) {
      styleEl = document.createElement('style');
      styleEl.setAttribute('id', styleId);

      document.head.appendChild(styleEl);
    } else {
      styleEl = document.querySelector('#' + styleId);
    }

    styleEl.textContent = getStyles()
      .replace(/_PAGE_ID_ABOUT_/g, pageIdName)
      .replace(/__PREFIX__/g, classPrefix)
      .replace(/\s+/g, ' ');
    if (refTxtColor) {
      styleEl.textContent = styleEl.textContent.replace(/_REF_TXT_TIP_COLOR_/g, refTxtColor);
    } else {
      styleEl.textContent = styleEl.textContent.replace(/_REF_TXT_TIP_COLOR_/g, 'rgba(252, 252, 252, 0.8)');
    }
    if (!onlyElasticity && pullAreaBg && pullAreaBg != '') {
      styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBG__/g, 'background: ' + pullAreaBg + ';');
    } else {
      if (onlyElasticity && elasticityTopAreaBg && elasticityTopAreaBg != '') {
        styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBG__/g, 'background: ' + elasticityTopAreaBg + ';');
      } else {
        styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBG__/g, '');
      }
    }
    if (elasticityAreaBg && elasticityAreaBg != '') {
      styleEl.textContent = styleEl.textContent.replace(/__PULLAFTERBG__/g, 'background: ' + elasticityAreaBg + ' !important;');
    } else {
      styleEl.textContent = styleEl.textContent.replace(/__PULLAFTERBG__/g, 'background: none !important;');
    }
    if (onlyElasticity) {
      styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBOXSHADOW__/g, '');
    } else {
      styleEl.textContent = styleEl.textContent.replace(/__PULLWRAPBOXSHADOW__/g, 'box-shadow: inset 0 -3px 10px rgba(0, 0, 0, 0.12);');
    }

    if (typeof onInit === 'function') {
      onInit(_SETTINGS);
    }

    return {
      styleNode: styleEl,
      ptrElement: _SETTINGS.ptrElement,
      ptrAfterElement: _SETTINGS.ptrAfterElement
    };
  }

  var pulltorefresh = {
    init: function init(options) {
      if (options === void 0) options = {};

      var handlers;
      Object.keys(_defaults).forEach(function (key) {
        if (typeof _defaults[key] == 'boolean' && typeof options[key] != 'undefined') {
          _SETTINGS[key] = options[key];
        } else {
          _SETTINGS[key] = options[key] || _defaults[key];
        }
      });

      var methods = ['mainElement', 'ptrElement', 'triggerElement'];
      methods.forEach(function (method) {
        if (typeof _SETTINGS[method] === 'string') {
          _SETTINGS[method] = document.querySelector(_SETTINGS[method]);
        }
      });

      if (!_setup) {
        handlers = new _setupEvents();
        _setup = true;
      }

      var ref = _run();
      var styleNode = ref.styleNode;
      var ptrElement = ref.ptrElement;

      return {
        destroy: function destroy() {
          // Teardown event listeners
          window.removeEventListener('touchstart', handlers.onTouchStart);
          window.removeEventListener('touchend', handlers.onTouchEnd);
          window.removeEventListener('touchmove', handlers.onTouchMove, supportsPassive
            ? { passive: _SETTINGS.passive || false }
            : undefined);
          window.removeEventListener('scroll', handlers.onScroll);

          // Remove ptr element and style tag
          styleNode.parentNode.removeChild(styleNode);
          ptrElement.parentNode.removeChild(ptrElement);

          // Enable setupEvents to run again
          _setup = false;

          // null object references
          handlers = null;
          styleNode = null;
          ptrElement = null;
          _SETTINGS = {};
        },
      };
    },
  };

  return pulltorefresh;

}());