// src/utils/auth.ts
interface User {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

// 🔹 استدعاء البيانات من localStorage
function getUsers(): User[] {
  const data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
}

// 🔹 حفظ البيانات في localStorage
function setUsers(users: User[]) {
  localStorage.setItem('users', JSON.stringify(users));
}

// 🔹 تسجيل مستخدم جديد
export function saveUser(user: User): boolean {
  const users = getUsers();
  const exists = users.some(u => u.email === user.email);
  if (exists) return false;
  users.push(user);
  setUsers(users);
  return true;
}

// 🔹 تسجيل الدخول
export function loginUser(email: string, password: string): boolean {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // حفظ الجلسة
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }
  return false;
}

// 🔹 تسجيل الخروج
export function logoutUser() {
  localStorage.removeItem('currentUser');
}

// 🔹 التحقق من الجلسة الحالية
export function getCurrentUser(): User | null {
  const data = localStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
}

// 🔹 هل المستخدم مسجل الدخول؟
export function isLoggedIn(): boolean {
  return localStorage.getItem('currentUser') !== null;
}
