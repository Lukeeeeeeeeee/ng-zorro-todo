import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { USERNAME } from 'src/app/services/local-storage.namespace';

@Component({
    selector: 'app-left-control',
    templateUrl: './left-control.component.html',
    styleUrls: ['./left-control.component.less']
})
export class LeftControlComponent implements OnInit {
    @Input() isCollapsed: boolean;

    username: string;

    constructor(private localStorage: LocalStorageService) {}

    ngOnInit() {
        this.username = this.localStorage.get(USERNAME);
    }
}
