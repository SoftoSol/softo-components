// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, Input } from '@angular/core';

import { SafeHtml } from '@angular/platform-browser';
import { ColumnConfig, RowAction, RowActionType, TableButton } from '../interfaces';
import { PageEvent } from '@angular/material/paginator';
import { ColumnType } from '../enums';

interface PaginationConfig {
  size: number
  index: number
  sizes: number[]
  length: number
}

@Component({
  selector: 'softo-table-sortable',
  templateUrl: 'table-sortable.component.html',
})

export class TableSortableComponent implements OnInit {
  //#region INPUTS
  @Input() public title: string = "";
  @Input() public headerRow: ColumnConfig[] = [];
  @Input() public rowActions: RowAction[] = [];
  @Input() public icon: string | null = null;
  @Input() public tableActions: TableButton[] = [];
  @Input() public loading: boolean = false;
  @Input() public set dataRows(value: string[][]) {
    this._dataRows = value;
    this.config.length = this._dataRows?.length ?? 0;
    this._getData();
  }
  //#endregion

  //#region PROPERTIES
  private _dataRows: string[][] = [];
  public rows: string[][] = [];
  public config: PaginationConfig;
  ColumnType = ColumnType;
  //#endregion

  ngOnInit() {
    this._getData();
  }

  constructor() {
    this.config = {
      length: 0,
      index: 0,
      size: 10,
      sizes: [10, 25, 100]
    }
  }
  //#region UI Functions
  // this method determines classes for each column head
  colHeadClass(column: ColumnConfig): string {
    if (column.type == this.ColumnType.Html) return '';
    return '';
  }

  sortData(column: ColumnConfig) {
    if (!column.sortable) return;
    // remove sort from other columns
    this.headerRow.forEach(col => {
      if (col != column) col.sortDir = undefined;
    });
    // sort data
    if (column.sortDir == 'asc') {
      this._sortAsc(column);
      column.sortDir = 'desc';
    } else {
      this._sortDesc(column);
      column.sortDir = 'asc';
    }
    this._getData();
  }
  private _sortAsc(column: ColumnConfig): void {
    this._dataRows.sort((a, b) => {
      const aVal = column.value(a);
      const bVal = column.value(b);
      if (aVal > bVal) return 1;
      if (aVal < bVal) return -1;
      return 0;
    });
    this._getData();
  }

  private _sortDesc(column: ColumnConfig): void {
    this._dataRows.sort((a, b) => {
      const aVal = column.value(a);
      const bVal = column.value(b);
      if (aVal > bVal) return -1;
      if (aVal < bVal) return 1;
      return 0;
    });
    this._getData();
  }
  //#endregion

  //#region DATA TABLE METHODS
  // this function gets data from dataRows and set data into rows to show table
  private _getData(): void {
    const startAt = this.config.index * this.config.size;
    this.rows = this._dataRows?.slice(startAt, startAt + this.config.size);
  }
  onPagniatorChange(value: PageEvent) {
    //console.log(value);
    this.config.size = value.pageSize;
    this.config.index = value.pageIndex;
    this._getData();
  }
  getAsSafeHtml(str: string): SafeHtml { return (str as SafeHtml) };
  // get icon of table action
  getActionIcon = (action: RowAction) => action.icon;
  getActionClasses(action: RowAction): string {
    let classes = 'btn btn-link btn-just-icon ';
    if (action.type == RowActionType.Warning) classes += 'btn-warning';
    if (action.type == RowActionType.Danger) classes += 'btn-danger';
    if (action.type == RowActionType.Info) classes += 'btn-info';
    return classes;
  }
  //#endregion
}