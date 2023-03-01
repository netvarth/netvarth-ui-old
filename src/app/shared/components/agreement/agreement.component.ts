import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { AgreementService } from './agreement.service';
import { OtpVerifyComponent } from './otp-verify/otp-verify.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {

  loanId: any;
  accountId: any;
  phoneNumber: any;
  email: any;
  loanData: any;
  type: any = 'agreement';
  currentDate = new Date();
  declaration: any;
  permanentState: any;
  stateWiseDeclaration: any = [
    {
      state: 'Tamil Nadu',
      content: "நான் / நாங்கள் இந்த கடனுக்கு உரித்தாகும் விதிமுறைகளை மற்றும் நிபந்தனைகளை புரிந்து கொண்டத உறுதி செய்கிறேன் \'/ றோம் மற்றும் நிபந்தனையின்றி ஏற்றுக் கொள்கிறேன் / றோம்.அதோடு இந்த விதிமுறைகள் மற்றும் நிபந்தனைகள் எந்த நேரத்திலும் எனக்கு / எங்களுக்கு உரிய அறிவிப்பு அளிப்பதன் MAFIL எம்ஏஎஃப்ஐஎல் - ஆல் மாற்றப்படலாம் என்பதற்கும் சம்மதிக்கிறேன் / றோம் மற்றும் நான் / நாங்கள் திருத்தப்படும் விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கும் கட்டுப்படுவேள் / டோம்."
    },
    {
      state: 'Kerala',
      content: "ഈ വായ്പ്പക്ക് ബാധകമായ നിബന്ധനകളും വ്യവസ്ഥകളും ഞാൻ ഞങ്ങൾ സ്ഥിരീകരിക്കുന്നു, കൂടാതെ നിബന്ധനകളും വ്യവസ്ഥ കളും നിരുപാധികമായി അംഗീകരിക്കുന്നു. ഈ നിബന്ധനകളും വ്യവസ്ഥകളും മണപുറം ഫിനാൻസ് ലിമിറ്റഡിന് ഏത് സമയത്തും മുൻകൂട്ടി അറിയിപ്പ് നൽകി മാറ്റാവുന്നതാണ്. ഞാൻ ഞങ്ങൾ ഈ ദേദഗതി ചെയ്ത നിബന്ധനകളും വ്യവസ്ഥകളും അനുസരിക്കുന്ന"
    },
    {
      state: 'Karnataka',
      content: "ನಾನು/ನಾವು ಈ ಸಾಲಕ್ಕೆ ಅನ್ವಯಿಸುವ ನಿಯಮ ಹಾಗೂ ಷರತ್ತುಗಳನ್ನು ತಿಳಿದುಕೊಂಡು ಈ ನಿಯಮ ಹಾಗೂ ಷರತ್ತುಗಳನ್ನು ಷರತ್ತುರಹಿತವಾಗ ಒಪ್ಪಿಕೊಂಡಿರುತ್ತೇನೆ/ ವೆ ಮತ್ತು ನನಗೆ / ನಮಗೆ ಪೂರ್ವ ಸೂಚನೆ ಕೊಟ್ಟು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ MAFIL ನ ಈ ನಿಯಮ ಹಾಗೂ ಷರತ್ತುಗಳು ಬದಲಾವಣೆಯಾಗಬಹುದು ಎನ್ನುವುದನ್ನು ಒಪ್ಪಿಕೊಂಡಿರುತ್ತೇನೆ / ವೆ ಮತ್ತು ನಾನು / ನಾವು ತಿದ್ದುಪಡಿಗೊಳಪಟ್ಟ ನಿಯಮ ಹಾಗೂ ಷರತ್ತುಗಳಿಗೆ ಬದ್ಧನಾಗಿದ್ದೇನೆ / ವೆ ಎನ್ನುವುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತೇನೆ / ವೆ."
    },
    {
      state: 'Andhra Pradesh',
      content: "ఈ లోనికి వర్తించే నియమ నిబంధనలన్నిటినీ అర్థంచేసుకున్నట్లుగా మరియు నియమ నిబంధనలను షరుతుగా ఆమోదించినట్లుగా నేను/మేమ ధృవీకరిస్తున్నాము మరియు నాకు / మాకు తగిన ఏ సమయంలోనైనా ఈ నియమ నిబంధనలను MAFIL మార్చవర్చని మరియు సవరించిన నియమ నిబంధనలకు నేను / మేము కట్టుబడివుంటాము."
    },
    {
      state: 'Other',
      content: "मैं / हम इस लोन के लिए लागू नियमों और शर्तों को समझने की पुष्टि करते हैं और बिनाशर्त नियमों और शर्तों को स्वीकार करते हैं और सहमत हैं कि इन नियमों और शर्तों को MAFIL द्वारा किसी भी समय मुझे / हमें सूचित करके बदला जा सकता है और मैं / हम संशोधित नियमों और शर्तों से बंधे होंगे."
    }
  ]
  loanEmiDetailsData: any;
  source: any = 'consumer';
  constructor(
    private activatedroute: ActivatedRoute,
    private agreementService: AgreementService,
    private dialog: MatDialog,
    private snackbarService: SnackbarService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe((params) => {
      if (params && params.uid) {
        this.loanId = params.uid;
        // this.getLoanEmiDetails(this.loanId);
      }
      if (params && params.account) {
        this.accountId = params.account;
      }
      if (params && params.type) {
        this.source = params.type;
      }
      this.declaration = "मैं / हम इस लोन के लिए लागू नियमों और शर्तों को समझने की पुष्टि करते हैं और बिनाशर्त नियमों और शर्तों को स्वीकार करते हैं और सहमत हैं कि इन नियमों और शर्तों को MAFIL द्वारा किसी भी समय मुझे / हमें सूचित करके बदला जा सकता है और मैं / हम संशोधित नियमों और शर्तों से बंधे होंगे."
    })

    this.agreementService.getLoanFromOutside(this.loanId, this.accountId).subscribe((data: any) => {
      console.log("LoanData", data);
      this.loanData = data;
      this.loanEmiDetailsData = data.loanEmis;
      if ((this.loanData && this.loanData.isAcceptanceOtpUpdated) && (this.source && this.source != 'provider')) {
        this.snackbarService.openSnackBar("Link Expired or Invalid");
        this.router.navigate(['/']);
      }
      if (data && data.customer && data.customer.phoneNo) {
        this.phoneNumber = data.customer.phoneNo
        if (data.customer.email) {
          this.email = data.customer.email;
        }
        else {
          this.email = "";
        }
      }
      if (data && data.loanApplicationKycList && data.loanApplicationKycList[0] && data.loanApplicationKycList[0].permanentState) {
        this.permanentState = data.loanApplicationKycList[0].permanentState
        const stateWiseFilter = this.stateWiseDeclaration.filter((states) => states.state == this.permanentState);
        // let stateWiseFilter = this.stateWiseDeclaration.filter((states) => {
        //   if (states.state == this.permanentState) {
        //     this.declaration = states
        //   }
        // })
        console.log(stateWiseFilter)
        if (stateWiseFilter && stateWiseFilter[0] && stateWiseFilter[0].content) {
          this.declaration = stateWiseFilter[0].content;
        }
      }
    })
  }

  goBack() {
    this.location.back()
  }


  onPrint() {
    const printContent = document.getElementById("printMe");
    var htmlToPrint = '' +
      '<style type="text/css">' +
      'table th, table td {' +
      'border:1px solid #000;' +
      'padding:0.5em;' +
      '}' +
      'table {' +
      'border-collapse: collapse;' +
      '}' +
      '.text-center {' +
      'text-align: center;' +
      '}' +
      '</style>';
    htmlToPrint += printContent.outerHTML;
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(htmlToPrint);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    // WindowPrt.close();
  }


  accept() {
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        phoneNo: this.phoneNumber,
        email: this.email,
        uid: this.loanId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.openSnackBar("Loan Accepted Successfully");
        this.type = 'accepted';
      }
    });

  }


  reject() {
    const dialogRef = this.dialog.open(OtpVerifyComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        phoneNo: this.phoneNumber,
        email: this.email,
        uid: this.loanId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.openSnackBar("Loan Rejected Successfully");
        this.type = 'rejected';
      }
    });

  }

  round(number) {
    return Math.round(Number(number));
  }


  // getLoanEmiDetails(id) {
  //   this.agreementService.getLoanEmiDetails(id).subscribe((data: any) => {
  //     if (data) {
  //       this.loanEmiDetailsData = data
  //     }
  //   },
  //     (error) => {
  //       this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' })
  //     });
  // }

}
