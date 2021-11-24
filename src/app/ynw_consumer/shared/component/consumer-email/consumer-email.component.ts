import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
 import { SharedServices } from '../../../../shared/services/shared-services';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';



@Component({
  selector: 'app-consumer-email',
  templateUrl: './consumer-email.component.html',
  styleUrls: ['./consumer-email.component.css']
})
export class ConsumerEmailComponent implements OnInit {
  email_id: any;
  update_email:any;
  apiError=false;
  apiErrorTxt: any;
  customer: any;
  userData: any;
  constructor(public dialogRef: MatDialogRef<ConsumerEmailComponent>,

     private sharedServices:SharedServices,
    private groupService:GroupStorageService
   ) { }

  ngOnInit(): void {

    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');


    
  }
  cancel() {
    this.dialogRef.close();
  }
  onSubmit() {
    this.apiError=false;

    if (this.isValidEmail(this.email_id)) {
      if(this.update_email){
        this.updateConsumerAccount().then(result=>{
          if(result&& result!==undefined){
          this.dialogRef.close(this.email_id);
          }
        });
      }else{
      this.dialogRef.close(this.email_id);
      }
    }else{
      this.apiError=true;
      this.apiErrorTxt='Please enter valid email';
    }

  }
  isValidEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);

  }
  updateConsumerAccount(){
    const _this = this;
    return new Promise(function(resolve,reject){
      const userObj = {};
      const firstName = _this.userData.firstName
      const lastName = _this.userData.lastName;
      userObj['id'] = _this.userData.id;
      userObj['email']=_this.email_id;
      userObj['firstName'] = firstName;
      userObj['lastName'] = lastName;
  
   _this.sharedServices.updateProfile(userObj,'consumer')
   .subscribe(data=>{
  resolve(data);
   },(error)=>{
    _this.apiError=true;
    _this.apiErrorTxt=error.error;
    reject();
   }
     );

    });
  }
}
