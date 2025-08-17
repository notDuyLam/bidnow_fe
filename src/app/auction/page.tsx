"use client";

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
import { useListAuctionsQuery } from "@/store/services/api";
import { formatCentsToCurrency, parseMoneyStringToNumber } from "@/lib/money";
import { useState } from "react";

export default function AuctionsPage() {
  const { data: auctions = [], isLoading, error } = useListAuctionsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter auctions based on search and status
  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearch = auction.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || auction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Browse Auctions</h1>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load auctions</p>
            <Button
              className="bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Browse Auctions</h1>
        <Link href="/products">
          <Button className="bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90">
            Create Auction
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search auctions by ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "LIVE", "PENDING", "ENDED"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className={`capitalize ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90"
                      : "border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white"
                  }`}
                >
                  {status === "all" ? "All" : status.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auctions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAuctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <Card
              key={auction.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Auction #{auction.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Item ID: {auction.itemId.slice(0, 8)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(auction.status)}>
                    {auction.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Current Price:
                    </span>
                    <span className="font-semibold text-[#1b5cfc]">
                      {formatCentsToCurrency(
                        parseMoneyStringToNumber(
                          auction.currentPriceCents || auction.startPriceCents
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Min Increment:
                    </span>
                    <span className="text-sm">
                      {formatCentsToCurrency(
                        parseMoneyStringToNumber(auction.minIncrementCents)
                      )}
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
                  {auction.buyNowPriceCents && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Buy Now:</span>
                      <span className="text-sm text-[#9518fa]">
                        {formatCentsToCurrency(
                          parseMoneyStringToNumber(auction.buyNowPriceCents)
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Time Remaining:
                    </span>
                    <span className="text-sm font-medium">
                      {getTimeRemaining(auction.endsAt)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/auction/${auction.id}`} className="flex-1">
                    <Button
                      className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-400"
                      disabled={auction.status !== "LIVE"}
                    >
                      {auction.status === "LIVE"
                        ? "View & Bid"
                        : "View Details"}
                    </Button>
                  </Link>
                  {auction.buyNowPriceCents && auction.status === "LIVE" && (
                    <Button
                      variant="outline"
                      className="px-3 border-[#9518fa] text-[#9518fa] hover:bg-[#9518fa] hover:text-white"
                    >
                      Buy Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "No auctions match your filters"
                : "No auctions available at the moment"}
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                className="border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
