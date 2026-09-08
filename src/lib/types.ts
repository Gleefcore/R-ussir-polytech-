export type Level = "MSP1" | "MSP2";
export type ResType = "td" | "examens" | "corrections";
export type Role = "student" | "admin";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface StudyItem {
  id: string;
  /** catégorie officielle (math, physique, info, chimie, tech, transversal) */
  subject: string;
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
  /** id de matière du catalogue officiel (config.CATALOG) */
  subject: string;
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

export interface Formation {
  id: string;
  title: string;
  level: string;
  description: string;
  preview: string;
  createdAt: number;
}

export interface DB {
  users: User[];
  resources: Resource[];
  requests: PurchaseRequest[];
  sessions: Session[];
  announcements: Announcement[];
  formations: Formation[];
}
