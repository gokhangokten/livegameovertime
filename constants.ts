
import { User, Employee } from './types';

export const PREDEFINED_USERS: User[] = [
  { id: 'u1', username: 'ggokten', fullName: 'Gökten Yönetici', role: 'admin', password: '1' },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', firstName: 'Ahmet', lastName: 'Yılmaz', createdAt: new Date().toISOString() },
  { id: 'e2', firstName: 'Ayşe', lastName: 'Kaya', createdAt: new Date().toISOString() },
  { id: 'e3', firstName: 'Mehmet', lastName: 'Demir', createdAt: new Date().toISOString() },
  { id: 'e4', firstName: 'Fatma', lastName: 'Şahin', createdAt: new Date().toISOString() },
];
