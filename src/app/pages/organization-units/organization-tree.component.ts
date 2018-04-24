import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { OrganizationUnitServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/component-base';
import { ModalHelper } from '@shared/helpers/modal.helper';
import { CreateOrEditOrganiaztionUnitsComponent } from '@app/pages/organization-units/create-or-edit-organiaztion-units/create-or-edit-organiaztion-units.component';


@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html'
})
export class OrganizationUnitOnTreeComponent extends AppComponentBase implements OnInit {
    nodes = [];
    Clicked: Function = null;
    @Output() nodeClicked: EventEmitter<string> = new EventEmitter<string>();
    options = {
        allowDrag: true,
        displayField: 'displayName'
    };

    constructor(
        _injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy,
        private modalHelper: ModalHelper) {
        super(_injector);
    }

    ngOnInit() {
        this.refresh();
    }

    refresh(): void {
        this._organizationUnitService.getOrganizationUnitsTree()
            .subscribe(result => {
                this.nodes = result.items;
            });
    }

    onEvent(ev: any) {
        if (ev.eventName && ev.eventName === "activate") {
            if (this.nodeClicked != null) {
                this.nodeClicked.emit(ev.node.data.code);
                // this.Clicked(ev.node.data.code);
            }
        }
    }




    // 创建一个根节点
    createOrganization(): void {
        this.addOrganization(undefined);
    }

    // 添加一个节点
    addOrganization(parentId?: number): void {
        this.modalHelper.open(CreateOrEditOrganiaztionUnitsComponent, {
            organizationUnit: {
                parentId: parentId,
                id: undefined
            }
        }).subscribe(res => this.refresh())
    }

    // 编辑一个节点
    editOrganization(nodeId?: number, nodeName?: string): void {
        this.modalHelper.open(CreateOrEditOrganiaztionUnitsComponent, {
            organizationUnit: {
                id: nodeId,
                displayName: nodeName
            }
        }).subscribe(res => this.refresh())
    }
}
