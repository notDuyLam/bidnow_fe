"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateNotificationMutation, useListNotificationsQuery, useMarkNotificationReadMutation } from "@/store/services/api";
import { useState } from "react";

export default function NotificationsPage() {
  const [userId, setUserId] = useState("");
  const { data, refetch } = useListNotificationsQuery(userId ? { userId } : undefined);
  const [createNotification] = useCreateNotificationMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const handleCreate = async (formData: FormData) => {
    const type = String(formData.get("type") || "");
    const payloadRaw = String(formData.get("payload") || "{}");
    try {
      const payload = JSON.parse(payloadRaw || "{}");
      await createNotification({ userId: userId || undefined, type, payload }).unwrap();
      await refetch();
    } catch {
      alert("Failed to create notification");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Notifications</h1>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div>
          <Label>User ID (optional)</Label>
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Target user or empty for broadcast" />
        </div>
        <Button onClick={() => refetch()}>Reload</Button>
      </div>

      <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <div>
          <Label>Type</Label>
          <Input name="type" required />
        </div>
        <div className="sm:col-span-4">
          <Label>Payload (JSON)</Label>
          <Input name="payload" defaultValue="{}" />
        </div>
        <div>
          <Button type="submit">Create</Button>
        </div>
      </form>

      <ul className="divide-y divide-neutral-200 border rounded-md">
        {data?.map((n) => (
          <li key={n.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{n.type}</div>
              <div className="text-xs text-neutral-500">{new Date(n.createdAt).toLocaleString()}</div>
              <pre className="text-xs whitespace-pre-wrap bg-neutral-50 p-2 rounded mt-1">{JSON.stringify(n.payload, null, 2)}</pre>
            </div>
            {n.readAt ? (
              <span className="text-xs text-neutral-500">Read</span>
            ) : (
              <Button variant="outline" onClick={async () => { await markRead(n.id).unwrap(); await refetch(); }}>Mark read</Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


