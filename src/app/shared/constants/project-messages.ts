export const Messages = {
  // 'OTP_SENT_EMAIL': 'OTP has been sent to  [your_email]. Please enter your OTP.',
  'OTP_SENT_EMAIL': 'Enter the OTP sent to [your_email]',
  'OTP_SENT_MOBILE': 'OTP has been sent to [your_mobile]. Please enter your OTP.',
  'OTP_SENT_LABEL' : 'Enter the OTP sent to [your_mobile]',
  'PROFILE_UPDATE': 'Profile has been updated successfully',
  'PASSWORD_MISMATCH': 'Password and Re-entered Password do not match',
  'PASSWORD_CHANGED': 'Password has been changed successfully',
  'EMAIL_VERIFIED': 'Your email has been verified',
  'PHONE_VERIFIED': 'Your phone number has been verified',
  'MEMBER_CREATED': 'Member added successfully',
  'MEMBER_UPDATED': 'Member updated successfully',
  'LICENSE_UPGRADED': 'License successfully upgraded to [package]',
  'LICENSE_TOOLTIP': 'This tooltip can be managed from the messages file',
  'ADDON_ADDED': 'Add-on Package added successfully',
  'TESTACC_LOGIN_NA': 'Test user cannot view/checkin real providers account details',

  // Items
  'ITEM_CREATED': 'Item added successfully',
  'ITEM_UPDATED': 'Item updated successfully',
  'ITEM_DELETE': 'Do you really want to remove the item "[name]"?',
  'ITEM_ENABLE': 'Do you really want to change the status to "[status]"?',
  'ITEM_LISTEMPTY': 'No Items exists',
  'ITEM_IMGREMOVED': 'Image removed successfully',
  'ITEMIMAGE_UPLOADED': 'Image uploaded successfully',

  // Bill Discount
  'DISCOUNT_CREATED': 'Discount created successfully',
  'DISCOUNT_UPDATED': 'Discount updated successfully',
  'DISCOUNT_DELETE': 'Do you really want to remove the discount "[name]"?',
  'DISCOUNT_DELETED': 'Discount deleted successfully',
  'DISCOUNT_LISTEMPTY': 'No Discounts exists',

  // Bill Coupons
  'COUPON_CREATED': 'Coupon created successfully',
  'COUPON_UPDATED': 'Coupon updated successfully',
  'COUPON_DELETE': 'Do you really want to remove the coupon "[name]"?',
  'COUPON_DELETED': 'Coupon deleted successfully',
  'COUPON_LISTEMPTY': 'No Coupons exists',

  // non working days
  'HOLIDAY_CREATED': 'Non Working Day created successfully',
  'HOLIDAY_UPDATED': 'Non Working Day updated successfully',
  'HOLIDAY_DELETE': 'Do you really want to remove the Non Working Day "[date]"?',
  'HOLIDAY_STIME': 'Start time should be greater than current time',
  'HOLIDAY_ETIME': 'Closing time should be greater than Start time',
  'HOLIDAY_LISTEMPTY': 'No scheduled holidays',

  // Common
  'API_ERROR': 'Jaldee.com is currently experiencing technical difficulties. Please try again later or email us at support@netvarth.com',
  'NETWORK_ERROR': 'Network error. Please check your internet connectivity',

  // Business Profile
  'BPROFILE_CREATED': 'Business Profile created successfully',
  'BPROFILE_EMAILDET': 'Please enter the email id and email label',
  'BPROFILE_SELECT_SCHEDULE': 'Please select the schedule',
  'BPROFILE_PHONEDET': 'Please enter the phone number and phone label',
  'BPROFILE_PHONENO': 'Please enter the phone number',
  'BPROFILE_SELECTLOGO': 'Please select the logo',
  'BPROFILE_ATLEASTONEDAY': 'Please select atleast one day',
  'BPROFILE_SELECTTIME': 'Please select the start and end time',
  'BPROFILE_STIMEERROR': 'End time should be greater than start time',
  'BPROFILE_SCHOVERLAP': 'Schedule overlaps with existing schedule',
  'BPROFILE_SCHADDEDFOR': 'Schedule added for',
  'BPROFILE_IMAGE_DELETE': 'Deleted successfully',
  'BPROFILE_IMAGE_UPLOAD': 'Uploaded successfully',
  'BPROFILE_SOCIALMEDIA_SAVED': 'Social media link added successfully',
  'BPROFILE_UPDATED': 'Business Profile updated successfully',
  'BPROFILE_LOGOUPLOADED': 'Profile image uploaded successfully',
  'BPROFILE_LOGODELETE_CONF': 'Remove Profile image?',
  'BPROFILE_LOGODELETED': 'Profile image deleted successfully',
  'BPROFILE_PRIVACY_SAVED': 'Privacy details saved successfully',
  'BPROFILE_PRIVACY_PHONELABEL_REQ': 'Phone label should not be blank',
  'BPROFILE_PRIVACY_PHONE_INVALID': 'Please enter a valid mobile phone number',
  'BPROFILE_PRIVACY_PHONE_10DIGITS': 'Mobile number should have 10 digits',
  'BPROFILE_PRIVACY_EMAILLABEL_REQ': 'Email label should not be blank',
  'BPROFILE_PRIVACY_PHONE_DELETE' : 'Do you really want to remove the Phone no "[DATA]" and its details?',
  'BPROFILE_PRIVACY_EMAIL_DELETE' : 'Do you really want to remove the Email id "[DATA]" and its details?',
  'BPROFILE_PRIVACY_EMAIL_INVALID': 'Please enter a valid email id',
  'BPROFILE_SOCIAL_URL_VALID': 'Please enter a valid URL',
  'BPROFILE_LOCNAME_BLANK': 'Please enter the location name',
  // 'BRPFOLE_SEARCH_TOOLTIP' : 'Public Search demo tool tip message. Please let us know what message you wanted here.',
  'BPROFILE_LANGUAGE_SAVED': 'Saved successfully',
  'BPROFILE_SPECIALIZATION_SAVED': 'Specializations saved successfully',
  'BUSINESS_NAME_MAX_LENGTH_MSG': 'Business name can contain only 50 characters',
  'BUSINESS_DESC_MAX_LENGTH_MSG': 'Business description can contain only 400 characters',

  // Adwords
  'ADWORD_LISTEMPTY': 'No AdWords exists',
  'ADWORD_CREATED': 'Adword added successfully',
  'ADWORD_DELETE': 'Do you really want to remove the AdWord [adword]?',
  'ADWORD_DELETE_SUCCESS': 'AdWord deleted successfully',
  'ADWORD_EXCEED_LIMIT': 'You are not allowed to do operation because it exceeds limit. You can upgrade license package/Add-on for more benefits',

  // WaitlistManager
  'ONLINE_CHECKIN_SAVED': 'Waitlist settings saved successfully',
  'SERVICE_UPDATED': 'Service updated successfully',
  'SERVICE_ADDED1': 'New service added successfully',
  'SERVICE_ADDED2': 'Please add this service to the relevant working hours by editing it.',
  'SERVICE_IMAGE_DELETED': 'Service image deleted successfully',
  'SERVICE_IMAGE_UPLOADED': 'Service image(s) uploaded successfully',
  'SERVICE_PRE_PAY_ERROR': 'Payment settings needs to be completed before enabling the Pre-Payment option',
  'SERVICE_TAX_ZERO_ERROR': 'Tax settings need to be completed for tax to be applicable',
  'WAITLIST_LOCATION_CREATED': 'Location created successfully',
  'WAITLIST_LOCATION_UPDATED': 'Location updated successfully',
  'WAITLIST_LOCATION_AMINITIES_SAVED': 'Location amenities saved successfully',
  'WAITLIST_LOCATION_CHG_STATLOCATION': 'Location "[locname]" has been [status] successfully',
  'WAITLIST_LOCATION_CHG_BASELOCATION': 'Base location changed to [locname]',
  'WAITLIST_QUEUE_CREATED': 'Working Hours created successfully',
  'WAITLIST_QUEUE_UPDATED': 'Working Hours updated successfully',
  'WAITLIST_QUEUE_SELECTTIME': 'Please select the start and end time',
  'WAITLIST_QUEUE_STIMEERROR': 'End time should be greater than start time',
  'WAITLIST_QUEUE_CHG_STAT': '[qname] [status] successfully',
  'WAITLIST_SERVICE_CHG_STAT': '[sername] [status] successfully',
  'NEW_SERVICE_TOOLTIP': 'Please add this service to the relevant working hours by editing it',
  'WAITLIST_TURNTIME_INVALID': 'Please enter a valid waiting time',
  // Inbox
  'MESSAGE_SENT': 'Message sent successfully',

  // Dashboard
  'ADD_DELAY': 'Delay has been notified to your [customer]',
  'ADD_DELAY_TIME_ERROR': 'Please specify the delay',
  'ADD_PROVIDER_CUSTOMER_WAITLIST': 'Wailist added successfully',
  'WAITLIST_STATUS_CHANGE': '[waitlist] status changed to [status]',
  'PROVIDER_NOTE_ADD': 'Note added successfully',
  'CONSUMERTOPROVIDER_NOTE_ADD': 'Message has been successfully sent',
  'PROVIDERTOCONSUMER_NOTE_ADD': 'Message has been successfully sent',
  'MSG_ERROR': 'Please enter the message',
  'ESTDATE': 'Estimated Service time',
  'SEARCH_ESTIMATE_TOOPTIP': 'Estimated Waiting Time',
  'CUSTOMER_SEARCH_EXIST': 'This [customer] already exist',
  'CUSTOMER_SEARCH_UNAVAILABLE': 'This [customer] doesnt exist',
  'PROVIDER_CUSTOMER_CREATED': 'New [customer] created',

  // Payment Setting
  'PAYSETTING_SAV_SUCC': 'Payment settings saved successfully',
  'PAYSETTING_SAV_PAYSTATUS': 'Payment Status updated successfully',
  'PAYSETTING_BLANKNUM': 'Mobile number required',
  'PAYSETTING_BLANKMID': 'Merchant Id required',
  'PAYSETTING_BLANKMKEY': 'Merchant Key required',
  'PAYSETTING_ONLYNUM': 'Only numbers are allowed in mobile field',
  'PAYSETTING_MOB10': 'Mobile number should have 10 digits',
  'PAYSETTING_PAN': 'Pan number is required',
  'PAYSETTING_PANPHANUMERIC': 'Pan number should not contain special characters',
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
  'PAYSETTING_IFSCALPHANUMERIC': 'IFSC code should not contain special characters',

  // Provider Bill
  'PROVIDER_BILL_CREATE': 'Bill created successfully',
  'PROVIDER_BILL_UPDATE': 'Bill updated successfully',
  'PROVIDER_BILL_SETTLE': 'Bill settled successfully',
  'PROVIDER_BILL_SERV_EXISTS': 'Service already exists in the bill',
  'PROVIDER_BILL_EMAIL': 'Bill emailed successfully',
  'PROVIDER_BILL_PAYMENT': 'Payment completed successfully',
  'PROVIDER_BILL_PAYMENT_SELFPAY': ' An email and push notification has been sent to the consumer',
  'PROVIDER_BILL_SETTLE_CONFIRM': 'Do you want to settle this bill?',
  'PROVIDER_ALERT_ACK_SUCC': 'Acknowledged Successfully',
  'CHECKIN_SUCC': 'You have [waitlisted] successfully',
  'CHECKIN_SUCC_REDIRECT': 'Please wait ... You are being redirected to the Payment Gateway ...',
  'CHECKIN_ERROR': 'Sorry! an error occured',
  'CHECKIN_CANCELLED': '[waitlist] [cancelled] successfully',
  'PAYMENT_REDIRECT': 'Please wait ... You are being redirected to the Payment Gateway ...',
  'CASH_PAYMENT': 'Visit provider to pay by cash',


  // Consumer Dashboard
  'SERVICE_RATE_UPDATE': 'Thank you for your feedback',
  'Manage_Privacy': 'Manage privacy changed successfully',
  'DASHBOARD_PREPAY_MSG': 'Click "Make Payment" button in 15 minutes to complete your check-in',

  // Dynamic Field
  'YEAR_MONTH_VALID': 'Future date not allowed',

  // Tooltips given by YNW
  'ADJUSTDELAY_TOOPTIP': 'Set delay in working hours anytime',
  'INBOXICON_TOOPTIP': 'Messages',
  'FILTERICON_TOOPTIP': 'Use filters to find specific data',
  'FILTERICON_CLEARTOOLTIP': 'Clear filtered data',
  'BRPFOLE_SEARCH_TOOLTIP': 'Set up your profile here',
  'WAITLIST_TOOLTIP': 'Manage working hours and waitlist',
  'LINCENSE_TOOLTIP': 'View and change your license package',
  'PAYMENT_TOOLTIP': 'View and edit online payment setings and tax settings',
  'BILLPOS_TOOLTIP': 'Add items, discounts, coupons',
  'ADDON_TOOLTIP': 'Buy available Add-ons',
  'ADDWORD_TOOLTIP': 'Buy AdWords here',
  'MOREOPTIONS_TOOLTIP': 'More Search Options',
  'CURRENTCHECKINS_TOOLTIP': 'Your check-ins',
  'FAVORITE_TOOLTIP': 'Your favourite providers',
  'HISTORY_TOOLTIP': 'Your past check-ins',
  'COMM_TOOPTIP': 'Send messages to your provider here',
  'REF_TOOPTIP': 'Show/hide refined search',
  'CUSTSIGN_TOOPTIP': 'Consumers click here to Login/Join Jaldee.com',
  'PROVSIGN_TOOPTIP': 'Providers please click here to Register/Login to Jaldee.com',
  'CLOUDICON_TOOPTIP': 'Online Check-in',
  'ITEMNAME_TOOLTIP': 'Click here to edit item',
  'QUEUENAME_TOOLTIP': 'Click here to edit the Working Hours',
  'ADJUSTDELAY_PLACEHOLDER': 'Default message will be send with adjust delay time or you can type your own message here',
  'EST_WAIT_TIME_CAPTION': 'Est Wait Time',
  'NXT_AVAILABLE_TIME_CAPTION': 'Next Available Time',
  'APPX_WAIT_TIME_CAPTION': 'Appox Waiting Time',
  'ESTIMATED_TIME_SMALL_CAPTION': 'Est Wait Time',
  'CHECKIN_TIME_CAPTION': 'Est Service Time',
  'PREPAYMENT_ERROR': 'Sorry! Please try again.',
  'FUTURE_NO_CHECKINS': 'No future [waitlist]s',

  // General
  'SAVE_BTN': 'Save',
  'CANCEL_BTN': 'Cancel',
  'UPDATE_BTN': 'Update',
  'EDIT_BTN': 'Edit',
  'DELETE_BTN': 'Delete',
  'SEND_BTN': 'Send',
  'OK_BTN': 'Ok',
  'CLOSE_BTN': 'Close',
  'DONE_BTN': 'Complete',
  'SAVE_MEMBER_BTN': 'Save Member',
  'RESEND_BTN': 'Resend',

  // Consumer Constants

  // Breadcrumbs
  'LEARN_MORE_CAP': 'Learn More',

  // Reveal Phone No
  'MANAGE_PRIVACY': 'Manage Privacy',
  'REVEAL_PHNO': 'Reveal Phone number',

  // Family Member
  'FAMILY_MEMBERS': 'Family Members',
  'MEMBER_CAPTION': 'Member',
  'PHONE_DIGIT_VAL_MSG': 'Enter a 10 digit mobile number',
  'PHONE_NUM_VAL_MSG': 'Phone number should have only numbers',
  'LASTNAME_INVAL_MSG': 'Please enter a valid last name',
  'FIRSTNAME_INVAL_MSG': 'Please enter a valid first name',
  'ADD_FAMILY_MEMBER': 'Add Family Member',
  'FIRST_NAME_CAP': 'First Name',
  'LAST_NAME_CAP': 'Last Name',
  'MOBILE_NUMBER_CAP': 'Mobile #',
  'GENDER_CAP': 'Gender',
  'DOB_CAP': 'Date of Birth',

  // Consumer Account Settings
  'RELATED_LINKS': 'Related Links',
  'USER_PROF_CAP': 'My Account',
  'CHANGE_PASSWORD_CAP': 'Change Password',
  'CHANGE_MOB_CAP': 'Change Mobile #',
  'ADD_CHANGE_EMAIL': 'Update Email',

  // Dashboard
  // Active Checkins
  'ACTIVE_CHECKINS_CAP': 'Active Checkins',
  'SEND_MSG_CAP': 'Send Message',
  'NO_CHECKINS_CAP': 'No current Check-Ins available',
  'MAKE_PAYMENT_CAP': 'Make Payment',
  'TOKEN_NO': 'Token Number',
  'PERSONS_AHEAD': 'Persons Ahead',
  'PARTY_SIZE': 'Party Size',
  'STATUS_CANCELLED': 'Cancelled',
  'STATUS_STARTED': 'Started',
  'STATUS_DONE': 'Completed',
  'ADD_TO_FAV': 'Add to Favourites',
  'CANCEL_CHECKIN': 'Cancel Check-in',
  'BILL_CAPTION': 'Bill',
  'RATE_VISIT': 'Rate Your Visit',

  // Favourite Checkins
  'MY_FAV_CAP': 'My Favourites',
  'VIEW_CAP': 'View',
  'REMOVE_FAV': 'Remove Favourite',

  'OPEN_NOW_CAP': 'Open Now',

  // Do You Want To Checkin For Different Date
  'DO_YOU_WANT_TO_CAP': 'Do you want to',
  'CHECKIN_CAP': 'Check-in',
  'FOR_CAP': 'for',
  'DIFFERENT_DATE_CAP': 'different Date?',
  'YOU_HAVENT_ADDED_CAP': 'You havent added any favourite providers',

  // History
  'HISTORY_CAP': 'History',

  // Consumer-Waitlist
  'CHECKIN_DET_CAP': 'Check-In Details',
  'BUSS_NAME_CAP': 'Bussiness Name:',
  'DATE_CAP': 'Date:',
  'LOCATION_CAP': 'Location',
  'WAITLIST_FOR_CAP': 'Waitlist For:',
  'SERVICE_CAP': 'Service:',
  'SER_TIME_WINDOW_CAP': 'Working Hours:',
  'PAY_STATUS_CAP': 'Payment Status:',
  'NOT_PAID_CAP': 'Not Paid',
  'PARTIALLY_PAID_CAP': 'Partially Paid',
  'PAID_CAP': 'Paid',
  'COMMU_HISTORY_CAP': 'Communication History',

  // kiosk
  'WELCOME_CAP': 'Welcome',
  'CHECKIN_YOURSELF_CAP': 'Check-In Yourself',
  'CHECKIN_ONLINE_CAP': 'Checked-In Online?',
  'CHECK_YOUR_STATUS_CAP': 'Check your Status / ',
  'REP_AS_ARRIVED_CAP': 'Report As Arrived',
  'DO_YOU_WANT_TO_SIGNUP_CAP': 'Do you want to Sign Up?',
  'MARKETING_TEXT': 'This is the test marketing content. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus adipisci perspiciatis magni quae voluptatibus delectus, laudantium voluptate officia eligendi ducimus.',
  'ENTER_YOUR_CAP': 'Enter Your',
  'ENTER_FIR_LETTERS_CAP': 'Enter first 3 letters of your',
  'FIR_LAS_NAME_CAP': 'First/Last Name',
  'SEARCH_CAP': 'Search',
  'OOPS_CAP': 'Oops!!',
  'LOOKS_NOT_REG_CUS_CAP': 'Looks like you\'re not a registered customer.',
  'FILL_YOUR_DET_CAP': 'Please fill in your details to Register',
  'REGISTER_CAP': 'Register',
  'BACK_TO_SEARCH_CAP': 'Back to Search',
  'HOME_CAP': 'Home',
  'EXIT_CAP': 'Exit',
  'SORRY_NOT_AUTH_TO_VIEW_PAGE': 'Sorry you are not authorized to view this page.',
  // Kiosk-Lookup
  'NO_CHECKINS_EXISTS_CAP': 'Sorry no Check-In exists',
  // Kiosk-report as arrived
  'TOKEN_CAP': 'Token:',
  'PERS_AHEAD': 'Persons Ahead:',
  'NAME_CAP': 'Name:',
  'STATUS_CAP': 'Status:',
  'CONFIRM_ARRIVAL_CAP': 'Confirm Arrival',

  // App-shared-components-consumer rate service popup
  'RATE_YOU_VISIT': 'Rate Your Visit',
  'RATING_CAP': 'Rate *',
  'MESSAGE_CAP': 'Message',
  'RATE_BTN_CAP': 'Rate',

  // App-shared-components-consumer
  'BACK_TO_CAP': 'Back to',
  'PROVIDER_DETAILS_CAP': 'Provider Details',

  // App-shared-components-existing checkin
  'YOUR_CAP': 'Your',
  'AT_CAP': 'at',
  'SCHEDULED_ON_CAP': 'Scheduled on',
  'MIN_CAP': 'Min(s)',
  'NO_CAP': 'No',
  'EXISTS_AT': 'exists at',

  // App-shared-components-Forgot Password
  'FORGOT_PASSWORD_CAP': 'Forgot Password',
  'BACK_TO_LOGIN_CAP': 'Back To Login',

  // App-shared-components-login
  'MOB_NO_PREFIX_CAP': '+91',
  'PASSWORD_CAP': 'Password',
  'LOGIN_CAP': 'Login',
  'FORGOT_PASS_CAP': 'Forgot Password?',
  'NEW_USER_CAP': 'New User?',
  'SIGNUP_HERE_CAP': 'Signup here',

  // App-shared-components-provider-details
  'GO_BACK_CAP': 'Go Back',
  'MORE_CAP': ' More',
  'LESS_CAP': ' Less',
  'CONTACT_DETAILS_CAP': 'Contact Details',
  'REM_FROM_FAV_CAP': 'Remove From Favourites',
  'YOU_HAVE_CAP': 'You have',
  'AT_THIS_LOC_CAP': 'at this location',
  'GET_DIRECTIONS_CAP': 'Get Directions',
  'WORKING_HRS_CAP': 'Working Hours',
  'SERV_OFFERED_CAP': 'Services Offered',
  'COUPONS_OFFERED_CAP': 'Coupons Offered',
  'SERVPRICE_CAP': 'Price ',

  // App-shared-components-return-payment
  'PAY_DONE_SUCCESS_CAP': 'Your payment has done successfully!',
  'GO_BACK_HOME_CAP': 'Go Back to home',
  'PAY_FAILED_CAP': 'Your payment has failed!',

  // App-shared-components-search-details
  'REFINE_SEARCH_CAP': 'Refine Search',
  'SELECT_DOMAIN_CAP': 'Select Domain',
  'SELECT_SUBDOMAIN_CAP': 'Select Subdomain',
  'SELECT_CAP': '-- Select --',
  'SHOW_MORE_CAP': 'show more',
  'SHOW_LESS_CAP': 'show less',
  'OTHER_FILTERS_CAP': 'Other Filters',
  'FOUND_CAP': 'found',
  'NONE_CAP': 'Sort By',
  'DISTANCE_CAP': 'Distance',
  'JALDEE_VERIFIED_CAP': 'Jaldee Verified',
  'BASIC_CAP': 'Basic',
  'BASIC_PLUS_CAP': 'Basic Plus',
  'PREMIUM_CAP': 'Premium',
  'CLAIM_BUSINESS_CAP': 'Claim my Business',
  'SORRY_CAP': 'Sorry !! Online ',
  'NOT_ALLOWED_CAP': ' is currently not allowed',
  'NO_YNW_RES_FOUND_CAP': 'No YNW results found',

  // App-shared-components-search-service-detail
  'DURATION_CAP': 'Duration:',
  'PRICE_CAP': 'Price:',
  'PREPAYMENT_AMOUNT_CAP': 'Prepayment Amount:',
  'DESCRIPTION_CAP': 'Description',

  // App-shared-components-set-password-form
  'NEW_PASSWORD_CAP': 'New Password *',
  'PASSWORD_VALID_CAP': 'Atleast one uppercase, one number and minimum 8 characters',
  'RE_ENTER_PASSWORD_CAP': 'Re-enter Password *',
  'SUBMIT_CAP': 'Submit',

  // App-shared-components-signup
  'MOBILE_NO_CAP': 'Mobile Number *',
  'F_NAME_CAP': 'First Name *',
  'L_NAME_CAP': 'Last Name *',
  'SELECT_DMN_CAP': 'Select Domain *',
  'SELECT_SB_DMN_CAP': 'Select Subdomain *',
  'LIC_PACKAGE_CAP': 'License Package *',
  'I_AGREE_CAP': 'I Agree',
  'TERMS_CONDITIONS_CAP': 'Terms & Conditions',
  'SIGN_UP_CAP': 'Sign Up',

  // App-shared-modules-add-member
  'FILL_FOLL_DETAILS_CAP': 'Please fill in the following details',
  'MALE_CAP': 'Male',
  'FEMALE_CAP': 'Female',

  // App-shared-modules-change email
  'EMAIL_CAP': 'Email',
  'VERIFIED_CAP': 'Verified',

  // App-shared-modules-change-mobile
  'MOBILE_CAP': 'Mobile #',

  // App-shared-modules-change-password
  'OLD_PASSWORD_CAP': 'Old Password *',

  // App-shared-modules-checkin-checkin-inner
  'SELECT_SER_CAP': 'Select Service',
  'NO_SER_AVAIL_CAP': 'No services available.',
  'ADD_CHANGE_MEMBER': 'Add / Change Member',
  'SERV_TIME_WINDOW_CAP': 'Working Hours',
  'ENTER_PARTY_SIZE': 'Enter Party Size',
  'HAVE_NOTE_CLICK_HERE_CAP': 'If you have a note, Click here.',
  'NOT_ACCEPTED_THIS_DATE_CAP': ' for this service is not accepted today.',
  'NEEDS_PREPAYMENT_FOR_CAP': 'This service needs prepayment for',
  'PRE_PAYMENT_AMNT_CAP': 'Pre Payment Amount:',
  'NO_PAY_MODES_AVAIL_CAP': 'Sorry no payment modes available',
  'APPLY_CAP': 'Apply',
  'SELECT_THE_CAP': 'Select the',
  'MEMBERS_CAP': 'members',
  'FOR_WHOM_CAP': 'for whom the',
  'IS_BEING_MADE_CAP': 'is being made',
  'ADD_MEMBER_CAP': 'Add Member',
  'TODAY_CAP': 'Today,',

  // App-shared-modules-consumer-checkin-history-list
  'SERV_PROVIDER_CAP': 'Service Provider',
  'DATE_COL_CAP': 'Date',
  'NO_PREV_CHECKINS_AVAIL_CAP': 'No previous Check-Ins available',

  // App-shared-modules-consumer-waitlist-checkin-payment
  'BILL_PAYMENT_CAP': 'Bill Payment',
  'COUPON_CODE_CAP': 'Coupon Code',
  'AMNT_TO_PAY_CAP': 'Amount to pay',
  'NO_PAY_OPT_AVIL_CAP': 'No payment options available.',

  // App-shared-modules-edit-profile
  'EDIT_PHONE_NO_CAP': 'Use "Change Mobile" option to edit the Phone number',
  'CHANGE_EMAIL_CAP': 'Use "Update Email" option to edit the Email Id',
  'PHONE_NO_CAP': 'Phone Number',
  'EMAIL_ID_CAP': 'Email Id',

  // App-shared-modules-footer
  'ABOUT_CAP': 'About',
  'ABOUT_JALDEE_ONE': 'Jaldee is an all-in-one web portal integrated with mobile application. It manages service providersÃ¢â‚¬â„¢ day to day operations like  waitlist, schedule, billing and payments. Customers can search service providers and book their time slots either from the portal or from the mobile app.',
  'ABOUT_JALDEE_TWO': 'Jaldees cloud-based platform is scalable, secure, and ready for any size deployment. Jaldee is owned and operated by Netvarth technologies Pvt Ltd.',
  'CONTACT_CAP': 'Contact',
  'NETVARTH_TECH_PVT_LTD': 'Netvarth Technologies Pvt Ltd',
  'ADDRESS_ONE': 'Museum cross lane',
  'ADDRESS_TWO': 'Chembukavu',
  'ADDRESS_THREE': 'Thrissur- 680020',
  'ADDRESS_FOUR': 'Kerala, India',
  'SUPPORT_EMAIL': 'E-mail : support@netvarth.com',
  'SUPPORT_PHONE': 'Phone : 0487-2325650',
  'TERMS_CAP': 'Terms',
  'CONDITIONS_CAP': 'Conditions',
  'PRIVACY_POLICY_CAP': 'Privacy Policy',
  'PRICING_CAP': 'Pricing',
  'ABOUT_US_CAP': 'About Us',
  'CONTACT_US_CAP': 'Contact Us',
  'JALDEE_CAP': 'Jaldee Soft Pvt Ltd',
  'COPY_RIGHT_CAP': 'Copyright',
  'DATE_TIME_CAP': 'Date/Time',
  'TEXT_CAP': 'Description',
  'SUBJECT_CAP': 'Action',
  'USER_NAME_CAP': 'User',
  'NO_AUDIT_LOGS_CAP': 'No Audit Logs so far',
  'VIEW_ALL_CAP': 'View All',
  'NO_ALERTS_CAP': 'No alerts found',
  'SETTINGS_NOT_FOUND_CAP': 'Sorry! settings not found',
  'ACC_ONLINE_CHECKIN_CAP': 'Accept Online Check-in',

  // App-shared-modules-header
  'SIGN_IN_CAP': 'Sign in',
  'JOIN_CAP': 'Join',
  'ARE_YOU_SER_PRO_CAP': 'Are you a Service Provider?',
  'CLICK_HERE_CAP': 'Click Here',
  'SWITCH_TO_CONSUMER': 'Switch to Consumer',
  'LOGOUT_CAP': 'Logout',
  'UPGRADE_CAP': 'Upgrade',
  'MEMBERSHIP_CAP': 'License',
  'SWITCH_TO_PROVIDER': 'Switch to Provider',
  'CREATE_PRO_ACCNT': 'Create a Provider Account',

  // App-shared-modules-inbox-inbox-list
  'PROVIDER_CONSUMER_CAP': 'Provider / Consumer',
  'REPLY_CAP': 'Reply',
  'DELETE_MSG_CAP': 'Delete Message',
  'NO_MSG_EXISTS_CAP': 'No Messages exists',

  // App-shared-modules-learnmore-adjustdelay
  'ADJUST_DELAY_CAP': 'Adjust Delay',

  // App-shared-modules-learnmore-checkin
  'CHECK_IN_CAP': 'Check In',

  // App-shared-modules-learnmore-customer
  'CUSTOMERS_CAP': 'Customers',

  // App-shared-modules-learnmore-kiosk
  'KIOSK_CAP': 'Kiosk',

  // App-shared-modules-otp-form
  'ENTER_OTP_CAP': 'Enter OTP *',
  'RESEND_OTP_TO_CAP': 'Resend OTP',
  'RESEND_OTP_EMAIL_CAP': 'Resend OTP Via Email',
  'RESEND_OTP_OPT_ACTIVE_IN_CAP': 'Resend OTP option will be active in',
  'SECONDS_CAP': 'seconds.',
  'ENTER_EMAIL_CAP': 'Enter Email',

  // App-shared-modules-pager
  'PREVIOUS_CAP': 'Previous',
  'NEXT_CAP': 'Next',

  // App-shared-modules-search
  'MORE_OPTIONS_CAP': 'More Options',
  'ALL_CAP': 'All',

  // App-shared-modules-search-moreoptiions
  'MORE_SEARCH_OPT_CAP': 'More Search Options ',

  // App-shared-modules-search-moreoptiions
  'CUSTOMER_CAP': 'Customer',
  'TIME_CAP': 'Time',
  'BILL_NO_CAP': 'Bill #',
  'GSTIN_CAP': 'GSTIN',
  'QTY_CAP': 'Qty',
  'DISCOUNT_CAP': 'Discount',
  'COUPON_CAP': 'Coupon',
  'SUB_TOT_CAP': 'Sub Total',
  'GROSS_AMNT_CAP': 'Gross Amount',
  'TAX_CAP': 'Tax',
  'AMNT_PAID_CAP': 'Amount Paid',
  'TOT_AMNT_PAY_CAP': 'Total Amount to Pay',
  'BACK_TO_BILL_CAP': 'Back to Bill',
  'PAY_LOGS_CAP': 'Payment Logs',
  'AMOUNT_CAP': 'Amount',
  'REFUNDABLE_CAP': 'Refundable',
  'MODE_CAP': 'Mode',
  'REFUND_CAP': 'Refund',
  'REFUNDS_CAP': 'Refunds',
  'UPDATE_BILL_CAP': 'Update Bill',
  'SETTLE_BILL_CAP': 'Settle Bill',
  'PRINT_BILL_CAP': 'Print Bill',
  'ACCEPT_PAY_CAP': 'Accept Payment',

  // App-ynw_provider-components-add-provider-addons
  'ADD_ADDON_CAP': 'Add Add-on',
  'ADDONS_CAP': 'Add-ons *',
  'SELECT_ONE_CAP': '- Select One -',
  'NO_UPGRADE_ADDONS_FOUND_CAP': 'Sorry no upgradable Add-ons found.',
  'DATE_APPLY_CAP' : 'Date Applied',
  'ADD_ON_HISTORY' : 'Add-on History',

  // App-ynw_provider-components-add-provider-bprofile-search-adwords
  'ADD_ADWORD_CAP': 'Add AdWord',
  'ADWORD_CAP': 'AdWord',

  // App-ynw_provider-components-add-provider-bprofile-specializations
  'SPECIALIZATIONS_CAP': 'Specializations',
  'NO_SPECI_FOUND_CAP': 'Sorry no specializations found.',

  // App-ynw_provider-components-add-provider-bprofile-spoken-languages
  'LANG_KNOWN_CAP': 'Languages Known',
  'NO_LANG_FOUND_CAP': 'Sorry no languages found.',

  // App-ynw_provider-components-add-provider-coupons
  'BILLING_COUPONS_CAP': 'Coupons',
  'NAME_MAND_CAP': 'Name *',
  'TYPE_MAND_CAP': 'Type *',
  'FIXED_CAP': 'Fixed',
  'PERCENTAGE_CAP': 'Percentage',
  'DESCRIPTION_MAND_CAP': 'Description *',

  // App-ynw_provider-components-add-provider-customers
  'CREATE_CAP': 'Create',
  'ADDRESS_CAP': 'Address',

  // App-ynw_provider-components-add-provider-item_image
  'ITEM_IMAGE_CAP': 'Item Image - ',
  'SELECT_IMAGE': 'Click here to select the image',
  'CHANGE_IMAGE': 'Click here to change the image',

  // App-ynw_provider-components-add-provider-schedule
  'ADD_SCHEDULE_CAP': 'Add Schedule',
  'EDIT_SCHEDULE_BTN': 'Edit : ',
  'SELECT_DAYS_BTN': ' Select All Days',
  'START_TIME_CAP': 'Start Time',
  'END_TIME_CAP': 'End Time',
  'SAVE_SCHEDULE_CAP': 'Save Schedule',

  // App-ynw_provider-components-add-provider-note
  'ADD_PROVIDER_NOTE_CAP': 'Add Private Note',
  'PROVIDER_NOTE_CAP': 'Private Note',
  'NOTE_PLACEHOLDER' : 'Type notes for your reference only',

  // App-ynw_provider-components-add-provider-location
  'AMENITIES_CAP': 'Amenities',
  'LOCATION_MAP_CAP': 'Choose your location in the MAP',
  'LOCATION_MAP_MESSAGE_CAP': 'If you are unable to find your location, please give the location coordinates',
  'LOCATION_NAME_CAP': 'Location Name *',
  'LATITUDE_CAP': 'Latitude *',
  'LONGITUDE_CAP': 'Longitude *',
  'LOCATION_ADDRESS_CAP': 'Address *',
  'MAP_URL_CAP': 'Google Map URL',
  'SCHEULDE_CAP': 'Business Schedules',
  'OPEN_CAP': '24 hours Open',
  'PARKING_TYPE_CAP': 'Select Parking Type',
  'LOC_PLACEHOLDER' : 'Enter your precise location',

  // App-ynw_provider-components-add-provider-waitlist_queue
  'SERVICE_TIME_WINDOW_CAP': 'Title for Working Hours *',
  'QUEUE_LOCATION_CAP': 'Location *',
  'QUEUE_SERVICE_CAP': 'Service*',
  'SCHEDULE_CAP': 'Schedule*',
  'EXISTING_SCHEDULE_CAP': '[ Existing Schedule(s) : ',
  'MAX_CAPACITY_CAP': 'Maximum Capacity',
  'NO_OF_CAP': 'No of ',
  'SERVE_CAP': 'served at a time',

  // App-ynw_provider-components-add-provider-watlist-service
  'SERVICE_NAME_CAP': 'Service Name *',
  'EST_DURATION_CAP': 'Estimated Duration (min)*',
  'ENABLE_PREPAYMENT_CAP': 'Enable prepayment',
  'PREPAYMENT_CAP': 'Prepayment Amount ',
  'TAX_APPLICABLE_CAP': 'Tax applicable',
  'SERVICE_NOTIFY_CAP': 'End of Service Notification',
  'PUSH_MESSAGE_CAP': 'Push Message',
  'SERVICE_EMAIL_CAP': 'Email',
  'GALLERY_CAP': 'Gallery',
  'SELECT_IMAGE_CAP': 'Click here to select the image files',
  'GO_TO_SERVICE_CAP': 'Please click here to go to the working hours List',

  // App-ynw_provider-components-add-provider-service-gallery
  'SERVICE_GALLERY_CAP': 'Service Gallery',

  // App-ynw_provider-components-add-provider-queue-delay
  'DELAY_CAP': 'Delay (Hour : Minute)',

  // App-ynw_provider-components-add-provider-googlemap
  'MARK_MAP_CAP': 'Mark your location by clicking on the map or by dragging the Marker',
  'SELECT_ADDRESS_CAP': 'Obtained Addresses, select the required one',
  'YES_DONE_CAP': 'Yes, I\'m Done!',

  // App-ynw_provider-components-provider-home
  'TODAY_HOME_CAP': 'Today',
  'FUTURE_HOME_CAP': 'Future',
  'HISTORY_HOME_CAP': 'History',
  'SERVICE_TIME_CAP': 'Service Time-Windows',
  'SERVICES_CAP': 'Services',
  'CHECK_IN_STATUS_CAP': 'Check-In Status',
  'PAYMENT_STATUS_CAP': 'Payment Status',
  'START_DATE_CAP': 'Start Date',
  'END_DATE_CAP': 'End Date',
  'TOKEN_NO_CAP': 'Token No',
  'PRO_NAME_CAP': 'Name',
  'PRO_SERVICE_CAP': 'Service',
  'PRO_STATUS_CAP': 'Status',
  'NOTE_CAP': 'Note',
  'CHANGE_STATUS_CAP': 'Change Status to',
  'ADD_NOTE_CAP': 'Add Note',
  'PRO_AVAILABLE_CAP': 'available',
  'NO_SERVICE_CAP': 'No service time-windows available',
  'ACTIONS_CAP': 'Actions',
  'ITEM_HI_CAP': 'Item',
  'ITEM_NAME_CAP': 'Item Name',
  'SHORT_DESC_CAP': 'Short Description',
  'DETAIL_DESC_CAP': 'Detailed Description',
  'PRICES_CAP': 'Price',
  'TAXABLE_CAP': 'Taxable',

  // App-ynw_provider-components-add-provider-coupons
  'NON_WORK_DAY_HI_CAP': 'Non Working Day',
  'REASON_CAP': 'Reason',

  // App-ynw_provider-components-add-provider-waitlist-checkin-bill
  'NEW_CAP': 'New',
  'ADD_SER_ITEM_CAP': 'Add Service/Item',
  'AVAILABLE_CAP': 'Available',
  'QTY_CAPITAL_CAP': 'Qty',
  'SEL_DISC_CAP': 'Select Discount',
  'SEL_COUPON_CAP': 'Select Coupon ',
  'DISCOUNTS_COUPONS_CAP': 'Discounts / Coupons',
  'BILL_DISCOUNT_CAP': 'Discount',
  'ADD_BTN': 'Add',

  // App-ynw_provider-components-provider-bprofile-search
  'BPROFILE_PUBLIC_SEARCH_CAP': 'Public Search',
  'BPROFILE_PROFILE_CAP': 'Your profile has been',
  'BPROFILE_DISABLED_CAP': 'disabled',
  'BPROFILE_ONLINE_VISIBLE_CAP': 'for public search online and will not be visible to',
  'BPROFILE_SET_UP_CAP': 'We recommend you to set up the',
  'BPROFILE_SUMMARY_CAP': 'Basic Information',
  'BPROFILE_ON_pUBLIC_SEARCH': 'section to turn ON the Public Search',
  'BPROFILE_CURRENT_STATUS': 'Current Status',
  'BPROFILE_ON_CAP': 'On',
  'BPROFILE_OFF_CAP': 'Off',
  'BPROFILE_VISIBILITY_CAP': 'Your profile is visible to',
  'BPROFILE_ONLINE_JALDEE_CAP': 'online at jaldee.com',
  'BPROFILE_OFFLINE_CAP': 'You are offline. Turn ON public search to make your profile visible to',
  'BPROFILE_TURN_OFF': 'Turn Off',
  'BPROFILE_TURN_ON': 'Turn On',
  'BPROFILE_ADWORDS_CAP': 'AdWords',
  'BPROFILE_BUY_ADWORDS_CAP': 'Currently you did not have any AdWords. Would you like to buy AdWords?',
  'BPROFILE_BUY_ADWORD_BTN': 'Buy AdWords',
  'BPROFILE_CREATE_ADWORD_CAP': 'AdWord(s), you can create',
  'BPROFILE_MOR_ADOWRDS_CAP': 'AdWord(s). To add more AdWords, go to',
  'BPROFILE_LICENSE_INVOICE_CAP': 'License & Invoice',
  'BPROFILE_HAVE_NOT_ADD_CAP': 'You haven\'t added any',
  'BPROFILE_BASIC_INFORMATION_CAP': 'Basic Information',
  'BPROFILE_SUCH_AS_CAP': 'such as',
  'BPROFILE_BUSINESS_NAME_CAP': 'Business Name, Profile Summary',
  'PROFILE_PICTURE_CAP': 'Profile Picture',
  'BPROFILE_ADD_IT_NOW_CAP': 'Add It Now',
  'BPROFILE_TURN_ON_PUBLIC_SEARCH': 'Need Basic Information to turn on Public Search',
  'BPROFILE_CHANGE_CAP': 'Change',
  'BPROFILE_PICTURE_CAP': 'Picture',
  'BPROFILE_DELETE_PICTURE_CAP': 'Delete Picture',
  'BPROFILE_INFORMATION_CAP': 'information',
  'BPROFILE_NEED_LOCATION_CAP': 'Need Location',
  'BPROFILE_WORK_HOURS_SEARCH_CAP': 'Working Hours to turn on Public Search',
  'BPROFILE_BASE_LOCATION': 'Your Base Location details are Incomplete',
  'BPROFILE_PLEASE_CAP': 'Please use the',
  'BPROFILE_BUTTON_COMPLETE_CAP': 'button to complete it',
  'BPROFILE_PIN_CAP': 'Pin',
  'BPROFILE_MORE_LOCATIONS_CAP': 'You can add more locations in the',
  'BPROFILE_LOCATIONS_CAP': 'locations',
  'BPROFILE_PAGE_CAP': 'page',
  'BPROFILE_LONGITUDE_CAP': 'Longitude:',
  'BPROFILE_LATIITUDE_CAP': 'Latitude:',
  'BPROFILE_LOCATION_AMENITIES': 'Location Amenities',
  'BPROFILE_CHANGE_WORKING_HOURS_CAP': 'You can change the working hours by editing the working hours of this location',
  'BPROFILE_VIEW_SERVICE_WINDOW_CAP': 'to view the working hours',
  'BPROFILE_PRIVACY_SETTINGS_CAP': 'Privacy Settings',
  'BPROFILE_ANY_CAP': 'any',
  'BPROFILE_PHONE_CAP': 'Phone',
  'BPROFILE_VISIBLE_CAP': 'Visible to',
  'BPROFILE_SPECIAL_CAP': 'Specialization',
  'BPROFILE_ADDOTIONAL_INFO_CAP': 'Additional Info',
  'BPROFILE_ADDITIONAL_CAP': 'Additional',
  'BPROFILE_ADD_CIRCLE_CAP': 'add_circle_outline',
  'BPROFILE_PHOTOS_CAP': 'photos to the',
  'BPROFILE_PHOT0_CAP': 'Photo',
  'BPROFILE_SOCIAL_MEDIA_CAP': 'Your Social Media',
  'BPROFILE_ADD_SOCIAL_MEDIA_CAP': 'You can add your social media links here',
  'NO_SOCIAL_MEDIA': 'You haven\'t added any social media links',

  // App-ynw_provider-components-provider-bprofile-search-schedulepopup
  'MANAGE_WORK_HOURS_CAP': 'Manage Working Hours',

  // App-ynw_provider-components-provider-bprofile-search-socialmedia
  'SOCIAL_SELECT_CAP': 'Select',
  'SOCIAL_URL_CAP': 'Enter the URL',

  // App-ynw_provider-components-provider-coupon_view
  'COUPON_DETAILS_CAP': 'Coupon Deatils',
  'JCOUPON_CODE': 'Coupon Code',
  'COUPON_PERCENT_CAP': 'Percent/Amount',
  'COUPON_EXPIRY_CAP': 'Expiry Date',
  'COUPON_RULES_CAP': 'Rules',
  'COUP_DISC_VALUE': 'Discount Value',
  'MAX_DISC_VALUE': 'Maximum Discount Value',
  'MAX_REIMBURSE_PERC': 'Reimbursable Percentage',
  'MAX_PRO_USE_LIMIT': '# Provider Use Limit',
  'MAX_CONSU_USE_LIMIT': '# Consumer Use Limit',
  'CONSUM_FIRST_HECK': 'Consumer First CheckIn Usage Only',
  'PRO_FIRST_CHECK': 'Provider First CheckIn Use Only',
  'SELF_PAYMENT': 'Self Payment Required',
  'ONLINE_CHECK': 'Online Checkin Required',
  'COMBIN_COUPON_LIST': 'Combine with Other Coupons',
  'DEFAULT_ENABLE': 'Default Enabled',
  'ALWAYS_ENABLE': 'Always Enabled',
  'TERM_CONDITION': 'Terms and Conditions',
  'PRO_DESCR': 'Provider Description',
  'CHART_CAP': 'Chart',

  // App-ynw_provider-components-provider-coupons
  'REPORTS_CAP': 'Reports',
  'VALID_FROM_CAP': 'Valid From',
  'VALID_TO_CAP': 'Valid To',
  'CONSUM_APPLY_CAP': 'consumers# applied',
  'PROVID_APPLY_CAP': 'providers# honored',
  'COUPONS_STATUS_CAP': 'Status',
  'ENABLE_CAP': 'Enabled',
  'DISABLE_CAP': 'Disabled',
  'ADD_COUPON_BTN': 'Add Coupons',
  'VALUE_CAP': 'Value',

  // App-ynw_provider-components-provider-customers
  'CUSTOMER_MOBILE_CAP': 'Mobile',
  'LAST_VISIT_CAP': 'Last Visit',
  'NO_CUSTOMER_CAP': 'You don\'t have any',

  // App-ynw_provider-components-provider-discounts
  'ADD_DISCOUNT_CAP': 'Add Discounts',

  // App-ynw_provider-components-provider-items
  'ADD_ITEM_CAP': 'Add Item',
  'ITEM_ENABLE_CAP': 'Enable',

  // App-ynw_provider-components-provider-license-detail
  'INVOICE_CAP': 'Invoice',
  'SERV_PERIOD_CAP': 'Billing Period',
  'GATEWAY_CAP': 'Payment Gateway',
  'PAYMENT_CAP': 'Payment',
  'ID_CAP': 'Id',
  'REF_ID_CAP': 'Ref Id',

  // App-ynw_provider-components-provider-license
  'CURRENT_PACKAGE_CAP': 'Your current License Package is',
  'UPGRADE_LICENSE': 'Upgrade License',
  'LICENSE_CHANGE': 'License Change History',
  'LICENSE_USAGE': 'License Usage',
  'SUBSCRIPTION_CAP': 'Subscription',
  'CURRENTLY_ENROLLED': 'You have currently enrolled to',
  'DUE_AMT_CAP': 'Due Amount',
  'PERIOD_CAP': 'Period',
  'ADD_ON_CAP': 'Add-on',
  'NO_ADDON_CAP': 'No Add-ons exists',
  'PAY_BUTTON' : 'Invoices to Pay',
  'DUE_DATE_CAP' : 'Due Date',
  'SUBSC_PACKAGE' : 'Subscription/Package',

  // App-ynw_provider-components-provider-license-usage
  'TOTAL_CAP': 'Total',
  'USED_CAP': 'Used',
  'COMPLIANCE_CAP': 'Compliance Info',
  'NO_METRIC_CAP': 'No metric found',

  // App-ynw_provider-components-provider-members
  'FAMILY_MEMEBER': 'No family members exists',

  // App-ynw_provider-components-provider-payment-history
  'NO_TRANSACTION': 'No transactions done yet',
  'BILLIN_CAP' : 'Billing',

  // App-ynw_provider-components-provider-profile
  'PROFILE_CAP': 'Profile',
  'BUS_NAME_CAP': 'Business Name',
  'SHORT_NAME_CAP': 'Short Name',
  'LOC_SCHEDULE_INFO': 'Location & Schedule Information',
  'PLACE_CAP': 'Place',
  'PINCODE_CAP': 'Pincode',
  'COORDINATES_CAP': 'Coordinates',
  'BACK_CAP': 'Back',
  'NOW_DONE_CAP': 'You are now done.',

  // App-ynw_provider-components-provider-refund
  'AMT_WANT_TO_REFUND': 'Amount you wanted to Refund',
  'PLEASE_WAIT': 'Please wait',

  // App-ynw_provider-components-provider-reimburse-report
  'REIMBUSE_REPORT_CAP': 'Reimbursement Reports',
  'REPORT_ID_CAP': 'Report Id',
  'TIME_PERIOD_CAP': 'Time Period',
  'COUP_USE_CAP': 'Coupons Used',
  'J_ACC_CAP': 'Jaldee Bank',
  'REIMBURSE_AMT_CAP': 'Reimbursable Amount',
  'REQ_PAYMENT_CAP': 'Request for payment',
  'SCCESS_MSG' : 'Requested Successfully',
  'ERROR_MSG' : 'Failed',
  'NO_REPORTS_MSG' : 'No reports',
  'GRANT_TOTAL' : 'Grant Total',
  'DATE_FROM_CAP' : 'Date From',
  'DATE_TO_CAP' : 'Date To',

  // App-ynw_provider-components-provider-settings
  'WAITLIST_MANAGE_CAP': 'Waitlist Manager',
  'ACCEPT_ONLINE_CAP': 'Accept Online',
  'SETTINGS_CAP': 'Settings',
  'LOCATIONS_CAP': 'Locations',
  'LICENSE_CAP': 'License',
  'ADDON_CAP': 'Add-ons',
  'PAYMENTS_CAP': 'Payments',
  'ACCEPT_PAYMENT_CAP': 'Accept Payments',
  'PAYMENT_SETTING_CAP': 'Payment Settings',
  'TAX_SETTING_CAP': 'Tax Settings',
  'BILLING_CAP': 'Billing/POS',
  'ITEMS_CAP': 'Items',
  'DISCOUNTS_CAP': 'Discounts',
  'COUPONS_CAP': 'Coupons',
  'MISCELLANEOUS_CAP': 'Miscellaneous',
  'NON_WORKING_CAP': 'Non-working Days',

  // App-ynw_provider-components-provider-system-auditlogs
  'AUDIT_CATEGORY_CAP': 'Category',
  'AUDIT_SUB_CTAEGORY_CAP': 'Sub Category',
  'AUDIT_ACTION_CAP': 'Action',
  'AUDIT_SELECT_DATE_CAP': 'Select Date',
  'AUDIT_NO_LOGS_CAP': 'Sorry! No logs found',

  // App-ynw_provider-components-provider-waitlist-checkin-cancel-popup
  'POPUP_SELECT_REASON_CAP': 'Select a reason',
  'POPUP_SEND_MSG_CAP': 'Send message to',

  // App-ynw_provider-components-provider-waitlist-checkin-payment
  'PAY_SELECT_CAP': 'Select Payment Options',
  'PAY_SETTLE': 'Settle',

  // App-ynw_provider-components-provider-waitlist-location-detail
  'WAITLIST_BASE_LOC_CAP': 'Base Location',
  'WAITLIST_LOC_STATUS_CAP': 'Location Status',
  'WAITLIST_SET_BASE_CAP': 'Set as base location',
  'WAITLIST_SCHEDULE_CAP': 'Schedule',

  // App-ynw_provider-components-provider-waitlist-locations
  'ADD_NEW_LOC_CAP': 'Add Location',
  'NO_LOC_ADDED' : 'No location added',
  'NO_QUEUE_ADDED' : 'No working hours added',

  // App-ynw_provider-components-provider-waitlist-online-checkin
  'CHECKIN_CALCULATE_CAP': 'Waiting Time Calculation',
  'CHECKIN_ML_CAP': 'Automatic (Machine Learning)',
  'CHECKIN_MINS_CAP': 'Minutes',
  'CHECKIN_NO_WAIT_TIME_CAP': 'Do not show waiting time for',
  'CHECKIN_TOKEN_ENABLE_CAP': '(Token Enabled)',
  'CHECKIN_TOKEN_DISABLE_CAP': '(Token Disabled)',
  'CHECKIN_FUTURE_CAP': 'Accept Future',

  // App-ynw_provider-components-provider-waitlist-queues
  'QUEUE_NEW_SERVICE_WIND_CAP': 'Add Working Hours',
  'QUEUE_MAX_CAPACITY_CAP': 'Max. Capacity',

  // App-ynw_provider-components-provider-waitlist-service-detail
  'SERVICE_DURATION_CAP': 'Estimated Duration',
  'SERVICE_STATUS_CAP': 'Service Status',
  'SERVICE_PHOTO_CAP': 'photos',

  // App-ynw_provider-components-request-for
  'REQUEST_CONFIRM_CAP': 'Confirm your request for payment',

  // App-ynw_provider-components-search-provider-customer
  'CUSTOMER_NOT_REGISTER_CAP': 'This is not a registered',

  // App-ynw_provider-components-view-report
  'REPORT_PERIOD_DATE_CAP': 'Period/Date',
  'REPORT_COUPON_AMT_CAP': 'Coupon Amount',
  'REPORT_REIMBURSE_AMT_CAP': 'Reimbursable Amount from Jaldee',
  'REPORT_JALDEE_ACCT_CAP': 'Jaldee Financial Account',
  'REPORT_CONSUMER_CAP': 'Consumer',

  // App-ynw_provider-components-provider-items-details
  'ITEM_DETAIL_CAP': 'Item Details',

  // App-ynw_provider-components-provider-auditlogs
  'AUDIT_LIC_HISTORY_CAP' : 'License History',
  'AUDIT_NAME_CAP' : 'Name',
  'AUDIT_APPLIED_ON_CAP' : 'Applied On',
  'AUDIT_EXP_DATE_CAP' : 'Expiry Date',
  'AUDIT_STATUS_CAP' : 'Status',
  'AUDIT_NO_LOGS_FOUND' : 'No logs found',
  // App-ynw_provider-components-provider-bprofile-privacy-settings
  'PRIVACY_SETTINGS_HI_CAP' : 'Privacy Settings -',
  'PRI_PHONE_NUMBER_CAP' : 'Phone Number *',
  'PRI_PHONE_LABEL_CAP' : 'Phone Label *',
  'PRI_THIS_PHONE_VISIBLE_TO_CAP' : 'This phone number is visible to',
  'PRI_EMAIL_ID_CAP' : 'Email Id *',
  'PRI_EMAIL_LABEL_CAP' : 'Email Label *',
  'PRI_MAIL_ID_IS_VISIBLE_TO_CAP' : 'This email is visible to',

  // App-ynw_provider-components-provider-bprofile-search-adwords
  'SEARCH_ADWORDS_CAP' : 'AdWords',
  'SEARCH_SORRY_CAP' : 'Sorry!',
  'SEARCH_NOT_HAVE_ANY_ADWORD_MSG' : 'Currently you do not have any AdWords. Please upgrade your Licence Package/Add-On',

  // App-ynw_provider-components-provider-bprofile-search-gallery
  'SEARCH_GALLERY_CAP' : 'Gallery',
  'SEARCH_GALLERY_SELEC_IMG_FILE_CAP' : 'Click here to select the image files',

  // App-ynw_provider-components-provider-bprofile-search-primary
  'SEARCH_PRI_PROF_NAME_SUMMARY_CAP' : 'Basic Information',
  'SEARCH_PRI_BUISINESS_NAME_CAP' : 'Name *',
  'SEARCH_PRI_PROF_SUMMARY_CAP' : 'Description',

  // App-ynw_provider-components-provider-bwizard
  'WIZ_CONGRATULATIONS_CAP' : 'Congratulations,',
  'WIZ_RIGHT_CHOICE_BY_SIGNIN_UP_CAP' : 'You have made a right choice by signing up for',
  'WIZ_JALDEE_CAP' : 'Jaldee!',
  'WIZ_WILL_WALK_TO_ENABLE_P_SEARCH_CAP' : 'We will walk you through to enable Public search!',
  'WIZ_REMEMBER_CAP' : 'Remember!',
  'WIZ_ADJUST_SETNGS_CAP' : 'You can always adjust any of the settings by going to',
  'WIZ_BUSIESS_PROFILE_CAP' : 'Business Profile',
  'WIZ_UNDER_SETTINGS_CAP' : 'under the settings!',
  'WIZ_LET_GET_STARTED_CAP' : 'Let\'s Get Started',
  'WIZ_PROFILE_NAME_SUMMARY_CAP' : 'Profile Name and Summary',
  'WIZ_BUSINESS_NAME_CAP' : 'Name',
  'WIZ_YOUR_CAP' : 'Your',
  'WIZ_VIEW_IN_PUBLIC_SEARCH_CAP' : 's will view this in Jaldee Online',
  'WIZ_PROFILE_SUMMARY_CAP' : 'Profile Summary',
  'WIZ_NEXT_CAP' : 'Next',
  'WIZ_ADD_MORE_SERVICE_IN_THE_SETT_CAP' : 'You can update the default created service details here. You can add more services in the Settings -> Services, after you create your profile.',
  'WIZ_ADD_MORE_QUEUE_IN_THE_SETT_CAP' : 'The service s1 will be served for all working hours',
  'WIZ_LOCATION_CAP' : 'Location',
  'WIZ_ADD_MORE_LOC_IN_THE_SETT_CAP' : 'You can add more locations in the Settings -> Location, after you create your profile.',
  'WIZ_CHOOSE_YOUR_LOCA_CAP' : 'Choose your location in the MAP',
  'WIZ_LOC_NOT_AVAIL_CAP' : 'If your location is not available in the MAP, kindly fill the location details manually.',
  'WIZ_GPS_COORDINATES_CAP' : 'GPS Coordinates',
  'WIZ_GPS_COORDINATES_NEEDED_CAP' : 'GPS coordinates needed for the',
  'WIZ_MOB_FOR_LOCA_PROXIMITY_CAP' : 's who uses their mobile phone for search by location proximity.',
  'WIZ_ADDRESS_CAP' : 'Address',
  'WIZ_ENTER_ADDRESS_CAP' : 'Enter the Address/Direction where your',
  'WIZ_CAN_FIND_YOU_CAP' : 's can find you.',
  'WIZ_LOC_NAME_CAP' : 'Location Name',
  'WIZ_DISPL_NAME_LOCA_CAP' : 'Display name of the location where you render services for your',
  'WIZ_GOOGLE_MAP_URL_CAP' : 'Google Map URL',
  'WIZ_USED_FIND_EXACT_LOC_CAP' : 'This can be used to find the exact location',
  'WIZ_BACK_CAP' : 'Back',
  'WIZ_WORKING_HOURS_CAP' : 'Working Hours',
  'WIZ_SHOWS_B_HOURS_CAP' : 'This shows your office/business hours',
  'WIZ_PUBLIC_SEARCH_CAP' : 'Public Search',
  'WIZ_TURN_ON_OFF_CAP' : 'You can turn On or Off anytime in Settings -> Profile & Search -> Profile',
  'WIZ_PRO_SEARCHABLE_VIEWABLE_CAP' : 'Do you want to make your Profile searchable and viewable to public?',
  'WIZ_TURN_ON_P_SEARCH_CAP' : 'Turn on Public Search',
  'WIZ_YOUR_PROF_VISIBLE_TO_CAP' : 'Your profile is visible to',
  'WIZ_ONLINE_AT_CAP' : 's online at',
  'WIZ_JALDEE_COM_CAP' : 'jaldee.com',
  'WIZ_TURN_OFF_P_SEARCH_CAP' : 'Turn off Public Search',
  'WIZ_PROF_NOT_VIBLE_TO_CAP' : 'Your profile is not visible to',
  'WIZ_SOME_INFO_MISSING_CAP' : 'Some of the information is missing, we recommend to visit',
  'WIZ_SETTINGS_CAP' : 'Settings',
  'WIZ_COMPL_YOUR_PRO_CAP' : 'page and complete your profile, then you can turn on',
  'WIZ_PUB_SEARCH_CAP' : 'Public Search!',

  // App-ynw_provider-components-provider-payment-settings
  'PAY_SET_JALDEE_ACCOUNT_CAP' : 'Jaldee Bank',
  'PAY_SET_MY_OWN_ACCOUNT_CAP' : 'My Own Bank Account',
  'PAY_SET_ONLY_IF_MAIL_VERIFIED_CAP' : 'Payment settings can be done only if your email id is verified. Please use the below button to set up your email id.',
  'PAY_SET_GO_TO_EMAIL_SET_CAP' : 'Go to My Account',
  'PAY_SET_REVISIT_THIS_PAGE_CAP' : 'Please revisit this page to do the payment settings, once you have verified the email address.',
  'PAY_SET_PAYTM_CAP' : 'Paytm',
  'PAY_SET_VERIFIED_CAP' : '(Verified)',
  'PAY_SET_NOT_VERIFIED_CAP' : '(Not Verified)',
  'PAY_SET_ENTER_MOB_NO_CAP' : 'Enter Mobile Number *',
  'PAY_SET_CC_DC_NETBANKING_CAP' : 'CC / DC / Netbanking',
  'PAY_SET_PAN_CARD_NO_CAP' : 'Pan Card Number *',
  'PAY_SET_NAME_ON_PAN_CAP' : 'Name on Pan Card *',
  'PAY_SET_ACCNT_HOLDER_NAME_CAP' : 'Account Holder Name *',
  'PAY_SET_BANK_ACCNT_NO_CAP' : 'Bank Account Number *',
  'PAY_SET_BANK_NAME_CAP' : 'Bank Name *',
  'PAY_SET_IFSC_CAODE_CAP' : 'IFSC Code *',
  'PAY_SET_BRANCH_NAME_CAP' : 'Branch Name *',
  'PAY_SET_BUSINESS_FILING_STATUS_CAP' : 'Business Filing Status *',
  'PAY_SET_SELECT_CAP' : '-- Select --',
  'PAY_SET_PROPRIETORSHIP_CAP' : 'Proprietorship',
  'PAY_SET_INDIVIDUAL_CAP' : 'Individual',
  'PAY_SET_PARTNERSHIP_CAP' : 'Partnership',
  'PAY_SET_PRIVATE_LTD_CAP' : 'Private Limited',
  'PAY_SET_PUBLIC_LTD_CAP' : 'Public Limited',
  'PAY_SET_LLP_CAP' : 'LLP',
  'PAY_SET_TRUST_CAP' : 'Trust',
  'PAY_SET_SOCIETIES_CAP' : 'Societies',
  'PAY_SET_ACCOUNT_TYPE_CAP' : 'Account Type *',
  'PAY_SET_CURRENT_CAP' : 'Current',
  'PAY_SET_SAVINGS_CAP' : 'Savings',
  'PAY_SET_CANCEL_EDIT_CAP' : 'Cancel Edit',
  'PAY_SET_SAVE_SETTINGS_CAP' : 'Save Settings',
  'PAY_SET_CHANGE_PAYMENT_SETTINGS_CAP' : 'Change Payment Settings',
  'PAY_SET_GST_NUMBER_CAP' : 'GST Number *',
  'PAY_SET_TAX_PER_CAP' : 'Tax Percentage *',
  'PAY_SET_UPDATE_TAX_CAP' : 'Update Tax',

  // App-ynw_provider-components-provider-subheader
  'SUB_HEADER_CREATE_CAP' : 'Create',
  'SUB_HEADER_KIOSK' : 'Kiosk',
  'DASHBOARD_TITLE' : 'Dashboard',
  'SUB_HEADER_SETTINGS' : 'Settings',
  'SUB_HEADER_HELP' : 'Help',

  // App-ynw_provider-components-provider-system-alerts
  'SYS_ALERTS_ACKNOWLEDGEMENT_STATUS' : 'Acknowledgement Status',
  'SYS_ALERTS_ANY_CAP' : '-- Any --',
  'SYS_ALERTS_ACKNOWLEDGED_CAP' : 'Acknowledged',
  'SYS_ALERTS_NOT_ACKNOWLEDGED_CAP' : 'Not Acknowledged',
  'SYS_ALERTS_SELECT_DATE_CAP' : 'Select Date',
  'SYS_ALERTS_SEARCH_CAP' : 'Search',
  'SYS_ALERTS_SUBJECT_CAP' : 'Subject',
  'SYS_ALERTS_DETAILS_CAP' : 'Details',
  'SYS_ALERTS_DATE_CAP' : 'Date',
  'SYS_ALERTS_ACTION_CAP' : 'Action',
  'SYS_ALERTS_NO_ALERTS_FOUND_CAP' : 'Sorry! No alerts found',

  // App-ynw_provider-components-provider-waitlist
  'WAITLIST_ACCEPT_ONLINE_CAP' : 'Accept Online',
  'WAITLIST_LOCATIONS_CAP' : 'Locations',
  'WAITLIST_SERVICES_CAP' : 'Services',
  'WAITLIST_SER_TIME_WINDOWS_CAP' : 'Service Time-Windows',

  // App-ynw_provider-components-provider-waitlist-checkin-consumer-note
  'CONS_NOTE_NOTE_CAP' : 'Note',

  // App-ynw_provider-components-provider-waitlist-checkin-detail
  'CHECK_DET_GO_BACK_CAP' : 'Go Back',
  'CHECK_DET_DETAILS_CAP' : 'Details',
  'CHECK_DET_NAME_CAP' : 'Name:',
  'CHECK_DET_DATE_CAP' : 'Date:',
  'CHECK_DET_LOCATION_CAP' : 'Location:',
  'CHECK_DET_WAITLIST_FOR_CAP' : 'Waitlist For:',
  'CHECK_DET_SERVICE_CAP' : 'Service:',
  'CHECK_DET_QUEUE_CAP' : 'Working Hours:',
  'CHECK_DET_PAY_STATUS_CAP' : 'Payment Status:',
  'CHECK_DET_NOT_PAID_CAP' : 'Not Paid',
  'CHECK_DET_PARTIALLY_PAID_CAP' : 'Partially Paid',
  'CHECK_DET_PAID_CAP' : 'Paid',
  'CHECK_DET_PARTY_SIZE_CAP' : 'Party Size:',
  'CHECK_DET_SEND_MSG_CAP' : 'Send Message',
  'CHECK_DET_ADD_PRVT_NOTE_CAP' : 'Add Private note',
  'CHECK_DET_CANCEL_CAP' : 'Cancel',
  'CHECK_DET_COMM_HISTORY_CAP' : 'Communication History',
  'CHECK_DET_PRVT_NOTES_CAP' : 'Private Notes',
  'CHECK_DET_NO_PVT_NOTES_FOUND_CAP' : 'No private notes found',
  'CHECK_DET_HISTORY_CAP' : 'History',
  'CHECK_DET_NO_HISTORY_FOUND_CAP' : 'No history found',

  // App-ynw_provider-components-provider-waitlist-checkin-detail
  'Q_DET_LOCATION_CAP' : 'Location',
  'Q_DET_SERVICE_CAP' : 'Service',
  'Q_DET_MAX_CAP_CAP' : 'Maximum Capacity',
  'Q_DET_NO_OF_CAP' : 'No of',
  'Q_DET_SERVED_AT_A_TIME_CAP' : 's served at a time',
  'Q_DET_SER_TIME_WIND_STATUS_CAP' : 'Working Hours Status',
  'Q_DET_ENABLED_CAP' : 'Enabled',
  'Q_DET_DISABLED_CAP' : 'Disabled',
  'Q_DET_SCHEDULE_CAP' : 'Schedule',

  // App-ynw_provider-components-provider-waitlist-services
  'SER_ADD_NEW_SER_CAP' : 'Add Service',
  'SER_EST_DURATION_CAP' : 'Estimated Duration',
  'SER_PRICE_CAP' : 'Price',
  'SER_MIN_CAP' : 'min',

  // App-ynw_provider-components-upgrade-license
  'UP_LIC_PACKAGE_CAP' : 'Upgrade License',
  'UP_LIC_PACK_CAP' : 'Select the License you would like to upgrade to :',
  'UP_SELECT_ONE_CAP' : '- Select One -',
  'UP_NO_UPGRADE_PACK_FOUND' : 'Sorry, No upgradable packages found.',

  'APPLY_DISCOUNT' : 'Apply Discount',
  'CHANGE_QTY' : 'Change Qty',
  'REMOVE_SERVICE' : 'Remove Service',
  'REMOVE_ITEM' : 'Remove Item',
  'PAYBYCASH' : 'Pay by Cash',
  'PAYBYOTHERS' : 'Pay by Others',
  'PAYBYCASH_OTHERS' : 'Pay by Cash / Others',
  'JALDEEPAY' : 'JaldeePay',
  'EMAILBILL' : 'Email Bill',
  'WBAMOUNT' : 'Amount',
  'AMOUNTDUE' : 'Amount Due',
  'NETTOTAL' : 'Net Total',
  'NOTESFOR' : 'Notes for ',
  'APPLYORDERDISC': 'Apply Order Discount',
  'APPLYCOUPON' : 'Apply Coupon',
  'APPLYJC' : 'Apply Jaldee Coupon',
  'CURRENTMOBMSG': 'Your Current Mobile # ',

  // App-shared-components-set-password-form
  'SET_PASSWORD_MSG' : 'Congratulations! You have become a Jaldee partner! Please set your password to continue sign up process.',
  'PASSWORD_ERR_MSG' : 'You haven\'t set your password. Next time you want to go through forgot password',
  'ADWORD_ERRMSG': 'Please enter AdWord',
  'ADWORD_MAXCOUNT' : 'Upgrade your License package to Gold or Diamond for free AdWords. You can also purchase AdWords as Add ons',

  // form-level-common
  'FRM_LEVEL_PROFILE_SEARCH_MSG' : 'Setup and maintain your public profile here.',
  // 'FRM_LEVEL_PROFILE_MSG' : 'Setup your profile name to help [customer]s identify and understand you. Summarize overall content by adding your location, working hours etc...',
  'FRM_LEVEL_PROFILE_MSG' : 'Update your business profile (such as location, working hours, specialization, languages, etc..) here.',
  'FRM_LEVEL_WAITLIST_MSG' : 'Manage your waitlist and enable or disable check-ins for current day or for future.',
  'FRM_LEVEL_LIC_MSG' : 'Manage and upgrade your license package.',
  'FRM_LEVEL_PAY_MSG' : 'View and edit the payment and tax settings.',
  'FRM_LEVEL_BILLING_MSG' : 'Create items, discounts and coupons here.',
  'FRM_LEVEL_COUPON_MSG' : 'View all the coupons available here.',
  'FRM_LEVEL_MISC_MSG' : 'Manage your non working days here',

  // form-level-provider-bprofile-search
  'FRM_LEVEL_PUBLIC_SEARCH_MSG' : 'Turn it on to enable your profile\'s visibility in [customer]\'s search result. Unless you enable, the patients won\'t be able to view your profile in their search result.',
  'FRM_LEVEL_ADWORDS_MSG' : 'Manage relevant keywords to increase visibility to your [customer]s.',
  'FRM_LEVEL_PROFILE_NAME_CAP' : 'Manage profile name and basic information of you or your business here. Profile Name can be either the individual\'s name or the business name.',
  'FRM_LEVEL_LOC_MSG' : 'Manage your business Location details here.',
  'FRM_LEVEL_LOC_AMENITIES_MSG' : 'Manage the location benefits that are offered to your [customer]s.',
  'FRM_LEVEL_WORKING_MSG' : 'Details of your business hours are shown here.',
  'FRM_LEVEL_PRIVACY_MSG' : 'Manage your contact related information here. Option to keep your information restricted is available.',
  'FRM_LEVEL_SPEC_MSG' : 'Mention your specializations here.',
  'FRM_LEVEL_LANG_MSG' : 'To widen your [customer] base, add different languages known to you here.',
  'FRM_LEVEL_ADDITIONAL_MSG' : 'Add other details of you or your business so that [customer]s can understand you more.',
  'FRM_LEVEL_VERI_MSG' : 'To upgrade verification level contact Jaldee.',
  'FRM_LEVEL_GALLERY_MSG' : 'Add images and catchy captions to boost your [customer]\'s check-ins.',
  'FRM_LEVEL_SOCIAL_MSG' : 'To connect with [customer]s on your social media platform, add your social media links here.',

  // form-level-provider-waitlist
  'FRM_LEVEL_WAIT_TIME_CALC_MSG' : 'Choose one of the four wait-time calculation options. This calculated time is the standby time after which your [customer] can avail the services.',
  'FRM_LEVEL_SETT_LOC_MSG' : 'Add the location details of your business presence here. Manage it as and when required.',
  'FRM_LEVEL_SETT_SERV_MSG' : 'Enlist all the services that you provide to the [customer]s. You can always add new services here.',
  'FRM_LEVEL_SETT_WORKING_HR_MSG' : 'Setup and Manage multiple working hours of your business here.',


  // form-level-provider-payment-settings
  'FRM_LEVEL_PAYMENT_SETTINGS_MSG' : 'Select the payment mode here. Enable online payments to settle your transactions online. You can also select different payment gateways such as Paytm/CC/DC/Net Banking for transaction process',
  'FRM_LEVEL_TAX_SETTINGS_MSG' : 'Set up your tax requirements here. Enable the \"Tax Applicable\" toggle switch to apply taxes for your services.',

  // form-level-provider-license and invoice
  'FRM_LEVEL_PROVIDER_LICE_MSG' : 'Manage the license history, its usage, and payment history and also upgrade your license here.',
  'FRM_LEVEL_PROVIDER_LIC_ADDON_MSG' : 'To avail the additional features of Jaldee.com, click here.',
  'FRM_LEVEL_PROVIDER_LIC_ADWORDS_MSG' : 'Add relevant keywords to increase your visibility to your [customer].',

  // form-level-provider-coupons
  'FRM_LEVEL_JALDEE_COUPONS_MSG' : 'These are provided by Jaldee. View the details of Jaldee coupons here.',
  'FRM_LEVEL_MY_COUPONS_MSG' : 'Create your coupon and its details here.',

  // form-level-provider-discounts
  'FRM_LEVEL_DISCOUNTS_MSG' : 'Create your discounts here.',

  // form-level-provider-items
  'FRM_LEVEL_ITEMS_MSG' : 'Create new items and related information here.',

  // form-level-provider-miscellaneous
  'FRM_LEVEL_NON_WORKING_MSG' : 'Unavailability of your services on particular days (holidays), mention here.',

  'SETPROF_LOC_MSG': 'Please set profile name and location to make use of Dashboard',
  'SETPROF_MSG': 'Please set profile name to make use of Dashboard',
  'SET_LOC_MSG': 'Please set location to make use of Dashboard',

  // form-level-provider-wizard
  'FRM_LEVEL_PRO_WIZ_ONE_MSG' : 'The Jaldee team takes pride in your decision of choosing its services.',
  'FRM_LEVEL_PRO_WIZ_TWO_MSG' : 'Let us quickly set up your basic profile and help you enable the Public Search to get you started!',
  'FRM_LEVEL_PRO_WIZ_THREE_MSG' : 'We wish you all the very best!',
  'FRM_LEVEL_PRO_WIZ_FOUR_MSG' : 'Be certain that this initial setup can be viewed, edited and managed, if and when required.',
  'FRM_LEVEL_PRO_WIZ_FIVE_MSG' : 'Enter your business name here. [customer]s will view this in Public Profile. Complete it by adding a brief introduction about you or your business to help [customer]s know you more.',
  'FRM_LEVEL_PRO_WIZ_SIX_MSG' : 'Enter the location related details here.',

  'SERVCE_DETAILS': '-Service Details', 

};

