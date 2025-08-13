"use client";

import { useState } from "react";
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
import {
  useAddWatchlistMutation,
  useListWatchlistsForUserQuery,
  useRemoveWatchlistMutation,
} from "@/store/services/api";

export default function WatchlistsPage() {
  const [userId, setUserId] = useState("");
  const { data, refetch } = useListWatchlistsForUserQuery(
    userId as unknown as string,
    { skip: !userId }
  );
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
      <h1 className="text-2xl font-semibold tracking-tight">Watchlists</h1>

      <Card>
        <CardHeader>
          <CardTitle>Load watchlists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label>User ID</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <Button onClick={() => userId && refetch()}>Load</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add to watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleAdd} className="flex items-end gap-3">
            <div className="flex-1">
              <Label>Auction ID</Label>
              <Input name="auctionId" />
            </div>
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Watchlist items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auction</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((w) => (
                <TableRow key={`${w.userId}-${w.auctionId}`}>
                  <TableCell className="font-medium">{w.auctionId}</TableCell>
                  <TableCell className="text-sm text-neutral-600">
                    {new Date(w.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      onClick={async () => {
                        await removeWatchlist({
                          userId: w.userId,
                          auctionId: w.auctionId,
                        }).unwrap();
                        await refetch();
                      }}
                    >
                      Remove
                    </Button>
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
