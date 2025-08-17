// Landing page
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
import { useListAuctionsQuery } from "@/store/services/api";
import { formatCentsToCurrency, parseMoneyStringToNumber } from "@/lib/money";

export default function Home() {
  const { data: auctions = [], isLoading } = useListAuctionsQuery();

  // Get featured auctions (live auctions)
  const featuredAuctions = auctions
    .filter((auction) => auction.status === "LIVE")
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] dark:from-blue-600 dark:to-purple-600 text-white rounded-lg p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to BidNow
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            Discover amazing deals and bid on unique items in real-time auctions
          </p>
          <div className="flex gap-4">
            <Link href="/auction">
              <Button
                variant="secondary"
                className="text-lg px-6 py-3 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Browse Auctions
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                className="text-lg px-6 py-3 text-white border-white hover:bg-white hover:text-[#1b5cfc] dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-900"
              >
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Live Auctions</h2>
          <Link href="/auction">
            <Button
              variant="outline"
              className="border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
            >
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : featuredAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAuctions.map((auction) => (
              <Card
                key={auction.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">
                    Auction #{auction.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    Ends: {new Date(auction.endsAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Current Price:
                      </span>
                      <span className="font-semibold text-[#1b5cfc] dark:text-blue-400">
                        {formatCentsToCurrency(
                          parseMoneyStringToNumber(
                            auction.currentPriceCents || auction.startPriceCents
                          )
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Min Increment:
                      </span>
                      <span className="text-sm">
                        {formatCentsToCurrency(
                          parseMoneyStringToNumber(auction.minIncrementCents)
                        )}
                      </span>
                    </div>
                  </div>
                  <Link href={`/auction/${auction.id}`}>
                    <Button className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600">
                      View & Bid
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No live auctions at the moment
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600">
                  Create Your First Auction
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔥 Live Bidding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Experience real-time bidding with instant updates and
              notifications.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🛡️ Secure Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Your payments and personal information are protected with
              bank-level security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📱 Mobile Friendly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Bid from anywhere with our responsive design and mobile-optimized
              experience.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
