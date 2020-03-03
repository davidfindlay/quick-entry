import {Component, Input, OnInit} from '@angular/core';
import {MeetMerchandise} from '../models/meet-merchandise';
import {FormBuilder, FormGroup} from '@angular/forms';
import {environment} from '../../environments/environment';
import {EntryService} from '../entry.service';

@Component({
  selector: 'app-entry-merchandise-item',
  templateUrl: './entry-merchandise-item.component.html',
  styleUrls: ['./entry-merchandise-item.component.css']
})
export class EntryMerchandiseItemComponent implements OnInit {

  @Input('merchandiseItem') merchandiseItem: MeetMerchandise;
  @Input('index') index;

  merchandiseItemForm: FormGroup;
  private fileRoot = environment.fileRoot;
  private qty = 0;
  private gallery = [];

  constructor(private fb: FormBuilder,
              private entryService: EntryService) { }

  ngOnInit() {

    console.log('entry merchandise item');

    this.merchandiseItemForm = this.fb.group({
      'qty': 0
    });
  }

  addItem() {
    this.qty++;
    this.merchandiseItemForm.patchValue({
      qty: this.qty
    });
    this.entryService.updateMerchandiseOrder(this.merchandiseItem, this.qty);
  }

  removeItem() {
    if (this.qty > 0) {
      this.qty--;
      this.merchandiseItemForm.patchValue({
        qty: this.qty
      });
    }
    this.entryService.updateMerchandiseOrder(this.merchandiseItem, this.qty);
  }

  openImage(index: number): void {
    // open lightbox
    console.log('openImage');
  }

  close(): void {
    // close lightbox programmatically
    console.log('closeImage');
  }

}
