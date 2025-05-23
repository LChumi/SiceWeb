import {Component, EventEmitter, Input, Output,OnInit} from '@angular/core';
import {faCloudUpload, faUpload} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit{

  @Input() message:string='';
  @Output() closeNotification= new EventEmitter<void>();

  ngOnInit(){
    setTimeout(()=>{
      this.close();
    },3000);
  }

  close(){
    this.closeNotification.emit();
  }

  protected readonly faCloudUpload = faCloudUpload;
  protected readonly faUpload = faUpload;
}
