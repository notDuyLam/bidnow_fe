"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateNotificationMutation,
  useListNotificationsQuery,
  useMarkNotificationReadMutation,
} from "@/store/services/api";
import { useState } from "react";

export default function NotificationsPage() {
  const [userId, setUserId] = useState("");
  const { data, refetch } = useListNotificationsQuery(
    userId ? { userId } : undefined
  );
  const [createNotification] = useCreateNotificationMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const handleCreate = async (formData: FormData) => {
    const type = String(formData.get("type") || "");
    const payloadRaw = String(formData.get("payload") || "{}");
    try {
      const payload = JSON.parse(payloadRaw || "{}");
      await createNotification({
        userId: userId || undefined,
        type,
        payload,
      }).unwrap();
      await refetch();
    } catch {
      alert("Failed to create notification");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <Label>User ID (optional)</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Target user or empty for broadcast"
              />
            </div>
            <Button onClick={() => refetch()}>Reload</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end"
          >
            <div>
              <Label>Type</Label>
              <Input name="type" required />
            </div>
            <div className="sm:col-span-4">
              <Label>Payload (JSON)</Label>
              <Textarea name="payload" defaultValue="{}" />
            </div>
            <div>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Payload</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.type}</TableCell>
                  <TableCell className="text-sm text-neutral-600">
                    {new Date(n.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs">
                    <pre className="text-xs whitespace-pre-wrap bg-neutral-50 p-2 rounded">
                      {JSON.stringify(n.payload, null, 2)}
                    </pre>
                  </TableCell>
                  <TableCell className="text-right">
                    {n.readAt ? (
                      <span className="text-xs text-neutral-500">Read</span>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={async () => {
                          await markRead(n.id).unwrap();
                          await refetch();
                        }}
                      >
                        Mark read
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
