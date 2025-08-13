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
import {
  useListBidsForAuctionQuery,
  usePlaceBidMutation,
} from "@/store/services/api";
import { useState } from "react";

export default function BidsPage() {
  const [auctionId, setAuctionId] = useState("");
  const [userId, setUserId] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const { data, refetch } = useListBidsForAuctionQuery(
    auctionId as unknown as string,
    { skip: !auctionId }
  );
  const [placeBid, { isLoading }] = usePlaceBidMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Bids</h1>

      <Card>
        <CardHeader>
          <CardTitle>Load and place bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
            <div>
              <Label>Auction ID</Label>
              <Input
                value={auctionId}
                onChange={(e) => setAuctionId(e.target.value)}
              />
            </div>
            <div>
              <Label>User ID</Label>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div>
              <Label>Amount (cents)</Label>
              <Input
                type="number"
                value={amountCents}
                onChange={(e) => setAmountCents(Number(e.target.value))}
              />
            </div>
            <Button onClick={() => refetch()}>Load</Button>
            <Button
              disabled={!auctionId || !userId || amountCents <= 0 || isLoading}
              onClick={async () => {
                try {
                  await placeBid({ auctionId, userId, amountCents }).unwrap();
                  await refetch();
                } catch {
                  alert(
                    "Failed to place bid: ensure auction is live and bid is high enough."
                  );
                }
              }}
            >
              Place Bid
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bid history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount (cents)</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.amountCents}</TableCell>
                  <TableCell className="text-sm text-neutral-600">
                    {new Date(b.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">{b.userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
