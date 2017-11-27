import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'title-bar',
  templateUrl: 'title-bar.html'
})
export class TitleBarComponent {
  @Input() titleStyle: string;
  @Input() title: string;
  @Input() leftIcon: string;
  @Input() rightIcon: string;
  @Input() rightTxt: string;

  constructor() {
    this.title ? {} : this.title = '标题栏';
    this.leftIcon ? {} : this.leftIcon = 'icon-left'; // icon-person
    this.rightIcon ? {} : this.rightIcon = '';
    this.rightTxt ? {} : this.rightTxt = '';
  }

  ngOnInit() {
  }

}
