export interface UserDisplay {
  id: number;
  username: string;
  email: string;
  role: string;       // mapped string version (e.g., 'Admin')
  roleId: number;     // original numeric version (e.g., 0)
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
}
