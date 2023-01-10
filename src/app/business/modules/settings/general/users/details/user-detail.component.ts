import { Component, OnInit } from "@angular/core";
import { UntypedFormGroup, Validators, UntypedFormBuilder } from "@angular/forms";
import { Messages } from "../../../../../../shared/constants/project-messages";
import { FormMessageDisplayService } from "../../../../../../shared/modules/form-message-display/form-message-display.service";
import { ProviderServices } from "../../../../../services/provider-services.service";
import { SharedFunctions } from "../../../../../../shared/functions/shared-functions";
import { ActivatedRoute, Router } from "@angular/router";
import { projectConstants } from "../../../../../../app.component";
import * as moment from "moment";
import { SharedServices } from "../../../../../../shared/services/shared-services";
import { ConfirmBoxComponent } from "../../../../../../shared/components/confirm-box/confirm-box.component";
import { MatDialog } from "@angular/material/dialog";
import { projectConstantsLocal } from "../../../../../../shared/constants/project-constants";
import { LocalStorageService } from "../../../../../../shared/services/local-storage.service";
import { WordProcessor } from "../../../../../../shared/services/word-processor.service";
import { SnackbarService } from "../../../../../../shared/services/snackbar.service";
import { GroupStorageService } from "../../../../../../shared/services/group-storage.service";
import { UserConfirmBoxComponent } from "../confirm-box/user-confirm-box.component";
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField
} from "ngx-intl-tel-input";
import { CommonDataStorageService } from "../../../../../../shared/services/common-datastorage.service";

