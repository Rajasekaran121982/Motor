import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  imageUrls: string[] = [];
  currentIndex: number = 0;

  
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.http.get<string[]>('http://localhost:3000/api/images').subscribe(
      (response) => {
        this.imageUrls = response;
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }
  nextImage(): void {
    
    this.currentIndex= (this.currentIndex + 1) % this.imageUrls.length;
    console.log(this.imageUrls[this.currentIndex] )
  }
}
