export enum UserRole {
  Admin = 0,
  Manager = 1,
  Clerk = 2,
  Customer = 3,
  TravelCompany = 4
}

export function getRoleName(roleId: number | string): string {
  switch (roleId.toString()) {
    case '0':
      return 'Admin';
    case '1':
      return 'Manager';
    case '2':
      return 'Clerk';
    case '3':
      return 'Customer';
    case '4':
      return 'Travel Company';
    default:
      return 'Unknown';
  }
}
