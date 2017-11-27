import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tab-control-slide',
  templateUrl: 'tab-control-slide.html'
})
export class TabControlSlideComponent {
  @Input("slides") slides: string[] = [];
  @Input("pageNumber") pageNumber: number = 5;
  @Output('change') childEvent = new EventEmitter<number>();

  mySlideOptions;
  selectedIndex: number = 0;

  constructor() {
  }

  ngOnInit() {
    this.mySlideOptions = {
      loop: false,
      autoplay: false,
      initialSlide: 0,
      pager: false,
      slidesPerView: this.pageNumber,
      paginationHide: true,
      paginationClickable: true
    };
  }

  onClick(index) {
    this.selectedIndex = index;
    this.childEvent.emit(index);
  }

}
