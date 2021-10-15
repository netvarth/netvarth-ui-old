import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-userlistpopup',
  templateUrl: './userlistpopup.component.html'
})
export class UserlistpopupComponent implements OnInit {
  order: any = [];
  displayusers:any;

    users_list: any;
  internalStatus: any;
  team: any;
  loading=true;
  constructor(
    public dialogRef: MatDialogRef<UserlistpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
 
   this.users_list=data.userlist;
   this.team=data.team;
   this.internalStatus=data.serviceStatus;
  
  }
  ngOnInit() {
    this.getOwnership(this.internalStatus);
  }
  getOwnership(ownerShipData){
    this.displayusers='';
   if(ownerShipData.users &&ownerShipData.users.length>0){
 
        ownerShipData.users.forEach(element => {
            const userObject =  this.users_list.filter(user => user.id === parseInt(element)); 
            console.log(userObject);
            this.displayusers=this.displayusers+userObject[0].firstName+' '+userObject[0].lastName+','
           });
    
          this.displayusers= this.displayusers.replace(/,\s*$/, '')
          this.loading=false;
            
       }
       if(ownerShipData.teams &&ownerShipData.teams.length>0){

        ownerShipData.teams.forEach(element => {
            const userObject =  this.team.filter(team => team.id === parseInt(element)); 
            console.log(userObject);
            this.displayusers=this.displayusers+userObject[0].name+','
           }); 
            this.displayusers= this.displayusers.replace(/,\s*$/, '');
            this.loading=false;
        }
          


}
  closeDialog() {
    this.dialogRef.close();
  }
}
