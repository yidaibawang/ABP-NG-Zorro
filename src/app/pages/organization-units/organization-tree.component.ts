import { Component, OnInit, Injector } from '@angular/core';
import { OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';


@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html'
})
export class OrganizationUnitOnTreeComponent extends AppComponentBase implements OnInit {
    nodes = [];
    Clicked: Function = null;

    options = {
        allowDrag: true,
        displayField: 'displayName'
    };

    constructor(
        _injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(_injector);
    }

    ngOnInit() {

        this._organizationUnitService.getOrganizationUnitsTree()
            .subscribe(result => {
                this.nodes = result.items;
            });
    }

    onEvent(ev: any) {
        if (ev.eventName && ev.eventName === "activate") {
            if (this.Clicked != null) {
                this.Clicked(ev.node.data.code);
            }
        }
    }



    createRootOrganization(): void {

    }
}
