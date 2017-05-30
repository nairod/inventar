import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
  selector: 'artikel-delete-dialog',
  templateUrl: './artikel-delete.component.html',
})
export class ArtikelDeleteDialog {
  constructor(public dialogRef: MdDialogRef<ArtikelDeleteDialog>) { }
}
