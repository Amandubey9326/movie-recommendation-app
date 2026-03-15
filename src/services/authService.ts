/**
 * Auth Service
 * 
 * Handles user authentication with localStorage.
 * In production, this would connect to a backend API.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = 'movierec_users';
const CURRENT_USER_KEY = 'movierec_current_user';

export const authService = {
  /**
   * Get all registered users
   */
  getUsers(): StoredUser[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  /**
   * Save users to storage
   */
  saveUsers(users: StoredUser[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  /**
   * Register a new user
   */
  signup(name: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password, // In production, this would be hashed
    };

    users.push(newUser);
    this.saveUsers(users);

    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  /**
   * Login user
   */
  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return { success: false, error: 'Email not found' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  /**
   * Get current logged in user
   */
  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
};

export default authService;
