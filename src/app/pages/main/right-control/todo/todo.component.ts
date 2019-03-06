import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { Todo, List } from 'src/domain/entities';
import { ListService } from 'src/app/services/list/list.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import { takeUntil } from 'rxjs/operators';
import { floorToDate, getTodayTime } from 'src/utils/time';
import { NzDropdownService, NzDropdownContextComponent } from 'ng-zorro-antd';
import { RankBy } from 'src/domain/type';
import { Router } from '@angular/router';

const rankerGenerator = (type: RankBy = 'title'): any => {
    if (type === 'completeFlag') {
        return (t1: Todo, t2: Todo) => (t1.completedFlag as any) - (t2.completedFlag as any);
    }
    return (t1: Todo, t2: Todo) => (t1[type] as any) - (t2[type] as any);
};

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.less']
})
export class TodoComponent implements OnInit, OnDestroy {
    private destory$ = new Subject();
    private dropdown: NzDropdownContextComponent;

    todos: Todo[] = [];
    lists: List[] = [];
    currentContextTodo: Todo;

    constructor(
        private listService: ListService,
        private todoService: TodoService,
        private dropdownService: NzDropdownService,
        private router: Router
    ) {}

    ngOnInit() {
        this.listService.lists$
            .pipe(takeUntil(this.destory$))
            .subscribe(lists => {
                this.lists = lists;
            });

        combineLatest(
            this.listService.currentUuid$,
            this.todoService.todo$,
            this.todoService.rank$
        )
            .pipe(takeUntil(this.destory$))
            .subscribe(sources => {
                this.processTodos(sources[0], sources[1], sources[2]);
            });

        this.todoService.getAll();
        this.listService.getAll();
    }

    ngOnDestroy(): void {
        this.destory$.next();
    }

    private processTodos(listUUID: string, todos: Todo[], rank: RankBy): void {
        const filteredTodos = todos
            .filter(todo => {
                return (
                    (listUUID === 'today' &&
                        todo.planAt &&
                        floorToDate(todo.planAt) <= getTodayTime()) ||
                    (listUUID === 'todo' &&
                        (!todo.listUUID || todo.listUUID === 'todo')) ||
                    listUUID === todo.listUUID
                );
            })
            .map(todo => Object.assign({}, todo) as Todo)
            .sort(rankerGenerator(rank));

        this.todos = [].concat(filteredTodos);
    }

    add(title: string): void {
        this.todoService.add(title);
    }

    contextMenu($event: MouseEvent, template: TemplateRef<void>, uuid: string) {
        this.dropdown = this.dropdownService.create($event, template);
        this.currentContextTodo = this.todos.find(t => t._id === uuid);
    }

    listsExcept(listUUID: string): List[] {
        return this.lists.filter(l => l._id !== listUUID);
    }

    click(uuid: string): void {
        this.router.navigateByUrl(`/main/${uuid}`);
    }

    toggle(uuid: string): void {
        this.todoService.toggleTodoComplete(uuid);
    }

    delete(): void {
        this.todoService.delete(this.currentContextTodo._id);
    }

    setToday(): void {
        this.todoService.setTodoToday(this.currentContextTodo._id);
    }

    moveToList(listUuid: string): void {
        this.todoService.moveToList(this.currentContextTodo._id, listUuid);
    }

    close(): void {
        this.dropdown.close();
    }
}
