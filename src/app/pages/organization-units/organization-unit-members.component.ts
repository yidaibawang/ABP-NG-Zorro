import { Component, OnInit, Injector } from '@angular/core';
import { OrganizationUnitServiceProxy, OrganizationUnitUserListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase, PagedListingComponentBase, PagedRequestDto } from '@shared/component-base';


@Component({
    selector: 'organization-tree',
    templateUrl: './organization-tree.component.html'
})
export class OrganizationUnitOnMembersComponent extends PagedListingComponentBase<OrganizationUnitUserListDto> {
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
    
    protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
        this.loading=true;
        this._organizationUnitService.getOrganizationUnitUsers(undefined,undefined,request.maxResultCount,request.skipCount)
			.finally(() => {
				finishedCallback();
				this.loading = false;
			})
			.subscribe((result) => {
				this.dataItems = result.items;
				//this.showPaging(result, pageNumber);
			});
        this.permission.isGranted("");
		//this.appSession.user
    }
    protected delete(entity: OrganizationUnitUserListDto): void {
        throw new Error("Method not implemented.");
    }



    onEvent(ev: any) {

    }

    createRootOrganization(): void {

    }
}
