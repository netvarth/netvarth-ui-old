import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls:['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {
  medicine: any;
  locationMessage: any;
  medicineDurationDays:any;
  medecineDoseDays:any;
  medecineDoseFrequency:any;
  medecineName:any;
  medecineInstruction:any;

  constructor(
    public dialogRef: MatDialogRef<InstructionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.medicine = this.data;
    console.log('medicine::',this.medicine);
    if(this.medicine){
      let daysTxt=' days';
      let doseTxt=' dose';
      let frequencyTxt=' time'
      if(this.medicine.data && this.medicine.data.duration){
        this.medicineDurationDays= this.medicine.data.duration + daysTxt;
      }
      if(this.medicine.data && this.medicine.data.dosage){
        this.medecineDoseDays = this.medicine.data.dosage + doseTxt;
      }
      if(this.medicine.data && this.medicine.data.frequency){
        this.medecineDoseFrequency = this.medicine.data.frequency + frequencyTxt;
      }
      if(this.medicine.data && this.medicine.data.medicine_name){
        this.medecineName= this.medicine.data.medicine_name;
      }
      if(this.medicine.data && this.medicine.data.instructions){
        this.medecineInstruction= this.medicine.data.instructions
      }
    }
  }
  ngOnInit() {
    this.locationMessage = this.medicine.instructions;
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
