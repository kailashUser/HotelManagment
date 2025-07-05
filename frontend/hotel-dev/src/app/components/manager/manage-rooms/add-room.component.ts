import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CreateRoomDto } from '../../../models/room.model';
import { RoomService } from '../../../services/room.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manager-add-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss'],
})
export class AddRoomComponent implements OnInit {
  addRoomForm!: FormGroup;
  isSubmitting = false;

  roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'];
  roomStates = [
    { label: 'Available', value: 'true' },
    { label: 'Unavailable', value: 'false' },
  ];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.addRoomForm = this.fb.group({
      Number: ['', Validators.required],
      Type: ['', Validators.required], // Changed back to empty string
      Price: ['', [Validators.required, Validators.min(1)]],
      Capacity: [1, [Validators.required, Validators.min(1)]],
      Description: [''],
      Available: ['', Validators.required], // Changed back to empty string
    });

    // Debug: log when form is created
    console.log('Form created:', this.addRoomForm);
  }

  onSubmit(): void {
    console.log('=== BUTTON CLICKED ===');
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form valid?', this.addRoomForm.valid);
    console.log('Form value:', this.addRoomForm.value);

    if (this.addRoomForm.invalid) {
      console.log('Form is invalid, marking all fields as touched');
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const form = this.addRoomForm.value;

    // Check each field step by step
    console.log('=== CHECKING EACH FIELD ===');
    console.log('Number:', form.Number, 'Type:', typeof form.Number);
    console.log('Type:', form.Type, 'Type:', typeof form.Type);
    console.log('Price:', form.Price, 'Type:', typeof form.Price);
    console.log('Capacity:', form.Capacity, 'Type:', typeof form.Capacity);
    console.log('Available:', form.Available, 'Type:', typeof form.Available);
    console.log(
      'Description:',
      form.Description,
      'Type:',
      typeof form.Description
    );

    // Simple conversion - no complex validation
    const roomData: CreateRoomDto = {
      roomNumber: String(form.Number || ''),
      type: Number(form.Type || 0),
      basePrice: Number(form.Price || 0),
      capacity: Number(form.Capacity || 1),
      isAvailable: form.Available === 'true',
      description: form.Description || null,
    };

    console.log('=== FINAL DATA TO SEND ===');
    console.log('roomData:', roomData);
    console.log('roomData.type is number?', typeof roomData.type === 'number');
    console.log(
      'roomData.basePrice is number?',
      typeof roomData.basePrice === 'number'
    );
    console.log(
      'roomData.isAvailable is boolean?',
      typeof roomData.isAvailable === 'boolean'
    );

    this.roomService.createRoom(roomData).subscribe({
      next: (res) => {
        console.log('SUCCESS! Response:', res);
        this.isSubmitting = false;
        this.toastr.success('Room created successfully!');
        this.router.navigate(['/manager/manage-rooms']);
      },
      error: (err) => {
        console.log('ERROR! Full error object:', err);
        console.log('Error message:', err.message);
        console.log('Error status:', err.status);
        console.log('Error body:', err.error);
        this.isSubmitting = false;
        alert('Error creating room: ' + (err.message || 'Unknown error'));
      },
    });
  }

  // Add this debug method
  testClick(): void {
    console.log('TEST BUTTON CLICKED!');
    console.log('Form value:', this.addRoomForm.value);
  }

  cancel(): void {
    this.router.navigate(['/manager/manage-rooms']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.addRoomForm.controls).forEach((control) =>
      control.markAsTouched()
    );
  }
}
