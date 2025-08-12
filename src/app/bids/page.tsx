"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useListBidsForAuctionQuery, usePlaceBidMutation } from "@/store/services/api";
import { useState } from "react";

export default function BidsPage() {
  const [auctionId, setAuctionId] = useState("");
  const [userId, setUserId] = useState("");
  const [amountCents, setAmountCents] = useState(0);
  const { data, refetch } = useListBidsForAuctionQuery(auctionId as unknown as string, { skip: !auctionId });
  const [placeBid, { isLoading }] = usePlaceBidMutation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Bids</h1>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
        <div>
          <Label>Auction ID</Label>
          <Input value={auctionId} onChange={(e) => setAuctionId(e.target.value)} />
        </div>
        <div>
          <Label>User ID</Label>
          <Input value={userId} onChange={(e) => setUserId(e.target.value)} />
        </div>
        <div>
          <Label>Amount (cents)</Label>
          <Input type="number" value={amountCents} onChange={(e) => setAmountCents(Number(e.target.value))} />
        </div>
        <Button onClick={() => refetch()}>Load</Button>
        <Button
          disabled={!auctionId || !userId || amountCents <= 0 || isLoading}
          onClick={async () => {
            try {
              await placeBid({ auctionId, userId, amountCents }).unwrap();
              await refetch();
            } catch {
              alert("Failed to place bid: ensure auction is live and bid is high enough.");
            }
          }}
        >Place Bid</Button>
      </div>

      <ul className="divide-y divide-neutral-200 border rounded-md">
        {data?.map((b) => (
          <li key={b.id} className="p-3">
            <div className="font-medium">{b.amountCents}</div>
            <div className="text-xs text-neutral-500">{new Date(b.createdAt).toLocaleString()} · {b.userId}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


