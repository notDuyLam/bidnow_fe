"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCreateAuctionMutation,
  useListAuctionsQuery,
  usePatchAuctionMutation,
} from "@/store/services/api";
import { formatCentsToCurrency, parseMoneyStringToNumber } from "@/lib/money";

export default function AuctionsPage() {
  const {
    data: auctions,
    isLoading,
    isError,
    refetch,
  } = useListAuctionsQuery();
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
      <h1 className="text-2xl font-semibold tracking-tight">Auctions</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create auction</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end"
          >
            <div className="sm:col-span-2">
              <Label>Item ID</Label>
              <Input
                value={form.itemId}
                onChange={(e) => setForm({ ...form, itemId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Input
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </div>
            <div>
              <Label>Start price (cents)</Label>
              <Input
                type="number"
                value={form.startPriceCents}
                onChange={(e) =>
                  setForm({ ...form, startPriceCents: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label>Min increment (cents)</Label>
              <Input
                type="number"
                value={form.minIncrementCents}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minIncrementCents: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="sm:col-span-3">
              <Label>Starts At (ISO)</Label>
              <Input
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </div>
            <div className="sm:col-span-3">
              <Label>Ends At (ISO)</Label>
              <Input
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
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
          <CardTitle>All auctions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : isError ? (
            <p className="text-red-600">Failed to load auctions</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Ends</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions?.map((a) => {
                  const current = parseMoneyStringToNumber(
                    a.currentPriceCents || a.startPriceCents
                  );
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.id}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.status === "LIVE"
                              ? "default"
                              : a.status === "PENDING"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatCentsToCurrency(current, a.currency)}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {new Date(a.endsAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {a.status === "PENDING" && (
                          <Button onClick={() => setLive(a.id)}>
                            Set LIVE
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
