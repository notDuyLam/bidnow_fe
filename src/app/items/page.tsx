"use client";

import { useListItemsQuery, useCreateItemMutation } from "@/store/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ItemsPage() {
  const { data: items, isLoading, isError, refetch } = useListItemsQuery();
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();
  const [form, setForm] = useState({ sellerId: "", title: "", description: "" });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sellerId || !form.title) return;
    try {
      await createItem({ sellerId: form.sellerId, title: form.title, description: form.description || undefined }).unwrap();
      setForm({ sellerId: "", title: "", description: "" });
      await refetch();
    } catch {
      alert("Failed to create item");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Items</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div>
          <Label>Seller ID</Label>
          <Input value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })} required />
        </div>
        <div>
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="sm:col-span-2">
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div>
          <Button type="submit" disabled={isCreating}>Create</Button>
        </div>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-600">Failed to load items</p>
      ) : (
        <ul className="divide-y divide-neutral-200 border rounded-md">
          {items?.map((it) => (
            <li key={it.id} className="p-3">
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-neutral-600">Seller: {it.sellerId}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


