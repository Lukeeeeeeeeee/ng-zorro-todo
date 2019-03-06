import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary.component';
import { InitGuardService } from 'src/app/services/init-guard/init-guard.service';

const routes: Routes = [
    {
        path: 'summary',
        component: SummaryComponent,
        canActivate: [InitGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SummaryRoutingModule {}
