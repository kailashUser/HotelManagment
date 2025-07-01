import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../services/user.service';



@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-staff.component.html',
  styleUrls: ['./edit-staff.component.scss']
})
export class EditStaffComponent implements OnInit {



  roleId: number = 0;
  editStaffForm: FormGroup
  staffId: number | null = null;
  staffData: any = {};
  staffRole: string[] = [];
  Roles = [
    'Admin',
    'Manager',
    'Clerk',
    'Travel Company'
  ];
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {

    this.editStaffForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
    })

  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.staffId = Number(params.get('id'));
      if (this.staffId) {
        this.loadStaffData(this.staffId);
      }
      this.staffRole = this.Roles
    });
  }

  loadStaffData(id: number): void {
    this.userService.getAllUsers().subscribe(users => {
      const user = users.find(u => u.id === id);
      if (user) {
        this.staffData = user;
        this.editStaffForm.patchValue({
          name: user.firstName + ' ' + user.lastName,
          email: user.email,
          role: this.Roles[user.roleId]
        });
      }
    });
  }


  getRoleId(role: string): number {
    console.log(role)
    switch (role) {
      case 'Admin':
        return 0;
      case 'Manager':
        return 1;
      case 'Clerk':
        return 2;
      case 'Customer':
        return 3;
      case 'Travel Company':
        return 4;
      default:
        return -1;
    }
  }
  onCancel() {
    this.editStaffForm.reset()
  }
  onSubmit(): void {
    if (this.editStaffForm.invalid || !this.staffId) return;

    const formValues = this.editStaffForm.value;
    const nameParts = formValues.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const updatedUser: any = {
      id: this.staffId,
      username: this.staffData.username, // required
      email: formValues.email.trim(),
      passwordHash: this.staffData.passwordHash || '123456', // required by backend — use old one or a placeholder
      roleId: this.getRoleId(formValues.role),
      firstName,
      lastName,
      phoneNumber: this.staffData.phone || '0000000000', // fallback phone
      isActive: this.staffData.isActive ?? true
    };

    this.userService.updateUser(this.staffId, updatedUser).subscribe({
      next: () => {
        this.toastr.success('Staff member updated successfully!', 'Success');
        this.router.navigate(['/manager/manage-staff']);
      },
      error: (err) => {
        console.error('Error updating staff:', err);
        this.toastr.success('Staff member created successfully!', 'danger');
      }
    });
  }


}
