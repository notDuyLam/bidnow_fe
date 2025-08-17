"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetAuctionQuery,
  useListBidsForAuctionQuery,
  usePlaceBidMutation,
  useGetItemQuery,
} from "@/store/services/api";
import { formatCentsToCurrency, parseMoneyStringToNumber } from "@/lib/money";
import { useState } from "react";

export default function AuctionDetailPage() {
  const params = useParams();
  const auctionId = params.id as string;

  const {
    data: auction,
    isLoading: auctionLoading,
    error: auctionError,
  } = useGetAuctionQuery(auctionId);
  const { data: bids = [], isLoading: bidsLoading } =
    useListBidsForAuctionQuery(auctionId);
  const { data: item } = useGetItemQuery(auction?.itemId || "");
  const [placeBid] = usePlaceBidMutation();

  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ENDED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeRemaining = (endsAt: string) => {
    const now = new Date();
    const end = new Date(endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handlePlaceBid = async () => {
    if (!auction || !bidAmount) return;

    const amountCents = Math.round(parseFloat(bidAmount) * 100);
    const currentPrice = parseMoneyStringToNumber(
      auction.currentPriceCents || auction.startPriceCents
    );
    const minIncrement = parseMoneyStringToNumber(auction.minIncrementCents);

    if (amountCents <= currentPrice + minIncrement) {
      alert(
        `Bid must be at least ${formatCentsToCurrency(
          currentPrice + minIncrement
        )}`
      );
      return;
    }

    setIsPlacingBid(true);
    try {
      await placeBid({
        auctionId,
        userId: "temp-user-id", // In real app, get from auth context
        amountCents,
      }).unwrap();
      setBidAmount("");
      alert("Bid placed successfully!");
    } catch (error) {
      alert("Failed to place bid. Please try again.");
    } finally {
      setIsPlacingBid(false);
    }
  };

  if (auctionLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
            <div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (auctionError || !auction) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Auction Not Found</h1>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">
              The requested auction could not be found.
            </p>
            <Link href="/auction">
              <Button className="bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90">
                Browse Other Auctions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPrice = parseMoneyStringToNumber(
    auction.currentPriceCents || auction.startPriceCents
  );
  const minIncrement = parseMoneyStringToNumber(auction.minIncrementCents);
  const minBidAmount = currentPrice + minIncrement;
  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Auction #{auction.id.slice(0, 8)}
          </h1>
          <p className="text-gray-600">
            Item: {item?.title || `Item #${auction.itemId.slice(0, 8)}`}
          </p>
        </div>
        <Badge className={getStatusColor(auction.status)}>
          {auction.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {item ? (
                <>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-600">{item.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Seller ID:</span>
                      <span className="ml-2">{item.sellerId.slice(0, 8)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Listed:</span>
                      <span className="ml-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading item details...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bid History */}
          <Card>
            <CardHeader>
              <CardTitle>Bid History ({bids.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {bidsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 animate-pulse"
                    >
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="h-4 bg-gray-300 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : sortedBids.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {sortedBids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <div>
                        <span className="font-medium">
                          {formatCentsToCurrency(
                            parseMoneyStringToNumber(bid.amountCents)
                          )}
                        </span>
                        {bid.isProxy && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Proxy
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>User: {bid.userId.slice(0, 8)}</div>
                        <div>{new Date(bid.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No bids yet. Be the first to bid!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bidding Panel */}
        <div className="space-y-6">
          {/* Current Price & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1b5cfc]">
                {formatCentsToCurrency(currentPrice)}
              </CardTitle>
              <CardDescription>Current Price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Time Remaining:</span>
                <span className="font-medium">
                  {getTimeRemaining(auction.endsAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Min Increment:</span>
                <span className="text-sm">
                  {formatCentsToCurrency(minIncrement)}
                </span>
              </div>
              {auction.reservePriceCents && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reserve:</span>
                  <span className="text-sm">
                    {formatCentsToCurrency(
                      parseMoneyStringToNumber(auction.reservePriceCents)
                    )}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bidding Form */}
          {auction.status === "LIVE" && (
            <Card>
              <CardHeader>
                <CardTitle>Place a Bid</CardTitle>
                <CardDescription>
                  Minimum bid: {formatCentsToCurrency(minBidAmount)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bidAmount">Bid Amount (VND)</Label>
                  <Input
                    id="bidAmount"
                    type="number"
                    placeholder={(minBidAmount / 100).toString()}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBidAmount / 100}
                    step="0.01"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 disabled:opacity-50"
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid || !bidAmount}
                >
                  {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                </Button>
                {auction.buyNowPriceCents && (
                  <Button
                    variant="outline"
                    className="w-full border-[#9518fa] text-[#9518fa] hover:bg-[#9518fa] hover:text-white"
                  >
                    Buy Now -{" "}
                    {formatCentsToCurrency(
                      parseMoneyStringToNumber(auction.buyNowPriceCents)
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Auction Details */}
          <Card>
            <CardHeader>
              <CardTitle>Auction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Started:</span>
                <span>{new Date(auction.startsAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ends:</span>
                <span>{new Date(auction.endsAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auto Extend:</span>
                <span>{auction.autoExtendSeconds}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max Extensions:</span>
                <span>{auction.maxExtensions}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
