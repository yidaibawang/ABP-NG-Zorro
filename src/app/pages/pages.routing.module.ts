import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRouteGuard } from '@shared/auth/auth-route-guard';

import { LayoutComponent } from '../layout/default/layout.component';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { TenantsComponent } from './tenants/tenants.component';
import { AboutComponent } from './about/about.component';
import { CreateOrEditRoleComponent } from '@app/pages/roles/create-or-edit-role.component';
import { OrganizationUnitsComponent } from '@app/pages/organization-units/organization-units.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            //{ path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, data: { translate: 'home' } ,  canActivate: [AppRouteGuard] },
            { path: 'users', component: UsersComponent, data: { translate: 'users', permission: 'Pages.Administration.Users' }, canActivate: [AppRouteGuard] },
            { path: 'roles', component: RolesComponent, data: { translate: 'roles', permission: 'Pages.Administration.Roles' }, canActivate: [AppRouteGuard] },
            { path: 'tenants', component: TenantsComponent, data: { translate: 'tenants', permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
            { path: 'organization-units', component: OrganizationUnitsComponent, data: { translate: 'organization-units', permission: 'Pages.Administration.OrganizationUnits' }, canActivate: [AppRouteGuard] },
            // { path: 'about', component: AboutComponent, data: { translate: 'about' } },
            // { path: 'test', component: CreateOrEditRoleComponent, data: { translate: 'test' } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class PagesRoutingModule { }