import { Component, OnInit, Injector, Input } from '@angular/core';
import { ModalComponentBase, ModalSubjectEvent, PagedRequestDto } from '@shared/component-base';
import { OrganizationUnitServiceProxy, NameValueDto, FindOrganizationUnitUsersInput } from '@shared/service-proxies/service-proxies';
import { PageListModalComponentBaseComponent } from '@shared/component-base/page-list-modal-component-base.component';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styles: []
})
export class AddMemberComponent extends PageListModalComponentBaseComponent<NameValueDto> implements ModalSubjectEvent.OnShow {

  @Input() organizationUnitId: number;
  loading = false;
  dataItems: any[] = [];
  requestPars: FindOrganizationUnitUsersInput;
  filterText: string = '';

  constructor(
    injector: Injector,
    private _organizationUnitService: OrganizationUnitServiceProxy
  ) {
    super(injector);
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.loading = true;

    if (!this.requestPars) {
      this.requestPars = new FindOrganizationUnitUsersInput();
    }

    // 设置查询数据
    this.requestPars.filter = this.filterText;
    this.requestPars.maxResultCount = request.maxResultCount;
    this.requestPars.skipCount = request.skipCount;
    this.requestPars.organizationUnitId = this.organizationUnitId;

    this._organizationUnitService.findUsers(this.requestPars)
      .finally(() => {
        finishedCallback();
        this.loading = false;
      })
      .subscribe((result) => {
        this.dataItems = result.items.map((item, index, array) => {
          return {
            checked: false,
            id: item.value,
            name: item.name
          };
        });

        // this.dataItems = result.items;
        this.showPaging(result, pageNumber);
      });
  }


  // 搜索
  onSearch(e: string): void {
    this.filterText = e;
    this.refresh();
  }


  protected delete(entity: NameValueDto): void {
    // 不需要实现
  }

  onShow(): void {
    // 不需要实现
  }
}
