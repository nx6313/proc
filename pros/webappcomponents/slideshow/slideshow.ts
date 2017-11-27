import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomController } from 'ionic-angular';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'slideshow',
  templateUrl: 'slideshow.html'
})
export class SlideshowComponent {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('slideshow', { read: ElementRef }) slideshow: ElementRef;
  @Input('height') height: string = '140';
  @Input('effect') effect: string = 'slide';
  @Input('paginationType') paginationType: string = 'bullets';
  @Input('contentList') contentList: Array<string>;

  constructor(private _dom: DomController) {
  }

  ngOnInit() {
    this.setScrollElementStyle('height', this.height + 'px');
    this.slides.loop = true;
    this.slides.autoplay = 1600;
    this.slides.centeredSlides = true;
    this.slides.effect = this.effect;
    this.slides.pager = true;
    this.slides.paginationType = this.paginationType;
    this.slides.zoom = true;
  }

  setScrollElementStyle(prop: string, val: any) {
    if (this.slideshow) {
      const scrollEle: HTMLElement = this.slideshow.nativeElement;
      this._dom.write(() => {
        (<any>scrollEle.style)[prop] = val;
      });
    }
  }

}
