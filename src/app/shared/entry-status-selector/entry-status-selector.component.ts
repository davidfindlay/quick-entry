import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EntryStatus} from '../../models/entry-status';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-entry-status-selector',
  templateUrl: './entry-status-selector.component.html',
  styleUrls: ['./entry-status-selector.component.css']
})
export class EntryStatusSelectorComponent implements OnInit, OnChanges {

  @Input() existingStatus;

  statusCodes: EntryStatus[];
  statusCodeForm: FormGroup;

  constructor(private http: HttpClient,
              private fb: FormBuilder) { }

  ngOnInit(): void {

    this.getStatusCodes().subscribe((statusCodes: EntryStatus[]) => {
      this.statusCodes = statusCodes;
      // this.statusCodeForm.patchValue({
      //   updateStatus: parseInt(this.existingStatus, 10)
      // });
      console.log(this.statusCodes);
    });

    this.statusCodeForm = this.fb.group({
      updateStatus: ''
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    if (this.statusCodes) {
      this.existingStatus = changes.existingStatus.currentValue
      // this.statusCodeForm.patchValue({
      //   updateStatus: parseInt(this.existingStatus, 10)
      // });
    }
  }

  getStatusCodes() {
    return this.http.get(environment.api + 'meet_entry_status_list');
  }

}
