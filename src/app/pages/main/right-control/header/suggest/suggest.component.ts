import { Component, OnInit, OnDestroy } from '@angular/core';
import { Todo } from 'src/domain/entities';
import { Subscription } from 'rxjs';
import { TodoService } from 'src/app/services/todo/todo.service';
import { floorToDate, getTodayTime, ONE_DAY } from 'src/utils/time';

@Component({
    selector: 'app-suggest',
    templateUrl: './suggest.component.html',
    styleUrls: ['./suggest.component.less']
})
export class SuggestComponent implements OnInit, OnDestroy {
    suggestedTodo: Todo[] = [];

    private todo$: Subscription;

    constructor(private todoService: TodoService) {}

    ngOnInit() {
        this.todo$ = this.todoService.todo$.subscribe(todos => {
            const filtered = todos.filter(t => {
                if (t.planAt && floorToDate(t.planAt) <= getTodayTime()) {
                    return true;
                }
                if (t.dueAt && t.dueAt - getTodayTime() <= ONE_DAY * 2) {
                    return true;
                }
                return false;
            });
            this.suggestedTodo = [].concat(filtered);
        });
        this.todoService.getAll();
    }

    ngOnDestroy(): void {
        this.todo$.unsubscribe();
    }

    setTodoToday(todo: Todo): void {
        this.todoService.setTodoToday(todo._id);
    }
}
