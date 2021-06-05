import {
  ApplicationRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {MeetMerchandise} from '../../models/meet-merchandise';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetService} from '../../meet.service';
import {Meet} from '../../models/meet';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from 'ngx-spinner';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-meet-merchandise-item',
  templateUrl: './meet-merchandise-item.component.html',
  styleUrls: ['./meet-merchandise-item.component.css']
})
export class MeetMerchandiseItemComponent implements OnInit {

  @Input() merchandise: MeetMerchandise;
  @Input() index;
  @ViewChild('confirmation', {static: true}) confirmation: ElementRef;
  merchandiseItem: MeetMerchandise;
  closeResult: string;
  fileRoot = environment.fileRoot;

  statusText: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private meetService: MeetService,
              private cdRef: ChangeDetectorRef,
              private appRef: ApplicationRef,
              private modalService: NgbModal,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.merchandiseItem = this.merchandise;
    this.updateStatus();
    this.cdRef.detectChanges();
    console.log(this.merchandiseItem.images);
  }

  updateStatus() {
    if (this.merchandiseItem.status === 0) {
      this.statusText = 'Draft';
    }
    if (this.merchandiseItem.status === 1) {
      this.statusText = 'Published';
    }
  }

  edit() {
    this.router.navigate([this.merchandiseItem.id, 'edit'], {relativeTo: this.activatedRoute});
  }

  publish() {
    this.spinner.show();
    this.merchandiseItem.status = 1;
    this.meetService.updateMerchandise(this.merchandiseItem).subscribe((res) => {
      console.log('Updated item');
      this.merchandiseItem = res.merchandise;
      this.updateStatus();
      this.spinner.hide();
      }, (err) => {
      console.error('Unable to update item');
      this.spinner.hide();
    });
  }

  unpublish() {
    this.spinner.show();
    this.merchandiseItem.status = 0;
    this.meetService.updateMerchandise(this.merchandiseItem).subscribe((res) => {
      console.log('Updated item');
      this.merchandiseItem = res.merchandise;
      this.updateStatus();
      this.spinner.hide();
    }, (err) => {
      console.error('Unable to update item');
      this.spinner.hide();
    });
  }

  delete() {
    this.confirmDelete();
  }

  confirmDelete() {
    this.modalService.open(this.confirmation, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      if (result === 'yes') {
        console.log('delete item');
        this.spinner.show();
        this.meetService.deleteMerchandise(this.merchandise.id).subscribe((res) => {
          console.log('item deleted');
          this.merchandiseItem = null;
          this.spinner.hide();
        }, (err) => {
          console.log('Unable to delete item');
          this.spinner.hide();
        });
      }
    }, (reason) => {
      console.log('don\'t delete');
    });
    this.appRef.tick();
  }

}
