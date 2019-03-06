import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
    USERNAME,
    AVATAR_CODE
} from 'src/app/services/local-storage.namespace';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
    selector: 'app-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.less']
})
export class SettingComponent implements OnInit {
    username = this.localStorage.get(USERNAME);
    avatar = this.localStorage.get(AVATAR_CODE);

    @ViewChild('usernameInput') private usernameInput: ElementRef;

    constructor(
        private localStorage: LocalStorageService,
        private message: NzMessageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.usernameInput.nativeElement.value = this.username;
    }

    validateUsername(username: string): void {
        if (!username) {
            this.message.error('用户名不能为空');
            this.usernameInput.nativeElement.value = this.username;
        } else if (username !== this.username) {
            this.username = username;
            this.localStorage.set(USERNAME, username);
            this.message.success('用户名修改成功');
        }
    }

    private getBase64(img: File, callback: (img: {}) => void): void {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleAvatarImageChange(info: { file: UploadFile }): void {
        this.getBase64(info.file.originFileObj, (img: string) => {
            this.avatar = img;
            this.localStorage.set(AVATAR_CODE, img);
        });
    }

    goBack(): void {
        this.router.navigateByUrl('/main');
    }
}
