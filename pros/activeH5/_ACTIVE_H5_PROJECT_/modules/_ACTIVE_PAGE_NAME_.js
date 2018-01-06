layui.define(['form', 'element'], function (exports) {
	var form = layui.form, element = layui.element;

	initAppPage({
		formRender: true,
		elmRender: true,
		pageTransitions: {
			mode: 24,
			infiniteLoop: false,
			touchIgnoreDomClass: 'touchIgnore',
			onSliderLoad: function (currentIndex) {
				let pageItemCount = $('ul.pageItemWrap').find('li.pageItem').length;
				element.progress('pageProgress', ((currentIndex + 1) / pageItemCount * 100) + '%');
			},
			onSlideAfter: function (newIndex, oldIndex, newElement, oldElement) {
				let pageItemCount = $('ul.pageItemWrap').find('li.pageItem').length;
				let pageProgressVal = (newIndex + 1) / pageItemCount * 100;
				element.progress('pageProgress', pageProgressVal + '%');
			}
		}
	});

	exports('_ACTIVE_PAGE_NAME_', function (clickWhere, thiz) {
		if (clickWhere == 'playMusicToggle') {
			$(thiz).toggleClass('rotate');
			let oAudio = $(thiz).find('audio').get(0);
			if ($(thiz).hasClass('rotate')) {
				oAudio.play();
			} else {
				oAudio.pause();
			}
		}
	});
});
