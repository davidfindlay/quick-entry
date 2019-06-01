import {AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.css']
})
export class InfoCardComponent implements OnInit, AfterViewInit {

  @ContentChild('app-info-card') messageRef: ElementRef;
  message: string;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    this.message = this.messageRef.nativeElement.innerHTML;
    console.log(this.messageRef.nativeElement.innerHTML);

  }


}
