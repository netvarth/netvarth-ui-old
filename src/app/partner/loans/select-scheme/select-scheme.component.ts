import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-scheme',
  templateUrl: './select-scheme.component.html',
  styleUrls: ['./select-scheme.component.css']
})
export class SelectSchemeComponent implements OnInit {
  schemes
  constructor(
    public dialogRef: MatDialogRef<SelectSchemeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.schemes) {
      this.schemes = this.data.schemes
    }
  }

  close() {
    this.dialogRef.close();
  }

  schemeSelected(scheme) {
    console.log("this.scheme", scheme)
    this.dialogRef.close(scheme);
  }
}
