import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { projectConstantsLocal } from '../../../../../src/app/shared/constants/project-constants';
import { SnackbarService } from '../../../../../src/app/shared/services/snackbar.service';
import { CrmService } from '../../modules/crm/crm.service';

@Component({
  selector: 'app-crm-progressbar',
  templateUrl: './crm-progressbar.component.html',
  styleUrls: ['./crm-progressbar.component.css']
})
export class CrmProgressbarComponent implements OnInit {
  public memberList:any=[]
  public assignMemberDetails:any;
  public handleAssignMemberSelectText:string='';
  public assignMemberErrorMsg:string='';
  public errorMsg:boolean=false
  public assignMemberForm:any;
  //for notes variable
  public notesTextarea:any;
  public noteDescription:any;
  public noteDescriptionTime:any;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  value;
  taskDetails: any;
  gridsize;
  progress: any;
  ddd: string;
  previousProgressList:any=[];
  constructor( public dialogRef: MatDialogRef<CrmProgressbarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    private crmService: CrmService,
    // private fb: FormBuilder,
    ) {
      console.log('consdata',this.data)
      // this.assignMemberDetails= this.data.assignMembername
      // console.log('this.assignMemberDetails',this.assignMemberDetails);
     }
    

  ngOnInit(): void {
    console.log('consdata',this.data.details)
    this.taskDetails = this.data.details
    this.previousProgress();
  }
  previousProgress(){
    this.crmService.previousProgress(this.taskDetails.id).subscribe((response:any)=>{
      this.previousProgressList = response
    },
    (error)=>{
      this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
    })
  }
  updateSetting(event) {
    this.gridsize = event.value;
    this.ddd = JSON.stringify(this.gridsize)
  }
  autoGrowTextZone(e) {
    // console.log('textarea',e)
    e.target.style.height = "0px";
    e.target.style.height = (e.target.scrollHeight + 15)+"px";
  }
  handleNotesDescription(textValue:any){
    console.log('taskDescription',textValue)
    if(textValue != undefined){
      this.errorMsg=false;
      this.assignMemberErrorMsg=''
    }else{
      this.errorMsg=true;
      this.assignMemberErrorMsg='Please enter some description'
    }
  }
  saveCreateNote(){
    console.log(this.gridsize)
      console.log('this.notesTextarea',this.notesTextarea);
      this.errorMsg=false;
      this.assignMemberErrorMsg='';
      const createNoteData:any = {
        "note" :this.notesTextarea
      }
        console.log('createNoteData',this.gridsize)
      this.crmService.addProgressvalue(this.data.taskUid,this.gridsize,createNoteData).subscribe((response:any)=>{
        this.dialogRef.close()
      },
      (error)=>{
        this.snackbarService.openSnackBar(error,{'panelClass': 'snackbarerror'})
      })
      
    
   
  }
closetab(){
    this.dialogRef.close('')
}
}
