import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { PreviewuploadedfilesComponent } from "../previewuploadedfiles/previewuploadedfiles.component";
import { LocalStorageService } from "../../../../shared/services/local-storage.service";
import { ProviderServices } from "../../../../business/services/provider-services.service";
import { SnackbarService } from "../../../../shared/services/snackbar.service";
import { Messages } from "../../../../shared/constants/project-messages";
import { GroupStorageService } from "../../../../shared/services/group-storage.service";
import { WordProcessor } from "../../../../shared/services/word-processor.service";
import { projectConstants } from "../../../../app.component";
import { ConfirmBoxComponent } from "../../../../business/shared/confirm-box/confirm-box.component";
import { FileService } from "../../../../shared/services/file-service";
import { DateTimeProcessor } from "../../../../shared/services/datetime-processor.service";
import { CrmSelectMemberComponent } from "../../../../../../src/app/business/shared/crm-select-member/crm-select-member.component";
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";

@Component({
  selector: "app-folder-files",
  templateUrl: "./folder-files.component.html",
  styleUrls: ["./folder-files.component.css"]
})
export class FolderFilesComponent implements OnInit {
  driveFiles: any[] = [];
  allFileTypesSelected = false;
  filterFileType: any;
  fileSizeFilter: any;
  contextTypes: any = [];
  fileTypes: any = [];
  loading = true;
  blogo = "";
  bname;
  userDetails: any = [];
  userData;
  branchName = "";
  bsubsector = "";
  bsector = "";
  bdetails: any;
  cols: any[];
  value: number = 0;
  api_loading: boolean;
  selectedTeam;
  addUser = false;
  tooltipcls = "";
  apiloading = false;
  dataLoading = false;
  foldertype: any;
  foldername: any;
  fileviewdialogRef: any;
  filter_sidebar = false;
  filterapplied = false;
  pagination: any = {
    startpageval: 1,
    totalCnt: this.driveFiles.length,
    perPage: 3
  };
  choose_type = "My";
  onClickedConsumer = false;
  onClickedProvider = false;
  sharedFolderName: any;
  active_user: any;
  action: any = "";
  apiError = "";
  apiSuccess = "";
  fileTypeName: any;
  selectedMessage = {
    files: [],
    base64: [],
    caption: []
  };
  filesType: any;
  @ViewChild("modal") modal;
  imgCaptions: any = [];
  @ViewChild("closebutton") closebutton;
  @ViewChild("locclosebutton") locclosebutton;
  filter = {
    fileSize: "",
    fileName: "",
    ownerName: "",
    fileType: "",
    context: "",
    serviceId: "",
    folderName: "",
    startDate: "",
    endDate: "",
    endminday: "",
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1
  };
  filtericonTooltip = "";

  filters: any = {
    firstName: false,
    lastName: "",
    city: false,
    state: false,
    pinCode: false,
    primaryMobileNo: false,
    employeeId: false,
    email: false,
    userType: false,
    folderName: false
  };

