import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ClubsService} from '../../clubs.service';
import {Club} from '../../models/club';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ClubAdministrationService} from '../club-administration.service';

@Component({
  selector: 'app-manage-club',
  templateUrl: './manage-club.component.html',
  styleUrls: ['./manage-club.component.css']
})
export class ManageClubComponent implements OnInit {

  @ViewChild('addAdministrator', {static: true}) addAdministrator: ElementRef;

  clubId;
  club: Club;
  clubName;

  editClub = false;

  manageClubForm: FormGroup;

  addAccessPersonDisabled = true;
  addAccessMemberPickedDetails = '';
  addAccessMemberPickedId;

  constructor(private clubsService: ClubsService,
              private clubAdministrationService: ClubAdministrationService,
              private modal: NgbModal,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit() {

    this.clubId = this.route.snapshot.paramMap.get('id');
    this.loadClub(this.clubId);

  }

  createForm() {
    let region;
    if (this.club.branch_region) {
      region = this.club.branch_region.regionname.toLowerCase();
    }

    this.manageClubForm = this.fb.group({
      clubcode: [this.club.code, Validators.required],
      clubname: [this.club.clubname, Validators.required],
      region: region,
      verified: this.club.verified
    });
  }

  loadClub(clubId) {
    this.clubsService.getSingleClub(parseInt(this.clubId, 10)).subscribe((result: any) => {
      console.log(result);
      this.club = result.club;
      this.clubName = this.club.clubname;
      this.createForm();
    });
  }

  backToClubList() {
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  edit() {
    this.editClub = true;
  }

  cancelEdit() {
    this.editClub = false;
  }

  saveClub() {
    console.log(this.manageClubForm.value);
    this.clubAdministrationService.updateClub(this.clubId, this.manageClubForm.value).subscribe((result: any) => {
      this.loadClub(this.clubId);
      this.cancelEdit();
    });

  }

  removeAccess(memberId) {
    this.clubAdministrationService.removeAccess(this.clubId, memberId).subscribe((result: any) => {
      this.loadClub(this.clubId);
    });
  }

  addOrganiserClick() {
    this.addAccessPersonDisabled = true;

    this.modal.open(this.addAdministrator, {size: 'lg'}).result.then((result: any) => {
      if (result === 'Add Access') {
        this.clubAdministrationService.addAccess(this.club.id, this.addAccessMemberPickedId).subscribe((updateResult: any) => {
          console.log(updateResult);
          this.loadClub(this.club.id);
        });
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  addAccessMemberPicked(memberPicked) {
    console.log(memberPicked);
    if (memberPicked) {
      this.addAccessMemberPickedDetails = memberPicked.surname + ', ' + memberPicked.firstname + '(' + memberPicked.number + ')';
      this.addAccessMemberPickedId = memberPicked.id;
      this.addAccessPersonDisabled = false;
    } else {
      this.addAccessMemberPickedDetails = '';
      this.addAccessMemberPickedId = null;
      this.addAccessPersonDisabled = true;
    }
  }

}
