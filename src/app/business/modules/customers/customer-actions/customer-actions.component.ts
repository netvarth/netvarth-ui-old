import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { Router, NavigationExtras } from "@angular/router";
import { LastVisitComponent } from "../../medicalrecord/last-visit/last-visit.component";
import { ProviderServices } from "../../../services/provider-services.service";
import { ApplyLabelComponent } from "../../check-ins/apply-label/apply-label.component";
import { GroupStorageService } from "../../../../shared/services/group-storage.service";
import { SnackbarService } from "../../../../shared/services/snackbar.service";
import { VoiceConfirmComponent } from "../voice-confirm/voice-confirm.component";
import { CommunicationService } from "../../../../business/services/communication-service";
import { projectConstants } from "../../../../../../src/app/app.component";
import { WordProcessor } from "../../../../../../src/app/shared/services/word-processor.service";

@Component({
  selector: "app-customer-actions",
  templateUrl: "./customer-actions.component.html",
  styleUrls: ["./customer-actions.component.css"]
})
export class CustomerActionsComponent implements OnInit {
  domain;
  customerDetails: any = [];
  subdomain;
  action = "";
  providerLabels: any = [];
  loading = false;
  showMessage = false;
  showApply = false;
  labelsforRemove: any = [];
  labelMap = {};
  meet_data: any;
  id: any;
  providerMeetingUrl: any;
  phoneNum;
  whatsappNum;
  groupMemberId = "";
  customerId;
  isMemberIdExisted;
  from: any;
  labelId: any;
  serviceid: any;
  selectedIndex: number;
  api_loading = true;
  service_list: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private router: Router,
    private communicationService: CommunicationService,
    public dialog: MatDialog,
    private wordProcessor: WordProcessor,
    public dialogRef: MatDialogRef<CustomerActionsComponent>
  ) {
    if(this.data && this.data.customer){
      this.data.customer.forEach(element => {
     
        this.customerId = element.id;
      });
    }
    if(this.data && this.data.groupName){
      this.provider_services
      .getMemberId(this.data.groupName, this.customerId)
      .subscribe(data => {
       
        this.isMemberIdExisted = data;
      });
    }
    if(this.data.from){
    this.from = this.data.from
    }
    if(this.data.serviceid){
      this.serviceid = this.data.serviceid
      }
  }
  ngOnInit() {
    this.getServices();
    // const getData ={
    //     'groupName':this.data.groupName,
    //     'proConId': this.customerId
    // }
    if (this.data.type && this.data.type === "label" && this.from === 'serv') {
     
      this.action = "label_service";
     
    }
    if (this.data.type && this.data.type === "label" && this.from !== 'serv') {
     
      this.action = "label";
    
    }
   
    if(this.data && this.data.customer){
      this.customerDetails = this.data.customer;
      if(this.customerDetails){
        if (
          this.customerDetails[0].phoneNo &&
          this.customerDetails[0].phoneNo.trim() !== ""
        ) {
          this.phoneNum = this.customerDetails[0].phoneNo;
        }
        if (
          this.customerDetails[0].whatsAppNum &&
          this.customerDetails[0].whatsAppNum.number
        ) {
          this.whatsappNum = this.customerDetails[0].whatsAppNum.number;
        }
        if (this.phoneNum || this.customerDetails[0].email) {
          this.showMessage = true;
        }
      }
    }
   
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.domain = user.sector;
    this.subdomain = user.subSector;
  }
  reminderAction(){
    this.closeDialog();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: this.customerId,
        // phoneNum : phoneNum,
        // type: "secure_video"
      }
    };
    this.router.navigate(["provider", "settings", "comm", "reminder"],navigationExtras);
    }
  prescription() {
    this.closeDialog();
    const customerDetails = this.customerDetails;
    const customerId = customerDetails[0].id;
    const mrId = 0;
    const bookingType = "FOLLOWUP";
    const bookingId = 0;
    this.router.navigate(
      [
        "provider",
        "customers",
        customerId,
        bookingType,
        bookingId,
        "medicalrecord",
        mrId,
        "prescription"
      ],
      { queryParams: { calledfrom: "patient" } }
    );
  }
  medicalRecord() {
    this.closeDialog();
    const customerDetails = this.customerDetails;
    const customerId = customerDetails[0].id;
    const mrId = 0;
    const bookingType = "FOLLOWUP";
    const bookingId = 0;
    this.router.navigate(
      [
        "provider",
        "customers",
        customerId,
        bookingType,
        bookingId,
        "medicalrecord",
        mrId,
        "clinicalnotes"
      ],
      { queryParams: { calledfrom: "patient" } }
    );
  }
  lastvisits() {
    this.closeDialog();
    const mrdialogRef = this.dialog.open(LastVisitComponent, {
      width: "80%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        patientId: this.customerDetails[0].id,
        customerDetail: this.customerDetails[0],
        back_type: "consumer"
      }
    });
    mrdialogRef.afterClosed().subscribe(result => {
      if (result.type === "prescription") {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = "reload";
        this.router.navigate(
          ["provider", "customers", "medicalrecord", "prescription"],
          result.navigationParams
        );
      } else if (result.type === "clinicalnotes") {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = "reload";
        this.router.navigate(
          ["provider", "customers", "medicalrecord", "clinicalnotes"],
          result.navigationParams
        );
      }
    });
  }
  listMedicalrecords() {
    this.closeDialog();
    const customerDetails = this.customerDetails;
    const customerId = customerDetails[0].id;
    const mrId = 0;
    const bookingType = "FOLLOWUP";
    const bookingId = 0;
    this.router.navigate(
      [
        "provider",
        "customers",
        customerId,
        bookingType,
        bookingId,
        "medicalrecord",
        mrId,
        "list"
      ],
      { queryParams: { calledfrom: "list" } }
    );
  }
  gotoSecureVideo() {
    this.closeDialog();
    const customerDetails = this.customerDetails;
    const customerId = customerDetails[0].id;
    // const phoneNum = customerDetails[0].phoneNo;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: customerId,
        // phoneNum : phoneNum,
        type: "secure_video"
      }
    };
    this.router.navigate(["provider", "secure-video"], navigationExtras);
  }
  startVoiceCall() {
    this.closeDialog();
    this.voiceCallConfirmed();

    // this.provider_services.voiceCallReady(customerId).subscribe(data => {
    //     this.voiceCallConfirm()
    // },
    //     error => {
    //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
    //     });
  }
  voiceCallConfirmed() {
    const customerId = this.customerDetails[0].id;
    const num =
      this.customerDetails[0].countryCode +
      " " +
      this.customerDetails[0].phoneNo;
    // const customerId = customerDetails[0].id;
    const dialogref = this.dialog.open(VoiceConfirmComponent, {
      width: "60%",
      //   height: '35%',
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass"
      ],
      disableClose: true,
      data: {
        customerId: customerId,
        customer: num
      }
    });
    dialogref.afterClosed().subscribe(result => {
      this.closeDialog();
      // if (result) {
      // }
    });
  }
  editCustomer() {
    this.closeDialog();
    const navigationExtras: NavigationExtras = {
      queryParams: { action: "edit", id: this.customerDetails[0].id }
    };
    this.router.navigate(["/provider/customers/create"], navigationExtras);
  }
  closeDialog() {
    this.dialogRef.close();
  }
  CustomersInboxMessage() {
    this.closeDialog();
    this.communicationService
      .ConsumerInboxMessage(this.customerDetails, "customer-list")
      .then(
        () => {},
        () => {}
      );
  }
  getLabel() {
    this.loading = true;
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe((data: any) => {
      this.providerLabels = data.filter(label => label.status === "ENABLED");
      this.loading = false;
      this.labelSelection();
    });
  }
  changeGroupMemberId(memberId) {
    console.log("Member Id :", memberId);
  }
  gotoLabel() {
    this.router.navigate(["provider", "settings", "general", "labels"], {
      queryParams: { source: "customer" }
    });
    this.dialogRef.close();
  }
  addLabelvalue(source) {
    const labeldialogRef = this.dialog.open(ApplyLabelComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "privacyoutermainclass"
      ],
      disableClose: true,
      autoFocus: true,
      data: {
        source: source
      }
    });
    labeldialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.labelMap = new Object();
        this.labelMap[data.label] = data.value;
        this.addLabel();
      }
      this.getLabel();
    });
  }
  addLabeltoPatient(label, event) {
    this.showApply = false;
    let labelArr = this.providerLabels.filter(lab => lab.label === label);
    if (this.labelMap[label]) {
      delete this.labelMap[label];
    }
    if (this.labelsforRemove.indexOf(label) !== -1) {
      this.labelsforRemove.splice(this.labelsforRemove.indexOf(label), 1);
    }
    if (event.checked) {
      if (labelArr[0] && labelArr[0].selected) {
      } else {
        this.labelMap[label] = true;
      }
    } else {
      if (labelArr[0] && labelArr[0].selected) {
        this.labelsforRemove.push(label);
      }
    }
    if (
      Object.keys(this.labelMap).length > 0 ||
      this.labelsforRemove.length > 0
    ) {
      this.showApply = true;
    }
  }
  addLabeltoService(label, event ) {
    this.showApply = false;
    
    let labelArr = this.providerLabels.filter(lab => lab.id === label);
   
    if (this.labelMap[label]) {
      delete this.labelMap[label];
    }
    if (this.labelsforRemove.indexOf(label) !== -1) {
      this.labelsforRemove.splice(this.labelsforRemove.indexOf(label), 1);
    }
    if (event.checked) {
      if (labelArr[0] && labelArr[0].selected) {
      } else {
        this.labelMap[label] = true;
      }
    } else {
      if (labelArr[0] && labelArr[0].selected) {
        this.labelsforRemove.push(label);
      }
    }
    if (
      Object.keys(this.labelMap).length > 0 ||
      this.labelsforRemove.length > 0
    ) {
      this.showApply = true;
    }
    
  }
  applyLabel() {
    if (Object.keys(this.labelMap).length > 0) {
      this.addLabel();
    }
    if (this.labelsforRemove.length > 0) {
      this.deleteLabel();
    }
  }
  addLabel() {
    const ids = [];
    for (const customer of this.customerDetails) {
      ids.push(customer.id);
    }
    const postData = {
      labels: this.labelMap,
      proConIds: ids
    };
    this.provider_services.addLabeltoCustomer(postData).subscribe(
      data => {
        this.snackbarService.openSnackBar("Label applied successfully", {
          panelclass: "snackbarerror"
        });
        this.dialogRef.close("reload");
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }
  applyLabel_service(){
    let labelId = [];
   let labelIds = Object.keys(this.labelMap);
   labelIds.forEach(myFunction)
  
   function myFunction(item) {
    labelId.push(parseInt(item))
  }
 
   const postData = labelId
  ;

    this.provider_services.addLabeltoService(this.serviceid , postData).subscribe(
      data => {
        this.snackbarService.openSnackBar("Label applied successfully", {
          panelclass: "snackbarerror"
        });
        this.dialogRef.close("reload");
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }
  
  deleteLabel() {
    const ids = [];
    for (const customer of this.customerDetails) {
      ids.push(customer.id);
    }
    const postData = {
      labelNames: this.labelsforRemove,
      proConIds: ids
    };
    this.provider_services.deleteLabelFromCustomer(postData).subscribe(
      data => {
        if (Object.keys(this.labelMap).length === 0) {
          this.snackbarService.openSnackBar("Label removed", {
            panelclass: "snackbarerror"
          });
        }
        this.dialogRef.close("reload");
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }
  showLabelSection() {
    this.action = "label";
  }
  showGenerateMemberIds() {
    this.action = "generateMemberIds";
    if (this.isMemberIdExisted) {
      this.groupMemberId = this.isMemberIdExisted;
    } else {
      this.groupMemberId = "";
    }
  }
  labelSelection() {
   
    if(this.action === "label_service"){
      const values = [];
      const servArray= [];
    
      for(let m =0; m<this.service_list.length; m++){
      
        if(this.service_list[m].id === this.serviceid){
          servArray.push(this.service_list[m])
        }

      }
     
      for (let i = 0; i < servArray.length; i++) {
        if (servArray[i].label) {
          Object.keys(servArray[i].label).forEach(key => {
            values.push(key)
            
           
          });
        }
      }
      for (let i = 0; i < this.providerLabels.length; i++) {
       
        for (let k = 0; k < values.length; k++) {
          const filteredArr = values.filter(
            value => value === this.providerLabels[i].label
          );
   
      if (filteredArr.length === servArray.length) {
        this.providerLabels[i].selected = true;
      }
        }
      }
      let selectedArray=this.providerLabels.filter(label => label.hasOwnProperty('selected') === true);
      for(let p=0;p<selectedArray.length;p++){
this.labelMap[selectedArray[p].id]=true;
      }

    }
    else {
      const values = [];
      for (let i = 0; i < this.customerDetails.length; i++) {
        if (this.customerDetails[i].label) {
          Object.keys(this.customerDetails[i].label).forEach(key => {
            values.push(key);
          });
        }
      }
      for (let i = 0; i < this.providerLabels.length; i++) {
        for (let k = 0; k < values.length; k++) {
          const filteredArr = values.filter(
            value => value === this.providerLabels[i].label
          );
          if (filteredArr.length === this.customerDetails.length) {
            this.providerLabels[i].selected = true;
          }
        }
      }
    }
   
  }

  createMemberId(groupMemberId) {
    const postData = {
      groupName: this.data.groupName,
      proConId: this.customerId,
      memId: groupMemberId
    };

    if (!this.isMemberIdExisted) {
    
      this.provider_services.createGroupMemberId(postData).subscribe(
        (res: any) => {
          // this.snackbarService.openSnackBar('Member Id Created Successfully', { 'panelclass': 'snackbarnormal' });
          // this.dialogRef.close();
          // this.isMemberId = res;
          // console.log("res ", this.isMemberId)
          this.snackbarService.openSnackBar("Member Id Added Successfully", {
            panelClass: "snackbarnormal"
          });
          setTimeout(() => {
            this.dialogRef.close(this.isMemberIdExisted);
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
    } else {
      this.provider_services.updateGroupMemberId(postData).subscribe(
        (res: any) => {
          this.snackbarService.openSnackBar("Member Id Updated Successfully", {
            panelClass: "snackbarnormal"
          }); // this.dialogRef.close();
          // this.isMemberId = res;
          // console.log("res ", this.isMemberId)
          setTimeout(() => {
            this.dialogRef.close(this.isMemberIdExisted);
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
    }
    // this.provider_services
    //console.log("Enter in create Member :")
  }
  getServices(pgefilter?) {
  
    this.api_loading = true;
    //  const filter = { 'scope-eq': 'account' };
    this.provider_services.getProviderServices(pgefilter)
        .subscribe(
            data => {
                this.service_list = data;
          
              this.getLabel();
                this.api_loading = false;
            },
            error => {
                this.api_loading = false;
                this.wordProcessor.apiErrorAutoHide(this, error);
            }
        );
}
  
}
