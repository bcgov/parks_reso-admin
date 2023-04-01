import { ChangeDetectorRef, Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MetricsService } from 'src/app/services/metrics.service';
import { BaseFormComponent } from 'src/app/shared/components/ds-forms/base-form/base-form.component';
import { Constants } from 'src/app/shared/utils/constants';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-metrics-filter',
  templateUrl: './metrics-filter.component.html',
  styleUrls: ['./metrics-filter.component.scss'],
})
export class MetricsFilterComponent extends BaseFormComponent {
  public params;
  public parkFacilitiesList;
  public timeSpanOptions = ['year', 'month', 'week'];
  public timeSpanLabels = ['12M', '30D', '7D'];
  public parkOptions = [];
  public facilityOptions = [];
  public metrics = [];
  public timezone = 'America/Vancouver';
  public count = 0;
  public minDate;
  public maxDate;

  constructor(
    protected formBuilder: UntypedFormBuilder,
    protected router: Router,
    protected dataService: DataService,
    protected loadingService: LoadingService,
    protected changeDetector: ChangeDetectorRef,
    protected metricsService: MetricsService,
  ) {
    super(formBuilder, router, dataService, loadingService, changeDetector);
    this.subscriptions.add(
      this.dataService.watchItem(Constants.dataIds.PARK_AND_FACILITY_LIST).subscribe((res) => {
        if (res) {
          this.parkFacilitiesList = res;
          this.createParksOptions(this.parkFacilitiesList);
        }
      })
    )
    this.subscriptions.add(
      this.dataService.watchItem(Constants.dataIds.METRICS_FILTERS_PARAMS).subscribe((res) => {
        if (res) {
          this.data = res;
          if (this.validateMetricsParams(this.data)) {
            this.onSubmit(this.data);
          };
        }
      })
    )
    this.parkFacilitiesList = this.dataService.getItemValue(Constants.dataIds.PARK_AND_FACILITY_LIST);
    this.data = this.dataService.getItemValue(Constants.dataIds.METRICS_FILTERS_PARAMS);
    if (this.parkFacilitiesList) {
      this.createParksOptions(this.parkFacilitiesList);
      if (this.data.park && this.data.park !== 'all') {
        this.createFacilityOptions(this.parkFacilitiesList[this.data.park].facilities);
      }
    }
    this.setForm();

  }

  setForm() {
    this.form = new UntypedFormGroup({
      timeSpan: new UntypedFormControl(this.data.timeSpan),
      dateRange: new UntypedFormControl(
        this.data.dateRange,
      ),
      park: new UntypedFormControl(this.data.park),
      facility: new UntypedFormControl(this.data.facility),
    });
    super.updateForm();
    super.addDisabledRule(
      this.fields.facility,
      () => {
        const park = this.fields?.park?.value;
        if (!park || park === 'all') {
          return true;
        }
        return false;
      },
      this.fields.park.valueChanges
    );
    super.subscribeToControlValueChanges(this.fields.timeSpan, () => { this.presetRange() })
    super.subscribeToControlValueChanges(this.fields.park, () => { this.parkChange() })
    super.subscribeToControlValueChanges(this.fields.facility, () => { this.updateFilterParams() })
    super.subscribeToControlValueChanges(this.fields.dateRange, () => { this.updateFilterParams() })
  }

  async updateFilterParams() {
    let res = await super.submit();
    let fields = res.fields;
    this.metricsService.setFilterParams(fields);
  }

  async onSubmit(params) {
    if (this.validateMetricsParams(params) && !this.loading) {
      // Get everything
      if (params.park === 'all') {
        this.metricsService.fetchData(params.dateRange[0], params.dateRange[1]);
        return;
      } else if (params.facility === 'all') {
        // Get all facilities
        this.metricsService.fetchData(params.dateRange[0], params.dateRange[1], params.park);
        return;
      } else {
        this.metricsService.fetchData(params.dateRange[0], params.dateRange[1], params.park, params.facility);
      }
    }
  }

  validateMetricsParams(fields): boolean {
    if (
      !fields.park ||
      !fields.dateRange
    ) {
      return false;
    }
    if (fields.park !== 'all' && !fields.facility) {
      return false;
    }
    return true;
  }

  createParksOptions(list) {
    let optionsList = [{
      value: 'all',
      display: 'All Parks'
    },
    {
      value: null,
      display: null,
      disabled: true,
      breakpoint: true
    }
    ];
    for (const park of Object.keys(list)) {
      optionsList.push({ value: park, display: list[park].name });
    }
    this.parkOptions = optionsList;
  }

  createFacilityOptions(list) {
    let optionsList = [{
      value: 'all',
      display: 'All Facilities'
    },
    {
      value: null,
      display: null,
      disabled: true,
      breakpoint: true
    }
    ];
    for (const facility in list) {
      optionsList.push({
        value: list[facility].sk,
        display: list[facility].name,
      });
    }
    this.facilityOptions = optionsList;
  }

  parkChange() {
    const park = this.fields.park.value;
    if (!park || park === 'all') {
      this.fields.facility.setValue(undefined);
      return;
    }
    if (this.parkFacilitiesList) {
      const selectedPark = this.parkFacilitiesList[this.fields.park.value];
      if (selectedPark) {
        this.createFacilityOptions(selectedPark.facilities);
        this.fields.facility.setValue(this.facilityOptions[2]?.value || this.facilityOptions[0]?.value || null);
      }
    }
  }

  presetRange() {
    const today = DateTime.now().setZone(this.timezone);
    const endDate = today.toISODate();
    if (this.fields.timeSpan.value) {
      let startDate;
      switch (this.fields.timeSpan.value) {
        case 'year':
          startDate = today.minus({ months: 12 }).toISODate();
          break;
        case 'month':
          startDate = today.minus({ days: 30 }).toISODate();
          break;
        case 'week':
          startDate = today.minus({ days: 7 }).toISODate();
          break;
        default:
          startDate = endDate;
      }
      this.fields.dateRange.setValue([startDate, endDate]);
    }
  }
}
