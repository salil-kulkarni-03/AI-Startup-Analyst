/**
 * AUTHENTICATION SYSTEM
 * Simple client-side auth with localStorage
 * For production, replace with real backend auth
 */

export interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthUser {
  name: string;
  email: string;
  phone: string;
}

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('infinity_users');
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem('infinity_users', JSON.stringify(users));
};

// Register new user
export const signup = (name: string, email: string, phone: string, password: string): { success: boolean; message: string } => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }

  // Check if phone already exists
  if (users.find(u => u.phone === phone)) {
    return { success: false, message: 'Phone number already registered' };
  }

  // Add new user
  users.push({ name, email, phone, password });
  saveUsers(users);
  
  return { success: true, message: 'Account created successfully!' };
};

// Login user - accepts any password
export const login = (email: string, password: string): { success: boolean; message: string; user?: AuthUser } => {
  const users = getUsers();
  const user = users.find(u => u.email === email); // Only check email, not password
  
  if (!user) {
    return { success: false, message: 'Email not found. Please sign up first.' };
  }

  // Save current user (password not validated)
  localStorage.setItem('infinity_current_user', JSON.stringify({ name: user.name, email: user.email, phone: user.phone }));
  
  return { 
    success: true, 
    message: 'Login successful!',
    user: { name: user.name, email: user.email, phone: user.phone }
  };
};

// Get current logged in user
export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('infinity_current_user');
  return user ? JSON.parse(user) : null;
};

// Logout
export const logout = () => {
  localStorage.removeItem('infinity_current_user');
};

// Update profile
export const updateProfile = (name: string, email: string, phone: string): { success: boolean; message: string } => {
  const users = getUsers();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return { success: false, message: 'Not logged in' };
  }

  const userIndex = users.findIndex(u => u.email === currentUser.email);
  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }

  users[userIndex] = { ...users[userIndex], name, email, phone };
  saveUsers(users);
  
  localStorage.setItem('infinity_current_user', JSON.stringify({ name, email, phone }));
  
  return { success: true, message: 'Profile updated successfully!' };
};
