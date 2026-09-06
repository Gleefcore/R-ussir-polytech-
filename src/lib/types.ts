export type Level = "MSP1" | "MSP2";
export type Subject = "math" | "physique" | "info";
export type ResType = "cours" | "td" | "exercices" | "tp" | "examens";
export type Role = "student" | "admin";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface StudyItem {
  id: string;
  subject: Subject;
  topic: string;
  done: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passHash: string;
  passSalt: string;
  level: Level;
  role: Role;
  createdAt: number;
  unlocked: string[];
  study: StudyItem[];
}

export type PublicUser = Omit<User, "passHash" | "passSalt">;

export interface Resource {
  id: string;
  title: string;
  subject: Subject;
  level: Level;
  type: ResType;
  premium: boolean;
  description: string;
  preview: string;
  tags: string[];
  createdAt: number;
}

export interface PurchaseRequest {
  id: string;
  userId: string;
  resourceId: string;
  status: RequestStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
}

export interface DB {
  users: User[];
  resources: Resource[];
  requests: PurchaseRequest[];
  sessions: Session[];
  announcements: Announcement[];
}
