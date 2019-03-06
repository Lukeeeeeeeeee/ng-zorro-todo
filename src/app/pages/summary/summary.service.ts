import { Injectable } from '@angular/core';
import { Summary, Todo } from 'src/domain/entities';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { getTodayTime, floorToDate, ONE_DAY } from 'src/utils/time';
import {
    LAST_SUMMARY_DATE,
    START_USING_DATE,
    SUMMARIES
} from 'src/app/services/local-storage.namespace';

@Injectable()
export class SummaryService {
    summaries: Summary[] = [];

    constructor(
        private localStorage: LocalStorageService,
        private todoService: TodoService
    ) {}

    doSummary(): void {
        const todayDate = getTodayTime();
        console.log(this.localStorage.get(LAST_SUMMARY_DATE))
        let lastDate =
            this.localStorage.get(LAST_SUMMARY_DATE) ||
            floorToDate(this.localStorage.get(START_USING_DATE));

        if (lastDate === todayDate) {
            return;
        }

        const todos = this.todoService.getRow();
        const todosToAna: Todo[] = [];
        const summaries: Summary[] = [];
        const dates: number[] = [];

        todos.forEach(todo => {
            if (todo.planAt) {
                const date = floorToDate(todo.planAt);
                if (date < todayDate) {
                    todosToAna.push(todo);
                }
            }
        });

        while (lastDate < todayDate) {
            dates.push(lastDate);
            lastDate += ONE_DAY;
        }

        dates.forEach(date => {
            const completedItems: string[] = [];
            const uncompletedItems: string[] = [];

            todosToAna.forEach(todo => {
                const planAt = floorToDate(todo.planAt);
                if (planAt <= date) {
                    if (
                        todo.completedFlag &&
                        floorToDate(todo.completedAt) === date
                    ) {
                        completedItems.push(todo.title);
                    } else if (
                        todo.completedFlag &&
                        floorToDate(todo.completedAt) < date
                    ) {
                    } else {
                        uncompletedItems.push(todo.title);
                    }
                }
            });

            summaries.push(new Summary(date, completedItems, uncompletedItems));
        });

        this.localStorage.set(LAST_SUMMARY_DATE, lastDate);
        this.addSummaries(summaries);
    }

    summaryForDate(date: number): Summary {
        if (!this.summaries.length) {
            this.summaries = this.loadSummaries();
        }
        return this.summaries.find(s => s.date === date);
    }

    private loadSummaries(): Summary[] {
        return this.localStorage.getList<Summary>(SUMMARIES);
    }

    private addSummaries(summaries: Summary[]): void {
        const oldSummaries = this.loadSummaries();
        const newSummaries = oldSummaries.concat(summaries);
        this.localStorage.set(SUMMARIES, newSummaries);
    }
}
