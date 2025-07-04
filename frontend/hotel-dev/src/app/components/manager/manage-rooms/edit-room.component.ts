import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateRoomDto } from '../../../models/room.model';
import { RoomService } from '../../../services/room.service';

@Component({
  selector: 'app-manager-edit-room',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss'],
})
export class EditRoomComponent implements OnInit {
  editRoomForm!: FormGroup;
  isSubmitting = false;
  roomId!: number;

  roomtypes = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'];
  roomStates = [
    { label: 'Available', value: 'true' },
    { label: 'Unavailable', value: 'false' }
  ];

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Get room ID from route
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));

    // Initialize form
    this.editRoomForm = this.fb.group({
      Number: ['', Validators.required],
      Type: ['', Validators.required],
      Price: ['', [Validators.required, Validators.min(1)]],
      Capacity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      Description: [''],
      Available: ['', Validators.required],
    });

    // Load room data
    this.loadRoomData();
  }

  loadRoomData(): void {
    this.roomService.getRoomById(this.roomId).subscribe({
      next: (room) => {
        console.log('Loaded room data:', room);
        this.editRoomForm.patchValue({
          Number: room.roomNumber,
          Type: this.roomtypes[room.type], // Convert number to string
          Price: room.basePrice,
          Capacity: room.capacity,
          Description: room.description || '',
          Available: room.isAvailable ? 'true' : 'false' // Convert boolean to string
        });
      },
      error: (err) => {
        console.error('Error loading room:', err);
        alert('Error loading room data: ' + (err.message || 'Unknown error'));
        this.router.navigate(['/manager/manage-rooms']);
      }
    });
  }

  onUpdate(): void {
    console.log('=== UPDATE FORM SUBMISSION START ===');
    console.log('Form valid?', this.editRoomForm.valid);
    console.log('Form value:', this.editRoomForm.value);

    if (this.editRoomForm.invalid) {
      console.log('Form is invalid, marking all fields as touched');
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    const form = this.editRoomForm.value;

    // Convert form values to proper types
    const roomData: CreateRoomDto = {
      roomNumber: String(form.Number || ''),
      type: this.roomtypes.indexOf(form.Type), // Convert string back to number
      basePrice: Number(form.Price || 0),
      capacity: Number(form.Capacity || 1),
      isAvailable: form.Available === 'true', // Convert string to boolean
      description: form.Description || null,
    };

    console.log('=== FINAL DATA TO SEND ===');
    console.log('roomData:', roomData);

    this.roomService.updateRoom(this.roomId, roomData).subscribe({
      next: (res) => {
        console.log('SUCCESS! Response:', res);
        this.isSubmitting = false;
        this.toastr.success('Room updated successfully!', 'success')
        this.router.navigate(['/manager/manage-rooms']);
      },
      error: (err) => {
        console.log('ERROR! Full error object:', err);
        this.isSubmitting = false;
        alert('Error updating room: ' + (err.message || 'Unknown error'));
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/manager/manage-rooms']);
  }

  private markFormGroupTouched(): void {
    Object.values(this.editRoomForm.controls).forEach((control) =>
      control.markAsTouched()
    );
  }
}
