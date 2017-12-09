!function (win) {
    var oHtml = win.document.documentElement; // 获取html
    var timer = null;

    function changeRem() {
        var width = oHtml.getBoundingClientRect().width; // 获取设备的宽度，IE浏览器要做兼容处理
        if (width > 540) {
            width = 540;
        }
        var rem = width / 10;
        oHtml.style.fontSize = rem + "px"; // 设置根目录下字体大小
    }

    win.addEventListener("resize", function () {
        clearTimeout(timer);
        timer = setTimeout(changeRem, 200);
    })

    changeRem();
}(window);

/**
 * 页面初始化
 * @param {* 页面配置参数 } pageParams 
 */
var initAppPage = function (pageParams) {
    let baseParams = {
        formRender: false, elmRender: false, pageTransitions: {}
    };
    if ($.isPlainObject(pageParams)) {
        $.extend(baseParams, pageParams);
    }

    $('body').animateCss('fadeIn');

    let bodyAllHtml = $('body').html();
    $('body').html('<div id="mainContent" class="mainContent" style="position: relative; z-index: 100;">' + bodyAllHtml + '</div>');

    $('body').show();
    if (baseParams.formRender) {
        var form = layui.form;
        form.render();
    }
    if (baseParams.elmRender) {
        var element = layui.element;
        element.init();
    }

    fullPullRefWrapHeight();

    // 解析活动页面数据
    if (!$.isEmptyObject(baseParams.pageTransitions)) {
        initPageTransitions({
            wrapElm: $('ul.pageItemWrap'),
            slideSelector: 'li.pageItem',
            mode: baseParams.pageTransitions.mode,
            preventDefaultSwipeX: false,
            preventDefaultSwipeY: true,
            infiniteLoop: baseParams.pageTransitions.infiniteLoop,
            touchIgnoreDomClass: baseParams.pageTransitions.touchIgnoreDomClass,
            onSliderLoad: baseParams.pageTransitions.onSliderLoad,
            onSlideAfter: baseParams.pageTransitions.onSlideAfter
        });
    }
};

/**
 * 指定元素占用空间剩余高度
 */
var fullPullRefWrapHeight = function () {
    if ($('div.mainContent').length > 0) {
        let screenHeight = $(window).outerHeight();
        $('div.mainContent').css('height', screenHeight + 'px');
    }
};

/**
 * 扩展 JQuery 添加动画属性方法
 */
$.fn.extend({
    animateCss: function (animationName, removeFlag) {
        let that = this;
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        let animationEndPromise = new Promise(function (resolve) {
            that.addClass('animated ' + animationName).one(animationEnd, function () {
                resolve('移出属性动画执行完毕');
                $(that).removeClass('animated ' + animationName);
                if (removeFlag) {
                    $(that).remove();
                }
            });
        });
        return animationEndPromise;
    }
});

/**
 * 初始化页面分页显示
 * @param {* 页面分页配置参数 } transitionParams 
 * @param mode 0：淡入翻页(适合左右和上下操作)
			1、2：简单位移翻页
			3、4：新页位移入场旧页变暗位置不动
			5、6：新旧页同时位移旧页变暗
			7、8：新页位移入场旧页浮动位移
			9、10：新页位移入场旧页变小
			11、12：新页位移入场旧页揭下和9、10差不多
			13、14：旧页位移新页放大入场
			15、16：新页位移入场旧页顶下去
			17、18：新旧页同时面对面翻页入场和出场
			19、20：新旧页像盒子一样转动
			21、22：新旧页像盒子一样展开
			23、24：新旧页像在盒子里一样转动
			25、26：新旧页像盒子一样转动视角由小大变小再由小变大
			27、28：新旧页立体间飞行位移
			29、30：新页缩小和旧变大页翻转交错入场
			31：新页和旧页一起淡入效果同时变小(适合左右和上下操作)
			32：新页和旧页一起淡入效果同时变大(适合左右和上下操作)
			33：新旧页同时面对面翻页入场和出场周时变小与24差不多(适合左右)
			34:旧页固定顶角再掉落新页放大入场(适合左右和上下操作)
			35：旧页缩小移出新页移出放大入场(适合左右)
			36：新页缩小旧页变大交错入场(适合左右和上下操作)
            37：新页缩小和旧变大页旋转交错入场(适合左右和上下操作)
 * @method goToSlide 执行一个幻灯片过渡到提供的幻灯片的索引（从零开始）
 * @method goToNextSlide 执行“下一步”幻灯片过渡
 * @method goToPrevSlide 执行“上一页”的幻灯片过渡
 * @method getCurrentSlide 返回当前活动的幻灯片
 * @method getSlideCount 返回在滑块总幻灯片的数目
 * @method setSlideMode 动态设置新的翻页效果（0-37）
 * @method reloadSlider 重新装入滑块
 */
var initPageTransitions = function (transitionParams) {
    let baseParams = {
        wrapElm: null, mode: 0, preventDefaultSwipeX: true, preventDefaultSwipeY: false, speed: null,
        startSlide: 0, slideSelector: '', infiniteLoop: true, easing: null, slideZIndex: 50, responsive: true, touchIgnoreDomClass: 'touchIgnore',
        wrapperClass: 'fk-page-wrapper', mouseWheel: false, wheelThreshold: 2, swipeThreshold: 50, pagerunstat: false,
        onSliderLoad: function (currentIndex) { }, onSliderResize: function (currentIndex) { }, onSlideBefore: function (newIndex, oldIndex, newElement, oldElement) { },
        onSlideAfter: function (newIndex, oldIndex, newElement, oldElement) { }, onSlideNext: function (newIndex, oldIndex, newElement, oldElement) { },
        onSlidePrev: function (newIndex, oldIndex, newElement, oldElement) { }
    };
    if ($.isPlainObject(transitionParams)) {
        $.extend(baseParams, transitionParams);
    }
    if (baseParams.wrapElm) {
        let fkObj = $(baseParams.wrapElm).FKPageTransitions({
            mode: baseParams.mode,
            preventDefaultSwipeX: baseParams.preventDefaultSwipeX,
            preventDefaultSwipeY: baseParams.preventDefaultSwipeY,
            speed: baseParams.speed,
            startSlide: baseParams.startSlide,
            slideSelector: baseParams.slideSelector,
            infiniteLoop: baseParams.infiniteLoop,
            easing: baseParams.easing,
            slideZIndex: baseParams.slideZIndex,
            responsive: baseParams.responsive,
            touchIgnoreDomClass: baseParams.touchIgnoreDomClass,
            wrapperClass: baseParams.wrapperClass,
            mouseWheel: baseParams.mouseWheel,
            wheelThreshold: baseParams.wheelThreshold,
            swipeThreshold: baseParams.swipeThreshold,
            pagerunstat: baseParams.pagerunstat,
            onSliderLoad: baseParams.onSliderLoad,
            onSliderResize: baseParams.onSliderResize,
            onSlideBefore: baseParams.onSlideBefore,
            onSlideAfter: baseParams.onSlideAfter,
            onSlideNext: baseParams.onSlideNext,
            onSlidePrev: baseParams.onSlidePrev
        });
        return fkObj;
    } else {
        console.error('初始化页面分页', '绑定根元素不能为空');
    }
};