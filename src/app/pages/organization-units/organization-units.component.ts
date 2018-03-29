import { Component, Injector, ViewChild, OnInit } from '@angular/core';

import { appModuleAnimation } from '@shared/animations/routerTransition';
import { OrganizationUnitOnTreeComponent } from '@app/pages/organization-units/organization-tree.component';
import { AppComponentBase } from '@shared/component-base';

@Component({
    templateUrl: './organization-units.component.html',
    animations: [appModuleAnimation()]
})
export class OrganizationUnitsComponent extends AppComponentBase implements OnInit  {
    //@ViewChild('ouMembers') ouMembers: OrganizationUnitMembersComponent;
    @ViewChild('ouTree') ouTree: OrganizationUnitOnTreeComponent;

    constructor(
        injector: Injector
    ) {
         super(injector);
    }

    ngOnInit(): void {
       
    }
}
