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
    this.positionToEdit = element.id;
    this.createRowForm();
    this.rowForm.patchValue({
      name: element.name,
      firstname: element.firstname,
      mail: element.mail,
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
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file')?.setValue(file);
    }
  }


  public downloadSample() {
    saveAs('assets/sample/sample.csv', 'sample.csv');
  }


  public downloadWrongSample() {
    saveAs('assets/sample/wrong-sample.csv', 'wrong-sample.csv');
  }


  public onFileSubmit() {
    if (!this.uploadForm.invalid) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        
        const lines = (fileReader.result as string).split("\n")

        const condition = lines[0].includes('id') && lines[0].includes('name') && lines[0].includes('firstname') && lines[0].includes('mail');

        if (condition) {
          this.dataSource.data = JSON.parse(this.csvToJson(fileReader.result as string));
          GUEST_DATA = JSON.parse(this.csvToJson(fileReader.result as string));
        } else {
          console.log('wrong format');
        }
      }
      fileReader.readAsText(this.uploadForm.get('file')?.value);
    } else {
      console.log('invalid');
    }
  }

  private csvToJson(csv: string) {
    var lines = csv.split("\n");
 
    var result = [];

    var headers=lines[0].split(";");
 
    for(var i=1;i<lines.length - 1;i++){
      var obj: any = {};
      var currentline=lines[i].split(";");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return JSON.stringify(result); //JSON
  }
}


export interface Guest {
  id: number;
  name: string;
  firstname: string;
  mail: string;
}

let GUEST_DATA: Guest[] = []; 