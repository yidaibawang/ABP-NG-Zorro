import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/component-base';
import { PagedRequestDto, PagedResultDto } from '@shared/component-base/basic-dtos';
import { NzModalSubject } from 'ng-zorro-antd';

export abstract class PageListModalComponentBaseComponent<EntityDto> extends AppComponentBase implements OnInit {

  public pageSize: number = 10;
  public pageNumber: number = 1;
  public totalPages: number = 1;
  public totalItems: number;
  public isTableLoading = false;
  modalVisible: boolean = false;
  subject: NzModalSubject;

  constructor(injector: Injector) {
    super(injector);

    this.subject = injector.get(NzModalSubject);

		const eventTypes = ['onShow', 'onShown', 'onHide', 'onHidden', 'onOk', 'onCancel', 'onDestroy'];
		eventTypes.forEach(name => {
			if (this[name] && typeof this[name] === "function") {
				this.subject.on(name, () => { this[name]() });
			}
		});

		this.subject.on('onShow', () => this.modalVisible = true);
		this.subject.on('onHide', () => this.modalVisible = false);
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.getDataPage(this.pageNumber);
  }

  public showPaging(result: PagedResultDto, pageNumber: number): void {
    this.totalPages = ((result.totalCount - (result.totalCount % this.pageSize)) / this.pageSize) + 1;

    this.totalItems = result.totalCount;
    this.pageNumber = pageNumber;
  }

  public getDataPage(page: number): void {
    var req = new PagedRequestDto();
    req.maxResultCount = this.pageSize;
    req.skipCount = (page - 1) * this.pageSize;

    this.isTableLoading = true;
    this.list(req, page, () => {
      this.isTableLoading = false;
    });
  }

	success(result?: any){
		this.modalVisible = false;
		if(result)
		{
			this.subject.next(result);
			this.subject.destroy('onCancel');
		}
		else
		{
			this.subject.destroy('onOk');
		}
	}

	close($event?: MouseEvent): void {
		if($event) $event.preventDefault();

		this.modalVisible = false;
		this.subject.destroy('onCancel');
	}

  protected abstract list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void;
  protected abstract delete(entity: EntityDto): void;
}
