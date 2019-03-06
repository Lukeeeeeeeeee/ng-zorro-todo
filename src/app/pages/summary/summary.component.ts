import { Component, OnInit, HostBinding } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SummaryService } from './summary.service';
import {
    USERNAME,
    START_USING_DATE
} from 'src/app/services/local-storage.namespace';
import { getTodayTime, ONE_DAY } from 'src/utils/time';
import { Summary } from 'src/domain/entities';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { pageSwitchTransition } from './summary.animation';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.less'],
    animations: [pageSwitchTransition]
})
export class SummaryComponent implements OnInit {
    username = this.localStorage.get(USERNAME) || 'username';
    dateCount = Math.floor(
        (getTodayTime() - this.localStorage.get(START_USING_DATE)) / ONE_DAY + 1
    );

    @HostBinding('@pageSwitchTransition') private state = 'activated';

    constructor(
        private localStorage: LocalStorageService,
        private summaryService: SummaryService,
        private noti: NzNotificationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.summaryService.doSummary();
    }

    requestForDate(date: Date): Summary | null {
        return this.summaryService.summaryForDate(date.getTime());
    }

    showSummaryDetail(summary: Summary): void {
        if (!summary) {
            return;
        }

        const { cCount, uCount } = summary;
        if (uCount) {
            this.noti.error(
                '有未完成的项目',
                `你完成了全部任务的 ${cCount / (cCount + uCount)}%`
            );
        } else if (cCount) {
            this.noti.success('完成了这一天的全部任务', '干的漂亮');
        }
    }

    goBack(): void {
        this.router.navigateByUrl('/main');
    }
}