@Component({
  selector: "app-branchuser-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"]
})
export class BranchUserDetailComponent implements OnInit {
  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  gender_cap = Messages.GENDER_CAP;
  male_cap = Messages.MALE_CAP;
  female_cap = Messages.FEMALE_CAP;
  date_of_birth_cap = Messages.DOB_CAP;
  phone_no_cap = Messages.PHONE_NO_CAP;
  email_id_cap = Messages.EMAIL_ID_CAP;
  email_cap = Messages.EMAIL_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  select_subdomain_cap = Messages.SELECT_SB_DMN_CAP;
  subdomain_displayname = projectConstantsLocal.SUBDOMAIN_DISPLAYNAME;
  userForm: UntypedFormGroup;
  char_count = 0;
  max_char_count = 250;
  roles: any;
  isfocused = false;
  layout_id;
  cancel_btn = Messages.CANCEL_BTN;
  button_title = "Save";
  service = false;
  action = "show";
  api_loading = false;
  api_error = null;
  api_success = null;
  fnameerror = null;
  lnameerror = null;
  emailerror = null;
  email1error = null;
  subdomainerror = null;
  subDomains: any = [];
  selectedRole: any;
  id;
  filter = {
    firstName: "",
    lastName: "",
    city: "",
    state: "",
    pinCode: "",
    primaryMobileNo: "",
    employeeId: "",
    email: "",
    userType: "",
    available: "",
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  tday = new Date();
  minday = new Date(1900, 0, 1);
  showPrvdrFields = false;
  showPatientList = false;
  type;
  actionparam;
  subDomainList: any = [];
  business_domains;
  showAdvancedSection = false;
  filterBydept = false;
  removeitemdialogRef;
  departments: any = [];
  userId;
  user_data: any = [];
  userTypesFormfill: any = [
    { value: "ASSISTANT", name: "Assistant" },
    { value: "PROVIDER", name: "Doctor" },
    { value: "ADMIN", name: "Admin" }
  ];
  dept: any;
  subDom;
  deptLength;
  subsector;
  sector;
  selectedsubDomain: any = [];
  usercaption = "Add User";
  showloc = false;
  locationDetails: any;
  locations: any = [];
  editloc = true;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  selectedCountry = CountryISO.India;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.India,
    CountryISO.UnitedKingdom,
    CountryISO.UnitedStates
  ];
  telegramCountry;
  whatsappCountry;
  countrycode;
  isadminPrivilege: any;
  provider_label = "";
  locationsjson: any;
  loc_list: any = [];
  consumer_label = "";
  userList: any = [];
  settings: any;
  userRolesSelected: any;
  constructor(
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private shared_services: SharedServices,
    private router: Router,
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private lStorageService: LocalStorageService,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private commonDataStorage: CommonDataStorageService
  ) {
    this.activated_route.queryParams.subscribe(data => {
      this.actionparam = data;
    });
    this.consumer_label = this.wordProcessor.getTerminologyTerm("customer");
  }
  ngOnInit() {
    this.provider_label = this.wordProcessor.getTerminologyTerm("provider");
    this.createForm();
    if (this.actionparam.val) {
      this.userId = this.actionparam.val;
      this.getUserData();
      // this.updateForm()

    }

    this.provider_services.getUsers().subscribe(res => {
      this.userList = res;
      console.log("User Data :", this.userList);
    });
    this.getProviderLocations();
    const bConfig = this.lStorageService.getitemfromLocalStorage("ynw-bconf");
    const user = this.groupService.getitemFromGroupStorage("ynw-user");
    this.subsector = user.subSector;
    this.isadminPrivilege = user.adminPrivilege;
    this.sector = user.sector;
    console.log(bConfig);
    console.log(this.sector);
    console.log(this.subsector);
    this.userTypesFormfill = [
      { value: "ASSISTANT", name: "Assistant" },
      { value: "PROVIDER", name: this.provider_label },
      { value: "ADMIN", name: "Admin" }
    ];
    if (bConfig && bConfig.bdata) {
      console.log("");
      for (let i = 0; i < bConfig.bdata.length; i++) {
        if (user.sector === bConfig.bdata[i].domain) {
          for (let j = 0; j < bConfig.bdata[i].subDomains.length; j++) {
            this.subDomains.push(bConfig.bdata[i].subDomains[j]);
          }
          break;
        }
      }
    } else {
      this.shared_services.bussinessDomains().subscribe(res => {
        const today = new Date();
        const postdata = {
          cdate: today,
          bdata: res
        };
        this.lStorageService.setitemonLocalStorage("ynw-bconf", postdata);
      });
    }
    this.selectedsubDomain = [];
    console.log(this.subDomains);
    for (const subdomain of this.subDomains) {
      if (this.sector === "healthCare") {
        if (this.subsector === "hospital") {
          if (subdomain.subDomain === "physiciansSurgeons") {
            this.selectedsubDomain.push(subdomain);
          }
        } else if (this.subsector === "dentalHosp") {
          if (subdomain.subDomain === "dentists") {
            this.selectedsubDomain.push(subdomain);
          }
        } else if (this.subsector === "alternateMedicineHosp") {
          if (subdomain.subDomain === "alternateMedicinePractitioners") {
            this.selectedsubDomain.push(subdomain);
          }
        }
      } else if (this.sector === "personalCare") {
        if (subdomain.subDomain === this.subsector) {
          this.selectedsubDomain.push(subdomain);
        }
      } else if (this.sector === "finance") {
        if (subdomain.subDomain === this.subsector) {
          this.selectedsubDomain.push(subdomain);
        }
      } else if (this.sector === "veterinaryPetcare") {
        if (this.subsector === "veterinaryhospital") {
          if (subdomain.subDomain === "veterinarydoctor") {
            this.selectedsubDomain.push(subdomain);
          }
        }
      } else if (this.sector === "retailStores") {
        if (subdomain.subDomain === this.subsector) {
          this.selectedsubDomain.push(subdomain);
        }
      } else if (this.sector === "educationalInstitution") {
        if (this.subsector === "educationalTrainingInstitute") {
          if (subdomain.subDomain === "educationalTrainingInstitute") {
            this.selectedsubDomain.push(subdomain);
          }
        } else if (this.subsector === "schools") {
          if (subdomain.subDomain === "schools") {
            this.selectedsubDomain.push(subdomain);
          }
        } else if (this.subsector === "colleges") {
          if (subdomain.subDomain === "colleges") {
            this.selectedsubDomain.push(subdomain);
          }
        }
      } else if (this.sector === "sportsAndEntertainement") {
        if (subdomain.subDomain === this.subsector) {
          this.selectedsubDomain.push(subdomain);
        }
      }
    }
    this.settings = this.groupService.getitemFromGroupStorage('settings');
    console.log("settings", this.settings)
    if (this.settings && this.settings.enableCdl) {
      this.getRolesData('cdl');
    }
  }

  getRolesData(features) {
    this.api_loading = true;
    this.provider_services.getRolesData(features).subscribe(data => {
      this.roles = data;
      this.api_loading = false;
      console.log("roles : ", this.roles);
    });
  }


