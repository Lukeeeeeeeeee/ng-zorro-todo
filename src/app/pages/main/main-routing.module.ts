import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';
import { DetailComponent } from './detail/detail.component';
import { InitGuardService } from 'src/app/services/init-guard/init-guard.service';

const routes: Routes = [
    {
        path: 'main',
        component: MainComponent,
        canActivate: [InitGuardService],
        children: [
            {
                path: ':id',
                component: DetailComponent,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule {}
