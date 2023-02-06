import { Component, ViewChild, OnInit, Inject } from "@angular/core";
import { SignaturePad } from 'angular2-signaturepad';
import { AgreementService } from "../agreement.service";
import { SnackbarService } from '../../../services/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 500,
    'canvasHeight': 300
  };
  selectedColor: any;
  sign: boolean;
  loanId: any;
  loanKycId: any;

  constructor(
    private agreementService: AgreementService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public signatureRef: MatDialogRef<SignatureComponent>
  ) { }

  ngOnInit() {
    if (this.data && this.data.uId) {
      this.loanId = this.data.uId;
    }
    if (this.data && this.data.kycId) {
      this.loanKycId = this.data.kycId;
    }
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
  }

  drawComplete() {
    const signName = 'sign.jpeg';
    const propertiesDetob = {};
    let i = 0;
    const blob = this.agreementService.b64toBlobforSign(this.signaturePad.toDataURL());
    console.log("blob", blob)
    const submit_data: FormData = new FormData();
    submit_data.append('files', blob, signName);
    const properties = {
      'caption': 'Signature'
    };
    propertiesDetob[i] = properties;
    i++;
    const propertiesDet = {
      'propertiesMap': propertiesDetob
    };
    const blobPropdata = new Blob([JSON.stringify(propertiesDet)], { type: 'application/json' });
    submit_data.append('properties', blobPropdata);
    if (submit_data && this.loanId && this.loanKycId) {
      this.uploadDigitalsign(this.loanId, this.loanKycId, submit_data);
    }
  }

  undoSignature() {
    const data = this.signaturePad.toData();
    if (data) {
      console.log(data)
      data.pop(); // remove the last dot or line from canvas
      this.signaturePad.fromData(data);
      console.log('this.signaturePad::', this.signaturePad)
      if (data && data.length === 0) {
        const error = 'Please draw your digital signature';
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.sign = true;
        this.signaturePad.clear();
      }
      else {
        this.sign = false;
        if (this.signaturePad && this.signaturePad['signaturePad'] && this.signaturePad['signaturePad']['penColor']) {
          this.selectedColor = this.signaturePad['signaturePad']['penColor'];
        }
      }
    }
  }


  clearSign() {
    this.signaturePad.clear();
  }

  uploadDigitalsign(uId, kycId, submit_data) {
    this.agreementService.uploadDigitalSign(uId, kycId, submit_data)
      .subscribe((data) => {
        this.snackbarService.openSnackBar('Digital sign uploaded successfully');
        this.signatureRef.close(data);
      },
        (error: any) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }


  drawStart() {
    this.sign = false;
  }

  close() {
    this.signatureRef.close()
  }
}