  getProviderLocations() {
    this.api_loading = true;
    this.provider_services.getProviderLocations().subscribe(data => {
      console.log("loc_listdata" + JSON.stringify(data));
      this.locationsjson = data;
      for (const loc of this.locationsjson) {
        if (loc.status === "ACTIVE" && loc.baseLocation) {
          this.loc_list.push(loc);
        }
      }
      this.api_loading = false;
      console.log("loc_list" + this.loc_list);
    });
  }
  createForm() {
    this.userForm = this.fb.group({
      first_name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)
        ])
      ],
      last_name: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(projectConstantsLocal.VALIDATOR_CHARONLY)
        ])
      ],
      gender: [""],
      employeeId: [""],
      countryCode: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_COUNTRYCODE)
        ])
      ],
      phonenumber: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_ONLYNUMBER)
        ])
      ],
      dob: [""],
      email: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)
        ])
      ],
      countryCode_whatsapp: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_COUNTRYCODE)
        ])
      ],
      whatsappumber: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_ONLYNUMBER)
        ])
      ],
      countryCode_telegram: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_COUNTRYCODE)
        ])
      ],
      telegramnumber: [
        "",
        Validators.compose([
          Validators.pattern(projectConstantsLocal.VALIDATOR_ONLYNUMBER)
        ])
      ],
      postalCode: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(6),
          Validators.minLength(6),
          Validators.pattern(projectConstantsLocal.VALIDATOR_ONLYNUMBER)
        ])
      ],
      selectedDepartment: [],
      privileges: [""],
      bProfilePermitted: [""],
      showCsmrDataBase: [""],
      selectedUserType: [],
      selectedrole: ""
    });
    this.userForm.patchValue(
      {
        countryCode: "+91" || '',
        countryCode_whatsapp: "+91" || null,
        countryCode_telegram: "+91" || null
      });
    this.userForm
      .get("selectedUserType")
      .setValue(this.userTypesFormfill[0].value);
    this.getWaitlistMgr();
  }
  getUserData() {
    if (this.userId) {
      this.provider_services.getUser(this.userId).subscribe(res => {
        this.user_data = res;
        if (this.actionparam.type === "edit") {
          this.usercaption = "User Details";
          this.type = this.user_data.userType;
          if (this.sector === "healthCare") {
            if (this.type === "PROVIDER") {
              this.type = "DOCTOR";
            }
          }
          if (this.sector === "finance") {
            if (this.type === "PROVIDER") {
              this.type = "Staff Member";
            }
          }
          if (this.sector === "educationalInstitution") {
            if (this.type === "PROVIDER") {
              this.type = "Mentor";
            }
          }
          this.updateForm();
        }
      });
    }
  }
  updateForm() {
    console.log("hi");
    if (this.user_data.userType === "PROVIDER") {
      this.showPrvdrFields = true;
    }
    console.log("form Data", this.user_data);
    console.log("Data :", this.userForm);

    this.userForm.patchValue({
      first_name: this.user_data.firstName || null,
      last_name: this.user_data.lastName || null,
      gender: this.user_data.gender || null,
      employeeId: this.user_data.employeeId || null,
      // countryCode: '+'+this.user_data.countryCode ? '+'+this.user_data.countryCode : "+91",
      phonenumber: this.user_data.mobileNo || "",
      dob: this.user_data.dob || null,
      email: this.user_data.email || null,
      selectedDepartment: this.user_data.deptId || null,
      selectedUserType: this.user_data.userType || null,
      privileges: this.user_data.admin || false,
      bProfilePermitted: this.user_data.bProfilePermitted || false,
      showCsmrDataBase: this.user_data.showCsmrDataBase || false,
      postalCode: this.user_data.pincode || null,
      countryCode_whatsapp:
        this.user_data.whatsAppNum && this.user_data.whatsAppNum.countryCode
          ? this.user_data.whatsAppNum.countryCode
          : "+91",
      whatsappumber:
        this.user_data.whatsAppNum && this.user_data.whatsAppNum.number
          ? this.user_data.whatsAppNum.number
          : "",
      countryCode_telegram:
        this.user_data.telegramNum && this.user_data.telegramNum.countryCode
          ? this.user_data.telegramNum.countryCode
          : "+91",
      telegramnumber:
        this.user_data.telegramNum && this.user_data.telegramNum.number
          ? this.user_data.telegramNum.number
          : ""
    });
    if ((this.user_data.countryCode === '91' || '' || undefined) || (this.user_data.whatsAppNum.countryCode === '91' || '' || undefined) || (this.user_data.telegramNum.countryCode === '91' || '' || undefined)) {
      this.userForm.patchValue({
        countryCode: "+91",
        countryCode_whatsapp: "+91" || null,
        countryCode_telegram: "+91" || null
      });
    }

    if (this.user_data && this.user_data.userRoles && this.user_data.userRoles[0] && this.user_data.userRoles[0].roleId) {
      console.log("this.user_data.userRoles[0].roleId", typeof (Number(this.user_data.userRoles[0].roleId)))
      this.userForm.get("selectedrole").setValue(this.user_data.userRoles[0].roleId);
    }
    this.userForm.controls.selectedrole.setValue(Number(this.user_data.userRoles[0].roleId));

    console.log("After set the form", this.userForm.controls.selectedrole.value);
  }
  onUserSelect(event) {
    this.type = event.value;
    console.log(this.userForm.controls.selectedUserType.value)
    if (event.value === "PROVIDER") {
      this.showPrvdrFields = true;
    } else {
      this.showPrvdrFields = false;
    }
  }

  onRoleSelect(event) {
    console.log(this.selectedRole)
    this.userRolesSelected = [
      {
        "roleId": event,
        "defaultRole": true
      }]
  }
  showPatients(event) {
    // this.showCsmrDataBase = !this.showCsmrDataBase;
    this.type = event.value;
    if (event.value === "PROVIDER" || "ADMIN") {
      this.showPatientList = true;

      //this.showPrvdrFields = true;
      this.provider_services.getProviderCustomers().subscribe(res => {
        this.userList = res;
        console.log("Data :", this.userList);
      });
    } else {
      this.showPatientList = false;
      // this.showPrvdrFields = false;
    }
  }
  hideUserSidebar() {
    this.showPatientList = false;
  }

  onSubmit(input) {
    console.log("Submit Data :", input)
    let date_format = null;
    if (input.dob !== null && input.dob !== "") {
      const date = new Date(input.dob);
      date_format = moment(date).format(projectConstants.POST_DATE_FORMAT);
    }
    if (input.email) {
      const stat = this.validateEmail(input.email);
      if (!stat) {
        this.emailerror = "Please enter a valid email.";
      }
    }
    if (input.first_name.trim() === "") {
      this.fnameerror = "First name is required";
    }
    if (input.last_name.trim() === "") {
      this.lnameerror = "Last name is required";
    }
    if (
      this.fnameerror !== null ||
      this.lnameerror !== null ||
      this.emailerror !== null
    ) {
      return;
    }
    const post_data1 = {
      firstName: input.first_name.trim() || null,
      lastName: input.last_name.trim() || null,
      dob: date_format || null,
      gender: input.gender || null,
      employeeId: input.employeeId || null,
      email: input.email || "",
      userType: input.selectedUserType,
      pincode: input.postalCode
    };
    if (input.whatsappumber !== "") {
      if (input.countryCode_whatsapp.startsWith("+")) {
        this.whatsappCountry = input.countryCode_whatsapp;
      } else {
        this.whatsappCountry = "+" + input.countryCode_whatsapp;
      }
      const whatsup = {};
      whatsup["countryCode"] = this.whatsappCountry;
      whatsup["number"] = input.whatsappumber;
      post_data1["whatsAppNum"] = whatsup;
    }
    if (input.telegramnumber !== "") {
      if (input.countryCode_telegram.startsWith("+")) {
        this.telegramCountry = input.countryCode_telegram;
      } else {
        this.telegramCountry = "+" + input.countryCode_telegram;
      }
      const telegram = {};
      telegram["countryCode"] = this.telegramCountry;
      telegram["number"] = input.telegramnumber;
      post_data1["telegramNum"] = telegram;
    }
    if (input.phonenumber !== "") {
      if (input.countryCode.startsWith("+")) {
        this.countrycode = input.countryCode;
      } else {
        this.countrycode = "+" + input.countryCode;
      }
      (post_data1["countryCode"] = this.countrycode ? this.countrycode : '+91'),
        (post_data1["mobileNo"] = input.phonenumber ? input.phonenumber : '');
    }
    if (input.selectedUserType === "PROVIDER") {
      post_data1["deptId"] = input.selectedDepartment;
      post_data1["bProfilePermitted"] = input.bProfilePermitted;
      post_data1["showCsmrDataBase"] = input.showCsmrDataBase;
      console.log(this.selectedsubDomain);
      // if (this.selectedsubDomain[0] && this.selectedsubDomain[0].id) {
      //    post_data1['subdomain'] = this.selectedsubDomain[0].id;
      // }
    }
    if (input.selectedUserType !== "ADMIN") {
      post_data1["admin"] = input.privileges;
      console.log(input.privileges);
    }
    if (this.settings && this.settings.enableCdl) {
      post_data1["userRoles"] = this.userRolesSelected;
    }
    if (this.actionparam.type === "edit") {
      console.log(post_data1);
      this.provider_services.updateUser(post_data1, this.userId).subscribe(
        () => {
          this.snackbarService.openSnackBar(
            this.wordProcessor.getProjectMesssages("USERUPDATED_ADDED"),
            { panelclass: "snackbarerror" }
          );
          this.router.navigate(["provider", "settings", "general", "users"]);
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
    } else {
      console.log(post_data1);
      this.provider_services.createUser(post_data1).subscribe(
        Id => {
          if (this.loc_list) {
            let loc = [];
            let userIds = [];
            loc.push(this.loc_list[0].id);
            userIds.push(Id);
            post_data1["bussLocations"] = loc;
            const postData = {
              userIds: userIds,
              bussLocations: loc
            };
            this.provider_services.assignLocationToUsers(postData).subscribe(
              (data: any) => { },
              error => {
                this.snackbarService.openSnackBar(error, {
                  panelClass: "snackbarerror"
                });
              }
            );
          }
          this.userAddConfirm();
        },
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
    }
  }
  onCancel() {
    this.router.navigate(["provider", "settings", "general", "users"]);
  }
  resetApiErrors() {
    this.emailerror = null;
    this.fnameerror = null;
    this.lnameerror = null;
    this.subdomainerror = null;
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  isNumericSign(evt) {
    return this.shared_functions.isNumericSign(evt);
  }
  validateEmail(mail) {
    const emailField = mail;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) === false) {
      return false;
    }
    return true;
  }
  advancedClick() {
    this.showAdvancedSection
      ? (this.showAdvancedSection = false)
      : (this.showAdvancedSection = true);
  }
  getWaitlistMgr() {
    this.provider_services.getWaitlistMgr().then(
      data => {
        this.filterBydept = data["filterByDept"];
        if (this.filterBydept) {
          setTimeout(() => {
            this.getDepartments();
          }, 1000);
        }
      },
      () => { }
    );
  }
  enabledepartment() {
    this.removeitemdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "50%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass"
      ],
      disableClose: true,
      data: {
        message: "Proceed with enabling department?"
      }
    });
    this.removeitemdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.provider_services.setDeptWaitlistMgr("Enable").subscribe(
          () => {
            this.api_loading = true;
            this.commonDataStorage.setSettings('waitlist', null);
            this.getWaitlistMgr();
          },
          error => {
            this.snackbarService.openSnackBar(error, {
              panelClass: "snackbarerror"
            });
          }
        );
      } else {
      }
    });
  }
  getDepartments() {
    this.provider_services.getDepartments().subscribe(
      data => {
        this.departments = data["departments"];
        if (this.actionparam.type !== "edit") {
          this.userForm
            .get("selectedDepartment")
            .setValue(this.departments[0].departmentId);
        }
        this.deptLength = this.departments.length;
        this.api_loading = false;
      },
      error => { }
    );
  }
  redirecToUsersl() {
    this.router.navigate(["provider", "settings", "general", "users"]);
  }
  keyPressed(event) {
    this.editloc = false;
    if (event.length == 6) {
      this.blurPincodeQty(event);
    } else {
      this.locations = [];
    }
  }
  blurPincodeQty(val) {
    this.locations = [];
    if (val.length < 6) {
      this.snackbarService.openSnackBar("Please enter valid Pincode", {
        panelClass: "snackbarerror"
      });
    } else {
      if (val.length == 6) {
        this.provider_services.getlocationbypincode(val).subscribe(
          data => {
            this.locationDetails = data;
            this.showloc = true;
            this.editloc = false;
            console.log(this.locationDetails)
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
  userAddConfirm() {
    const dialogref = this.dialog.open(UserConfirmBoxComponent, {
      width: "60%",
      panelClass: [
        "popup-class",
        "commonpopupmainclass",
        "confirmationmainclass"
      ],
      disableClose: true,
      data: {}
    });
    dialogref.afterClosed().subscribe(result => {
      this.router.navigate(["provider", "settings", "general", "users"]);
    });
  }
}
