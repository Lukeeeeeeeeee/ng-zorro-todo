import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { InitGuardService } from 'src/app/services/init-guard/init-guard.service';

const routes: Routes = [
    {
        path: 'setting',
        component: SettingComponent,
        canActivate: [InitGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingRoutingModule {}
