import { Component } from '@angular/core';

@Component({
  selector: 'organ-list',
  templateUrl: 'organ-list.html'
})
export class OrganListComponent {

  text: string;

  constructor() {
    console.log('Hello OrganListComponent Component');
    this.text = 'Hello World';
  }

}
