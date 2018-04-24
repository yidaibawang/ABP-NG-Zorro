import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Injector, Input } from '@angular/core';
import {
  OrganizationUnitDto,
  OrganizationUnitServiceProxy,
  UpdateOrganizationUnitInput,
  CreateOrganizationUnitInput
} from '@shared/service-proxies/service-proxies';
import { ModalComponentBase, ModalSubjectEvent } from '@shared/component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

export interface IOrganizationUnitOnEdit {
  id?: number;
  parentId?: number;
  displayName?: string;
}

@Component({
  selector: 'app-create-or-edit-organiaztion-units',
  templateUrl: './create-or-edit-organiaztion-units.component.html',
  styles: []
})

export class CreateOrEditOrganiaztionUnitsComponent extends ModalComponentBase implements OnInit, ModalSubjectEvent.OnShow {


  @Output() unitCreated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();
  @Output() unitUpdated: EventEmitter<OrganizationUnitDto> = new EventEmitter<OrganizationUnitDto>();
  organizationUnit: IOrganizationUnitOnEdit = {};

  active = false;
  saving = false;

  validateForm: FormGroup;

  constructor(
    injector: Injector,
    private _message: NzMessageService,
    private _organizationUnitService: OrganizationUnitServiceProxy,
    private _changeDetector: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      displayName: [null, Validators.required]
    });
  }
  onShow(): void {

  }

  getFormControl(name: string) {
    return this.validateForm.controls[name];
  }

  // 创建
  createUnit() {
    const createInput = new CreateOrganizationUnitInput();
    createInput.parentId = this.organizationUnit.parentId;
    createInput.displayName = this.organizationUnit.displayName;

    this.saving = true;
    this._organizationUnitService
      .createOrganizationUnit(createInput)
      .finally(() => this.saving = false)
      .subscribe((result: OrganizationUnitDto) => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }
  // 更新
  updateUnit() {
    const updateInput = new UpdateOrganizationUnitInput();
    updateInput.id = this.organizationUnit.id;
    updateInput.displayName = this.organizationUnit.displayName;

    this.saving = true;
    this._organizationUnitService
      .updateOrganizationUnit(updateInput)
      .finally(() => this.saving = false)
      .subscribe((result: OrganizationUnitDto) => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.success();
      });
  }

  // 保存
  save(): void {
    if (!this.organizationUnit.displayName || this.organizationUnit.displayName == '') {
      this._message.create('error', this.l('Please Input Organization Unit Name'));
      return;
    }

    if (this.organizationUnit.id) {
      this.updateUnit();
    } else {
      this.createUnit();
    }
  }
}
