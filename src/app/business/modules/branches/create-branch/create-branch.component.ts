import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
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
  action: any;
  branchId: any;
  branchStatus: any;
  locationId: any;
  constructor(
    private createBranchFormBuilder: UntypedFormBuilder,
    private providerServices: ProviderServices,
    private snackbarService: SnackbarService,
    private router: Router,
    private lStorageService: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.createBranch = this.createBranchFormBuilder.group({
      location: [null],
      branchname: [null],
      branchcode: [null]
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.id && params.action && params.action == 'update') {
        this.branchId = params.id;
        this.providerServices.getBranchById(params.id).subscribe((data: any) => {
          if (data && data.branchCode) {
            this.createBranch.controls.branchcode.setValue(data.branchCode)
          }
          if (data && data.branchName) {
            this.createBranch.controls.branchname.setValue(data.branchName)
          }
          if (data && data.status) {
            this.branchStatus = data.status;
          }
          if (data && data.location && data.location.id) {
            this.createBranch.controls.location.setValue(data.location.id)
          }
        })
      }
      if (params && params.action) {
        this.action = params.action;
      }
      if (params && params.loc_id) {
        this.createBranch.controls.location.setValue(Number(params.loc_id))
      }
    });
  }

  ngOnInit(): void {
    if (this.lStorageService.getitemfromLocalStorage('branchData')) {
      let storedBranchData = this.lStorageService.getitemfromLocalStorage('branchData');
      if (storedBranchData && storedBranchData.branchCode) {
        this.createBranch.controls.branchcode.setValue(storedBranchData.branchCode)
      }
      if (storedBranchData && storedBranchData.branchName) {
        this.createBranch.controls.branchname.setValue(storedBranchData.branchName)
      }
      this.lStorageService.removeitemfromLocalStorage('branchData')
    }
    this.getLocations();
  }

  resetErrors() { }

  goBack() {
    if (this.action && this.action == 'update') {
      this.router.navigate(["provider", "branches"]);
    }
    else {
      this.location.back()
    }
  }

  getLocations() {
    this.providerServices.getProviderLocations().subscribe((data: any) => {
      this.locations = data;
      console.log("this.locations", this.locations);
    });
  }

  addLocation() {
    let branchData = {
      branchCode: this.createBranch.controls.branchcode.value,
      branchName: this.createBranch.controls.branchname.value,
    };
    this.lStorageService.setitemonLocalStorage('branchData', branchData);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'branch'
      }
    };
    this.router.navigate(["provider", "settings", "general", "locations", "add"], navigationExtras);
  }

  saveBranch() {
    let branchData = {
      branchCode: this.createBranch.controls.branchcode.value,
      branchName: this.createBranch.controls.branchname.value,
      location: { id: this.createBranch.controls.location.value }
    };
    console.log("branchData", branchData);
    if (this.action && this.action == 'update') {
      if (this.branchStatus) {
        branchData['status'] = this.branchStatus;
      }
      this.providerServices.updateBranch(this.branchId, branchData).subscribe(
        (data: any) => {
          if (data) {
            this.snackbarService.openSnackBar("Branch Data Updated Successfully");
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
    else {
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
}
