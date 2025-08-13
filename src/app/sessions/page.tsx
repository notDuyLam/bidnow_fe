"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useCreateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionQuery,
} from "@/store/services/api";
import { useState } from "react";

export default function SessionsPage() {
  const [sessionId, setSessionId] = useState("");
  const [userId, setUserId] = useState("");
  const { data, refetch } = useGetSessionQuery(sessionId as unknown as string, {
    skip: !sessionId,
  });
  const [createSession] = useCreateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Get / delete session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <Label>Session ID</Label>
              <Input
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
            </div>
            <Button onClick={() => refetch()}>Get</Button>
            {data && (
              <Button
                variant="outline"
                onClick={async () => {
                  await deleteSession(data.id).unwrap();
                  setSessionId("");
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
            <div>
              <Label>User ID</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <Label>Expires At (ISO, optional)</Label>
              <Input name="expiresAt" placeholder="2025-12-31T23:59:59.000Z" />
            </div>
            <Button
              onClick={async () => {
                if (!userId) return;
                await createSession({ userId }).unwrap();
                alert("Session created");
              }}
            >
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Current session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="font-medium">{data.id}</div>
              <div className="text-sm text-neutral-600">
                User: {data.userId}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
