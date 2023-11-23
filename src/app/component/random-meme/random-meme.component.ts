import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RandomMemeService } from 'src/app/service/random-meme.service';

@Component({
  selector: 'app-random-meme',
  templateUrl: './random-meme.component.html'
})
export class RandomMemeComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.dialog.open(RandomMemeDialog).afterClosed()
  }

}
@Component({
  templateUrl: 'random-meme.dialog.html',
})
export class RandomMemeDialog {
  url: string;

  constructor(public dialogRef: MatDialogRef<RandomMemeDialog>, private memeService: RandomMemeService) {
    this.url = "";
    this.randomMemeButtonAction();
  }

  ngOnInit() {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.dialogRef.close();
      }
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close();
    });
  }

  randomMemeButtonAction() {
    this.memeService.getMeme().subscribe(x => this.url = x.url)
    console.log(this.url)
  }
}

