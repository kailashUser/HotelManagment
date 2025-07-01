import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent} from './components/home-services/services.component';

import { RoomBrowseComponent } from './components/room-browse/room-browse.component';
import { ManagerLayoutComponent } from './components/manager/shared/manager-layout.component';
import { CustomerComponent } from './components/customer/customer.component';
import { BookRoomsComponent } from './components/customer/book-rooms/book-rooms.component';
import { ProfileComponent as CustomerProfileComponent } from './components/customer/profile/profile.component';
import { ProfileComponent as ManagerProfileComponent } from './components/manager/profile/profile.component';
import { MyReservationsComponent } from './components/customer/reservation/my-reservations.component';
import { BookingFormComponent } from './components/customer/booking/booking-form.component';
import { PaymentComponent } from './components/customer/booking/payment.component';
import { ReserveRoomComponent } from './components/customer/reservation/reserve-room.component';

// Import Manager Staff Components
import { StaffListComponent } from './components/manager/manage-staff/staff-list.component';
import { AddStaffComponent } from './components/manager/manage-staff/add-staff.component';
import { EditStaffComponent } from './components/manager/manage-staff/edit-staff.component';

// Import Manager Room Components
import { RoomListComponent as ManagerRoomListComponent } from './components/manager/manage-rooms/room-list.component';
import { AddRoomComponent as ManagerAddRoomComponent } from './components/manager/manage-rooms/add-room.component';
import { EditRoomComponent as ManagerEditRoomComponent } from './components/manager/manage-rooms/edit-room.component';

// Import Manager Revenue Components
import { RevenueDashboardComponent } from './components/manager/revenues/revenue-dashboard.component';

// Import Clerk Components
import { ClerkLayoutComponent } from './components/clerk/shared/clerk-layout.component';
import { ProfileComponent as ClerkProfileComponent } from './components/clerk/profile/profile.component';
import { RoomStatusComponent } from './components/clerk/room-status/room-status.component';
import { AddReservationComponent } from './components/clerk/reservations/add-reservation.component';
import { CheckOutComponent } from './components/clerk/billing/check-out.component';
import { BillSummaryComponent } from './components/clerk/billing/bill-summary.component';
import { ReservationFormComponent } from './components/clerk/reservations/reservation-form.component';
import { CustomerReservationsComponent } from './components/clerk/reservations/customer-reservations.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
   { path: 'service', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },

  { path: 'rooms', component: RoomBrowseComponent },
  {
    path: 'manager',
    component: ManagerLayoutComponent,
    children: [
      { path: 'profile', component: ManagerProfileComponent },
      { path: 'manage-staff', component: StaffListComponent },
      { path: 'add-staff', component: AddStaffComponent },
      { path: 'edit-staff/:id', component: EditStaffComponent },
      { path: 'manage-rooms', component: ManagerRoomListComponent },
      { path: 'add-room', component: ManagerAddRoomComponent },
      { path: 'edit-room/:id', component: ManagerEditRoomComponent },
      { path: 'revenues', component: RevenueDashboardComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  },
  {
    path: 'clerk',
    component: ClerkLayoutComponent,
    children: [
      { path: 'profile', component: ClerkProfileComponent },
      { path: 'manage-room-states', component: RoomStatusComponent },
      { path: 'customer-reservations', component: CustomerReservationsComponent },
      { path: 'check-out', component: CheckOutComponent },
      { path: 'billing/summary', component: BillSummaryComponent },
      { path: 'reservations/new', component: ReservationFormComponent },
      { path: '', redirectTo: 'manage-room-states', pathMatch: 'full' }
    ]
  },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      { path: 'book-rooms', component: BookRoomsComponent },
      { path: 'profile', component: CustomerProfileComponent },
      { path: 'my-reservations', component: MyReservationsComponent },
      { path: 'booking/:roomId', component: BookingFormComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'reserve/:id', component: ReserveRoomComponent },
      { path: '', redirectTo: 'book-rooms', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
