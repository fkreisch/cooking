import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackComponent } from '../../base/snack/snack.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public newsLetterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {

    this.newsLetterForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      terms: new FormControl(false, [Validators.required]),
    });

  }

  ngOnInit() {
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(SnackComponent, {
      duration: 3000,
      data: message
    });
  }

  subscribeNewsLetter() {
    this.openSnackBar('Sikeresen feliratkoztál a hírlevelünkre.');
  }
}
