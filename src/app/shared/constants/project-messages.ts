export const Messages = {
  'OTP_SENT_EMAIL': 'OTP has been sent to  [your_email]. Please enter your OTP.',
  'OTP_SENT_MOBILE': 'OTP has been sent to [your_mobile]. Please enter your OTP.',
  'PROFILE_UPDATE': 'Profile has been updated successfully',
  'PASSWORD_MISMATCH': 'Password and Re-entered Password do not match',
  'PASSWORD_CHANGED': 'Password has been changed successfully',
  'EMAIL_VERIFIED': 'Your email is verified',
  'PHONE_VERIFIED': 'Your phone number is verified',
  'MEMBER_CREATED': 'Member added successfully',
  'MEMBER_UPDATED': 'Member updated successfully',
  'LICENSE_UPGRADED': 'License Package upgraded successfully',
  'LICENSE_TOOLTIP' : 'This tooltip can be managed from the messages file',
  'ADDON_ADDED': 'Addon Package added successfully',
  'TESTACC_LOGIN_NA': 'Test user cannot view/checkin real providers account details',

  // Items
  'ITEM_CREATED': 'Item created successfully',
  'ITEM_UPDATED': 'Item updated successfully',
  'ITEM_DELETE'  : 'Do you really want to remove the item "[name]"?',
  'ITEM_ENABLE'  : 'Do you really want to change the status to "[status]"?',
  'ITEM_LISTEMPTY' : 'No Items exists',
  'ITEM_IMGREMOVED': 'Image removed successfully',
  'ITEMIMAGE_UPLOADED': 'Image uploaded successfully',

  // Bill Discount
  'DISCOUNT_CREATED' : 'Bill Discount created successfully',
  'DISCOUNT_UPDATED' : 'Bill Discount updated successfully',
  'DISCOUNT_DELETE'  : 'Do you really want to remove the bill discount "[name]"?',
  'DISCOUNT_DELETED' : 'Bill Discount deleted successfully',
  'DISCOUNT_LISTEMPTY' : 'No Bill Discounts exists',

  // Bill Coupons
  'COUPON_CREATED' : 'Bill Coupon created successfully',
  'COUPON_UPDATED' : 'Bill Coupon updated successfully',
  'COUPON_DELETE'  : 'Do you really want to remove the bill coupon "[name]"?',
  'COUPON_DELETED' : 'Bill Coupon deleted successfully',
  'COUPON_LISTEMPTY' : 'No Bill Coupons exists',

  // non working days
  'HOLIDAY_CREATED' : 'Non Working Day created successfully',
  'HOLIDAY_UPDATED' : 'Non Working Day updated successfully',
  'HOLIDAY_DELETE'  : 'Do you really want to remove the Non Working Day "[date]"?',
  'HOLIDAY_STIME'   : 'Start time should be greater than current time',
  'HOLIDAY_ETIME'   : 'Closing time should be greater than Start time',
  'HOLIDAY_LISTEMPTY' : 'No non working days scheduled',

  // Common
  'API_ERROR': 'Jaldee.com is currently experiencing technical difficulties. Please try again later or email us at support@netvarth.com',
  'NETWORK_ERROR': 'Network error. Please check your internet connectivity',

  // Business Profile
  'BPROFILE_CREATED' : 'Business Profile created successfully',
  'BPROFILE_EMAILDET' : 'Please enter the email id and email label',
  'BPROFILE_SELECT_SCHEDULE' : 'Please select the schedule',
  'BPROFILE_PHONEDET' : 'Please enter the phone number and phone label',
  'BPROFILE_PHONENO' : 'Please enter the phone number',
  'BPROFILE_SELECTLOGO' : 'Please select the logo',
  'BPROFILE_ATLEASTONEDAY' : 'Please select atleast one day',
  'BPROFILE_SELECTTIME' : 'Please select the start and end time',
  'BPROFILE_STIMEERROR' : 'End time should be greater than start time',
  'BPROFILE_SCHOVERLAP' : 'Schedule selected for "[day]" overlaps with existing schedule',
  'BPROFILE_SCHADDEDFOR' : 'Schedule added for',
  'BPROFILE_IMAGE_DELETE': 'Deleted successfully',
  'BPROFILE_IMAGE_UPLOAD': 'Uploaded successfully',
  'BPROFILE_SOCIALMEDIA_SAVED': 'Saved successfully',
  'BPROFILE_UPDATED' : 'Business Profile updated successfully',
  'BPROFILE_LOGOUPLOADED' : 'Profile image uploaded successfully',
  'BPROFILE_LOGODELETE_CONF' : 'Remove Profile image?',
  'BPROFILE_LOGODELETED' : 'Profile image deleted successfully',
  'BPROFILE_PRIVACY_SAVED' : 'Privacy details saved successfully',
  'BPROFILE_PRIVACY_PHONELABEL_REQ' : 'Phone label should not be blank',
  'BPROFILE_PRIVACY_PHONE_INVALID' : 'Please enter a valid mobile phone number',
  'BPROFILE_PRIVACY_PHONE_10DIGITS' : 'Mobile number should have 10 digits',
  'BPROFILE_PRIVACY_EMAILLABEL_REQ' : 'Email label should not be blank',
  'BPROFILE_PRIVACY_EMAIL_INVALID' : 'Please enter a valid email id',
  'BPROFILE_SOCIAL_URL_VALID' : 'Please enter a valid URL',
  'BPROFILE_LOCNAME_BLANK': 'Please enter the location name',
  // 'BRPFOLE_SEARCH_TOOLTIP' : 'Public Search demo tool tip message. Please let us know what message you wanted here.',
  'BPROFILE_LANGUAGE_SAVED': 'Languages saved successfully',
  'BPROFILE_SPECIALIZATION_SAVED': 'Specializations saved successfully',
  'BUSINESS_NAME_MAX_LENGTH_MSG': 'Business name can contain only 50 characters',
  'BUSINESS_DESC_MAX_LENGTH_MSG': 'Business description can contain only 400 characters',


  // Adwords
  'ADWORD_LISTEMPTY' : 'No adwords exists',
  'ADWORD_CREATED' : 'Adword created successfully',
  'ADWORD_DELETE'  : 'Do you really want to remove the Adword "[adword]"?',
  'ADWORD_DELETE_SUCCESS'  : 'Adword deleted successfully',
  'ADWORD_EXCEED_LIMIT' : 'You are not allowed to do operation because it exceeds limit. You can upgrade license package/addon for more benefits',

  // WaitlistManager
  'ONLINE_CHECKIN_SAVED' : 'Saved successfully',
  'SERVICE_UPDATED': 'Service updated successfully',
  'SERVICE_ADDED1' : 'New service added successfully',
  'SERVICE_ADDED2' : 'Please add this service to the relevant service time window by editing it.',
  'SERVICE_IMAGE_DELETED': 'Service image deleted successfully',
  'SERVICE_IMAGE_UPLOADED': 'Service image(s) uploaded successfully',
  'SERVICE_PRE_PAY_ERROR': 'Payment settings needs to be completed before enabling the Pre-Payment option',
  'SERVICE_TAX_ZERO_ERROR': 'Tax settings need to be completed for tax to be applicable',
  'WAITLIST_LOCATION_CREATED': 'Location created successfully',
  'WAITLIST_LOCATION_UPDATED': 'Location updated successfully',
  'WAITLIST_LOCATION_AMINITIES_SAVED': 'Location amenities saved successfully',
  'WAITLIST_LOCATION_CHG_STATLOCATION': '[locname] [status] successfully',
  'WAITLIST_LOCATION_CHG_BASELOCATION': 'Base location changed to [locname]',
  'WAITLIST_QUEUE_CREATED': 'Service Time Window created successfully',
  'WAITLIST_QUEUE_UPDATED': 'Service Time Window updated successfully',
  'WAITLIST_QUEUE_SELECTTIME' : 'Please select the start and end time',
  'WAITLIST_QUEUE_STIMEERROR' : 'End time should be greater than start time',
  'WAITLIST_QUEUE_CHG_STAT': '[qname] [status] successfully',
  'WAITLIST_SERVICE_CHG_STAT': '[sername] [status] successfully',
  'NEW_SERVICE_TOOLTIP': 'Please add this service to the relevant service time window by editing it',
  // Inbox
  'MESSAGE_SENT': 'Message sent successfully',

  // Dashboard

  'ADD_DELAY': 'New delay added successfully',
  'ADD_PROVIDER_CUSTOMER_WAITLIST': 'Wailist added successfully',
  'WAITLIST_STATUS_CHANGE': 'Waitlist status changed to [status]',
  'PROVIDER_NOTE_ADD': 'Note added successfully',
  'CONSUMERTOPROVIDER_NOTE_ADD': 'Message send successfully',
  'PROVIDERTOCONSUMER_NOTE_ADD': 'Message send successfully',
  'ESTDATE' : 'Estimated Service time',

  'SEARCH_ESTIMATE_TOOPTIP' : 'Estimated Waiting Time',
  'CUSTOMER_SEARCH_EXIST': 'This [customer] already exist',
  'CUSTOMER_SEARCH_UNAVAILABLE': 'This [customer] doesnt exist',
  'PROVIDER_CUSTOMER_CREATED': 'New [customer] created',
  // Payment Setting
  'PAYSETTING_SAV_SUCC': 'Payment settings saved successfully',
  'PAYSETTING_SAV_PAYSTATUS': 'Payment Status updated successfully',
  'PAYSETTING_BLANKNUM' : 'Mobile number required',
  'PAYSETTING_ONLYNUM': 'Only numbers are allowed in mobile field',
  'PAYSETTING_MOB10': 'Mobile number should have 10 digits',
  'PAYSETTING_PAN': 'Pan number is required',
  'PAYSETTING_PANPHANUMERIC' : 'Pan number should not contain special characters',
  'PAYSETTING_ACCNO': 'Account number is required',
  'PAYSETTING_ACCNO_NUMONLY': 'Only numbers are allowed for account number',
  'PAYSETTING_BANKNAME': 'Bank name is required',
  'PAYSETTING_IFSC': 'IFSC code is required',
  'PAYSETTING_PANNAME': 'Name on pancard is required',
  'PAYSETTING_CHARONLY': 'Name can contain only alphabets',
  'PAYSETTING_ACMNAME': 'Account holder Name is required',
  'PAYSETTING_BRANCH': 'Branch is required',
  'PAYSETTING_FILING': 'Filing status is required',
  'PAYSETTING_ACTYPE': 'Account type is required',
  'PAYSETTING_TAXPER': 'Please enter a valid tax percentage',
  'PAYSETTING_GSTNUM': 'Please enter the GST number',
  'PAYSETTING_SAV_TAXPER': 'Tax details updated successfully',
  'PAYSETTING_CONTACTADMIN': 'Contact Administrator to verify your payment modes',
  'PAYSETTING_MAXLEN': 'Only [maxlen] characters are allowed',
  'PAYSETTING_PANMAXLEN10': 'Pancard should contain only 10 characters',
  'PAYSETTING_IFSCMAXLEN11': 'IFSC code should contain only 11 characters',
  'PAYSETTING_IFSCALPHANUMERIC' : 'IFSC code should not contain special characters',
  // Provider Bill

  'PROVIDER_BILL_CREATE' : 'Bill created successfully',
  'PROVIDER_BILL_UPDATE' : 'Bill updated successfully',
  'PROVIDER_BILL_SETTLE' : 'Bill settled successfully',
  'PROVIDER_BILL_SERV_EXISTS' : 'Service already exists in the bill',
  'PROVIDER_BILL_EMAIL' : 'Bill emailed successfully',
  'PROVIDER_BILL_PAYMENT': 'Payment completed successfully',
  'PROVIDER_BILL_PAYMENT_SELFPAY': ' An email and push notification will be send to the consumer',
  'PROVIDER_BILL_SETTLE_CONFIRM': 'Do you want to settle this bill?',
  'PROVIDER_ALERT_ACK_SUCC' : 'Acknowledge Successfull',
  'CHECKIN_SUCC': 'You have [waitlisted] successfully',
  'CHECKIN_SUCC_REDIRECT': 'Please wait ... You are being redirected to the Payment Gateway ...',
  'CHECKIN_ERROR': 'Sorry! an error occured',
  'CHECKIN_CANCELLED' : '[waitlist] [cancelled] successfully',
  'PAYMENT_REDIRECT': 'Please wait ... You are being redirected to the Payment Gateway ...',


  // Consumer Dashboard

  'SERVICE_RATE_UPDATE': 'Thank you for your feedback',
  'Manage_Privacy': 'Manage privacy changed successfully',

    // Dynamic Field
  'YEAR_MONTH_VALID' : 'Future date not allowed',

  // Tooltips given by YNW
  'ADJUSTDELAY_TOOPTIP' : 'Set delay in working hours anytime',
  'INBOXICON_TOOPTIP': 'Messages',
  'FILTERICON_TOOPTIP': 'Use filters to find specific data',
  'BRPFOLE_SEARCH_TOOLTIP': 'Set up your profile here',
  'WAITLIST_TOOLTIP': 'Manage working hours and waitlist',
  'LINCENSE_TOOLTIP' : 'View and change your license package',
  'PAYMENT_TOOLTIP' : 'View and edit online payment setings and tax settings',
  'BILLPOS_TOOLTIP' : 'Add items, discounts, coupons',
  'ADDON_TOOLTIP' : 'Buy available add-ons',
  'ADDWORD_TOOLTIP' : 'Buy adwords here',
  'MOREOPTIONS_TOOLTIP' : 'More Search Options',
  'CURRENTCHECKINS_TOOLTIP' : 'Your check-ins',
  'FAVORITE_TOOLTIP' : 'Your favourite providers',
  'HISTORY_TOOLTIP' : 'Your past check-ins',
  'COMM_TOOPTIP' : 'Send messages to your provider here',
  'REF_TOOPTIP' : 'Show/hide refined search',
  'CUSTSIGN_TOOPTIP' : 'Consumers click here to Login/Join Jaldee.com',
  'PROVSIGN_TOOPTIP' : 'Providers please click here to Register/Login to Jaldee.com',
  'CLOUDICON_TOOPTIP': 'Online Check-in',
  'ITEMNAME_TOOLTIP': 'Click here to edit item',
  'QUEUENAME_TOOLTIP': 'Click here to edit the Service Time Window',

  'ADJUSTDELAY_PLACEHOLDER': 'Default message will be send with adjust delay time or you can type your own message here',


  'EST_WAIT_TIME_CAPTION' : 'Est Wait Time',
  'NXT_AVAILABLE_TIME_CAPTION' : 'Next Available Time',
  'APPX_WAIT_TIME_CAPTION' : 'Appox Waiting Time',

  'ESTIMATED_TIME_SMALL_CAPTION': 'Est Wait Time',
  'CHECKIN_TIME_CAPTION': 'Est Service Time',

  'PREPAYMENT_ERROR': 'Sorry! an error occured'

};
