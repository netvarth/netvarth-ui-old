import { Injectable } from '@angular/core';
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

  gstVerify(id, data) {
    const url = 'provider/partner/validate/gst/' + id;
    return this.servicemeta.httpPut(url, data);
  }


  getCustomers() {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanTypeList() {
    const url = 'provider/loanapplication/type';
    return this.servicemeta.httpGet(url, null);
  }


  getLoans() {
    const url = 'provider/loanapplication';
    return this.servicemeta.httpGet(url, null);
  }


  getLoansByFilter(filter = {}) {
    const url = 'provider/loanapplication';
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

  getCustomerDetails(filter = {}) {
    const url = 'provider/customers';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getBusinessProfile() {
    const url = 'provider/bProfile';
    return this.servicemeta.httpGet(url, null);
  }


  getLoanProducts() {
    const url = 'provider/loan/products';
    return this.servicemeta.httpGet(url, null);
  }

  getLoanById(id) {
    const url = 'provider/loanapplication/' + id;
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

  redirectLoan(id, data) {
    const url = 'provider/loanapplication/' + id + '/redirect';
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

  getStateByPin(pin) {
    const url = 'provider/account/settings/locations/' + pin;
    return this.servicemeta.httpGet(url, null);
  }




  getDealerById(id) {
    const url = 'provider/partner/' + id;
    return this.servicemeta.httpGet(url, null);
  }



  verifyIds(type, data) {
    const url = 'provider/loanapplication/update/' + type;
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


  getLoanSchemes() {
    const url = 'provider/loan/schemes';
    return this.servicemeta.httpGet(url, null);
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


  suspendDealer(id, data) {
    const url = 'provider/partner/' + id + '/suspended';
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
    if (from == 'partner') {
      var url = 'provider/partner/generate/phone';
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


  verifyPhoneOTP(otp, data) {
    const url = 'provider/loanapplication/verify/' + otp + '/phone';
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
    return this.servicemeta.httpPost(url, data);
  }

  verifyEmailOTP(otp, from, data?) {
    var url = 'provider/loanapplication/verify/' + otp + '/email';
    if (from && from == 'partner') {
      var url = 'provider/partner/verify/' + otp + '/email';
      return this.servicemeta.httpPost(url, data);
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

  getBranches(filter) {
    const url = 'provider/branchmaster';
    return this.servicemeta.httpGet(url, null, filter);
  }

  getDashboardStats() {
    const url = 'provider/dashboard/stats';
    return this.servicemeta.httpGet(url, null);
  }

  getCapabilitiesConfig(user) {
    if (user && user.roles && user.roles[0] && user.roles[0].capabilities) {
      console.log("Role Capabilities in Sevice File", user)
      let roleCapabilities = user.roles[0].capabilities;
      let capabilities = {
        'canCreateLoan': roleCapabilities.includes('createLoan'),
        'canUpdateLoan': roleCapabilities.includes('updateLoan'),
        'canViewLoan': roleCapabilities.includes('viewLoan'),
        'canCreatePartner': roleCapabilities.includes('createPartner'),
        'canUpdatePartner': roleCapabilities.includes('updatePartner'),
        'canViewPartner': roleCapabilities.includes('viewPartner'),
        'canViewSchemes': roleCapabilities.includes('viewScheme'),
        'canApprovePartnerLoan': roleCapabilities.includes('approvePartnerLoan'),
        'canRejectLoan': roleCapabilities.includes('rejectLoan'),
        'canApprovePartner': roleCapabilities.includes('approvePartner'),
        'canApproveLoan': roleCapabilities.includes('approveLoan'),
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
        'canVerification': roleCapabilities.includes('verification'),
        'canCreditVerification': roleCapabilities.includes('creditVerification'),
        'canDocumentVerification': roleCapabilities.includes('documentVerification'),
        'canInvoiceUpdation': roleCapabilities.includes('invoiceUpdation'),
        'canCreateLead': roleCapabilities.includes('createLead'),
        'canUpdateLead': roleCapabilities.includes('updateLead'),
        'canViewLead': roleCapabilities.includes('viewLead'),
        'canTransformLeadtoLoan': roleCapabilities.includes('transformLeadtoLoan')
      }
      return capabilities;
    }
    return null;
  }
}
