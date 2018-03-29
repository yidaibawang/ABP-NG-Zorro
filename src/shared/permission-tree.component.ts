import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NzTreeComponent } from 'ng-tree-antd';
import { ITreeOptions } from 'angular-tree-component';
import { TreePermissionDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'permission-tree',
  template: `
  <nz-tree #myTree [nzNodes]="permissions"
  [nzCheckable]="true"></nz-tree>
  `
})
export class PermissionTreeComponent implements OnInit {
  @ViewChild("myTree") myTree: NzTreeComponent;
  // 所有权限
  permissions: TreePermissionDto[] = [];
  // 已拥有权限
  grantedPermissionNames: string[];

  treeOptions: ITreeOptions = {
    displayField: 'displayName'
  };

  ngOnInit() {
    this.myTree.nzOptions = this.treeOptions;
  }

  // 设置数据
  setEditData(treePermissions: TreePermissionDto[], grantedPermissionNames: string[]) {
    this.permissions = treePermissions;
    this.grantedPermissionNames = grantedPermissionNames;
    this.refreshTree();
  }


  // 获取所有被选中项的名字
  getGrantedPermissionNames(): string[] {
    let permissionNames = [];
    this.myTree.nzNodes.forEach((node, index, arr) => {
      this.pushCheckedPermissionName(node, permissionNames);
    });
    return permissionNames;
  }
  // 将选中项的值填充到数组
  private pushCheckedPermissionName(node: any, permissionNames: string[]): void {
    // 1、判断是否选中或有部分子项被选中
    if (node.checked || node.halfChecked) {
      // 
      permissionNames.push(node.name);

      // 2、判断是否有子项
      if (node.children && node.children.constructor === Array) {
        node.children.forEach(element => {
          this.pushCheckedPermissionName(element, permissionNames);
        });
      }
    }
  }

  // 刷新树
  private refreshTree(): void {
    let xx = 1;
    this.permissions.forEach((item) => {
      this.updateChecked(item, this.grantedPermissionNames);
    });
  }

  // 更新被选中的项
  private updateChecked(treeDot: TreePermissionDto, grantedPermissionNames: string[]): void {
    if (grantedPermissionNames.indexOf(treeDot.name) != -1) {
      treeDot.checked = true;
    } 


    if (treeDot.children.length > 0) {
      treeDot.children.forEach(item => {
        this.updateChecked(item, grantedPermissionNames);
      });
    }
  }

}
