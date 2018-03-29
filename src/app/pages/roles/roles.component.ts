import { Component, Injector, ViewChild } from '@angular/core';
import { ModalHelper } from '@shared/helpers/modal.helper';
import { PagedListingComponentBase, PagedRequestDto } from "shared/component-base";
import { RoleServiceProxy, RoleListDto, ListResultDtoOfRoleListDto } from "shared/service-proxies/service-proxies";
import { CreateOrEditRoleComponent } from '@app/pages/roles/create-or-edit-role.component';

@Component({
	selector: 'pro-page-roles',
	templateUrl: './roles.component.html',
	styleUrls: ['./roles.component.less']
})
export class RolesComponent extends PagedListingComponentBase<RoleListDto> {

	loading = false;
	dataItems: RoleListDto[] = [];

	constructor(
		private injector: Injector,
		private roleService: RoleServiceProxy,
		private modalHelper: ModalHelper
	) {
		super(injector);
	}

	list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
		this.loading = true;


		this.roleService.getRoles('')
			.finally(() => {
				finishedCallback();
				this.loading = false;
			})
			.subscribe((result: ListResultDtoOfRoleListDto) => {
				this.dataItems = result.items;
				// this.showPaging(result, pageNumber);
			});
	}

	delete(role: RoleListDto): void {
		this.message.confirm(
			"Remove Users from Role and delete Role '" + role.displayName + "'?",
			"Permanently delete this Role",
			(result: boolean) => {
				if (result) {
					this.roleService.deleteRole(role.id)
						.finally(() => {
							this.notify.info("Deleted Role: " + role.displayName);
							this.refresh();
						})
						.subscribe(() => { });
				}
			}
		);
	}

	create(): void {
		this.modalHelper.open(CreateOrEditRoleComponent, { isEdit: false }).subscribe(res => this.refresh())
		//this.modalHelper.open(CreateRoleComponent).subscribe(res => this.refresh());
	}

	edit(role: RoleListDto): void {
		this.modalHelper.open(CreateOrEditRoleComponent, { id: role.id, isEdit: true }).subscribe(res => this.refresh());
	}
}
