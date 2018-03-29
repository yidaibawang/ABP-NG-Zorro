import { Component, OnInit, Injector } from '@angular/core';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase, PagedListingComponentBase, PagedRequestDto } from '@shared/component-base';
import { IBasicOrganizationUnitInfo } from './basic-organization-unit-info';

@Component({
    selector: 'organization-unit-members',
    templateUrl: './organization-unit-members.component.html'
})
export class OrganizationUnitOnMembersComponent extends PagedListingComponentBase<OrganizationUnitUserListDto> {

    private _organizationUnit: IBasicOrganizationUnitInfo = null;
    loading = false;
    dataItems: OrganizationUnitUserListDto[] = [];

    options = {
        allowDrag: true,
        displayField: 'displayName'
    };

    constructor(
        _injector: Injector,
        private _organizationUnitService: OrganizationUnitServiceProxy) {
        super(_injector);
    }


    get organizationUnit(): IBasicOrganizationUnitInfo {
        return this._organizationUnit;
    }

    set organizationUnit(ou: IBasicOrganizationUnitInfo) {
        if (this._organizationUnit === ou) {
            return;
        }

        this._organizationUnit = ou;
        if (ou) {
            this.refresh();
        }
    }

    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        if (this._organizationUnit != null) {
            this._organizationUnitService
                .getOrganizationUnitUsers(this._organizationUnit.id, undefined, request.maxResultCount, request.skipCount)
                .finally(() => { })
                .subscribe((result) => {
                    this.dataItems = result.items;
                });
        }
        // this.loading=true;
        // this._organizationUnitService.getOrganizationUnitUsers(undefined,undefined,request.maxResultCount,request.skipCount)
        // 	.finally(() => {
        // 		finishedCallback();
        // 		this.loading = false;
        // 	})
        // 	.subscribe((result) => {
        // 		this.dataItems = result.items;
        // 		//this.showPaging(result, pageNumber);
        // 	});
        // this.permission.isGranted("");
        //this.appSession.user
    }
    protected delete(entity: OrganizationUnitUserListDto): void {
        // throw new Error("Method not implemented.");
    }




    onEvent(ev: any) {

    }

    createRootOrganization(): void {

    }
}
