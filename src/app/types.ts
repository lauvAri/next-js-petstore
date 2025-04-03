export interface User {
  username:string,
}

export interface AuthContextType {
  user: User | null,
  isLogin:boolean,
  login:()=>void,
  logout:()=>void,
}