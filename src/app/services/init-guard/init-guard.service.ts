import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import {
    Router,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { INIT_FLAG } from '../local-storage.namespace';

@Injectable()
export class InitGuardService implements CanActivate {
    constructor(
        private localStorage: LocalStorageService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const init = !!this.localStorage.get(INIT_FLAG);

        if (state.url.includes('setup') && init) {
            this.router.navigateByUrl('/main');
            return false;
        }
        if (!state.url.includes('setup') && !init) {
            this.router.navigateByUrl('/setup');
            return false;
        }

        return true;
    }
}
