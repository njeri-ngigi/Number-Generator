import { Component } from '@angular/core';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  numbersValue = '';
  phoneNumbers = [];
  spanError = false;
  spanErrorText = '';

  validateNumber() {
    const parsedNumber = parseInt(this.numbersValue, 10);
    const validNumber = parsedNumber > 0 && parsedNumber <= 10000;

    if (!validNumber) {
      this.spanError = true;
      this.spanErrorText = 'enter a valid number between 1 and 10,000';
    }
  }

  generateNumbers() {
    this.spanError = false;
    this.validateNumber();
    if (!this.spanError) {
      const newLength = this.phoneNumbers.length + parseInt(this.numbersValue, 10);

      while (this.phoneNumbers.length < newLength) {
        const uniqueNumber = `0${Math.floor(100000000 + Math.random() * 900000000)}`;

        if (!this.phoneNumbers.includes(uniqueNumber)) {
          this.phoneNumbers.push(uniqueNumber);
        }
      }
    }
    this.phoneNumbers.sort();
  }

  downloadAsPDF() {
    if (this.phoneNumbers.length > 0) {
      const numbersString = this.phoneNumbers.join('\r\n');
      const blob = new Blob([numbersString], { type: 'text/plain;charset=utf-8' });
      FileSaver.saveAs(blob, 'phone-numbers.txt');
    }
  }

  clearNumbers() {
    this.phoneNumbers = [];
  }
}
