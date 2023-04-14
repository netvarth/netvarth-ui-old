import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { projectConstants } from '../../../app.component';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
// import { HttpClient } from '@angular/common/http';
import { ServiceMeta } from '../../../shared/services/service-meta';

@Injectable({
  providedIn: 'root'
})
export class CdlService {
  user: any;
  capabilities: any;

  constructor(
    // private http: HttpClient,
    private servicemeta: ServiceMeta,
    private groupService: GroupStorageService
  ) {
    this.user = this.groupService.getitemFromGroupStorage('ynw-user');
  }

  getLoanCategoryList() {
    const url = 'provider/loanapplication/category';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanProductCategoryList() {
    const url = 'provider/loanproduct/category';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanProductSubCategoryList(id) {
    const url = 'provider/loanproduct/category/' + id + '/subcategory';
    return this.servicemeta.httpGet(url, null);
  }

  gstVerify(id, data) {
    const url = 'provider/partner/validate/gst/' + id;
    return this.servicemeta.httpPut(url, data);
  }

  uploadFilesToS3(data) {
    const url = 'provider/fileShare/upload';
    return this.servicemeta.httpPost(url, data);
  }


  getCustomers() {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null);
  }

  getPartnerCustomers(id) {
    const url = 'provider/partner/' + id + '/customers';
    return this.servicemeta.httpGet(url, null);
  }

  getPartnerTotalAmount(id) {
    const url = 'provider/loanapplication/loanamount/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  getUsers() {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null);
  }

  updateCoApplicant(id, data) {
    const url = 'provider/loanapplication/' + id + '/updatekyc';
    return this.servicemeta.httpPost(url, data);
  }

  getLeadsByFilter(filter = {}) {
    const url = 'provider/enquire';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getEquifaxByFilter(filter = {}) {
    const url = 'provider/equifax';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getEquifaxCountByFilter(filter = {}) {
    const url = 'provider/equifax/count';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getLeadsByUid(uid) {
    const url = 'provider/enquire/' + uid;
    return this.servicemeta.httpGet(url, null);
  }

  getUsersByOrder() {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanTypeList() {
    const url = 'provider/loanapplication/type';
    return this.servicemeta.httpGet(url, null);
  }

  getAccountAggregatorStatus(uId, kycId) {
    const url = 'provider/loanapplication/accountaggregatestatus/' + uId + '/' + kycId;
    return this.servicemeta.httpGet(url, null);
  }

  refreshAccountAggregator(id) {
    const url = 'provider/loanapplication/upload/bankstatement/' + id;
    return this.servicemeta.httpPost(url, null);
  }


  getLoans() {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpGet(url, null);
  }


  getLoansByFilter(filter = {}) {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getLeadsCountByFilter(filter = {}) {
    const url = 'provider/enquire/count';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getUsersByFilter(filter = {}) {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getLoansCountByFilter(filter = {}) {
    const url = 'provider/loanapplication/count';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getDealersCountByFilter(filter = {}) {
    const url = 'provider/partner/count';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getBranchesByFilter(filter = {}) {
    const url = 'provider/branchmaster';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getDealersByFilter(filter = {}) {
    const url = 'provider/partner';
    return this.servicemeta.httpGet(url, null, filter);
  }


  createLoan(data) {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpPost(url, data);
  }


  updateLoan(id, data) {
    const url = 'provider/loanapplication/' + id;
    return this.servicemeta.httpPut(url, data);
  }

  generateCibilScore(data) {
    const url = 'provider/loanapplication/cibilscore';
    return this.servicemeta.httpPut(url, data);
  }


  createPartner(data) {
    const url = 'provider/partner';
    return this.servicemeta.httpPost(url, data);
  }

  partnerAccountStatus(id, status) {
    const url = 'provider/partner/' + id + '/active/' + status;
    return this.servicemeta.httpPut(url);
  }


  partnerSubvention(id, status) {
    const url = 'provider/partner/' + id + '/subventionscheme/' + status;
    return this.servicemeta.httpPut(url);
  }

  partnerSalesOfficerVerification(id, status) {
    const url = 'provider/partner/' + id + '/salesofficerverification/' + status;
    return this.servicemeta.httpPut(url);
  }

  partnerDistrictWiseStatus(id, status) {
    const url = 'provider/partner/' + id + '/districtwiseresstriction/' + status;
    return this.servicemeta.httpPut(url);
  }


  partnerAutoApprovalStatus(id, status) {
    const url = 'provider/partner/' + id + '/autoapproval/' + status;
    return this.servicemeta.httpPut(url);
  }

  savePartner(data) {
    const url = 'provider/partner/draft';
    return this.servicemeta.httpPost(url, data);
  }


  updateDealer(id, data) {
    const url = 'provider/partner/' + id;
    return this.servicemeta.httpPut(url, data);
  }

  updateDealerValidDates(id, data) {
    const url = 'provider/partner/' + id + '/setting';
    return this.servicemeta.httpPut(url, data);
  }

  dealerApprovalRequest(id) {
    const url = 'provider/partner/' + id + '/approvalrequest';
    return this.servicemeta.httpPut(url, null);
  }


  createCustomer(data) {
    const url = 'provider/customers';
    return this.servicemeta.httpPost(url, data);
  }

  getCdlEnquireTemplate(name) {
    const url = 'provider/enquire/master?loanNature-eq=' + name;
    return this.servicemeta.httpGet(url, null);
  }

  getCustomerDetails(filter = {}) {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null, filter);
  }

  createEnquire(data) {
    const url = 'provider/enquire';
    return this.servicemeta.httpPost(url, data);
  }

  getEquifax(data) {
    const url = 'provider/equifax/generatereport';
    return this.servicemeta.httpPost(url, data);
  }

  getBusinessProfile() {
    const url = 'provider/bProfile';
    return this.servicemeta.httpGet(url, null);
  }


  getBankList() {
    const url = 'provider/loanapplication/bank';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanProducts(categoryId, subCategoryId) {
    let url = 'provider/loanproduct?category-eq=' + categoryId
    if (subCategoryId != 0) {
      url = 'provider/loanproduct?category-eq=' + categoryId + '&subCategory-eq=' + subCategoryId;
    }
    return this.servicemeta.httpGet(url, null);
  }

  getLoanById(id) {
    const url = 'provider/loanapplication/' + id;
    return this.servicemeta.httpGet(url, null);
  }


  getDefaultScheme(id) {
    const url = 'provider/loanapplication/' + id + '/availableschemes';
    return this.servicemeta.httpGet(url, null);
  }


  getBankDetailsById(id) {
    const url = 'provider/loanapplication/' + id + '/bankdetails';
    return this.servicemeta.httpGet(url, null);
  }

  getDealerUsers(id) {
    const url = 'provider/partner/' + id + '/users';
    return this.servicemeta.httpGet(url, null);
  }


  getStaffList(filter) {
    const url = 'provider/user';
    return this.servicemeta.httpGet(url, null, filter);
  }

  manualLoanApproval(id, data) {
    const url = 'provider/loanapplication/' + id + '/manualapproval';
    return this.servicemeta.httpPut(url, data);
  }


  rejectLoan(id, data) {
    const url = 'provider/loanapplication/' + id + '/reject';
    return this.servicemeta.httpPut(url, data);
  }

  redirectLoan(id, data, status) {
    const url = 'provider/loanapplication/' + id + '/actionrequired/spinternalstatus/' + status;
    return this.servicemeta.httpPut(url, data);
  }

  approveLoanByBranchManager(id, data) {
    const url = 'provider/loanapplication/' + id + '/branchapproval';
    return this.servicemeta.httpPut(url, data);
  }

  completeLoan(id, data) {
    const url = 'provider/loanapplication/' + id + '/actioncompleted';
    return this.servicemeta.httpPut(url, data);
  }

  getSchemes() {
    const url = 'provider/loanapplication/schemes';
    return this.servicemeta.httpGet(url, null);
  }

  verifyLoanByOps(id, data) {
    const url = 'provider/loanapplication/' + id + '/operationalapproval';
    return this.servicemeta.httpPut(url, data);
  }

  getEquifaxReport(id) {
    const url = 'provider/equifax/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  generateOtpForEquifax() {
    const url = 'provider/equifax/generateotp';
    return this.servicemeta.httpPost(url, null);
  }

  getLoanEmiDetails(id) {
    const url = 'provider/loanapplication/' + id + '/loanemi';
    return this.servicemeta.httpGet(url, null);
  }

  getStateByPin(pin) {
    const url = 'provider/account/settings/locations/' + pin;
    return this.servicemeta.httpGet(url, null);
  }




  getDealerById(id) {
    const url = 'provider/partner/' + id;
    return this.servicemeta.httpGet(url, null);
  }



  verifyIds(type, data, from?) {
    let url = 'provider/loanapplication/update/' + type;
    if (from && from == 'coapplicant') {
      url = 'provider/loanapplication/updatekyc/document/' + type;
    }
    return this.servicemeta.httpPut(url, data);
  }


  verifyPartnerIds(type, data) {
    const url = 'provider/partner/update/' + type;
    return this.servicemeta.httpPut(url, data);
  }

  ApprovalRequest(id) {
    const url = 'provider/loanapplication/' + id + '/approvalrequest';
    return this.servicemeta.httpPut(url, null);
  }

  refreshAadharVerify(id) {
    const url = 'provider/loanapplication/aadhar/status/' + id;
    return this.servicemeta.httpPut(url, null);
  }


  refreshPartnerAadharVerify(id) {
    const url = 'provider/partner/aadhar/status/' + id;
    return this.servicemeta.httpPut(url, null);
  }

  addressUpdate(data) {
    const url = 'provider/loanapplication/kyc/update';
    return this.servicemeta.httpPut(url, data);
  }

  loanDetailsSave(data) {
    const url = 'provider/loanapplication/request';
    return this.servicemeta.httpPut(url, data);
  }


  getDealers() {
    const url = 'provider/partner';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanStatuses() {
    const url = 'provider/loanapplication/status';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanSchemes(id) {
    const url = 'provider/loanapplication/' + id + '/availableschemes ';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanTenures(id) {
    const url = 'provider/loan/scheme/' + id + '/availabletenures';
    return this.servicemeta.httpGet(url, null);
  }


  sendDigitalDocument(id) {
    const url = 'provider/loanapplication/digitaldocument/' + id;
    return this.servicemeta.httpPost(url, null);
  }



  getPartnerCategories() {
    const url = 'provider/partner/category';
    return this.servicemeta.httpGet(url, null);
  }


  getPartnerTypes() {
    const url = 'provider/partner/type';
    return this.servicemeta.httpGet(url, null);
  }

  videoaudioS3Upload(file, url) {
    return this.servicemeta.httpPut(url, file);
  }

  videoaudioS3UploadStatusUpdate(status, id) {
    const url = 'provider/fileShare/upload/' + status + '/' + id;
    return this.servicemeta.httpPut(url, null);
  }

  approveDealer(id, data) {
    const url = 'provider/partner/' + id + '/approved';
    return this.servicemeta.httpPut(url, data);
  }


  changeScheme(loanId, data) {
    const url = 'provider/loanapplication/' + loanId + '/approval';
    return this.servicemeta.httpPut(url, data);
  }

  saveRemarks(data) {
    const url = 'provider/loanapplication/remark';
    return this.servicemeta.httpPut(url, data);
  }

  partnerAcceptance(data) {
    const url = 'provider/loanapplication/partner/acceptance';
    return this.servicemeta.httpPut(url, data);
  }

  uploadInvoice(id, data) {
    const url = 'provider/loanapplication/' + id + '/uploadinvoice';
    return this.servicemeta.httpPut(url, data);
  }


  salesOfficerApproval(data, id) {
    const url = 'provider/loanapplication/' + id + '/approval';
    return this.servicemeta.httpPut(url, data);
  }

  AttachmentsOnsalesOfficerApproval(id, kycId, data) {
    const url = 'provider/loanapplication/' + id + '/kyc/' + kycId + '/attachments';
    return this.servicemeta.httpPut(url, data);
  }


  suspendDealer(id, data) {
    const url = 'provider/partner/' + id + '/suspended';
    return this.servicemeta.httpPut(url, data);
  }

  resumptionDealer(id, data) {
    const url = 'provider/partner/' + id + '/resumption';
    return this.servicemeta.httpPut(url, data);
  }

  rejectDealer(id, data) {
    const url = 'provider/partner/' + id + '/rejected';
    return this.servicemeta.httpPut(url, data);
  }


  changeInternalStatus(id, status) {
    const url = 'provider/loanapplication/' + id + '/spinternalstatus/' + status;
    return this.servicemeta.httpPut(url, null);
  }


  sendPhoneOTP(data, from) {
    var url = 'provider/loanapplication/generate/phone';
    if (from == 'guarantor') {
      var url = 'provider/loanapplication/generate/guarantor/phone';
    }
    else if (from == 'coapplicant') {
      var url = 'provider/loanapplication/generate/coapplicant/phoneotp';
    }
    else if (from == 'partner') {
      var url = 'provider/partner/generate/phone';
    }
    else if (from == 'equifax') {
      var url = 'provider/equifax/generateotp';
    }
    return this.servicemeta.httpPost(url, data);
  }

  saveBankDetails(data) {
    const url = 'provider/loanapplication/bank';
    return this.servicemeta.httpPost(url, data);
  }

  updateBankDetails(data) {
    const url = 'provider/loanapplication/bank';
    return this.servicemeta.httpPut(url, data);
  }

  savePartnerBankDetails(data) {
    const url = 'provider/partner/bank';
    return this.servicemeta.httpPost(url, data);
  }

  updatePartnerBankDetails(data) {
    const url = 'provider/partner/bank';
    return this.servicemeta.httpPut(url, data);
  }

  verifyPartnerBankDetails(data) {
    const url = 'provider/partner/verify/bank';
    return this.servicemeta.httpPut(url, data);
  }

  verifyBankDetails(data) {
    const url = 'provider/loanapplication/verify/bank';
    return this.servicemeta.httpPut(url, data);
  }

  accountAggregate(id, kycid) {
    const url = 'provider/loanapplication/accountaggregate/' + id + '/' + kycid;
    return this.servicemeta.httpPost(url, null);
  }


  verifyPhoneOTP(otp, data, from) {
    let url = 'provider/loanapplication/verify/' + otp + '/phone';
    if (from == 'guarantor') {
      url = 'provider/loanapplication/verify/' + otp + '/guarantor/phone';
    }
    else if (from == 'coapplicant') {
      url = 'provider/loanapplication/verify/coapplicant/' + otp + '/phoneotp';
    }
    else if (from == 'equifax') {
      url = 'provider/equifax/verifyotp/' + otp;
    }
    return this.servicemeta.httpPost(url, data);
  }

  verifyEquifaxOtp(otp, data) {
    const url = 'provider/equifax/verifyotp/' + otp;
    return this.servicemeta.httpPost(url, data);
  }



  getGraphAnalyticsData(data) {
    const url = 'provider/dashboard';
    return this.servicemeta.httpPut(url, data);
  }

  partnerOtpVerify(otp, data) {
    const url = 'provider/partner/verify/' + otp + '/phone';
    return this.servicemeta.httpPost(url, data);
  }

  sendEmailOTP(data, from) {
    var url = 'provider/loanapplication/generate/email';
    if (from && from == 'partner') {
      var url = 'provider/partner/generate/email';
    }
    else if (from && from == 'coapplicant') {
      var url = 'provider/loanapplication/generate/coapplicant/emailotp';
    }
    return this.servicemeta.httpPost(url, data);
  }

  verifyEmailOTP(otp, from, data?) {
    var url = 'provider/loanapplication/verify/' + otp + '/email';
    if (from && from == 'partner') {
      var url = 'provider/partner/verify/' + otp + '/email';
      return this.servicemeta.httpPost(url, data);
    }
    else if (from && from == 'coapplicant') {
      var url = 'provider/loanapplication/verify/coapplicant/' + otp + '/emailotp';
    }
    return this.servicemeta.httpPost(url, data);
  }

  mafilScoreFields() {
    const url = 'provider/loanapplication/csms/settings';
    return this.servicemeta.httpGet(url, null);
  }

  getAddressRelations() {
    const url = 'provider/loanapplication/addressrelationtype';
    return this.servicemeta.httpGet(url, null);
  }

  updateSalesOfficer(id, data) {
    const url = 'provider/partner/' + id + '/updatesalesofficer';
    return this.servicemeta.httpPut(url, data);
  }

  updateCreditOfficer(id, data) {
    const url = 'provider/partner/' + id + '/updatecreditofficer';
    return this.servicemeta.httpPut(url, data);
  }


  getMafilScore(data) {
    const url = 'provider/loanapplication/csms/generatescore';
    return this.servicemeta.httpPut(url, data);
  }


  getEquifaxScore(data) {
    const url = 'provider/loanapplication/equifaxreport';
    return this.servicemeta.httpPost(url, data);
  }

  getDigitalDocument(id) {
    const url = 'provider/loanapplication/digitaldocument/download/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  getInsuranceDocument(id) {
    const url = 'provider/loanapplication/digitalinsurance/download/' + id;
    return this.servicemeta.httpGet(url, null);
  }

  sendInsuranceDocument(id) {
    const url = 'provider/loanapplication/digitalinsurance/' + id;
    return this.servicemeta.httpPost(url, null);
  }

  sendEnach(id) {
    const url = 'provider/loanapplication/emandate/account/' + id;
    return this.servicemeta.httpPost(url, null);
  }

  getPerfiosScore(data) {
    const url = 'provider/loanapplication/perfios';
    return this.servicemeta.httpPost(url, data);
  }

  getBranches(filter) {
    const url = 'provider/branchmaster';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getDashboardStats() {
    const url = 'provider/dashboard/stats';
    return this.servicemeta.httpGet(url, null);
  }


  getGoogleMapLocationAddress(lat, lon) {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&key=' + projectConstants.GOOGLEAPIKEY + '&sensor=false';
    return this.servicemeta.httpGet(url);
  }


  setFiltersFromPrimeTable(event) {
    let api_filter = {}
    if ((event && event.first) || (event && event.first == 0)) {
      api_filter['from'] = event.first;
    }

    if (event && event.rows) {
      api_filter['count'] = event.rows;
    }

    if (event && event.filters) {
      let filters = event.filters;
      Object.entries(filters).forEach(([key, value]) => {
        if (filters[key]['value'] != null) {
          let filterSuffix = ''
          if (filters[key]['matchMode'] == 'startsWith') {
            filterSuffix = 'startWith';
          }
          else if (filters[key]['matchMode'] == 'contains') {
            filterSuffix = 'like';
          }
          else if (filters[key]['matchMode'] == 'endsWith') {
            filterSuffix = 'endWith';
          }
          else if (filters[key]['matchMode'] == 'equals') {
            filterSuffix = 'eq';
          }
          else if (filters[key]['matchMode'] == 'notEquals') {
            filterSuffix = 'neq';
          }
          else if (filters[key]['matchMode'] == "dateIs") {
            filterSuffix = 'eq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] = moment(dateValue).format('YYYY-MM-DD');
          }
          else if (filters[key]['matchMode'] == "dateIsNot") {
            filterSuffix = 'neq';
            let dateValue = new Date(filters[key]['value']);
            filters[key]['value'] = moment(dateValue).format('YYYY-MM-DD');
          }
          if (filterSuffix != '') {
            api_filter[key + '-' + filterSuffix] = filters[key]['value'];
          }
        }
      });
    }

    if (event && event.sortField) {
      let filterValue;
      if (event.sortOrder && event.sortOrder == 1) {
        filterValue = 'asc';
      }
      else if (event.sortOrder && event.sortOrder == -1) {
        filterValue = 'dsc';
      }
      if (filterValue) {
        api_filter['sort_' + event.sortField] = filterValue;
      }
    }
    return api_filter;
  }


  getCapabilitiesConfig(user) {
    if (user && user.roles && user.roles[0] && user.roles[0].capabilities) {
      console.log("Role Capabilities in Sevice File", user)
      let roleCapabilities = user.roles[0].capabilities;
      let capabilities = {
        'canCreateLoan': roleCapabilities.includes('createLoanApplication'),
        'canUpdateLoan': roleCapabilities.includes('updateLoanApplication'),
        'canViewLoan': roleCapabilities.includes('viewLoanApplication'),
        'canCreatePartner': roleCapabilities.includes('createPartner'),
        'canUpdatePartner': roleCapabilities.includes('updatePartner'),
        'canViewPartner': roleCapabilities.includes('viewPartner'),
        'canViewSchemes': roleCapabilities.includes('viewScheme'),
        'canApprovePartnerLoan': roleCapabilities.includes('verifyPartnerLoanApplication'),
        'canRejectLoan': roleCapabilities.includes('rejectLoanApplication'),
        'canApprovePartner': roleCapabilities.includes('approvePartner'),
        'canApproveLoan': roleCapabilities.includes('approveLoanApplication'),
        'canContactPartner': roleCapabilities.includes('contactPartner'),
        'canActionRequired': roleCapabilities.includes('actionRequired'),
        'canCreditScoreCheck': roleCapabilities.includes('creditScoreCheck'),
        'canAnalyseBankStatement': roleCapabilities.includes('analyseBankStatement'),
        'canGenerateMafilScore': roleCapabilities.includes('generateMafilScore'),
        'canLoanDisbursement': roleCapabilities.includes('loanDisbursement'),
        'canUpdateCreditOfficer': roleCapabilities.includes('updateCreditOfficer'),
        'canUpdateSalesOfficer': roleCapabilities.includes('updateSalesOfficer'),
        'canUpdatePartnerSettings': roleCapabilities.includes('updatePartnerSettings'),
        'canMakePartnerInactive': roleCapabilities.includes('makePartnerInactive'),
        'canCreateLocation': roleCapabilities.includes('createLocation'),
        'canUpdateLocation': roleCapabilities.includes('updateLocation'),
        'canCreateBranch': roleCapabilities.includes('createBranch'),
        'canUpdateBranch': roleCapabilities.includes('updateBranch'),
        'canCreateUser': roleCapabilities.includes('createUser'),
        'canUpdateUser': roleCapabilities.includes('updateUser'),
        'canSuspendPartner': roleCapabilities.includes('suspendPartner'),
        'canDisableUser': roleCapabilities.includes('disableUser'),
        'canDisablePartner': roleCapabilities.includes('disablePartner'),
        'canEnablePartner': roleCapabilities.includes('enablePartner'),
        'canVerification': roleCapabilities.includes('verification'),
        'canCreditVerification': roleCapabilities.includes('creditVerification'),
        'canDocumentVerification': roleCapabilities.includes('documentVerification'),
        'canInvoiceUpdation': roleCapabilities.includes('invoiceUpdation'),
        'canCreateLead': roleCapabilities.includes('createLead'),
        'canUpdateLead': roleCapabilities.includes('updateLead'),
        'canViewLead': roleCapabilities.includes('viewLead'),
        'canTransformLeadtoLoan': roleCapabilities.includes('transformLeadtoLoan'),
        'canLoanApplicationOperationsVerification': roleCapabilities.includes('loanApplicationOperationsVerification'),
        'canViewCustomerPhoneNumber': roleCapabilities.includes('viewCustomerPhoneNumber'),
        'canViewKycReport': roleCapabilities.includes('viewKycReport'),
        'canLoanApplicationBranchVerification': roleCapabilities.includes('loanApplicationBranchVerification')
      }
      return capabilities;
    }
    return null;
  }
}
