import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { saveAs } from 'file-saver';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'table-pagination-example',
  styleUrls: ['data-table.component.scss'],
  templateUrl: 'data-table.component.html',
})
export class DataTableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['id', 'name', 'firstname', 'mail', 'action'];
  // dataSource!: MatTableDataSource<Guest>;
  dataSource = new MatTableDataSource<Guest>(GUEST_DATA);

  public positionToEdit!: number;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  public rowForm!: FormGroup;
  public uploadForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    //
  }

  public onActionClick() {
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.createRowForm();
    this.createUploadForm();
  }

  public createRowForm() {
    this.rowForm = this.fb.group({
      name: [''],
      firstname: [''],
      mail: [''],
    });
  }

  public onEditBtnClick(element: any) {
    this.positionToEdit = element.position;
    this.createRowForm();
    this.rowForm.patchValue({
      name: element.name,
      weight: element.weight,
      symbol: element.symbol,
    })
  }

  public onRemoveBtnClick(element: Guest) {
    let confirmation = confirm(`Sure you want to delete ${element.name}?`)

    if (confirmation) {
      GUEST_DATA = GUEST_DATA.filter((x: Guest) => x.id !== element.id);
      
      this.dataSource.data = GUEST_DATA;
      this.createRowForm();
      this.cancelRowEdition();
    }
  }

  public cancelRowEdition() {
    this.positionToEdit = -1;
  }

  public validateRow(element: Guest) {
    GUEST_DATA = GUEST_DATA.map((x: Guest) => {
      if (x.id === element.id) {
        return {
          id: x.id,
          name: this.rowForm.value.name,
          firstname: this.rowForm.value.firstname,
          mail: this.rowForm.value.mail,
        }
      }
      return x;
    });
    this.dataSource.data = GUEST_DATA;
    this.createRowForm();
    this.cancelRowEdition();
  }


  // CSV FILE
  public createUploadForm() {
    this.uploadForm = this.fb.group({
      file: ['', [Validators.required]]
    });
  }

  public onFileSelect(event: any) {
    // console.log(event)
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file')?.setValue(file);
    }
  }


  public downloadSample() {
    saveAs('assets/sample/sample.csv', 'sample.csv')
  }


  public onFileSubmit() {
    if (!this.uploadForm.invalid) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        console.log('e')
        console.log(e)
          console.log('------')
          console.log('fileReader.result')
        console.log(fileReader.result)
        console.log('------')
        console.log(JSON.parse(this.csvToJson(fileReader.result as string)))
        // console.log(fileReader.result);
        // console.log(JSON.parse(this.csvToJson(fileReader.result as string)))
        // this.dataSource = new MatTableDataSource<Guest>(JSON.parse(this.csvToJson(fileReader.result as string)));
        // console.log(this.csvToJson(fileReader.result as string));
        this.dataSource.data = JSON.parse(this.csvToJson(fileReader.result as string));
        
        // setTimeout(() => {
        //   this.dataSource.paginator = this.paginator;
        // }, 100)
        // this.dataSource.paginator = this.paginator;

      }
      // this.dataSource.paginator = this.paginator;
      fileReader.readAsText(this.uploadForm.get('file')?.value);
      // console.log(this.uploadForm.get('file'));
    } else {
      console.log('invalid');
    }
  }

  private csvToJson(csv: string) {
    var lines=csv.split("\n");
console.log(lines)
    var result = [];

    // NOTE: If your columns contain commas in their values, you'll need
    // to deal with those before doing the next step 
    // (you might convert them to &&& or something, then covert them back later)
    // jsfiddle showing the issue https://jsfiddle.net/
    var headers=lines[0].split(";");

    for(var i=1;i<lines.length;i++){
      var obj: any = {};
      var currentline=lines[i].split(";");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }
}

// export interface PeriodicElement {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }


// let ELEMENT_DATA: PeriodicElement[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
//   {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
//   {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
//   {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
//   {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
//   {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
//   {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
//   {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
//   {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
//   {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
//   {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
// ];


export interface Guest {
  id: number;
  name: string;
  firstname: string;
  mail: string;
}

let GUEST_DATA: Guest[] = []; 