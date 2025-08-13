"use client";

import { useListItemsQuery, useCreateItemMutation } from "@/store/services/api";
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
import { useState } from "react";

export default function ItemsPage() {
  const { data: items, isLoading, isError, refetch } = useListItemsQuery();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [form, setForm] = useState({
    sellerId: "",
    title: "",
    description: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sellerId || !form.title) return;
    try {
      await createItem({
        sellerId: form.sellerId,
        title: form.title,
        description: form.description || undefined,
      }).unwrap();
      setForm({ sellerId: "", title: "", description: "" });
      await refetch();
    } catch {
      alert("Failed to create item");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Items</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create item</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <Label>Seller ID</Label>
              <Input
                value={form.sellerId}
                onChange={(e) => setForm({ ...form, sellerId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <Button type="submit" disabled={isCreating}>
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-600">Failed to load items</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Seller</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium">{it.title}</TableCell>
                    <TableCell className="text-sm text-neutral-600">
                      {it.sellerId}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
