import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  @Input() familyMembers;
  @Input() allowSelection;
  @Input() multiple;
  @Input() selectedMember;
  @Input() maxSelection;
  @Input() parentCustomer;

  @Output() memberSelected = new EventEmitter<any>();

  constructor(private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    console.log(this.selectedMember);
  }

  /**
   * Method to handle member selection
   * @param id selected member id
   * @param firstName first name of selected member
   * @param lastName last name of selected member
   * @param obj seleted object
   * @returns member list
   */
  handleMemberSelect(id, firstName, lastName, obj) {
    if (this.selectedMember.length === 0) {
      this.selectedMember.push({ id: id, firstName: firstName, lastName: lastName });
    } else {
      let isExists = false;
      let selIndex;
      for (let i = 0; i < this.selectedMember.length; i++) {
        if (this.selectedMember[i].id === id) {
          isExists = true;
          selIndex = i;
          break;
        }
      }
      if (isExists) {
        this.selectedMember.splice(selIndex, 1);
      } else {
        if (this.ismoreMembersAllowed()) {
          this.selectedMember.push({ id: id, firstName: firstName, lastName: lastName });
        } else {
          obj.source.checked = false; // preventing the current checkbox from being checked
          if (this.maxSelection > 1) {
            this.snackbarService.openSnackBar('Only ' + this.maxSelection + ' member(s) can be selected', { 'panelClass': 'snackbarerror' });
          } else if (this.maxSelection === 1) {
            this.snackbarService.openSnackBar('Only ' + this.maxSelection + ' member can be selected', { 'panelClass': 'snackbarerror' });
          }
          return false;
        }
      }
    }
    this.memberSelected.emit(this.selectedMember);
  }

  /**
   * To check whether more members allowed for checkin
   * @returns true/false true if more members allowed
   */
  ismoreMembersAllowed() {
    if (this.maxSelection > this.selectedMember.length) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * To Check whether member selected
   * @param id selected member id
   * @returns true/false
   */
  isChecked(id) {
    let retval = false;
    if (this.selectedMember.length > 0) {
      for (let i = 0; i < this.selectedMember.length; i++) {
        if (this.selectedMember[i].id == 0) {
          this.selectedMember[i].id = this.parentCustomer.id;
        }
        if (this.selectedMember[i].id === id) {
          retval = true;
        }
      }
    }
    return retval;
  }

  /**
   * 
   * @param id 
   * @param firstName 
   * @param lastName 
   * @param email 
   */
  handleOneMemberSelect(id, firstName, lastName, email) {
    this.selectedMember = [];
    this.selectedMember.push({ id: id, firstName: firstName, lastName: lastName });
    if (email && email !== undefined && email.trim() !== '') {
      this.selectedMember[0]['email'] = email;
    } else if (this.parentCustomer && this.parentCustomer.userProfile && this.parentCustomer.userProfile.email !== undefined && this.parentCustomer.userProfile.email.trim() !== '') {
      this.selectedMember[0]['email'] = this.parentCustomer.userProfile.email;
    } else {
      this.selectedMember[0]['email'] = '';
    }
    this.memberSelected.emit(this.selectedMember);
  }
}
