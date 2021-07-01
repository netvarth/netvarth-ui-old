import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-consumer-email',
  templateUrl: './consumer-email.component.html',
  styleUrls: ['./consumer-email.component.css']
})
export class ConsumerEmailComponent implements OnInit {
  email_id: any;
  apiError=false;
  apiErrorTxt: any;
  constructor(public dialogRef: MatDialogRef<ConsumerEmailComponent>,
   ) { }

  ngOnInit(): void {
  }
  cancel() {
    this.dialogRef.close();
  }
  onSubmit() {
    this.apiError=false;
    if (this.isValidEmail(this.email_id)) {
      this.dialogRef.close(this.email_id);
    }else{
      this.apiError=true;
      this.apiErrorTxt='Please enter valid email';
    }

  }
  isValidEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);

  }
}
