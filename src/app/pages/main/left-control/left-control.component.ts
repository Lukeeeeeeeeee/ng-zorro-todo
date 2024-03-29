import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { USERNAME } from 'src/app/services/local-storage.namespace';
import { ListComponent } from './list/list.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-left-control',
    templateUrl: './left-control.component.html',
    styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit {
    @Input() isCollapsed: boolean;
    @ViewChild(ListComponent) listComponent: ListComponent;

    username: string;

    constructor(private localStorage: LocalStorageService, private router: Router) {}

    ngOnInit() {
        this.username = this.localStorage.get(USERNAME);
    }

    openAddListModal(): void {
        this.listComponent.openAddListModal();
    }

    goSummary(): void {
        this.router.navigateByUrl('/summary');
    }

    goSetting(): void {
        this.router.navigateByUrl('/setting');
    }
}
