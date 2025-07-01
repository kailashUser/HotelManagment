import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDisplay } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {

  staffMembers: UserDisplay[] = [];
  AllUsers: UserDisplay[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.loadStaff();
  }

  // getting  staff users from all user by filtering
  loadStaff(): void {
    this.userService.getAllUsers().subscribe((res) => {
      this.staffMembers = res.filter(user => user.roleId !== 3);
      console.log(this.staffMembers)
    });
  }
  // all users
  loadUsers(): void {
    this.userService.getAllUsers().subscribe((res) => {
      this.AllUsers = res;
      console.log(this.AllUsers);
    })
  }



  //not completed yet ---------------------

  editStaff(id: number): void {

  }

  deleteStaff(id: number): void {

  }

}
