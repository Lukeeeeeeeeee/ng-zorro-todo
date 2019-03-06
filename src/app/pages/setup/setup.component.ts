import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { INIT_FLAG, START_USING_DATE, USERNAME } from 'src/app/services/local-storage.namespace';
import { getTodayTime } from 'src/utils/time';
import { Router } from '@angular/router';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.component.html',
    styleUrls: ['./setup.component.less']
})
export class SetupComponent implements OnInit {
    username: string;

    constructor(private localSotrage: LocalStorageService, private router: Router) {}

    ngOnInit() {}

    completeSetup(): void {
        this.localSotrage.set(INIT_FLAG, true);
        this.localSotrage.set(START_USING_DATE, getTodayTime());
        this.localSotrage.set(USERNAME, this.username);

        this.router.navigateByUrl('main');
    }
}
