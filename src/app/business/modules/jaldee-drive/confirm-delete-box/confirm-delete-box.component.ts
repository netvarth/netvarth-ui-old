import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../../../business/services/provider-services.service';

@Component({
  selector: 'app-confirm-delete-box',
  templateUrl: './confirm-delete-box.component.html',
  styleUrls: ['./confirm-delete-box.component.css']
})
export class ConfirmDeleteBoxComponent implements OnInit {

  id: any;
  fileName: any;
  message
  constructor(
    private provider_servicesobj: ProviderServices,

    public dialogRef: MatDialogRef<ConfirmDeleteBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // if (this.data.type) {
    //   // this.ok_btn_cap = Messages.YES_BTN;
    //   // this.cancel_btn_cap = Messages.NO_BTN;
    // }

    this.id = data.id;
    this.fileName = data.fileName;
    this.message = data.message

  }


  ngOnInit(): void {
  }
  onClickOk() {
    this.provider_servicesobj.deleteAttachment(this.id).subscribe(
      (data: any) => {
        console.log("Deleted Attachment :", data);
        this.dialogRef.close(data);
        //this.getfiles();
        // this.Allfiles = data;
        // this.customers = data
        // this.dataLoading = false;
        //this.paginator = this.customers
        // this.customers.map((x) => {
        //   this.fileSizeFilter = Math.ceil(x.fileSize)
        //   // console.log("File Size", this.fileSizeFilter)
        // })

        //console.log("Uploaded Files : ", this.customers);
      }
    );
  }

  onClick(data) {
    this.dialogRef.close(data);
  }

}
