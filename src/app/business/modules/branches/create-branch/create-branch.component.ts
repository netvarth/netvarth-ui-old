import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NavigationExtras, Router } from "@angular/router";
import { SnackbarService } from "../../../../shared/services/snackbar.service";
import { ProviderServices } from "../../../services/provider-services.service";

@Component({
  selector: "app-create-branch",
  templateUrl: "./create-branch.component.html",
  styleUrls: ["./create-branch.component.css"]
})
export class CreateBranchComponent implements OnInit {
  createBranch: any;
  locations: any;
  constructor(
    private createBranchFormBuilder: FormBuilder,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.createBranch = this.createBranchFormBuilder.group({
      location: [null],
      branchname: [null],
      branchcode: [null]
    });
  }

  ngOnInit(): void {
    this.getLocations();
  }

  resetErrors() {}

  goBack() {
    this.router.navigate(["provider", "settings"]);
  }

  getLocations() {
    this.providerServices.getProviderLocations().subscribe((data: any) => {
      this.locations = data;
      console.log("this.locations", this.locations);
    });
  }

  addLocation() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'branch'
      }
    };
    this.router.navigate(["provider","settings","general","locations","add"],navigationExtras);
  }

  saveBranch() {
    let branchData = {
      branchCode: this.createBranch.controls.branchcode.value,
      branchName: this.createBranch.controls.branchname.value,
      location: { id: this.createBranch.controls.location.value }
    };
    console.log("branchData", branchData);
    this.providerServices.saveBranch(branchData).subscribe(
      (data: any) => {
        if (data) {
          this.snackbarService.openSnackBar("Branch Data Saved Successfully");
          this.router.navigate(["provider", "branches"]);
        }
      },
      error => {
        this.snackbarService.openSnackBar(error, {
          panelClass: "snackbarerror"
        });
      }
    );
  }
}
