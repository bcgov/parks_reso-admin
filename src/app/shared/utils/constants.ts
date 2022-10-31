export class Constants {
  public static readonly dataIds = {
    PARKS_LIST: 'parksList',
    CURRENT_PARK: 'currentPark',
    FACILITIES_LIST: 'facilitiesList',
    CURRENT_FACILITY: 'currentFacility',
    PASSES_LIST: 'passesList',
    PASS_SEARCH_PARAMS: 'passSearchParams',
    CANCELLED_PASS: 'cancelledPass',
    RESERVATION_OBJECTS_LIST: 'reservationObjectsList',
    CURRENT_RESERVATIONS_OBJECT: 'currentReservationsObj',
    ENTER_DATA_SUB_AREA: 'enterDataSubArea',
    ACCORDION_FRONTCOUNTRY_CAMPING: 'accordion-Frontcountry Camping',
    ACCORDION_FRONTCOUNTRY_CABINS: 'accordion-Frontcountry Cabins',
    ACCORDION_DAY_USE: 'accordion-Day Use',
    ACCORDION_GROUP_CAMPING: 'accordion-Group Camping',
    ACCORDION_BOATING: 'accordion-Boating',
    ACCORDION_BACKCOUNTRY_CAMPING: 'accordion-Backcountry Camping',
    ACCORDION_BACKCOUNTRY_CABINS: 'accordion-Backcountry Cabins',
    ENTER_DATA_URL_PARAMS: 'enter-data-url-params',
    EXPORT_ALL_POLLING_DATA: 'export-all-polling-data',
    LOCK_RECORDS_FISCAL_YEARS_DATA: 'lock-records-fiscal-years-data',
  };

  public static readonly ApplicationRoles: any = {
    ADMIN: 'sysadmin',
  };

  // March
  public static readonly FiscalYearFinalMonth: number = 3;

  public static readonly iconUrls = {
    frontcountryCamping: '../../assets/images/walk-in-camping.svg',
    frontcountryCabins: '../../assets/images/shelter.svg',
    groupCamping: '../../assets/images/group-camping.svg',
    backcountryCamping: '../../assets/images/walk-in-camping.svg',
    backcountryCabins: '../../assets/images/shelter.svg',
    boating: '../../assets/images/sailing.svg',
    dayUse: '../../assets/images/hiking.svg',
  };

  public static readonly ToastTypes: any = {
    SUCCESS: 0,
    WARNING: 1,
    INFO: 2,
    ERROR: 3,
  };
}
