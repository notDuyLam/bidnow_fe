"use client";

import { useState } from "react";
import { useCreateUserMutation, useListUsersQuery } from "@/store/services/api";
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

export default function UsersPage() {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isError, refetch } = useListUsersQuery({
    offset,
    limit,
  });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleCreate = async (formData: FormData) => {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const displayName = String(formData.get("displayName") || "");
    const role = String(formData.get("role") || "USER") as
      | "USER"
      | "SELLER"
      | "ADMIN";
    if (!email || !password) return;
    try {
      await createUser({
        email,
        password,
        displayName: displayName || undefined,
        role,
      }).unwrap();
      await refetch();
    } catch {
      alert("Failed to create user. Possibly 'Email already in use'.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Users</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
          >
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" name="displayName" />
            </div>
            <div className="sm:col-span-1">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" defaultValue="USER" />
            </div>
            <div className="sm:col-span-1">
              <Button type="submit" disabled={isCreating}>
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>List users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Label>Offset</Label>
            <Input
              type="number"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-24"
            />
            <Label>Limit</Label>
            <Input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-24"
            />
            <Button onClick={() => refetch()}>Reload</Button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-600">Failed to load users</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-neutral-500">
                Total: {data?.total ?? 0}
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Display name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.email}</TableCell>
                      <TableCell className="text-sm">{u.role}</TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {u.profile?.displayName ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
