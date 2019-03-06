import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    OnDestroy,
    TemplateRef
} from '@angular/core';
import { List } from 'src/domain/entities';
import {
    NzDropdownContextComponent,
    NzDropdownService,
    NzModalService
} from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListService } from 'src/app/services/list/list.service';
import { TodoService } from 'src/app/services/todo/todo.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit, OnDestroy {
    @Input() isCollapsed: boolean;
    @ViewChild('listRenameInput') private listRenameInput: ElementRef;
    @ViewChild('listInput') private listInput: ElementRef;

    lists: List[];
    currentListUuid: string;
    contextListUuid: string;
    addListModalVisible = false;
    renameListModalVisible = false;

    private dropdown: NzDropdownContextComponent;
    private destroy$ = new Subject();

    constructor(
        private dropdownService: NzDropdownService,
        private listService: ListService,
        private todoService: TodoService,
        private modal: NzModalService
    ) {}

    ngOnInit() {
        this.listService.lists$
            .pipe(takeUntil(this.destroy$))
            .subscribe(lists => {
                this.lists = lists;
            });

        this.listService.currentUuid$
            .pipe(takeUntil(this.destroy$))
            .subscribe(uuid => {
                this.currentListUuid = uuid;
            });

        this.listService.getAll();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
    }

    closeAddListModal(): void {
        this.addListModalVisible = false;
    }

    closeRenameListModal(): void {
        this.renameListModalVisible = false;
    }

    openAddListModal(): void {
        this.addListModalVisible = true;
        setTimeout(() => {
            this.listInput.nativeElement.focus();
        });
    }

    openRenameListModal(): void {
        this.renameListModalVisible = true;
        setTimeout(() => {
            const title = this.lists.find(l => l._id === this.contextListUuid)
                .title;
            console.log(title);
            this.listRenameInput.nativeElement.value = title;
            this.listRenameInput.nativeElement.focus();
        });
    }

    contextMenu(
        $event: MouseEvent,
        template: TemplateRef<void>,
        uuid: string
    ): void {
        this.dropdown = this.dropdownService.create($event, template);
        this.contextListUuid = uuid;
    }

    click(uuid: string): void {
        this.listService.setCurrentListUuid(uuid);
    }

    rename(title: string): void {
        this.listService.rename(this.contextListUuid, title);
        this.closeRenameListModal();
    }

    add(title: string): void {
        this.listService.add(title);
        this.closeAddListModal();
    }

    delete(): void {
        const uuid = this.contextListUuid;
        this.modal.confirm({
            nzTitle: '确认删除列表',
            nzContent: '该操作会导致该列表下的所有待办事项被删除',
            nzOnOk: () =>
                new Promise((res, req) => {
                    this.listService.delete(uuid);
                    this.todoService.deleteInList(uuid);
                    res();
                }).catch(() => console.error('Delete list failed'))
        });
    }

    close(): void {
        this.dropdown.close();
    }
}
