import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ModalHelper } from '@shared/helpers/modal.helper';
import { PagedListingComponentBase, PagedRequestDto } from "shared/component-base";
import { UserServiceProxy, PagedResultDtoOfUserListDto, UserListDto, EntityDtoOfInt64 } from '@shared/service-proxies/service-proxies';

import { CreateOrEditUserComponent } from '@app/pages/users/create-or-edit-user.component';
import { AppConsts } from '@shared/AppConsts';

@Component({
	templateUrl: './users.component.html'
})
export class UsersComponent extends PagedListingComponentBase<UserListDto> {

	loading = false;
	dataItems: UserListDto[] = [];

	constructor(
		private injector: Injector,
		private _userService: UserServiceProxy,
		private modalHelper: ModalHelper
	) {
		super(injector);
	}

	list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
		this.loading = true;

		this._userService.getUsers(undefined, undefined, undefined, undefined, request.maxResultCount, request.skipCount)
			.finally(() => {
				finishedCallback();
				this.loading = false;
			})
			.subscribe((result) => {
				this.dataItems = result.items;
				//this.showPaging(result, pageNumber);
			});
		this.permission.isGranted("");
		this.appSession.user
	}


	loginAsThisUser(user: UserListDto): void {
		alert('暂未实现');
	}

	delete(user: UserListDto): void {
		this.message.confirm(
			"Delete user '" + user.name + user.surname + "'?",
			(result: boolean) => {
				if (result) {
					this.l
					this._userService.deleteUser(user.id)
						.finally(() => {
							this.notify.info("Deleted User: " + user.name);
							this.refresh();
						})
						.subscribe(() => { });
				}
			}
		);
	}

	createUser(): void {
		this.modalHelper.open(CreateOrEditUserComponent, { isEdit: false }).subscribe(res => { 
			this.refresh();
		});
	}

	editUser(user: UserListDto): void {
		this.modalHelper.open(CreateOrEditUserComponent, { id: user.id, isEdit: true }).subscribe(res => this.refresh());
	}
	editUserPermissions(user: UserListDto): void {

	}

	unlockUser(user: UserListDto): void {
		let data = new EntityDtoOfInt64();
		data.id = user.id;
		this._userService.unlockUser(data)
			.finally(() => {

			})
			.subscribe(() => {
				this.refresh();
				this.notify.success(this.l('SuccessfullyUnlock'));
			});
	}

	deleteUser(user: UserListDto): void {
		if (user.userName === AppConsts.userManagement.defaultAdminUserName) {
			this.message.warn(this.l('{0}UserCannotBeDeleted', user.userName));
			return;
		}
		this.message.confirm(
			this.l('UserDeleteWarningMessage', user.userName),
			(isConfirmed) => {
				if (isConfirmed) {
					this._userService.deleteUser(user.id)
						.subscribe(() => {
							this.refresh();
							this.notify.success(this.l('SuccessfullyDeleted'));
						});
				}
			});
	}
}