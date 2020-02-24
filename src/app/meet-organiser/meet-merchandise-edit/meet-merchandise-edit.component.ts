import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Meet} from '../../models/meet';
import {MeetService} from '../../meet.service';
import {Form, FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinner} from 'ngx-spinner/lib/ngx-spinner.enum';
import {NgxSpinnerService} from 'ngx-spinner';
import {MerchandiseDetails} from '../../models/merchandise';
import {MeetMerchandise} from '../../models/meet-merchandise';
import {MeetMerchandiseImage} from '../../models/meet-merchandise-image';

@Component({
  selector: 'app-meet-merchandise-edit',
  templateUrl: './meet-merchandise-edit.component.html',
  styleUrls: ['./meet-merchandise-edit.component.css']
})
export class MeetMerchandiseEditComponent implements OnInit {

  meetName;
  meetId;
  pageTitle = 'Add Merchandise';
  meet;
  merchandiseItem;
  merchandiseId;

  fileToUpload: File = null;

  showClose = false;

  merchandiseForm: FormGroup;
  merchandiseImageForm: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private meetService: MeetService,
              private fb: FormBuilder,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show()
    this.meetId = parseInt(this.activatedRoute.snapshot.params['meetId'], 10);
    console.log('Meet Merchandise meetId = ' + this.meetId);
    this.meetService.getMeetDetails(this.meetId).subscribe((meet: Meet) => {
      if (meet !== undefined && meet !== null) {
        this.meet = meet;
        this.meetName = meet.meetname;
        const merchandiseId = this.activatedRoute.snapshot.params['merchandiseId'];

        if (merchandiseId !== undefined && merchandiseId !== null) {

          this.merchandiseId = parseInt(merchandiseId, 10);
          console.log('MerchandiseId: ' + this.merchandiseId);

          if (this.meet.merchandise !== undefined && this.meet.merchandise !== null) {
            this.merchandiseItem = this.meet.merchandise.find(x => x.id === this.merchandiseId);
            this.pageTitle = 'Edit Merchandise';
            let stockControl = 'no';
            let gstApplicable = 'no';
            if (this.merchandiseItem.stock_control === 1) {
              stockControl = 'yes';
            }
            if (this.merchandiseItem.gst_applicable === 1) {
              gstApplicable = 'yes';
            }
            this.merchandiseForm.patchValue({
              itemName: this.merchandiseItem.item_name,
              sku: this.merchandiseItem.sku,
              itemDescription: this.merchandiseItem.description,
              stockControl: stockControl,
              stock: this.merchandiseItem.stock,
              deadline: this.merchandiseItem.deadline,
              gstApplicable: gstApplicable,
              exgst: this.merchandiseItem.exgst,
              gst: this.merchandiseItem.gst,
              totalPrice: this.merchandiseItem.total_price,
              maxQty: this.merchandiseItem.maxQty,
              status: this.merchandiseItem.status
            });

            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
        }

      } else {
        console.error('Unable to load meet details for meetId: ' + this.meetId);
      }
    });

    this.merchandiseForm = this.fb.group({
      itemName: '',
      sku: '',
      stockControl: 'no',
      stock: 0,
      itemDescription: '',
      gstApplicable: 'no',
      exgst: '',
      gst: '',
      deadline: '',
      totalPrice: '',
      maxQty: '',
      status: ''
    });

    this.merchandiseImageForm = this.fb.group({
      caption: ''
    });

    this.merchandiseForm.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  cancel() {
    this.router.navigate(['meet-organiser', this.meetId, 'merchandise']);
  }

  save() {
    console.log('save');

    if (this.merchandiseId === undefined || this.merchandiseId === null) {
      this.merchandiseItem = new MeetMerchandise()
    }

    this.merchandiseItem.meet_id = this.meetId;
    this.merchandiseItem.item_name = this.merchandiseForm.controls['itemName'].value;
    this.merchandiseItem.sku = this.merchandiseForm.controls['sku'].value;

    if (this.merchandiseForm.controls['stockControl'].value === 'yes') {
      this.merchandiseItem.stock_control = true;
    } else {
      this.merchandiseItem.stock_control = false;
    }

    this.merchandiseItem.stock = this.merchandiseForm.controls['stock'].value;
    this.merchandiseItem.description = this.merchandiseForm.controls['itemDescription'].value;

    if (this.merchandiseForm.controls['gstApplicable'].value === 'yes') {
      this.merchandiseItem.gst_applicable = true;
      this.merchandiseItem.exgst = this.merchandiseForm.controls['exgst'].value;
      this.merchandiseItem.gst = this.merchandiseForm.controls['gst'].value;
    } else {
      this.merchandiseItem.gst_applicable = false;
      this.merchandiseItem.exgst = this.merchandiseForm.controls['totalPrice'].value;
      this.merchandiseItem.gst = 0;
    }


    this.merchandiseItem.total_price = this.merchandiseForm.controls['totalPrice'].value;
    this.merchandiseItem.max_qty = this.merchandiseForm.controls['maxQty'].value;
    this.merchandiseItem.status = this.merchandiseForm.controls['status'].value;

    if (this.merchandiseId === undefined || this.merchandiseId === null) {
      console.log('create');
      this.meetService.createMerchandise(this.merchandiseItem).subscribe((create) => {
        console.log('Created new Merchandise Item: ' + create.merchandise.id);
        this.showClose = true;
      });
    } else {
      console.log('update');
      this.meetService.updateMerchandise(this.merchandiseItem).subscribe((create) => {
        console.log('Update Merchandise Item: ' + create.merchandise.id);
        this.showClose = true;
      });
    }

  }

  close() {
    this.router.navigate(['meet-organiser', this.meetId, 'merchandise']);
  }

  addFile(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadImage() {
    const merchandiseImage = new MeetMerchandiseImage();
    merchandiseImage.caption = this.merchandiseImageForm.controls['caption'].value;
    merchandiseImage.meet_id = this.meetId;
    merchandiseImage.meet_merchandise_id = this.merchandiseId;
    this.meetService.addMerchandiseImage(this.fileToUpload, merchandiseImage).subscribe(res => {
      console.log('Added image');
    }, err => {
      console.log(err);
    });
  }

}
