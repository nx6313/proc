import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pageSlides: any;

  constructor(public navCtrl: NavController) {
    this.pageSlides = ['新闻', '美食', '中外', '中外', '中外', '中外', '中外', '中外', '中外'];
  }

  ionViewDidEnter() {
  }

  onSlideClick(index) {

  }

}
