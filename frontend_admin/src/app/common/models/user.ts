export interface User {
  _id: string;
  name: string;
  email: string;
}

export type UserListResponse = User[];