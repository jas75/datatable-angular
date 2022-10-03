import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'table-pagination-example',
  styleUrls: ['data-table.component.scss'],
  templateUrl: 'data-table.component.html',
})
export class DataTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  public positionToEdit!: number;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public rowForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    //
  }

  public onActionClick() {
    
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.createRowForm();
  }

  public createRowForm() {
    this.rowForm = this.fb.group({
      name: [''],
      weight: [''],
      symbol: [''],
    });
  }

  public onEditBtnClick(element: any) {
    // console.log(element);
    this.positionToEdit = element.position;
    this.createRowForm();
    this.rowForm.patchValue({
      name: element.name,
      weight: element.weight,
      symbol: element.symbol,
    })
  }

  public onRemoveBtnClick(element: PeriodicElement) {
    let confirmation = confirm(`Sure you want to delete ${element.name}?`)

    if (confirmation) {
      ELEMENT_DATA = ELEMENT_DATA.filter((x: PeriodicElement) => x.position !== element.position);
      
      this.dataSource.data = ELEMENT_DATA;
      this.createRowForm();
      this.cancelRowEdition();
    }
  }

  public cancelRowEdition() {
    this.positionToEdit = -1;
  }

  public validateRow(element: PeriodicElement) {
    ELEMENT_DATA = ELEMENT_DATA.map((x: PeriodicElement) => {
      if (x.position === element.position) {
        return {
          position: x.position,
          name: this.rowForm.value.name,
          weight: this.rowForm.value.weight,
          symbol: this.rowForm.value.symbol,
        }
      }
      return x;
    });
    this.dataSource.data = ELEMENT_DATA;
    this.createRowForm();
    this.cancelRowEdition();
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

let ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];