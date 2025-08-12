"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAuctionMutation, useListAuctionsQuery, usePatchAuctionMutation } from "@/store/services/api";
import { formatCentsToCurrency, parseMoneyStringToNumber } from "@/lib/money";

export default function AuctionsPage() {
  const { data: auctions, isLoading, isError, refetch } = useListAuctionsQuery();
  const [createAuction, { isLoading: isCreating }] = useCreateAuctionMutation();
  const [patchAuction] = usePatchAuctionMutation();

  const [form, setForm] = useState({
    itemId: "",
    currency: "VND",
    startPriceCents: 100,
    minIncrementCents: 100,
    startsAt: new Date(Date.now() + 60_000).toISOString(),
    endsAt: new Date(Date.now() + 3_600_000).toISOString(),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemId) return;
    try {
      await createAuction({ ...form }).unwrap();
      await refetch();
    } catch {
      alert("Failed to create auction. Check itemId and times.");
    }
  };

  const setLive = async (id: string) => {
    try {
      await patchAuction({ id, status: "LIVE" }).unwrap();
      await refetch();
    } catch {
      alert("Failed to set auction live");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Auctions</h1>

      <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <div className="sm:col-span-2">
          <Label>Item ID</Label>
          <Input value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} required />
        </div>
        <div>
          <Label>Currency</Label>
          <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
        </div>
        <div>
          <Label>Start price (cents)</Label>
          <Input type="number" value={form.startPriceCents} onChange={(e) => setForm({ ...form, startPriceCents: Number(e.target.value) })} />
        </div>
        <div>
          <Label>Min increment (cents)</Label>
          <Input type="number" value={form.minIncrementCents} onChange={(e) => setForm({ ...form, minIncrementCents: Number(e.target.value) })} />
        </div>
        <div className="sm:col-span-3">
          <Label>Starts At (ISO)</Label>
          <Input value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
        </div>
        <div className="sm:col-span-3">
          <Label>Ends At (ISO)</Label>
          <Input value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
        </div>
        <div>
          <Button type="submit" disabled={isCreating}>Create</Button>
        </div>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-600">Failed to load auctions</p>
      ) : (
        <ul className="divide-y divide-neutral-200 border rounded-md">
          {auctions?.map((a) => {
            const current = parseMoneyStringToNumber(a.currentPriceCents || a.startPriceCents);
            return (
              <li key={a.id} className="p-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{a.id}</div>
                  <div className="text-sm text-neutral-600">{a.status} · {formatCentsToCurrency(current, a.currency)}</div>
                  <div className="text-xs text-neutral-500">Ends {new Date(a.endsAt).toLocaleString()}</div>
                </div>
                {a.status === "PENDING" && (
                  <Button onClick={() => setLive(a.id)}>Set LIVE</Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}


