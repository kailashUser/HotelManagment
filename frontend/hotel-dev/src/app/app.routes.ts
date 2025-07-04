import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/home-services/services.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { BookRoomsComponent } from './components/customer/book-rooms/book-rooms.component';
import { BookingFormComponent } from './components/customer/booking/booking-form.component';
import { PaymentComponent } from './components/customer/booking/payment.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ProfileComponent as CustomerProfileComponent } from './components/customer/profile/profile.component';
import { MyReservationsComponent } from './components/customer/reservation/my-reservations.component';
import { ReserveRoomComponent } from './components/customer/reservation/reserve-room.component';
import { ProfileComponent as ManagerProfileComponent } from './components/manager/profile/profile.component';
import { ManagerLayoutComponent } from './components/manager/shared/manager-layout.component';
import { RoomBrowseComponent } from './components/room-browse/room-browse.component';

// Import Manager Staff Components
import { AddStaffComponent } from './components/manager/manage-staff/add-staff.component';
import { EditStaffComponent } from './components/manager/manage-staff/edit-staff.component';
import { StaffListComponent } from './components/manager/manage-staff/staff-list.component';

// Import Manager Room Components
import { AddRoomComponent as ManagerAddRoomComponent } from './components/manager/manage-rooms/add-room.component';
import { EditRoomComponent as ManagerEditRoomComponent } from './components/manager/manage-rooms/edit-room.component';
import { RoomListComponent as ManagerRoomListComponent } from './components/manager/manage-rooms/room-list.component';

// Import Manager Revenue Components
import { RevenueDashboardComponent } from './components/manager/revenues/revenue-dashboard.component';

// Import Clerk Components

import { CheckInComponent } from './components/clerk/check-in.component';
import { CheckOutComponent } from './components/clerk/billing/check-out.component';
import { ProfileComponent as ClerkProfileComponent } from './components/clerk/profile/profile.component';
import { AddReservationComponent } from './components/clerk/reservations/add-reservation.component';
import { CustomerReservationsComponent } from './components/clerk/reservations/customer-reservations.component';
import { ReservationFormComponent } from './components/clerk/reservations/reservation-form.component';
import { RoomStatusComponent } from './components/clerk/room-status/room-status.component';
import { ClerkLayoutComponent } from './components/clerk/shared/clerk-layout.component';
import { ReservationAutomaticCanelComponent } from './components/clerk/reservation-automatic-canel/reservation-automatic-canel.component';
import { NoShowBillsComponent } from './components/clerk/no-show-bills/no-show-bills.component';
import { AllBillsComponent } from './components/clerk/all-bills/all-bills.component';

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
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  {
    path: 'clerk',
    component: ClerkLayoutComponent,
    children: [
      { path: 'profile', component: ClerkProfileComponent },
      { path: 'manage-room-states', component: RoomStatusComponent },
      { path: 'noshow-bills', component: NoShowBillsComponent },
      { path: 'all-bills', component: AllBillsComponent },
      {
        path: 'cancel-reservation',
        component: ReservationAutomaticCanelComponent,
      },
      {
        path: 'customer-reservations',
        component: CustomerReservationsComponent,
      },
      { path: 'reservations/add', component: AddReservationComponent },
      { path: 'check-in', component: CheckInComponent },
      { path: 'reservations/new', component: ReservationFormComponent },
      { path: 'check-out', component: CheckOutComponent },
      { path: '', redirectTo: 'manage-room-states', pathMatch: 'full' },
    ],
  },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      { path: 'book-rooms', component: BookRoomsComponent },
      { path: 'profile', component: CustomerProfileComponent },
      { path: 'my-reservations', component: MyReservationsComponent },
      { path: 'booking/:id', component: BookingFormComponent },
      { path: 'payment/:id', component: PaymentComponent },
      { path: 'reserve/:id', component: ReserveRoomComponent },
      { path: '', redirectTo: 'book-rooms', pathMatch: 'full' },
    ],
  },
];
