export interface User {
    token: string;
    expiresIn: number;
    roleIds: string[];
    roleNames: string[];
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    userId: string;
  }


  export interface ServerResponse {
    success: boolean;
    data: any;
    message: string;
}
