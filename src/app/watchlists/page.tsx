"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddWatchlistMutation, useListWatchlistsForUserQuery, useRemoveWatchlistMutation } from "@/store/services/api";

export default function WatchlistsPage() {
  const [userId, setUserId] = useState("");
  const { data, refetch } = useListWatchlistsForUserQuery(userId as unknown as string, { skip: !userId });
  const [addWatchlist] = useAddWatchlistMutation();
  const [removeWatchlist] = useRemoveWatchlistMutation();

  const handleAdd = async (formData: FormData) => {
    const auctionId = String(formData.get("auctionId") || "");
    if (!userId || !auctionId) return;
    try {
      await addWatchlist({ userId, auctionId }).unwrap();
      await refetch();
    } catch {
      alert("Failed to add watchlist");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Watchlists</h1>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Label>User ID</Label>
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
        <Button onClick={() => userId && refetch()}>Load</Button>
      </div>

      <form action={handleAdd} className="flex items-end gap-3">
        <div className="flex-1">
          <Label>Auction ID</Label>
          <Input name="auctionId" />
        </div>
        <Button type="submit">Add</Button>
      </form>

      <ul className="divide-y divide-neutral-200 border rounded-md">
        {data?.map((w) => (
          <li key={`${w.userId}-${w.auctionId}`} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{w.auctionId}</div>
              <div className="text-sm text-neutral-600">{new Date(w.createdAt).toLocaleString()}</div>
            </div>
            <Button variant="outline" onClick={async () => { await removeWatchlist({ userId: w.userId, auctionId: w.auctionId }).unwrap(); await refetch(); }}>Remove</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}


