import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  role: "customer" | "admin";
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory store — replace with a real DB (Postgres/Prisma) in production
const users: UserRecord[] = [
  {
    id: "usr_001",
    email: "alice@example.com",
    passwordHash: "$2b$12$hashedpassword1",
    role: "customer",
    firstName: "Alice",
    lastName: "Smith",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "usr_002",
    email: "admin@example.com",
    passwordHash: "$2b$12$hashedpassword2",
    role: "admin",
    firstName: "Bob",
    lastName: "Admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const User = {
  // Find a user by email — used in password reset request
  async findByEmail(email: string): Promise<UserRecord | undefined> {
    return users.find((u) => u.email === email);
  },

  // Find a user by ID — used in password reset confirmation
  async findById(id: string): Promise<UserRecord | undefined> {
    return users.find((u) => u.id === id);
  },

  // Update password — hashes with bcrypt before storing
  async updatePassword(this: UserRecord, newPassword: string): Promise<void> {
    this.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    this.updatedAt = new Date();
  },

  // Verify password — used at login
  async verifyPassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  },
};
