export const projectConstantsLocal = {
  GOOGLEAPIKEY: 'AIzaSyC3MdDKtIAsLrWXzKiQShq3wRXgftf5lBM',
  PERPAGING_LIMIT: 10,
  CONSUMER_DASHBOARD_REFRESH_TIME: 300, // seconds
  INBOX_REFRESH_TIME: 300, // seconds
  ALERT_REFRESH_TIME: 300, // seconds
  SMALL_DEVICE_BOUNDARY: 991,
  PROVIDER_SMALL_DEVICE_BOUNDARY: 767,
  searchpass_criteria: {
    'start': 0,
    'return': 'title,sector,logo,place1,business_phone_no,unique_id',
    'fq': '',
    'q': '',
    'size': 10,
    'parser': 'structured', // 'q.parser'
    'options': '', // 'q.options'
    'sort': '',
    'distance': ''
  },
  myweekdays: [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ],
  myweekdaysSchedule: [
    '',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ],
  OPEN_NOW_INTERVAL: 2, // interval which calculates the time for open now condition in search
  MY_DATE_FORMATS: {
    parse: {
      dateInput: 'L'
    },
    display: {
      dateInput: 'L',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  },
  TIMEOUT_DELAY: 2000, // msec
  TIMEOUT_DELAY_SMALL: 200, // msec
  TIMEOUT_DELAY_LARGE: 4100, // msec
  TIMEOUT_DELAY_LARGE6: 6000, // msec
  TIMEOUT_DELAY_LARGE10: 10000, // msec
  TIMEOUT_DELAY_600: 600,
  TOOLBAR_CONFIG: [
    {
      name: 'document',
      groups: ['mode', 'document', 'doctools'],
      items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates']
    },
    {
      name: 'clipboard',
      groups: ['clipboard', 'undo'],
      items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
    },
    {
      name: 'editing',
      groups: ['find', 'selection'],
      items: ['Find', 'Replace', '-', 'SelectAll']
    },
    {
      name: 'basicstyles',
      groups: ['basicstyles', 'cleanup'],
      items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat']
    },
    {
      name: 'paragraph',
      groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
      items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
        '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
    },
    {
      name: 'links',
      items: ['Link', 'Unlink', 'Anchor']
    },
    {
      name: 'insert',
      items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak', 'Iframe']
    },
    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
    { name: 'others', items: ['-'] }
  ],
  DISPLAY_DATE_FORMAT: 'DD/MM/YYYY',
  DISPLAY_DATE_FORMAT_NEW: 'dd/MM/yyyy',
  PIPE_DISPLAY_DATE_FORMAT: 'dd/MM/y',
  PIPE_DISPLAY_DATE_FORMAT_WITH_DAY: 'E, dd/MM/y',
  PIPE_DISPLAY_TIME_FORMAT: 'h:mm a',
  // PIPE_DISPLAY_TIME_FORMAT: 'HH:mm a',
  PIPE_DISPLAY_DATE_TIME_FORMAT: 'dd/MM/y h:mm a',
  POST_DATE_FORMAT: 'YYYY-MM-DD',
  POST_DATE_FORMAT_WITHTIME: 'YYYY-MM-DD HH:mm a',
  POST_DATE_FORMAT_WITHTIME_A: 'YYYY-MM-DD HH:mm A',
  DATE_FORMAT_WITH_MONTH: 'd MMM',
  DATE_FORMAT_STARTS_MONTH: 'MMM d',
  DATE_MM_DD_YY_FORMAT: 'MMM d, y',
  DATE_EE_MM_DD_YY_FORMAT: 'EEE, MMM dd, y',
  DATE_MM_DD_YY_HH_MM_A_FORMAT: 'medium',
  BASE_SCHEDULE: [
    {
      day: 4,
      sTime: '09:00 AM',
      eTime: '12:00 PM'
    },
    {
      day: 2,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 3,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 1,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 5,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    }
    ,
    {
      day: 6,
      sTime: '09:00 AM',
      eTime: '06:00 PM'
    },
    {
      day: 7,
      sTime: '09:00 AM',
      eTime: '12:00 PM'
    }
  ],
  DEFAULT_STARTTIME: '09:00 AM',
  DEFAULT_ENDTIME: '06:00 PM',
  IMAGE_FORMATS: [
    'image/gif',
    'image/png',
    'image/jpeg',
    'image/bmp',
    'image/webp'
  ],
  IMAGE_MAX_SIZE: 5000000, // byte
  FILE_MAX_SIZE: 10000000,
  INTERVAL_TIME: 60000, // byte
  AUTOSUGGEST_MIN_CHAR: 3,  // minimum characters required for autosuggest
  AUTOSUGGEST_LOC_MAX_CNT: 100000, // max number of locations that will be displayed in the autosuggestion
  SEARCH_DEFAULT_LOCATION: {
    'autoname': 'Bengaluru, Karnataka',
    'name': 'Bengaluru',
    'lat': '12.971599',
    'lon': '77.594563',
    'typ': 'city'
  },
  MAP_ZOOM: 15,
  MAP_BASE_URL: 'https://www.google.com/maps/place/', // this is used to implement google map related API calls
  LOCATION_BADGE_ICON: { // images to be used for the location badges
    'physiciansemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'dentistemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'altemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'emergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' }, // dynamic
    'hosemergencyservices': { 'icon': 'emergency.png', 'class': 'icon-emergency' },
    'traumacentre': { 'icon': 'trauma.png', 'class': 'icon-trauma' }, // dynamic
    'firstaid': { 'icon': 'noimage.png', 'class': 'icon-first-aid' }, // dynamic
    '24hour': { 'icon': 'noimage.png', 'class': 'icon-open-time' },
    'parkingtype': { 'icon': 'noimage.png', 'class': 'icon-parking' },
    'autopaymentoptions': { 'icon': 'autopay.png', 'class': 'icon-auto-payment' },
    'densistambulance': { 'icon': 'ambulance.png', 'class': 'icon-ambulance' },
    'docambulance': { 'icon': 'ambulance.png', 'class': 'icon-ambulance' },
    'altambulance': { 'icon': 'ambulance.png', 'class': 'icon-ambulance' },
    'none': { 'icon': 'noimage.png', 'class': 'icon-trauma' },
    'homesamplecollection': { 'class': 'fa fa fa-flask' },
    'onlinereports': { 'class': 'fa fa-file-pdf-o' }
  },
  DOMAIN_ICONS: {
    healthCare: { iconClass: 'healthcare_icon' },
    personalCare: { iconClass: 'personalCare_icon' },
    foodJoints: { iconClass: 'food_icon' },
    professionalConsulting: { iconClass: 'professionalConsulting_icon' },
    vastuAstrology: { iconClass: 'vastuAstrology_icon' },
    religiousPriests: { iconClass: 'religiousPriests_icon' },
    finance: { iconClass: 'finance_icon' },
    veterinaryPetcare: { iconClass: 'veterinary_icon' },
    retailStores: { iconClass: 'retailstores_icon' },
    otherMiscellaneous: { iconClass: 'other_icon' },

  },
  DOMAIN_SERVICES_HINT: {
    healthCare: { helphint: 'In-person consultation, Video consultation, Lab services' },
    personalCare: { helphint: 'Haircut facial, Spa treatment' },
    foodJoints: { helphint: 'Pickup, Dine-in, Home delivery' },
    professionalConsulting: { helphint: 'Legal consultation, Auditing' },
    vastuAstrology: { helphint: 'Palm reading, Horoscope reading' },
    religiousPriests: { helphint: 'Pooja, Abhisheka seva' },
    finance: { helphint: 'Loan appeal, Account opening' },
    veterinaryPetcare: { helphint: 'In-person consultation, Video consultation, Pet training' },
    retailStores: { helphint: 'Pickup, Home delivery' },
    otherMiscellaneous: { helphint: 'Add your services here' },
  },
  SUBDOMAIN_ICONS: {
    physiciansSurgeons: { help: 'single doctor facility', iconClass: 'allopathy_doc' },
    hospital: { help: 'multiple doctors facility', iconClass: 'hospital_doc' },
    dentists: { help: 'single doctor facility', iconClass: 'dentists_doc' },
    dentalHosp: { help: 'multiple doctors facility', iconClass: 'dentalHosp_doc' },
    alternateMedicinePractitioners: { help: 'single doctor facility (homeo, ayurveda ....)', iconClass: 'alternateMedicinePractitioners_doc' },
    alternateMedicineHosp: { help: 'multiple doctors facility (homeo, ayurveda ....)', iconClass: 'alternateMedicineHosp_doc' },
    veterinarydoctor: { help: 'single doctor facility', iconClass: 'veterinarydoctor_doc' },
    veterinaryhospital: { help: 'multiple doctors facility', iconClass: 'veterinarydoctor_doc' },
    petcare: { help: '', iconClass: 'veterinarydoctor_doc' },
    beautyCare: { help: '', iconClass: 'veterinarydoctor_doc' },
    personalFitness: { help: '', iconClass: 'veterinarydoctor_doc' },
    massageCenters: { help: '', iconClass: 'veterinarydoctor_doc' },
    restaurants: { help: '', iconClass: 'veterinarydoctor_doc' },
    caterer: { help: '', iconClass: 'veterinarydoctor_doc' },
    homebaker: { help: '', iconClass: 'veterinarydoctor_doc' },
    bakery: { help: '', iconClass: 'veterinarydoctor_doc' },
    juiceParlour: { help: '', iconClass: 'veterinarydoctor_doc' },
    iceCreamParlour: { help: '', iconClass: 'veterinarydoctor_doc' },
    homefood: { help: '', iconClass: 'veterinarydoctor_doc' },
    coffeeShop: { help: '', iconClass: 'veterinarydoctor_doc' },
    sweetShop: { help: '', iconClass: 'veterinarydoctor_doc' },
    lawyers: { help: '', iconClass: 'veterinarydoctor_doc' },
    charteredAccountants: { help: '', iconClass: 'veterinarydoctor_doc' },
    taxConsultants: { help: '', iconClass: 'veterinarydoctor_doc' },
    civilArchitects: { help: '', iconClass: 'veterinarydoctor_doc' },
    financialAdviser: { help: '', iconClass: 'veterinarydoctor_doc' },
    stockbroker: { help: '', iconClass: 'veterinarydoctor_doc' },
    auditor: { help: '', iconClass: 'veterinarydoctor_doc' },
    geologist: { help: '', iconClass: 'veterinarydoctor_doc' },
    vastu: { help: '', iconClass: 'veterinarydoctor_doc' },
    Astrologer: { help: '', iconClass: 'veterinarydoctor_doc' },
    temple: { help: '', iconClass: 'veterinarydoctor_doc' },
    poojari: { help: '', iconClass: 'veterinarydoctor_doc' },
    bank: { help: '', iconClass: 'veterinarydoctor_doc' },
    nbfc: { help: '', iconClass: 'veterinarydoctor_doc' },
    insurance: { help: '', iconClass: 'veterinarydoctor_doc' }
  },
  SOCIAL_MEDIA: [
    { key: 'facebook', iconClass: 'socicon-facebook text-danger', iconImg: 'facebook.png', displayName: 'Facebook' },
    { key: 'twitter', iconClass: 'socicon-twitter', iconImg: 'twitter.png', displayName: 'Twitter' },
    { key: 'youtube', iconClass: 'socicon-youtube', iconImg: 'youtube.png', displayName: 'Youtube' },
    { key: 'linkedin', iconClass: 'socicon-linkedin', iconImg: 'linkedin.png', displayName: 'LinkedIn' },
    { key: 'pinterest', iconClass: 'socicon-pinterest', iconImg: 'pinterest.png', displayName: 'Pinterest' },
    { key: 'instagram', iconClass: 'socicon-instagram', iconImg: 'instagram.png', displayName: 'Instagram' },
    { key: 'bizyGlobe', iconClass: 'bizyGlobe bglobe', iconImg: 'bizyglobe.png', displayName: 'BizyGlobe' },
    { key: 'website', iconClass: 'flaticon2-world', iconImg: 'website.png', displayName: 'Website' },
    { key: 'googleplus', iconClass: 'socicon-googleplus', displayName: 'Google+' }

  ],
  SOCIAL_MEDIA_CONSUMER: [
    { key: 'facebook', iconClass: 'fa fa-facebook-square fb', iconImg: 'facebook.png', displayName: 'Facebook' },
    { key: 'twitter', iconClass: 'fa fa-twitter-square tw', iconImg: 'twitter.png', displayName: 'Twitter' },
    { key: 'youtube', iconClass: 'youTube youtube', iconImg: 'youtube.png', displayName: 'Youtube' },
    { key: 'linkedin', iconClass: 'fa fa-linkedin lkd', iconImg: 'linkedin.png', displayName: 'LinkedIn' },
    { key: 'pinterest', iconClass: 'fa fa-pinterest-square pntr', iconImg: 'pinterest.png', displayName: 'Pinterest' },
    { key: 'instagram', iconClass: 'instagram insta', iconImg: 'instagram.png', displayName: 'Instagram' },
    { key: 'bizyGlobe', iconClass: 'bizyGlobe bglobe', iconImg: 'bizyglobe.png', displayName: 'BizyGlobe' },
    { key: 'website', iconClass: 'fa fa-globe site', iconImg: 'website.png', displayName: 'Website' },
    { key: 'googleplus', iconClass: 'socicon-googleplus', displayName: 'Google+' }
  ],
  PRIVACY_PERMISSIONS: {
    'all': 'Public (All can see)',
    'customersOnly': 'Customer',
    'self': 'Private (None can see)'
  },
  HealthcareService: {
    'service_cap': 'Consultations and Services'
  },
  PersonalFitness: {
    personalFitness: { helphint: 'Personal training session, diet consultation' }
  },
  TOOLTIP_CLS: 'ynwtooltipcls',
  TOOLTIP_PRIVACYPHONE: 'Example : Cell Phone,  Mobile, Emergency, Main Line, others etc',
  TOOLTIP_PRIVACYEMAIL: 'Example : Office Email id, Personal Email id etc',
  TOOLTIP_MALE: 'Male',
  TOOLTIP_FEMALE: 'Female',
  VALIDATOR_BLANK_FALSE: /^((?!\s{2,}).)*$/,
  VALIDATOR_BLANK: /^\s*$/,
  VALIDATOR_URL: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.\_]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
  VALIDATOR_NUMBERONLY: /^\d+$/, 
  VALIDATOR_ONLYNUMBER:/^[0-9]+$/, 
  VALIDATOR_PHONENUMBERONLY: /^[1-9]\d{9}$/,
  VALIDATOR_FLOAT: /^[+-]?([0-9]*[.])?[0-9]+$/,
  VALIDATOR_PHONENUMBERCOUNT10: /^\d{10}$/,
  VALIDATOR_CHARONLY: /^[a-zA-Z\. ]+$/,
  VALIDATOR_ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  VALIDATOR_ALPHANUMERIC_HYPHEN: /^[a-zA-Z0-9-]*$/,
  VALIDATOR_ALPHANUMERIC_DOT: /^[a-zA-Z0-9"':;,-.% ]*$/,
  VALIDATOR_EMAIL: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  VALIDATOR_NUMBER_COMMA: /^[0-9\,]+$/,
  VALIDATOR_MAX6: 6, // max char count
  VALIDATOR_MAX9: 9, // max char count
  VALIDATOR_MAX10: 10, // max char count
  VALIDATOR_MAX15_DEPT_CDE: 15, // max char count
  VALIDATOR_MAX100_DEPT_NME: 100, // max char count
  VALIDATOR_MAX50: 50, // max char count
  VALIDATOR_MAX100: 100, // max char count
  VALIDATOR_MAX150: 150, // max char count
  VALIDATOR_MAX200: 200, // max char count
  VALIDATOR_MAX250: 250, // max char count
  VALIDATOR_MAX500: 500, // max char count
  VALIDATOR_MAX_LAKH: 100,
  VALIDATOR_MOBILE_AND_EMAIL: /^(?:\d{10}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,4})$/,
  QTY_MAX_VALUE: 100000,
  PRICE_MAX_VALUE: 100000,
  TIME_MAX_VALUE: 3600,
  PERC_MAX_VALUE: 100,
  WAITLIST_CANCEL_RESON: [{ title: 'No Show Up', value: 'noshowup', reasonkey: 'noShowUpCancel', type: 2 },
  { title: 'Self', value: 'self', reasonkey: 'selfCancel' },
  { title: 'Blocked', value: 'blocked', reasonkey: 'blockedCancel' },
  { title: 'Closing Soon', value: 'closingSoon', reasonkey: 'closingSoonCancel', type: 2 },
  { title: 'Too Full', value: 'tooFull', reasonkey: 'tooFullCancel' },
  { title: 'PrePayment Pending', value: 'prePaymentPending', reasonkey: 'tooFullCancel' },
  { title: 'Queue Disabled', value: 'QueueDisabled', reasonkey: 'tooFullCancel' },
  { title: 'Other', value: 'other', reasonkey: 'other', type: 2 },
  { title: 'Holiday', value: 'holiday', reasonkey: 'tooFullCancel' }],

  DOMAINLIST_APIFETCH_HOURS: 1, // hours which decides whether domain list api should be execured or not
  REFINE_ENUMLIST_DEFAULT_SHOW_CNT: 5,
  DISTANCE_STATE: 300, // in Km
  DISTANCE_CITY: 40, // in Km
  DISTANCE_AREA: 5, // in Km
  DISTANCE_METRO: 10, // in Km
  DISTANCE_CAPITAL: 20, // in Km

  AUDITLOG_CNT: 10,
  AUDITLOG_FILTER_CATEGORIES: [
    {
      name: 'SETTINGS',
      displayName: 'Settings',
      subcat: [
        { name: 'LOCATION', dispName: 'Location' },
        { name: 'QUEUE', dispName: 'Queues' },
        { name: 'SERVICE', dispName: 'Service' },
        { name: 'HOLIDAY', dispName: 'Holiday' },
        { name: 'WAITLIST', dispName: 'Waitlist' },
        { name: 'PAYMENT', dispName: 'Payment' },
        { name: 'COUPOUN', dispName: 'Coupon' },
        { name: 'ITEM', dispName: 'Item' },
        { name: 'ADDWORD', dispName: 'Jaldee Adword' },
        { name: 'TAX', dispName: 'Tax' },
        { name: 'DISCOUNT', dispName: 'Discount' },
        { name: 'ACCOUNT', dispName: 'Account' }
      ]
    },
    {
      name: 'WAITLIST',
      displayName: 'Waitlist',
      subcat: [
        { name: 'CANCEL', dispName: 'Cancel' },
        { name: 'WAIT', dispName: 'Wait' },
        { name: 'DELAY', dispName: 'Delay' },
        { name: 'WAITLIST', dispName: 'Waitlist' },
        { name: 'RATING', dispName: 'Rating' },
        { name: 'BILL', dispName: 'Bill' }
      ]
    },
    {
      name: 'LICENSE',
      displayName: 'License',
      subcat: [
        { name: 'ADDON', dispName: 'Add-on' },
        { name: 'INVOICE', dispName: 'Invoice' },
        { name: 'LICENSE', dispName: 'License' }
      ]
    },
    {
      name: 'SIGNUP',
      displayName: 'Signup',
      subcat: [
        { name: 'PROVIDER', dispName: 'Provider' },
        { name: 'CONSUMER', dispName: 'Consumer' }
      ]
    }
  ],
  AUDITLOG_FILTER_ACTION: [
    { name: 'ADD', dispName: 'Add' },
    { name: 'DELETE', dispName: 'Delete' },
    { name: 'EDIT', dispName: 'Edit' },
    // { name: 'COPY', dispName: 'Copy' },
    { name: 'VIEW', dispName: 'View' }
  ],
  ALERT_CNT: 10,
  BUSINESS_NAME_MAX_LENGTH: 50,
  BUSINESS_DESC_MAX_LENGTH: 2000,
  REPORT_STATUSES: {
    PAYMENTPENDING: 'Payment Pending',
    REQUESTED: 'Requested',
    PAID: 'Paid',
    INDISPUTE: 'In-Dispute'
  },
  PARKING_TYPES: [
    { displayName: 'None', value: 'none' },
    { displayName: 'Free Parking', value: 'free' },
    { displayName: 'Street Parking', value: 'street' },
    { displayName: 'Private Parking', value: 'privatelot' },
    { displayName: 'Valet Parking', value: 'valet' },
    { displayName: 'Paid Parking', value: 'paid' }
  ],
  PARKING_TYPES_DISPLAY: {
    none: 'None',
    free: 'Free Parking',
    street: 'Street Parking',
    privatelot: 'Private Parking',
    valet: 'Valet Parking',
    paid: 'Paid Parking'
  },
  REPORT_STATUS_FILTER: [
    { displayName: 'Payment Pending', value: 'PAYMENTPENDING' },
    { displayName: 'Requested', value: 'REQUESTED' },
    { displayName: 'Paid', value: 'PAID' },
    { displayName: 'In-Dispute', value: 'INDISPUTE' }
  ],
  ITEM_STATUS: {
    ACTIVE: 'Enabled',
    INACTIVE: 'Disabled'
  },
  COUPON_NOTES: {
    // MINIMUM_BILL_AMT_REQUIRED: 'Minimum bill amount',
    COUPON_APPLIED: 'Coupon already applied',
    SELF_PAY_REQUIRED: 'Self pay required',
    NO_OTHER_COUPONS_ALLOWED: 'No other coupons allowed',
    EXCEEDS_APPLY_LIMIT: 'Exceeds apply limit',
    ONLY_WHEN_FITST_CHECKIN: 'Only for first check-in',
    ONLINE_CHECKIN_REQUIRED: 'Online check-in required',
    CANT_COMBINE_WITH_OTHER_COUPONES: 'Can\'t combine with other coupons',
    CONSUMER_CAN_NOT_APPLY_COUPON:'Coupon cannot be applied.',
    PROVIDER_COUPON_NOT_APPLICABLE_SERVICE:'Provider coupon not applicable for this service',
    PROVIDER_COUPON_NOT_APPLICABLE_USER:'Provider coupon not applicable for this user',
    PROVIDER_COUPON_NOT_APPLICABLE_GROUP:'Provider coupon not applicable for this group',
    PROVIDER_COUPON_NOT_APPLICABLE_ITEM:'Provider coupon not applicable for this item',
    PROVIDER_COUPON_NOT_APPLICABLE_CATALOG:'Provider coupon not applicable for this catalog',
    PROVIDER_COUPON_NOT_APPLICABLE_LABEL:'Provider coupon not applicable for this label',
    PROVIDER_COUPON_NOT_APPLICABLE_BOOKING_MODE:'Provider coupon not applicable for this booking mode',
    PROVIDER_COUPON_NOT_APPLICABLE  : 'Provider coupon not applicable on this day',
    PROVIDER_COUPON_NOT_APPLICABLE_NOW : 'Provider coupon not applicable now',
    JC_NOT_APPLICABLE_DAY : 'Jaldee Coupon not applicable on this day',
    ONLY_WHEN_FITST_CHECKIN_ON_PROVIDER : 'Coupon can be applied only for first check in with this provider',
    MINIMUM_BILL_AMT_REQUIRED : 'A minimum bill amount is required to redeem this coupon'
  },
  CHECK_IN_STATUSES: {
    Done: 'Completed',
    Started: 'Started',
    Arrived: 'Arrived',
    CheckedIn: 'Checked in',
    Cancelled: 'Cancelled',
    Completed: 'Completed',
    Rejected: 'Cancelled',
    Confirmed: 'Confirmed',
    Rescheduled: 'Rescheduled',
    PrepaymentPending: 'Prepayment Pending',
  },
  INVOICE_STATUS_FILTER: [
    { displayName: 'Paid', value: 'Paid' },
    { displayName: 'NotPaid', value: 'NotPaid' },
    { displayName: 'Cancel', value: 'Cancel' },
    { displayName: 'Waived', value: 'Waived' },
    { displayName: 'RolledBack', value: 'RolledBack' },
    // { displayName: 'Obsolete', value: 'Obsolete' },
  ],
  APPT_STATUSES_FILTER: [
    { displayName: 'Confirmed', value: 'Confirmed' },
    { displayName: 'Arrived', value: 'Arrived' },
    { displayName: 'Started', value: 'Started' },
    { displayName: 'Completed', value: 'Completed' },
    { displayName: 'Cancelled', value: 'Cancelled,Rejected' },
    { displayName: 'Prepayment Pending', value: 'prepaymentPending' },
    { displayName: 'Failed', value: 'failed' }
  ],
  FUTURE_APPT_STATUSES_FILTER: [
    { displayName: 'Checked in', value: 'Confirmed' },
    { displayName: 'Cancelled', value: 'Cancelled,Rejected' }
  ],
  CHECK_IN_STATUSES_FILTER: [
    { displayName: 'Checked in', value: 'checkedIn' },
    { displayName: 'Arrived', value: 'arrived' },
    { displayName: 'Started', value: 'started' },
    { displayName: 'Completed', value: 'done' },
    { displayName: 'Cancelled', value: 'cancelled' },
    { displayName: 'Prepayment Pending', value: 'prepaymentPending' },
    { displayName: 'Failed', value: 'failed' }
  ],
  FUTURE_CHECK_IN_STATUSES_FILTER: [
    { displayName: 'Checked in', value: 'checkedIn' },
    { displayName: 'Cancelled', value: 'cancelled' }
  ],
  DELIVERY_STATUS: [
    { displayName: 'Home Delivery', value: 'homeDelivery' },
    { displayName: 'Store Pickup', value: 'storePickup' }
  ],
  JCOUPON_STATES: {
    NEW: 'New - Available for Use',
    EXPIRED: 'Expired',
    ENABLED: 'Enabled',
    DISABLED: 'Disabled',
    DISABLED_BY_JALDEE: 'Disabled By Jaldee',
    DISABLED_PROVIDER_LIMIT_REACHED: 'Disabled (Limit Reached)'
  },
  LICENSE_PACKAGES: {
    5: 'You can change your license package anytime. Once the trial period expires, we will automatically put you in to "Basic Free"',
    1: '',
    7: '',
    2: '',
    3: '',
    4: ''
  },
  PROFILE_ERROR_STACK: {
    1: 'Please set up the \'Basic Information\' section to view your dashboard.',
    2: 'Please set profile name',
    3: 'Please set location',
    4: 'No active services found',
    5: 'No active queues found',
    pushMsg: 'App notification',
    email: 'Email',
    none: 'None',
    professionalConsulting: 'Eg:- Adv.Pranav, Ameya Professionals Private Limited, etc',
    healthCare: 'Eg:- Seven Star Clinic, Dr. Mani, Bright Hospital, etc',
    personalCare: 'Eg:- Herbal beauty parlour, Aloe Sita Beauty Salon & Spa, etc',
    finance: 'Eg:- Manappuram Finance Limited, Bajaj Allianz Life Insurance Co. Ltd, etc',
    foodJoints: 'Eg:- Pepper Restaurant, Madurai Vegetarian, etc',
    vastuAstrology: 'Eg:- Vastupeedam, Ambadi Jyothisham Center, etc',
    religiousPriests: 'Eg:- Our Lady of Dolours Basilica Church, Sri Vadakkumnatha Temple, etc',
    veterinaryPetcare: 'Eg:- Veterinary Clinic, Adat Veterinary Hospital, etc'
  },
  DOMAIN_SEARCH_SUGGESTIONS: {
    all: 'Search for doctors, professionals, beauty saloons, ....',
    professionalconsulting: 'Search for lawyers, civil architects, chartered accountants, ....',
    healthcare: 'Search for hospitals, doctors, dentists,.....',
    personalcare: 'Search for beauty saloons, fitness centers, massage centers, ......',
    finance: 'Search for financial institutions, insurances, loans, ......',
    foodjoints: 'Search for restaurants, caterers, home bakers, .....',
    vastuastrology: ' Search for astrologers, vastu consultants, ......',
    religiouspriests: 'Search for temples, poojas, ceremonies, .....',
    veterinarypetcare: 'Search for veterinary doctors, pet grooming, pet training, ......'
  },

  LICENSE_METRIC: {
    1: 'Jaldee_Business_Listing',
    2: 'Search',
    3: 'Business_Profile_View',
    4: 'Number_Of_Provider',
    5: 'Transactions',
    6: 'Your_Own_Bank_Account',
    7: 'Storage',
    8: 'Jaldee_Keywords',
    9: 'Kiosk',
    10: 'Jaldee_POS_And_Billiing',
    11: 'Corporate_Branch_Admin',
    12: 'Jaldee_Online_Coupons',
    13: 'Custom_URL',
    14: 'Guaranteed_Business_Value_Protection',
    15: 'Additional_Transation_Charges',
    16: 'Jaldee_Verification',
    17: 'Jaldee_Discount_Network',
    18: 'Status_Board',
    19: 'Jaldee_Messaging'

  },
  REGION_LANGUAGE: 'en-US',
  TIME_ZONE_REGION: 'Asia/Kolkata',
  KEY: 'JALDEESOFT',
  WAITLIST_STATUS_BOARD: [
    {
      'name': 'token',
      'displayname': 'Token',
      'label': false,
      'checked': false,
      'order': 1,
    },
    {
      'name': 'waitlistingFor',
      'displayname': 'Customer',
      'label': false,
      'checked': false,
      'order': 2,
    },
    {
      'name': 'primaryMobileNo',
      'displayname': 'Mobile',
      'label': false,
      'checked': false,
      'order': 3,
    },
    {
      'name': 'appxWaitingTime',
      'displayname': 'Waiting Time',
      'label': false,
      'checked': false,
      'order': 5,
    },
    {
      'name': 'service',
      'displayname': 'Service',
      'label': false,
      'checked': false,
      'order': 6,
    },
    {
      'name': 'queue',
      'displayname': 'Queue',
      'label': false,
      'checked': false,
      'order': 7,
    },
    {
      'name': 'label',
      'displayname': 'Label',
      'label': false,
      'checked': false,
      'order': 8,
    },
    {
      'name': 'calling',
      'displayname': 'Calling',
      'label': false,
      'checked': false,
      'order': 9,
    }
  ],
  APPT_STATUS_BOARD: [
    {
      'name': 'appmtFor',
      'displayname': 'Customer',
      'label': false,
      'checked': false,
      'order': 2,
    },
    {
      'name': 'primaryMobileNo',
      'displayname': 'Mobile',
      'label': false,
      'checked': false,
      'order': 3,
    },
    {
      'name': 'appointmentTime',
      'displayname': 'Appointment Time',
      'label': false,
      'checked': false,
      'order': 4,
    },
    {
      'name': 'service',
      'displayname': 'Service',
      'label': false,
      'checked': false,
      'order': 6,
    },
    {
      'name': 'schedule',
      'displayname': 'Schedule',
      'label': false,
      'checked': false,
      'order': 7,
    },
    {
      'name': 'label',
      'displayname': 'Label',
      'label': false,
      'checked': false,
      'order': 8,
    },
    {
      'name': 'calling',
      'displayname': 'Calling',
      'label': false,
      'checked': false,
      'order': 9,
    }
  ],
  ADWORDSPLIT: '__',
  FILETYPES_UPLOAD: [
    'image/jpg',
    'image/png',
    'image/jpeg',
    'application/pdf'
  ],
  LIVETRACK_CONST: {
    'KILOMETER': 'km'
  },
  SUBDOMAIN_DISPLAYNAME: {
    1: 'Doctor',
    2: 'Dentist',
    3: 'Alternative Medicine Practitioner'
  },
  CALLING_MODES: {
    WHATSAPP: 'Whatsapp',
    HANGOUTS: 'Hangouts',
    SKYPE: 'Skype',
    BOTIM: 'Botim',
    IMO: 'Imo'
  },
  PAYMENT_MODES: [

    { value: 'Cash', displayName: 'Cash' },
    { value: 'CC,DC', displayName: 'CC/DC' },
    { value: 'NB', displayName: 'Net banking' },
    { value: 'PPI', displayName: 'Wallet' },
    { value: 'UPI', displayName: 'UPI' },

  ],
  PAYMENT_STATUS: [

    { value: 'SUCCESS', displayName: 'Success' },
    { value: 'FAILED', displayName: 'Failed' },
    { value: 'INCOMPLETE', displayName: 'In Complete' }


  ],
  PAYMENT_PURPOSE: [

    { value: 'prePayment', displayName: 'Advance Payment' },
    { value: 'billPayment', displayName: 'Bill Payment' },
    { value: 'donation', displayName: 'Donation' }


  ],
  APPOINTMENT_MODE: [
    { displayName: 'Walk-in ', value: 'WALK_IN_APPOINTMENT' },
    { displayName: 'Online', value: 'ONLINE_APPOINTMENT' },
    { displayName: 'Phone-in', value: 'PHONE_IN_APPOINTMENT' },

  ],
  APPOINTMENT_STATUS: [
    // {displayName: 'Pre Payment Pending ', value: 'prepaymentPending'},
    { displayName: 'Confirmed', value: 'Confirmed' },
    { displayName: 'Arrived', value: 'Arrived' },
    { displayName: 'Started', value: 'Started' },
    { displayName: 'Cancelled', value: 'Cancelled' },
    { displayName: 'Rejected', value: 'Rejected' },
    // {displayName: 'Failed', value: 'failed'},
    // {displayName: 'Calling', value: 'calling'},
    { displayName: 'Completed', value: 'Completed' },

  ],
  WAITLIST_MODE: [
    { displayName: 'Walk-in ', value: 'WALK_IN_CHECKIN' },
    { displayName: 'Online', value: 'ONLINE_CHECKIN' },
    { displayName: 'Phone-in', value: 'PHONE_CHECKIN' },

  ],
  WAITLIST_STATUS: [
    // {displayName: 'Pre Payment Pending ', value: 'prepaymentPending'},
    { displayName: 'Checked In ', value: 'checkedIn' },
    { displayName: 'Arrived', value: 'arrived' },
    // {displayName: 'Unrevertable', value: 'unrevertable'},
    { displayName: 'Started', value: 'started' },
    { displayName: 'Cancelled', value: 'cancelled' },
    { displayName: 'Completed', value: 'done' },
    // {displayName: 'Failed', value: 'failed'},

  ],
  BILL_PAYMENT_STATUS: [
    { value: 'NotPaid', displayName: 'Not Paid' },
    { value: 'PartiallyPaid', displayName: 'Partially Paid' },
    { value: 'FullyPaid', displayName: 'Fully Paid' },
    { value: 'Refund', displayName: 'Refund' },
    { value: 'PartiallyRefunded', displayName: 'Partially Refunded' },
    { value: 'FullyRefunded', displayName: 'Fully Refunded' }
  ],

  REPORT_TYPE: [
    { displayName: 'Token', value: 'TOKEN' },
    { displayName: 'Appointment', value: 'APPOINTMENT' },
    { displayName: 'Donation', value: 'DONATION' },
    { displayName: 'Payment', value: 'PAYMENT' },

  ],
  BOOKING_MODE: [
    { displayName: 'Walk-in ', value: 'WALK_IN' },
    { displayName: 'Online', value: 'ONLINE' },
    { displayName: 'Phone-in', value: 'PHONE_IN' },
  ],

  REPORT_TRANSACTION_TYPE: [
    { displayName: 'Check-in/Token', value: 'Waitlist' },
    { displayName: 'Appointment', value: 'Appointment' },
    { displayName: 'Donation', value: 'Donation' },
    { displayName: 'Order', value: 'Order' }
    // {displayName: 'License', value: 'License'},

  ],

  REPORT_TIMEPERIOD: [
    { value: 'TODAY', displayName: 'Today' },
    { value: 'LAST_WEEK', displayName: 'Last 7 days' },
    { value: 'LAST_THIRTY_DAYS', displayName: 'Last 30 days' },
    { value: 'NEXT_WEEK', displayName: 'Next 7 days' },
    { value: 'NEXT_THIRTY_DAYS', displayName: 'Next 30 days' },
    { value: 'DATE_RANGE', displayName: 'Date Range' },

  ],

  DONATION_TIMEPERIOD: [
    { value: 'TODAY', displayName: 'Today' },
    { value: 'LAST_WEEK', displayName: 'Last 7 days' },
    { value: 'LAST_THIRTY_DAYS', displayName: 'Last 30 days' },
    { value: 'DATE_RANGE', displayName: 'Date Range' },

  ],

  COMPARISON: [
    { value: 'eq', displayName: '=' },
    { value: 'le', displayName: '<' },
    { value: 'ge', displayName: '>' },

  ],
  CLINICAL_NOTES: [
    { displayName: 'Symptoms', value: '', id: 'symptoms' },
    { displayName: 'Observations', value: '', id: 'observations' },
    { displayName: 'Diagnosis', value: '', id: 'diagnosis' },
    { displayName: 'Notes', value: '', id: 'misc_notes' },
    { displayName: 'Allergies', value: '', id: 'allergies' },
    { displayName: 'Complaints', value: '', id: 'complaints' },
    { displayName: 'Vaccination Notes', value: '', id: 'vaccination_history' },
  ],



  BUSINESS_PROFILE_WEIGHTAGE: {
    BUSINESS_NAME: { 'name': 'BUSINESS_NAME', 'value': 10 },
    BUSINESS_DESCRIPTION: { 'name': 'BUSINESS_DESCRIPTION', 'value': 5 },
    BASE_LOCATION: { 'name': 'BASE_LOCATION', 'value': 10 },
    LOCATION_SCHEDULE: { 'name': 'LOCATION_SCHEDULE', 'value': 10 },
    SPECIALIZATION: { 'name': 'SPECIALIZATION', 'value': 10 },
    LANGUAGES_KNOWN: { 'name': 'LANGUAGES_KNOWN', 'value': 5 },
    SOCIAL_MEDIA: { 'name': 'SOCIAL_MEDIA', 'value': 5 },
    MEDIA_GALLERY: { 'name': 'GALLERY', 'value': 5 },
    PRIVACY_PHONE_NUMBER: { 'name': 'PRIVACY_PHONE_NUMBER', 'value': 5 },
    PRIVACY_EMAILS: { 'name': 'PRIVACY_EMAILS', 'value': 5 },
    ADDITIONAL_INFO: { 'name': 'ADDITIONAL_INFO', 'value': 10 },
    MANDATORY_INFO: { 'name': 'MANDATORY_INFO', 'value': 10 },
    PROFILE_PIC: { 'name': 'PROFILE_PIC', 'value': 10 }
  },
  USER_BUSINESS_PROFILE_WEIGHTAGE: {
    BUSINESS_NAME: { 'name': 'BUSINESS_NAME', 'value': 10 },
    BUSINESS_DESCRIPTION: { 'name': 'BUSINESS_DESCRIPTION', 'value': 10 },
    SPECIALIZATION: { 'name': 'SPECIALIZATION', 'value': 20 },
    LANGUAGES_KNOWN: { 'name': 'LANGUAGES_KNOWN', 'value': 5 },
    SOCIAL_MEDIA: { 'name': 'SOCIAL_MEDIA', 'value': 15 },
    ADDITIONAL_INFO: { 'name': 'ADDITIONAL_INFO', 'value': 20 },
    MANDATORY_INFO: { 'name': 'MANDATORY_INFO', 'value': 15 },
    PROFILE_PIC: { 'name': 'PROFILE_PIC', 'value': 5 }
  },
  COUNTRY_CODES: [
    { displayName: '+91', value: '+91' }
  ],
  CONSUMER_COUNTRY_CODES: [
    { displayName: '+91', value: '+91' },
    { displayName: '+49', value: '+49' },
    { displayName: '+44', value: '+44' },
    { displayName: '+1', value: '+1' }
  ],
  WAITLIST_CANCEL_REASON: [{ title: 'No Show Up', value: 'noshowup', reasonkey: 'noShowUpCancel', type: 2 },
  { title: 'Self', value: 'self', reasonkey: 'selfCancel' },
  { title: 'Blocked', value: 'blocked', reasonkey: 'blockedCancel' },
  { title: 'Closing Soon', value: 'closingSoon', reasonkey: 'closingSoonCancel', type: 2 },
  { title: 'Too Full', value: 'tooFull', reasonkey: 'tooFullCancel' },
  // { title: 'PrePayment Pending', value: 'prePaymentPending', reasonkey: 'tooFullCancel' },
  // { title: 'Queue Disabled', value: 'QueueDisabled', reasonkey: 'tooFullCancel' },
  // { title: 'Holiday', value: 'holiday', reasonkey: 'tooFullCancel' },
  { title: 'Other', value: 'other', reasonkey: 'other', type: 2 },
  ],
  REQUIRED_FIELDS_JALDEE_ONLINE: [
    'SPECIALIZATION', 'PROFILE_PIC', 'BUSINESS_NAME', 'BASE_LOCATION', 'LOCATION_SCHEDULE'
  ],
  // PATH: 'https://' + window.location.host + '/',
  ORDER_STATUSES_FILTER: [
    { displayName: 'Accepted', value: 'Accepted' },
    { displayName: 'Rejected', value: 'Rejected' },
    { displayName: 'Preparing', value: 'Preparing' },
    { displayName: 'On the way', value: 'onTheWay' },
    { displayName: 'Delivered', value: 'Delivered' }
  ],
  ORDER_MODES: [
    { value: 'WALK_IN_ORDER', displayName: 'Walk in Order' },
    { value: 'PHONE_ORDER', displayName: 'Phone in Order' },
    { value: 'ONLINE_ORDER', displayName: 'Online Order' },
  ],
  PAYMENT_STATUSES: [
    { value: 'NotPaid', displayName: 'Not Paid' },
    { value: 'PartiallyPaid', displayName: 'Partially Paid' },
    { value: 'FullyPaid', displayName: 'Fully Paid' },
    { value: 'Refund', displayName: 'Refund' }
  ],
  PAYMENT_STATUS_CLASS: [
    { value: 'NotPaid', class: 'red' },
    { value: 'PartiallyPaid', class: 'orange' },
    { value: 'FullyPaid', class: 'greenc' },
    { value: 'Refund', class: 'yellow-green' },
    { value: 'PartiallyRefunded', class: 'yellow-green' },
    { value: 'FullyRefunded', class: 'yellow-green' }
  ],
  BILL_PAYMENT_STATUS_WITH_DISPLAYNAME: {
    NotPaid: 'Not Paid',
    PartiallyPaid: 'Partially Paid',
    FullyPaid: 'Fully Paid',
    PartiallyRefunded: 'Partially Refunded',
    FullyRefunded: 'Fully Refunded',
    Refund: 'Refund'
  },
  ORDER_STATUS_CLASS: [
    { value: 'Order Received', class: 'order-received-icon' },
    { value: 'Order Acknowledged', class: 'order-ack-icon' },
    { value: 'Order Confirmed', class: 'order-confirmed-icon' },
    { value: 'Preparing', class: 'preparing-icon' },
    { value: 'Packing', class: 'packing-icon' },
    { value: 'Payment Required', class: 'payment-required-icon' },
    { value: 'Ready For Pickup', class: 'readyfor-pickup-icon' },
    { value: 'Ready For Shipment', class: 'readyfor-ship-icon' },
    { value: 'Ready For Delivery', class: 'readyfor-delivery-icon' },
    { value: 'Completed', class: 'order-completed-icon' },
    { value: 'In Transit', class: 'intransit-icon' },
    { value: 'Shipped', class: 'shipped-icon' },
    { value: 'Cancelled', class: 'order-cancelled-icon' }
  ],
   BOOKING_STATUS_CLASS: [
    { value: 'Done', class: 'dark-green' },
    { value: 'Started', class: 'orange' },
    { value: 'Arrived', class: 'yellow' },
    { value: 'CheckedIn', class: 'greenc' },
    { value: 'Cancelled', class: 'red' },
    { value: 'Completed', class: 'dark-green' },
    { value: 'Rejected', class: 'red' },
    { value: 'Confirmed', class: 'greenc' }
  ],
  ADDON_ICON_CLASS: [
    { value: 'Cloud Storage', class: 'fa ico_cloud' },
    { value: 'Jaldee Search Keywords', class: 'fa ico_searchky' },
    { value: 'QBoards', class: 'fa ico_qbods' },
    { value: 'Jaldee Messaging', class: 'fa ico_sms' },
    { value: 'Queues/Schedules/Services', class: 'fa ico_que' },
    { value: 'Multi User', class: 'fa ico_usr' },
  ],
  videoModes: {
    WhatsApp: { displayName: 'WhatsApp', placeHolder: 'Update WhatsApp ID', title: 'Configure WhatsApp' },
    Zoom: { displayName: 'Zoom', placeHolder: 'Update Zoom ID', title: 'Configure Zoom' },
    GoogleMeet: { displayName: 'Google Meet', placeHolder: 'Update Meet ID', title: 'Configure Google Meet' },
    Phone: { displayName: 'Phone', placeHolder: 'Update Phone number', title: 'Configure Phone' }
  },
  ORDER_STATUS_FILTER: [
    { displayName: 'Order Received', value: 'Order Received', delivery: true , pickup: true , clas: 'orderreceived'},
    { displayName: 'Order Acknowledged', value: 'Order Acknowledged' , delivery: true , pickup: true , clas: 'orderacknowledged'},
    { displayName: 'Order Confirmed', value: 'Order Confirmed', delivery: true , pickup: true , clas: 'orderconfirmed'},
    { displayName: 'Preparing', value: 'Preparing', delivery: true , pickup: true , clas: 'orderpreparing'},
    { displayName: 'Packing', value: 'Packing', delivery: true , pickup: true , clas: 'orderpacking'},
    { displayName: 'Payment Required', value: 'Payment Required', delivery: true , pickup: true , clas: 'orderpaymentrequired'},
    { displayName: 'Ready For Pickup', value: 'Ready For Pickup', delivery: false , pickup: true , clas: 'orderreadyforpickup'},
    { displayName: 'Ready For Shipment', value: 'Ready For Shipment', delivery: true , pickup: false , clas: 'orderreadyforshipment'},
    { displayName: 'Ready For Delivery', value: 'Ready For Delivery', delivery: true , pickup: false , clas: 'orderreadyfordelivery'},
    { displayName: 'Completed', value: 'Completed' , delivery: true , pickup: true , clas: 'ordercompleted'},
    { displayName: 'In Transit', value: 'In Transit', delivery: true , pickup: false , clas: 'orderintransit'},
    { displayName: 'Shipped', value: 'Shipped', delivery: true , pickup: false , clas: 'ordershipped'},
    { displayName: 'Cancelled', value: 'Cancelled', delivery: true , pickup: true , clas: 'ordercancelled'}
  ]
};
