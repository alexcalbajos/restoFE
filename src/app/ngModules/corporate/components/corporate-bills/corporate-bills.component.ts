import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { environment } from '../../../../../environments/environment';
import { Bill } from '../../../../models/corporate/bill.model';
import {
    CorporateApiService
} from '../../../shared/services/business/corporate/corporate.api.service';

@Component({
    selector: 'ri-corporate-bills',
    templateUrl: 'corporate-bills.component.html',
    styleUrls: ['corporate-bills.component.scss']
})
export class CorporateBillsComponent implements OnInit {
    bills: MatTableDataSource<Bill>;
    activePage: number;
    pages: Array<any> = [];
    displayedColumns: Array<string> = ['num_complete', 'date', 'ft', 'actions'];
    dataLoaded: boolean;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private corporateApiService: CorporateApiService) { }

    ngOnInit(): void {
        this.getBills(1);
    }

    getBills(page: number): void {
        this.activePage = page;
        this.dataLoaded = false;

        this.corporateApiService.getCurrentMonthUrl(new Date().getMonth()).subscribe((url: string) => {
            const currentMonthBill: Bill = {
                num_complete: 'MONTH_CURRENT',
                recap_url: url
            };

            this.corporateApiService.getBills(page).subscribe((responseData: any) => {
                if (responseData.bills.length) {
                    responseData.bills.unshift(currentMonthBill);

                    this.bills = undefined;
                    this.bills = new MatTableDataSource(responseData.bills);
                    this.bills.sort = this.sort;
                } else {
                    this.bills = new MatTableDataSource([]);
                }

                if (responseData.pageCount) {
                    this.pages.length = responseData.pageCount;
                }

                this.dataLoaded = true;
            });
        });
    }

    applyFilter(filterValue: string): void {
        this.bills.filter = filterValue;
    }

    download(url: string): void {
        const urlBase: string = `https://${environment.domain}`;

        window.open(`${urlBase}${url}`);
    }
}
