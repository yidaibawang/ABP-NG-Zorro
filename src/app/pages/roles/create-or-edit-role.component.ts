import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalSubject } from 'ng-zorro-antd';
import { zip } from 'rxjs/observable/zip';

import { ModalComponentBase, ModalSubjectEvent } from '@shared/component-base';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import {
    PermissionServiceProxy, RoleServiceProxy,
    RoleEditDto, CreateOrUpdateRoleInput,
    GetRoleForEditOutput,ListResultDtoOfTreePermissionDto
} from '@shared/service-proxies/service-proxies';
import { PermissionTreeComponent } from '@shared/permission-tree.component';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
    templateUrl: './create-or-edit-role.component.html',
    styles:[]
//     styles: [`
//     :host ::ng-deep .vertical-center-modal {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }

//     :host ::ng-deep .vertical-center-modal .ant-modal {
//       top: 0;
//     }
//   ` ]
})
export class CreateOrEditRoleComponent extends ModalComponentBase implements OnInit, ModalSubjectEvent.OnShow {
    // id
    @Input() id: number;
    // 判断是编辑还是新增
    @Input() isEdit: boolean;
    // 权限菜单
    @ViewChild("permissionTree") permissionTree: PermissionTreeComponent;
    // 弹出框的title
    title: String;
    // 保存按钮可用状态
    saving: boolean = false;
    //
    isDefaultRole:boolean=false;
    // 提交的input
    input: CreateOrUpdateRoleInput = new CreateOrUpdateRoleInput();
    // 表单验证
    validateForm: FormGroup;

    constructor(
        injector: Injector,
        private _permissionService: PermissionServiceProxy,
        private _roleService: RoleServiceProxy,
        private formBuilder: FormBuilder
    ) {
        super(injector);
    }


    onShow(): void {

    }
    ngOnInit(): void {
        this.title = this.isEdit ? this.l('EditRole') : this.l('CreateNewRole');
        this.saving = true;

        if (this.isEdit) {
            this.edit();
        } else {
            this.title = this.l('CreateNewRole');
            this.create();
        }

        this.validateForm = this.formBuilder.group({
            displayName: [null, Validators.compose([Validators.required, Validators.maxLength(32)])],
            isDefaultRole:[]
        });
    }

    // 新增
    create(): void {
        zip(
            this._permissionService.getAllPermissionsTree()
        )
            .finally(() => {
                this.saving = false;
            })
            .subscribe(([permissions]) => {
                this.permissionTree.setEditData(permissions.items, []);
            });

        this.validateForm = this.formBuilder.group({
            displayName: [null, Validators.compose([Validators.required, Validators.maxLength(32)])]
        });

        //this.resetForm();
    }

    // 编辑
    edit(): void {
        zip(
            this._permissionService.getAllPermissionsTree(),
            this._roleService.getRoleForEdit(this.id)
        )
            .finally(() => {
                this.saving = false;
            })
            .subscribe(([permissions, result]) => {
                this.input.role = result.role;
                this.isDefaultRole=result.role.isDefault;
                this.permissionTree.setEditData(permissions.items, result.grantedPermissionNames);
                // 编辑设置title
                this.title = this.l('EditRole') +' : '+ this.input.role.displayName;
            });
    }

    save(e): void {
        this.input.grantedPermissionNames = this.permissionTree.getGrantedPermissionNames();
        this.input.role.isDefault=this.isDefaultRole;

        this.saving = true;
        this._roleService.createOrUpdateRole(this.input)
            .finally(() => { this.saving = false; })
            .subscribe(() => {
                this.notify.success(this.l('SavedSuccessfully'));
                this.success();
            });
    }

    getFormControl(name: string) {
        return this.validateForm.controls[name];
    }

    resetForm($event?: MouseEvent) {
        if ($event) $event.preventDefault();

        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
        }
    }
}