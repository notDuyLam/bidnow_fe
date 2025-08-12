// Core domain types reflecting backend responses/contracts

export type UUID = string;

export type UserRole = "USER" | "SELLER" | "ADMIN";

export interface UserProfile {
  userId: UUID;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
}

export interface User {
  id: UUID;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string; // ISO
  profile: UserProfile | null;
}

export interface UsersListResponse {
  data: User[];
  total: number;
}

export interface Item {
  id: UUID;
  sellerId: UUID;
  title: string;
  description: string | null;
  images: unknown[] | null;
  categoryId: UUID | null;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
}

export interface Auction {
  id: UUID;
  itemId: UUID;
  currency: string; // default VND
  startPriceCents: string; // money as string
  minIncrementCents: string;
  reservePriceCents: string | null;
  buyNowPriceCents: string | null;
  startsAt: string; // ISO
  endsAt: string; // ISO
  status: "PENDING" | "LIVE" | "ENDED" | "CANCELLED";
  autoExtendSeconds: number;
  maxExtensions: number;
  currentPriceCents?: string; // may be set by backend when bids placed
}

export interface Bid {
  id: UUID;
  auctionId: UUID;
  userId: UUID;
  amountCents: string;
  createdAt: string; // ISO
  isProxy: boolean;
}

export interface Watchlist {
  userId: UUID;
  auctionId: UUID;
  createdAt: string; // ISO
}

export interface Notification {
  id: UUID;
  userId: UUID | null;
  type: string;
  payload: unknown;
  readAt: string | null; // ISO | null
  createdAt: string; // ISO
}

export interface SystemEvent {
  id: UUID;
  actorUserId: UUID | null;
  action: string;
  entityType: string;
  entityId: UUID;
  meta: unknown;
  createdAt: string; // ISO
}

export interface Session {
  id: UUID;
  userId: UUID;
  refreshTokenHash: string | null;
  userAgent: string | null;
  ip: string | null;
  expiresAt: string | null; // ISO | null
  createdAt: string; // ISO
}

export interface ApiError {
  status: number;
  message: string;
}