  onClickedFolder = false;
  searchTerm: any;
  p: number = 1;
  config: any;
  count: number = 0;
  selectedLanguages: any = [];
  selectedLocations: any = [];
  selectedSpecialization: any = [];
  lessMb: boolean;
  grateMB: boolean;
  pdf: boolean;
  png: boolean;
  jpeg: boolean;
  jpg: boolean;
  mp3: boolean;
  mp4: boolean;
  doc: boolean;
  selectrow = false;
  user_count_filterApplied: any;
  availabileSelected: boolean;
  notAvailabileSelected: boolean;
  tooltipcl = projectConstantsLocal.TOOLTIP_CLS;
  customer_label = "";
  provider_label = "";
  isHealthCare = false;
  fileData: any;
  fileExisted: string;
  isExistFile: boolean = false;
  folderTypeName: any;
  tday = new Date();
  minday = new Date(2015, 0, 1);
  endminday = new Date(1900, 0, 1);
  maxDate = new Date();
  isCheckin;
  dateFilter = false;
  auditSelAck = [];
  startDate = null;
  endDate = null;
  holdauditSelAck = null;
  holdauditStartdate = null;
  holdauditEnddate = null;
  constructor(
    private _location: Location,
    private provider_servicesobj: ProviderServices,
    private activated_route: ActivatedRoute,
    public dialog: MatDialog,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private fileService: FileService,
    private dateTimeProcessor: DateTimeProcessor
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm("customer");
    this.provider_label = this.wordProcessor.getTerminologyTerm("provider");
    this.activated_route.queryParams.subscribe(params => {
      this.foldertype = params.foldername;
      this.foldername = this.foldertype;
      if (this.foldertype === "private") {
        this.folderTypeName = "privateFolder";
      }
      if (this.foldertype === "public") {
        this.folderTypeName = "publicFolder";
      }
    });
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.driveFiles.length
    };
  }
  contextModes = [
    { mode: "appointment", value: "Appointment" },
    { mode: "waitlist", value: "Token" },
    { mode: "order", value: "Order" },
    { mode: "donation", value: "Donation" },
    { mode: "medicalRecord", value: "Medical Record" },
    { mode: "communication", value: "Communication" },
    { mode: "massCommunication", value: "Mass Communication" },
    // { mode: "jaldeeDrive", value: "Jaldee Drive" },
    { mode: "itemCreation", value: "Item Creation" },
    { mode: "consumerTask", value: "Consumer Task" },
    { mode: "providerTask", value: "Provider Task" },
    { mode: "serviceCreation", value: "Service Creation" },
    { mode: "profileCreation", value: "Profile Creation" },
    { mode: "catalogCreation", value: "Catalog Creation" },
    { mode: "lead", value: "Lead" },
    { mode: "KYC", value: "KYC" }
  ];
  fileTypeModes = [
    { mode: "jpg", value: "JPG" },
    { mode: "jpeg", value: "JPEG" },
    { mode: "png", value: "PNG" },
    { mode: "mp3", value: "MP3" },
    { mode: "mp4", value: "MP4" },
    { mode: "pdf", value: "PDF" },
    { mode: "doc", value: "DOC" },
    { mode: "xlsx", value: "XLSX" },
    { mode: "bmp", value: "BMP" },
    { mode: "txt", value: "TXT" },
    { mode: "mpeg", value: "MPEG" },
    { mode: "msword", value: "MSWORD" },
    { mode: "webp", value: "WEBP" }
  ];
  pageChanged(event) {
    this.config.currentPage = event;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
  }
  ngOnInit() {
    this.getfiles();
    this.active_user = this.groupService.getitemFromGroupStorage("ynw-user");
    console.log("getFilesOnProviderId", this.getFilesOnProviderId());
    console.log("active_user", this.active_user);
  }
  doSearch() {
    this.filter.endminday = this.filter.startDate;
    this.holdauditStartdate = "";
    this.holdauditEnddate = "";
    if (this.filter.startDate) {
      this.holdauditStartdate = this.dateTimeProcessor.transformToYMDFormat(
        this.filter.startDate
      );
    }
    if (this.filter.endDate) {
      this.holdauditEnddate = this.dateTimeProcessor.transformToYMDFormat(
        this.filter.endDate
      );
    }
    this.getAuditList(this.holdauditStartdate, this.holdauditEnddate);
    //  if (this.holdauditEnddate !== '' || this.holdauditStartdate !== '' ) {
    //    this.filterapplied = true;
    //  } else {
    //    this.filterapplied = false;
    //  }
    this.lStorageService.removeitemfromLocalStorage("drivefilter");
    if (
      this.holdauditEnddate !== "" ||
      this.holdauditStartdate !== "" ||
      this.filter.fileSize ||
      this.filter.startDate ||
      this.filter.endDate ||
      this.filter.ownerName ||
      this.filter.fileName ||
      this.filter.fileType ||
      this.filter.folderName ||
      this.filter.context ||
      this.filter.serviceId ||
      this.selectedLanguages.length > 0 ||
      this.selectedLocations.length > 0 ||
      this.selectedSpecialization.length > 0 ||
      this.contextTypes.length > 0 ||
      this.fileTypes.length > 0
    ) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }

  getAuditList(sdate, edate) {
    let pageval;
    if (this.config.currentPage) {
      pageval = (this.config.currentPage - 1) * this.config.itemsPerPage;
    } else {
      pageval = 0;
    }
    this.provider_servicesobj
      .getFilterFileslogs(
        sdate,
        edate,
        Number(pageval),
        this.config.itemsPerPage
      )
      .subscribe(
        data => {},
        error => {
          this.snackbarService.openSnackBar(error, {
            panelClass: "snackbarerror"
          });
        }
      );
  }

  stopprop(event) {
    event.stopPropagation();
  }

  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  getFilteredFiles(from_oninit = false) {
    this.loading = true;
    let filter = this.setFilterForApi();
    if (filter) {
      console.log(filter);
      this.lStorageService.setitemonLocalStorage("drivefilter", filter);
      this.provider_servicesobj
        .getAllFilterAttachments(filter)
        .subscribe((data: any) => {
          console.log(data);
          this.driveFiles = data;
          this.api_loading = false;
        });
    }
  }

  setFilterForApi() {
    let api_filter = {};
    const filter = this.lStorageService.getitemfromLocalStorage("drivefilter");
    if (filter) {
      api_filter = filter;
      this.initFilters(filter);
    }
    if (this.filter.fileSize !== "") {
      if (this.grateMB) {
        api_filter["fileSize-gt"] = this.filter.fileSize;
        api_filter["folderName-eq"] = this.foldertype;
      } else {
        api_filter["fileSize-lt"] = this.filter.fileSize;
        api_filter["folderName-eq"] = this.foldertype;
      }
    }
    if (this.contextTypes.length > 0) {
      api_filter["contextType-eq"] = this.contextTypes.toString();
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.fileTypes.length > 0) {
      api_filter["fileType-eq"] = this.fileTypes.toString();
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.holdauditStartdate !== "") {
      api_filter["uploadedDate-ge"] = this.holdauditStartdate;
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.holdauditEnddate !== "") {
      api_filter["uploadedDate-le"] = this.holdauditEnddate;
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.filter.fileName !== "") {
      api_filter["fileName-like"] = this.filter.fileName;
      api_filter["folderName-eq"] = this.foldertype;
    }
    //uploadedDate
    if (this.filter.ownerName !== "") {
      api_filter["ownerName-like"] = this.filter.ownerName;
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.filter.fileType !== "") {
      api_filter["fileType-eq"] = this.filter.fileType;
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.filter.folderName !== "") {
      api_filter["folderName-eq"] = this.filter.folderName;
    }
    // if (this.filter.context !== "") {
    //   api_filter["contextType-eq"] = this.filter.context;
    //   api_filter["folderName-eq"] = this.foldertype;
    // }
    if (this.filter.serviceId !== "") {
      api_filter["serviceId-eq"] = this.filter.serviceId;
      api_filter["folderName-eq"] = this.foldertype;
    }
    if (this.selectedLanguages.length > 0) {
      api_filter["spokenlangs-eq"] = this.selectedLanguages.toString();
    }
    if (this.selectedLocations.length > 0) {
      api_filter["businessLocs-eq"] = this.selectedLocations.toString();
    }
    if (this.selectedSpecialization.length > 0) {
      api_filter["specialization-eq"] = this.selectedSpecialization.toString();
    }
    if (this.selectedTeam === "all" || this.addUser) {
      delete api_filter["teams-eq"];
    }
    return api_filter;
  }

  initFilters(filter) {
    if (Object.keys(filter).length > 0) {
      Object.keys(filter).forEach(key => {
        const splitedKey = key.split("-");
        if (splitedKey[0] === "spokenlangs") {
          const values = filter[key].split(",");
          this.selectedLanguages = values;
        } else if (splitedKey[0] === "businessLocs") {
          let values = filter[key].split(",");
          values = values.map(value => JSON.parse(value));
          this.selectedLocations = values;
        } else if (splitedKey[0] === "specialization") {
          const values = filter[key].split(",");
          this.selectedSpecialization = values;
        } else {
          this.filter[splitedKey[0]] = filter[key];
        }
      });
      this.filterapplied = true;
    }
  }

  showFilterSidebar() {
    this.getfiles();
    this.filter_sidebar = true;
    console.log(this.filter_sidebar);
  }
  clearFilter() {
    this.lStorageService.removeitemfromLocalStorage("drivefilter");
    this.resetFilter();
    this.filterapplied = false;
    this.getfiles();
    this.png = false;
    this.jpeg = false;
    this.jpg = false;
    this.pdf = false;
    this.mp3 = false;
    this.mp4 = false;
    this.doc = false;
    this.lessMb = false;
    this.grateMB = false;
  }
  resetFilter() {
    this.filters = {
      firstName: false,
      lastName: false,
      city: false,
      state: false,
      pinCode: false,
      primaryMobileNo: false,
      employeeId: false,
      email: false,
      userType: false,
      available: false
    };
    this.filter = {
      fileSize: "",
      fileName: "",
      ownerName: "",
      fileType: "",
      context: "",
      serviceId: "",
      folderName: "",
      startDate: "",
      endDate: "",
      endminday: "",
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 1
    };
    this.selectedSpecialization = [];
    this.selectedLanguages = [];
    this.selectedLocations = [];
    this.contextTypes = [];
    this.fileTypes = [];
  }
  setFilterFileTypeCheckbox(type, value, event) {
    if (type === "fileType") {
      if (value === "all") {
        this.filterFileType = [];
        this.allFileTypesSelected = false;
        if (event.checked) {
          for (const service of this.fileTypes) {
            if (this.filterFileType.indexOf(service.id) === -1) {
              this.filterFileType.push(service.id);
            }
          }
          this.allFileTypesSelected = true;
        }
      } else {
        this.allFileTypesSelected = false;
        const indx = this.filterFileType.indexOf(value);
        if (indx === -1) {
          this.filterFileType.push(value);
        } else {
          this.filterFileType.splice(indx, 1);
        }
      }
      if (this.filterFileType.length === this.fileTypes.length) {
        this.filter["fileType"] = "all";
        this.allFileTypesSelected = true;
      }
    }
    this.doSearch();
  }
  setFilterDataCheckbox(type, value) {
    // if(type === 'contextMode')
    // {
    //   console.log("contextMode value :",value)
    // }
    if (type === "contextMode") {
      const indx = this.contextTypes.indexOf(value);
      console.log("contextMode value :", value);
      this.contextTypes = [];
      if (indx === -1) {
        this.contextTypes.push(value);
      }
    }
    if (type === "fileType") {
      const indx = this.fileTypes.indexOf(value);
      this.filter.fileType = value;
      console.log("fileTypeMode value :", value);
      this.fileTypes = [];
      if (indx === -1) {
        this.fileTypes.push(value);
      }
    }
    if (type === "folder") {
      if (value === "true") {
        this.availabileSelected = true;
        this.notAvailabileSelected = false;
        this.filter.folderName = "public";
      } else {
        this.availabileSelected = false;
        this.notAvailabileSelected = true;
        this.filter.folderName = "Private";
      }
    }
    // if (type === "fileType") {
    //   if (value === false) {
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.doc = false;
    //     this.filter.fileType = " ";
    //   }
    //   if (value === "png") {
    //     this.png = true;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.filter.fileType = "png";
    //   } else if (value === "jpeg") {
    //     this.png = false;
    //     this.jpeg = true;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.filter.fileType = "jpeg";
    //   } else if (value === "jpg") {
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = true;
    //     this.pdf = false;
    //     this.filter.fileType = "jpg";
    //   } else if (value === "pdf") {
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.doc = false;
    //     this.pdf = true;
    //     this.filter.fileType = "pdf";
    //   } else if (value === "doc") {
    //     this.doc = true;
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.mp4 = false;
    //     this.mp3 = false;
    //     this.filter.fileType = "doc";
    //   } else if (value === "mp3") {
    //     this.mp3 = true;
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.mp4 = false;
    //     this.doc = false;
    //     this.filter.fileType = "mp3";
    //   } else if (value === "mp4") {
    //     this.mp4 = true;
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.mp3 = false;
    //     this.filter.fileType = "mp4";
    //   } else {
    //     this.png = false;
    //     this.jpeg = false;
    //     this.jpg = false;
    //     this.pdf = false;
    //     this.mp3 = false;
    //     this.mp4 = false;
    //     this.doc = false;
    //     this.filter.fileType = "";
    //   }
    // }
    if (type === "fileSize") {
      console.log("Checked", type, value);
      if (value === true) {
        this.filter.fileSize = "";
        console.log("File Size : ", this.filter.fileSize);
      }
      if (value === "lessMb") {
        if (!this.lessMb) {
          this.lessMb = true;
          this.grateMB = false;
          this.filter.fileSize = "1";
        } else {
          this.lessMb = false;
          this.grateMB = false;
          this.filter.fileSize = "";
        }
      } else if (value === "grateMB") {
        if (!this.grateMB) {
          this.lessMb = false;
          this.grateMB = true;
          this.filter.fileSize = "1";
        } else {
          this.lessMb = false;
          this.grateMB = false;
          this.filter.fileSize = "";
        }
      } else {
        this.lessMb = false;
        this.grateMB = false;
        this.filter.fileSize = "";
      }
    }
    this.doSearch();
  }
  preview(file) {
    console.log("Files : ", this.driveFiles);
    if (
      file.fileType === "jpg" ||
      file.fileType === "jpeg" ||
      file.fileType === "png" ||
      file.fileType === "bmp" ||
      file.fileType === "webp"
    ) {
      this.fileviewdialogRef = this.dialog.open(PreviewuploadedfilesComponent, {
        width: "100%",
        panelClass: [
          "popup-class",
          "commonpopupmainclass",
          "uploadfilecomponentclass"
        ],
        disableClose: true,
        data: {
          file: file
        }
      });
      this.fileviewdialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      });
    } else {
      const a = document.createElement("a");
      a.href = file.filePath;
      a.download = file.filePath.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // console.log("Type :",file.fileType)

      return '<a [href]="file.filePath" target="_blank" [download]="file.fileName"></a>';
    }
  }
  deleteFile(id, fileName) {
    console.log("ID : ", id);
    this.fileviewdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: "30%",
      panelClass: ["popup-class", "commonpopupmainclass"],
      disableClose: true,
      data: {
        message: "Do you really want to delete " + fileName + " ?"
      }
    });
    this.fileviewdialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result === 1) {
          this.provider_servicesobj
            .deleteAttachment(id)
            .subscribe((data: any) => {
              this.snackbarService.openSnackBar("Deleted Successfully");
              this.getfiles();
            });
        }
      }
    });
  }
  sharedfolder(foldername) {
    console.log("Access!!!");
    if (foldername === "Provider") {
      this.onClickedProvider = true;
      this.onClickedConsumer = false;
      this.foldertype = "Shared";
      this.sharedFolderName = foldername;
      this.getfiles();
    }
    if (foldername === "Consumer") {
      this.onClickedConsumer = true;
      this.onClickedProvider = false;
      this.foldertype = "Shared";
      this.sharedFolderName = foldername;
      this.getfiles();
    }
  }

  getAllFiles() {
    this.dataLoading = true;
    this.provider_servicesobj
      .getFilesUploaded(this.active_user.id)
      .subscribe((data: any) => {
        console.log("Alllllll Filessss.", data);
        this.driveFiles = data;
        this.dataLoading = false;
      });
  }

  getfiles() {
    this.dataLoading = true;
    const filter = {};
    console.log("Folder Type :", this.foldertype);
    if (this.foldertype === "private") {
      filter["folderName-eq"] = "private";
      this.foldername = "My";
    } else if (this.foldertype === "public") {
      filter["folderName-eq"] = "public";
      this.foldername = "Provider";
    } else {
      filter["folderName-eq"] = "shared";
      this.foldername = "Consumer";
    }
    console.log(filter);
    this.provider_servicesobj
      .getAllFilterAttachments(filter)
      .subscribe((data: any) => {
        console.log("Alllllll Filessss.", data);
        this.driveFiles = data;
        console.log("this.driveFiles.", this.driveFiles);
        this.dataLoading = false;
      });
  }
  getFileType(fileType) {
    let fileTypeName = "";
    if (fileType.indexOf("image")) {
      fileTypeName = fileType.split("/")[1];
    }
    if (fileType.indexOf("pdf")) {
      fileTypeName = fileType.split("/")[1];
    }

    return fileTypeName;
  }
  getFileName(fileName) {
    let filename = "";
    if (fileName.indexOf("fileName")) {
      if (fileName.length > 10) {
        filename = fileName.slice(0, 10) + "...";
      }
      if (fileName.length <= 10) {
        filename = fileName;
      }
    }
    return filename;
  }
  getFileSize(fileSize) {
    return Math.round(fileSize);
  }
  getFilesOnProviderId() {
    this.provider_servicesobj
      .getFileShareCountOnProviderId(this.active_user.id)
      .subscribe(res => {
        console.log("Files are :", res);
      });
  }
  actionCompleted() {
    console.log("this.action", this.driveFiles);
    console.log("this.selectedMessage", this.selectedMessage.files);
    this.apiloading = true;
    if (
      this.action === "attachment" &&
      this.folderTypeName &&
      this.selectedMessage
    ) {
      // const dataToSend: FormData = new FormData();
      let i = 0;
      let captions = [];
      if (this.selectedMessage) {
        for (const file of this.selectedMessage.files) {
          const size = file["size"] / 1024;
          const caption = {
            owner: this.active_user.id,
            fileName: file["name"],
            fileSize: size / 1024,
            caption: this.imgCaptions[i] ? this.imgCaptions[i] : "",
            fileType: file["type"].split("/")[1],
            order: i++
          };
          captions.push(caption);
          // dataToSend.append('attachments', file);
          // captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
          // i++;
        }
      }

      // const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
      // dataToSend.append('captions', blobPropdata);
      // let i = 0;
      // this.fileData = [{owner: "", fileName: "", fileSize: "", caption: "", fileType: "", order: ""}];
      // for (const pic of this.selectedMessage.files) {
      // const size = pic["size"] / 1024;
      // console.log("Pic Type ", pic["type"]);
      // if (pic["type"]) {
      //   this.fileData = [
      //     {
      //       owner: this.active_user.id,
      //       fileName: pic["name"],
      //       fileSize: size / 1024,
      //       caption: this.imgCaptions[i] ? this.imgCaptions[i] : "",
      //       fileType: pic["type"].split("/")[1],
      //       order: i++
      //     }
      //   ];
      // } else {
      //   const picType = "doc";
      //   this.fileData = [
      //     {
      //       owner: this.active_user.id,
      //       fileName: pic["name"],
      //       fileSize: size / 1024,
      //       caption: this.imgCaptions[i] ? this.imgCaptions[i] : "",
      //       fileType: picType,
      //       order: i++
      //     }
      //   ];
      // }
      //   console.log("Json Daata :", JSON.stringify(this.fileData));
      // }
      // const newBlobData = new Blob([JSON.stringify(this.fileData, null, 2)], {
      //   type: "application/json"
      // });
      // dataToSend.append("fileData", newBlobData);
      this.provider_servicesobj
        .uploadAttachments(this.folderTypeName, this.active_user.id, captions)
        .subscribe(
          (s3UrlsObj: any) => {
            // this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, { panelClass: "snackbarnormal" });
            // this.selectedMessage = { files: [], base64: [], caption: [] };
            // this.getfiles();
            // this.apiloading = false;
            this.uploadFilesToS3(s3UrlsObj);
          },
          error => {
            this.snackbarService.openSnackBar(error.error, {
              panelClass: "snackbarerror"
            });
            this.apiloading = false;
          }
        );
    } else {
      alert("Please attach atleast one file.");
    }
  }

  uploadFile(file, url) {
    const _this = this;
    return new Promise(function(resolve, reject) {
      _this.provider_servicesobj.videoaudioS3Upload(file, url).subscribe(
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        }
      );
    });
  }
  async uploadFilesToS3(s3Urls) {
    const _this = this;
    let count = 0;
    for (let i = 0; i < s3Urls.length; i++) {
      // this.provider_servicesobj.videoaudioS3Upload(this.selectedMessage['files'][s3Urls[i].orderId], s3Urls[i].url).subscribe(
      //   () => {

      //   // }, () => {
      //     // resolve(false);
      //   })
      // }
      await _this
        .uploadFile(
          this.selectedMessage["files"][s3Urls[i].orderId],
          s3Urls[i].url
        )
        .then(() => {
          count++;
          console.log("Count=", count);
          console.log(s3Urls.length);
          if (count === s3Urls.length) {
            _this.snackbarService.openSnackBar(Messages.ATTACHMENT_UPLOAD, {
              panelClass: "snackbarnormal"
            });
            _this.selectedMessage = { files: [], base64: [], caption: [] };
            _this.getfiles();
            _this.apiloading = false;
          }
        });
    }
  }

  getFolderfiles() {
    this.provider_servicesobj.getAllFileAttachments().subscribe((data: any) => {
      console.log(data);
      this.driveFiles = data;
      console.log("The Folder Files : ", this.driveFiles);
    });
  }

  filesSelected(event, type?) {
    this.fileService.filesSelected(event, this.selectedMessage).then(() => {
      this.action = "attachment";
      this.modal.nativeElement.click();
    });
    // const input = event.target.files;
    // console.log("File Selected :", input);
    // let i = 0;
    // if (input) {
    //   for (const file of input) {
    //     if (file.size > projectConstantsLocal.FILE_MAX_SIZE) {
    //       this.snackbarService.openSnackBar("Please upload images with size < 10mb", { panelClass: "snackbarerror" });
    //       return;
    //     } else {
    //       this.selectedMessage.files.push(file);
    //       const reader = new FileReader();
    //       reader.onload = e => {
    //         this.selectedMessage.base64.push(e.target["result"]);
    //         this.imgCaptions[i] = "";
    //         console.log("Caption: ", this.imgCaptions[i]);
    //       };
    //       reader.readAsDataURL(file);
    //       this.action = "attachment";
    //     }
    //   }
    //   this.modal.nativeElement.click();
    // }
  }
  getCaption(caption) {
    const captions = {};
    let i = 0;
    if (caption) {
      captions[i] = this.imgCaptions[i] ? "" : this.imgCaptions[i];
      console.log("Uploaded Image : ", captions[i]);
      return captions[i];
    } else {
      return this.imgCaptions[i];
    }
  }

  getImage(url, file) {
    //console.log("URL :", url);
    return this.fileService.getImage(url, file);
  }
  getImageType(fileType) {
    return this.fileService.getImageByType(fileType);
  }

  openShareFileWindow(file) {
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "fileShare",
        file: file
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      //Messages.ATTACHMENT_UPLOAD
      if (result) {
        this.snackbarService.openSnackBar("Shared successfully!", {
          panelClass: "snackbarnormal"
        });
      }
    });
  }
  onBack() {}
  onCancel() {
    this._location.back();
  }
  popupClosed() {}
  deleteTempImage(i) {
    this.selectedMessage.files.splice(i, 1);
    this.selectedMessage.base64.splice(i, 1);
    this.selectedMessage.caption.splice(i, 1);
    this.imgCaptions[i] = "";
  }

  openDialogStatusChange(file) {
    console.log("openDialogStatusChange", file);
    const dialogRef = this.dialog.open(CrmSelectMemberComponent, {
      width: "100%",
      panelClass: ["commonpopupmainclass", "confirmationmainclass"],
      disableClose: true,
      data: {
        requestType: "fileShare",
        file: file
      }
    });
    dialogRef.afterClosed().subscribe((res: any) => {});
  }
}
