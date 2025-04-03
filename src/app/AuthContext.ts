import { createContext } from "react";
import {User, AuthContextType} from './types';

// 1. 创建Context
export const AuthContext = createContext<AuthContextType|null>(null);

// 2. 创建Provider组件
export default function AuthProvider () {
  return 
}
