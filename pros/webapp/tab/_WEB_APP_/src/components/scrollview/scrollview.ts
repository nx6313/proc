import { Component, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Platform } from 'ionic-angular';

declare var $;
declare var PullToRefresh;

@Component({
  selector: 'scrollview',
  templateUrl: 'scrollview.html'
})
export class ScrollviewComponent {
  @Output('pullRef') dataPullRef = new EventEmitter<any>();
  @Output('pullRefAfter') dataPullRefAfter = new EventEmitter<any>();
  @ViewChild('pullrefcontent', { read: ElementRef }) _pullrefContent: ElementRef;
  @Input('height') scrollViewHeight: number = -1;
  @Input('bottomOtherHeight') bottomOtherHeight: number = 0;
  @Input('pullRefSupport') pullRefSupport: boolean = false;
  @Input('pullAreaBg') pullAreaBg: string = '#CCCCCC';
  @Input('instructionsPullToRefresh') instructionsPullToRefresh: string = '继续下拉';
  @Input('instructionsReleaseToRefresh') instructionsReleaseToRefresh: string = '释放刷新';
  @Input('instructionsRefreshing') instructionsRefreshing: string = '正在刷新';
  @Input('iconArrow') iconArrow: string = 'assets/imgs/pull.png';
  @Input('iconRefreshing') iconRefreshing: string = 'assets/imgs/refing.png';
  @Input('iconZoomRate') iconZoomRate: number = 0.1;
  @Input('refTxtColor') refTxtColor: string = '#4D4D4D';

  constructor(private platform: Platform) {
  }

  ngOnInit() {
    this.initPullRef();
  }

  initPullRef() {
    this.platform.ready().then(() => {
      let scrollEle: HTMLElement = this._pullrefContent.nativeElement;
      PullToRefresh.init({
        mainElement: scrollEle,
        classPrefix: 'ionic-',
        pullAreaBg: this.pullAreaBg,
        elasticityAreaBg: null,
        instructionsPullToRefresh: this.instructionsPullToRefresh,
        instructionsReleaseToRefresh: this.instructionsReleaseToRefresh,
        instructionsRefreshing: this.instructionsRefreshing,
        iconArrow: this.iconArrow,
        iconRefreshing: this.iconRefreshing,
        iconZoomRate: this.iconZoomRate,
        refTxtColor: this.refTxtColor,
        onRefresh: () => {
          let dataPullRefFn = this.dataPullRef;
          return new Promise(function (resolve) {
            dataPullRefFn.emit(resolve);
          });
        },
        onRefreshAfter: (data) => {
          this.dataPullRefAfter.emit(data);
        },
        onlyElasticity: (!this.pullRefSupport),
        scrollViewHeight: this.scrollViewHeight,
        titleBarHeight: 44,
        footerBarHeight: 'auto',
        otherElmHeight: this.bottomOtherHeight,
        offsetWidth: scrollEle.offsetWidth,
        offsetTop: scrollEle.offsetTop,
        offsetLeft: scrollEle.offsetLeft,
        shouldPullToRefresh: () => {
          let scrollTop = scrollEle.scrollTop;
          if (scrollTop <= 0) {
            return true;
          }
          return false;
        },
        shouldUpToElasticity: () => {
          let scrollTop = scrollEle.scrollTop;
          let clientHeight = scrollEle.clientHeight;
          let scrollHeight = scrollEle.scrollHeight;
          if (scrollHeight == clientHeight + scrollTop) {
            return true;
          }
          return false;
        }
      });
    });
  }

  // 提供方法，将滚动条保持在最下
  scrollToBottom() {
    let scrollEle: HTMLElement = this._pullrefContent.nativeElement;
    scrollEle.scrollTop = $(scrollEle).stop().animate({ scrollTop: scrollEle.scrollHeight + 'px' }, 600);
  }

}
