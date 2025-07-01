export interface UserDisplay {
  username: string;
  email: string;
  role: string; // derived from roleId
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
}
