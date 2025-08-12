import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "@/lib/config";
import type {
  Auction,
  Bid,
  Notification as NotificationDto,
  Session,
  SystemEvent,
  User,
  UsersListResponse,
  Watchlist,
  UUID,
  Item,
} from "@/lib/types";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
    credentials: "omit",
  }),
  tagTypes: [
    "Users",
    "User",
    "Items",
    "Item",
    "Auctions",
    "Auction",
    "Bids",
    "Watchlists",
    "Notifications",
    "Sessions",
  ],
  endpoints: (builder) => ({
    // Users
    createUser: builder.mutation<User, { email: string; password: string; displayName?: string; role?: "USER" | "SELLER" | "ADMIN" }>(
      {
        query: (body) => ({ url: "/users", method: "POST", body }),
        invalidatesTags: ["Users"],
      }
    ),
    listUsers: builder.query<UsersListResponse, { offset?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/users",
        params: (params ?? undefined) as Record<string, string | number | boolean | null | undefined> | undefined,
      }),
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, UUID>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Items
    createItem: builder.mutation<Item, { sellerId: UUID; title: string; description?: string; images?: unknown[]; categoryId?: UUID }>(
      {
        query: (body) => ({ url: "/items", method: "POST", body }),
        invalidatesTags: ["Items"],
      }
    ),
    listItems: builder.query<Item[], void>({
      query: () => ({ url: "/items" }),
      providesTags: ["Items"],
    }),
    getItem: builder.query<Item, UUID>({
      query: (id) => ({ url: `/items/${id}` }),
      providesTags: (result, error, id) => [{ type: "Item", id }],
    }),
    patchItem: builder.mutation<Item, { id: UUID } & Partial<{ sellerId: UUID; title: string; description?: string; images?: unknown[]; categoryId?: UUID }>>({
      query: ({ id, ...body }) => ({ url: `/items/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Item", id }, "Items"],
    }),
    deleteItem: builder.mutation<{ id: UUID }, UUID>({
      query: (id) => ({ url: `/items/${id}`, method: "DELETE" }),
      invalidatesTags: ["Items"],
    }),

    // Auctions
    createAuction: builder.mutation<Auction, {
      itemId: UUID;
      currency?: string;
      startPriceCents: number;
      minIncrementCents: number;
      reservePriceCents?: number;
      buyNowPriceCents?: number;
      startsAt: string;
      endsAt: string;
      status?: "PENDING" | "LIVE" | "ENDED" | "CANCELLED";
      autoExtendSeconds?: number;
      maxExtensions?: number;
    }>({
      query: (body) => ({ url: "/auctions", method: "POST", body }),
      invalidatesTags: ["Auctions"],
    }),
    listAuctions: builder.query<Auction[], void>({
      query: () => ({ url: "/auctions" }),
      providesTags: ["Auctions"],
    }),
    getAuction: builder.query<Auction, UUID>({
      query: (id) => ({ url: `/auctions/${id}` }),
      providesTags: (result, error, id) => [{ type: "Auction", id }],
    }),
    patchAuction: builder.mutation<Auction, { id: UUID } & Partial<{
      itemId: UUID;
      currency?: string;
      startPriceCents: number;
      minIncrementCents: number;
      reservePriceCents?: number;
      buyNowPriceCents?: number;
      startsAt: string;
      endsAt: string;
      status?: "PENDING" | "LIVE" | "ENDED" | "CANCELLED";
      autoExtendSeconds?: number;
      maxExtensions?: number;
    }>>({
      query: ({ id, ...body }) => ({ url: `/auctions/${id}`, method: "PATCH", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Auction", id }, "Auctions"],
    }),
    deleteAuction: builder.mutation<{ id: UUID }, UUID>({
      query: (id) => ({ url: `/auctions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Auctions"],
    }),

    // Bids
    placeBid: builder.mutation<Bid, { auctionId: UUID; userId: UUID; amountCents: number; minIncrementCents?: number; isProxy?: boolean }>({
      query: (body) => ({ url: "/bids", method: "POST", body }),
      invalidatesTags: (r, e, { auctionId }) => [{ type: "Bids", id: auctionId }, { type: "Auction", id: auctionId }],
    }),
    listBidsForAuction: builder.query<Bid[], UUID>({
      query: (auctionId) => ({ url: `/bids/auction/${auctionId}` }),
      providesTags: (result, error, auctionId) => [{ type: "Bids", id: auctionId }],
    }),
    getBid: builder.query<Bid, UUID>({
      query: (id) => ({ url: `/bids/${id}` }),
    }),

    // Watchlists
    addWatchlist: builder.mutation<Watchlist, { userId: UUID; auctionId: UUID }>({
      query: (body) => ({ url: "/watchlists", method: "POST", body }),
      invalidatesTags: (r, e, { userId }) => [{ type: "Watchlists", id: userId }],
    }),
    removeWatchlist: builder.mutation<{ userId: UUID; auctionId: UUID }, { userId: UUID; auctionId: UUID }>({
      query: ({ userId, auctionId }) => ({ url: `/watchlists/${userId}/${auctionId}`, method: "DELETE" }),
      invalidatesTags: (r, e, { userId }) => [{ type: "Watchlists", id: userId }],
    }),
    listWatchlistsForUser: builder.query<Watchlist[], UUID>({
      query: (userId) => ({ url: `/watchlists/user/${userId}` }),
      providesTags: (r, e, userId) => [{ type: "Watchlists", id: userId }],
    }),

    // Notifications
    createNotification: builder.mutation<NotificationDto, { userId?: UUID; type: string; payload: unknown }>({
      query: (body) => ({ url: "/notifications", method: "POST", body }),
      invalidatesTags: ["Notifications"],
    }),
    listNotifications: builder.query<NotificationDto[], { userId?: UUID } | void>({
      query: (params) => ({
        url: "/notifications",
        params: (params ?? undefined) as Record<string, string | number | boolean | null | undefined> | undefined,
      }),
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<NotificationDto, UUID>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: "POST" }),
      invalidatesTags: ["Notifications"],
    }),

    // System events
    createSystemEvent: builder.mutation<SystemEvent, { actorUserId?: UUID; action: string; entityType: string; entityId: UUID; meta?: unknown }>({
      query: (body) => ({ url: "/system-events", method: "POST", body }),
    }),
    listSystemEvents: builder.query<SystemEvent[], { entityType: string; entityId: UUID }>({
      query: ({ entityType, entityId }) => ({ url: `/system-events/${entityType}/${entityId}` }),
    }),

    // Sessions
    createSession: builder.mutation<Session, { userId: UUID; refreshTokenHash?: string; userAgent?: string; ip?: string; expiresAt?: string }>({
      query: (body) => ({ url: "/sessions", method: "POST", body }),
      invalidatesTags: ["Sessions"],
    }),
    getSession: builder.query<Session, UUID>({
      query: (id) => ({ url: `/sessions/${id}` }),
      providesTags: ["Sessions"],
    }),
    deleteSession: builder.mutation<{ id: UUID }, UUID>({
      query: (id) => ({ url: `/sessions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Sessions"],
    }),
  }),
});

export const {
  // users
  useCreateUserMutation,
  useListUsersQuery,
  useGetUserQuery,
  // items
  useCreateItemMutation,
  useListItemsQuery,
  useGetItemQuery,
  usePatchItemMutation,
  useDeleteItemMutation,
  // auctions
  useCreateAuctionMutation,
  useListAuctionsQuery,
  useGetAuctionQuery,
  usePatchAuctionMutation,
  useDeleteAuctionMutation,
  // bids
  usePlaceBidMutation,
  useListBidsForAuctionQuery,
  useGetBidQuery,
  // watchlists
  useAddWatchlistMutation,
  useRemoveWatchlistMutation,
  useListWatchlistsForUserQuery,
  // notifications
  useCreateNotificationMutation,
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  // sessions
  useCreateSessionMutation,
  useGetSessionQuery,
  useDeleteSessionMutation,
} = api;


