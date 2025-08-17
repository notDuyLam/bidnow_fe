"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
  useCreateNotificationMutation,
} from "@/store/services/api";
import { useState } from "react";

export default function NotificationPage() {
  const { data: notifications = [], isLoading } = useListNotificationsQuery();
  const [markAsRead] = useMarkNotificationReadMutation();
  const [createNotification] = useCreateNotificationMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [newNotification, setNewNotification] = useState({
    userId: "",
    type: "bid_placed",
    message: "",
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      alert("Failed to mark notification as read");
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotification.type || !newNotification.message) return;

    setIsCreating(true);
    try {
      await createNotification({
        userId: newNotification.userId || undefined,
        type: newNotification.type,
        payload: { message: newNotification.message },
      }).unwrap();

      setNewNotification({ userId: "", type: "bid_placed", message: "" });
      alert("Notification created successfully!");
    } catch (error) {
      alert("Failed to create notification");
    } finally {
      setIsCreating(false);
    }
  };

  const formatNotificationMessage = (notification: any) => {
    const payload = notification.payload as any;

    switch (notification.type) {
      case "bid_placed":
        return payload?.message || "A new bid has been placed on your auction";
      case "auction_won":
        return payload?.message || "Congratulations! You won an auction";
      case "auction_ended":
        return payload?.message || "An auction you were watching has ended";
      case "outbid":
        return payload?.message || "You have been outbid on an auction";
      default:
        return payload?.message || `Notification: ${notification.type}`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "bid_placed":
        return "💰";
      case "auction_won":
        return "🎉";
      case "auction_ended":
        return "⏰";
      case "outbid":
        return "⚠️";
      default:
        return "🔔";
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.readAt);
  const readNotifications = notifications.filter((n) => n.readAt);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your auction activity
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {unreadNotifications.length} unread
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Unread Notifications */}
          {unreadNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                Unread ({unreadNotifications.length})
              </h2>
              {unreadNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="border-l-4 border-l-[#1b5cfc] bg-gradient-to-r from-[#1b5cfc]/5 to-[#9518fa]/5"
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {notification.type.replace("_", " ")}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-800">
                          {formatNotificationMessage(notification)}
                        </p>
                        {notification.userId && (
                          <p className="text-xs text-gray-500 mt-2">
                            User: {notification.userId.slice(0, 8)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="ml-4 px-3 py-1 text-xs border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white"
                      >
                        Mark Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Read Notifications */}
          {readNotifications.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">
                Read ({readNotifications.length})
              </h2>
              {readNotifications.map((notification) => (
                <Card key={notification.id} className="opacity-75">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg opacity-60">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="text-xs opacity-75"
                          >
                            {notification.type.replace("_", " ")}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {formatNotificationMessage(notification)}
                        </p>
                        {notification.userId && (
                          <p className="text-xs text-gray-400 mt-1">
                            User: {notification.userId.slice(0, 8)}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Read:{" "}
                          {new Date(notification.readAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Notifications */}
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <span className="text-4xl mb-4 block">🔔</span>
                <p className="text-gray-600 mb-4">No notifications yet</p>
                <p className="text-sm text-gray-500">
                  Notifications will appear here when there's activity on your
                  auctions
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Create Notification Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Test Notification</CardTitle>
              <CardDescription>
                Create a sample notification for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateNotification} className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID (Optional)</Label>
                  <Input
                    id="userId"
                    value={newNotification.userId}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        userId: e.target.value,
                      }))
                    }
                    placeholder="Leave empty for global notification"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If empty, creates a global notification
                  </p>
                </div>

                <div>
                  <Label htmlFor="type">Notification Type</Label>
                  <select
                    id="type"
                    value={newNotification.type}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="bid_placed">Bid Placed</option>
                    <option value="auction_won">Auction Won</option>
                    <option value="auction_ended">Auction Ended</option>
                    <option value="outbid">Outbid</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Enter notification message"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 disabled:opacity-50"
                >
                  {isCreating ? "Creating..." : "Create Notification"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Bid notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Auction ending alerts</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Outbid notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Email notifications</span>
                </label>
              </div>
              <Button
                variant="outline"
                className="w-full border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white"
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
