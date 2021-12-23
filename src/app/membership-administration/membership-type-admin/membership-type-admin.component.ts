import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MembershipType} from '../../models/membership-type';
import {MembershipTypeService} from '../membership-type.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';

enum MembershipActive {
  Inactive,
  Active,
  Archive
}

enum MembershipStatus {
  Financial = 1,
  Unfinancial,
  Inactive,
  Guest
}

@Component({
  selector: 'app-membership-type-admin',
  templateUrl: './membership-type-admin.component.html',
  styleUrls: ['./membership-type-admin.component.css']
})
export class MembershipTypeAdminComponent implements OnInit {
  @ViewChild('membershipTypeTable', {static: true}) membershipTypeTable: ElementRef;
  @ViewChild('configureType', {static: true}) configureType: ElementRef;

  membershipTypes: MembershipType[];
  configureTypeForm: FormGroup;

  constructor(private membershipTypeService: MembershipTypeService,
              private fb: FormBuilder,
              private modal: NgbModal) { }

  ngOnInit(): void {
    this.createTypeForm();
    this.loadData();
  }

  loadData() {
    this.membershipTypes = null;
    this.membershipTypeService.getMembershipTypes().subscribe((mtResponse: any) => {
      this.membershipTypes = mtResponse.membershipTypes;
      this.membershipTypes.sort((a, b) => (b.id - a.id));
      console.log(this.membershipTypes);
    });
  }

  createTypeForm() {
    this.configureTypeForm = this.fb.group({
      typename: '',
      startdate: '',
      enddate: '',
      months: '',
      weeks: '',
      status: '',
      active:  ''
    });
  }

  prefillForm(membershipType) {
    this.configureTypeForm.patchValue({
      typename: membershipType.typename,
      startdate: membershipType.startdate,
      enddate: membershipType.enddate,
      months: membershipType.months,
      weeks: membershipType.weeks,
      status: membershipType.status,
      active: membershipType.active
    });
  }

  resetForm() {
    this.configureTypeForm.patchValue({
      typename: '',
      startdate: '',
      enddate: '',
      months: '',
      weeks: '',
      status: '',
      active: ''
    });
  }

  addNewType() {
    this.resetForm();
    this.modal.open(this.configureType).result.then((apply: any) => {
      const newMembershipType = new MembershipType();
      Object.assign(newMembershipType, this.configureTypeForm.value);
      this.membershipTypeService.addType(newMembershipType).subscribe((results: any) => {
        this.loadData();
      });
    });
  }

  editType(membershipType) {
    console.log(membershipType);
    this.prefillForm(membershipType);

    this.modal.open(this.configureType).result.then((apply: any) => {
      Object.assign(membershipType, this.configureTypeForm.value);
      this.membershipTypeService.updateType(membershipType).subscribe((results: any) => {
        this.loadData();
      });
    });
  }

  getActiveValue(value) {
    switch (value) {
      case 0:
        return 'Inactive';
        break;
      case 1:
        return 'Active';
        break;
      case 2:
        return 'Archive';
        break;
    }
  }
}
