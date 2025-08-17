"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateItemMutation,
  useCreateAuctionMutation,
  useListItemsQuery,
} from "@/store/services/api";
import { useState } from "react";

export default function ProductsPage() {
  const { data: items = [], isLoading } = useListItemsQuery();
  const [createItem] = useCreateItemMutation();
  const [createAuction] = useCreateAuctionMutation();

  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isCreatingAuction, setIsCreatingAuction] = useState(false);

  // Item form state
  const [itemForm, setItemForm] = useState({
    title: "",
    description: "",
    sellerId: "",
  });

  // Auction form state
  const [auctionForm, setAuctionForm] = useState({
    itemId: "",
    startPrice: "",
    minIncrement: "",
    reservePrice: "",
    buyNowPrice: "",
    duration: "24", // hours
  });

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title || !itemForm.sellerId) return;

    setIsCreatingItem(true);
    try {
      await createItem({
        title: itemForm.title,
        description: itemForm.description || undefined,
        sellerId: itemForm.sellerId,
      }).unwrap();

      setItemForm({ title: "", description: "", sellerId: "" });
      alert("Item created successfully!");
    } catch (error) {
      alert("Failed to create item. Please try again.");
    } finally {
      setIsCreatingItem(false);
    }
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !auctionForm.itemId ||
      !auctionForm.startPrice ||
      !auctionForm.minIncrement
    )
      return;

    setIsCreatingAuction(true);
    try {
      const now = new Date();
      const endsAt = new Date(
        now.getTime() + parseInt(auctionForm.duration) * 60 * 60 * 1000
      );

      await createAuction({
        itemId: auctionForm.itemId,
        startPriceCents: Math.round(parseFloat(auctionForm.startPrice) * 100),
        minIncrementCents: Math.round(
          parseFloat(auctionForm.minIncrement) * 100
        ),
        reservePriceCents: auctionForm.reservePrice
          ? Math.round(parseFloat(auctionForm.reservePrice) * 100)
          : undefined,
        buyNowPriceCents: auctionForm.buyNowPrice
          ? Math.round(parseFloat(auctionForm.buyNowPrice) * 100)
          : undefined,
        startsAt: now.toISOString(),
        endsAt: endsAt.toISOString(),
        status: "LIVE",
        autoExtendSeconds: 300, // 5 minutes
        maxExtensions: 3,
      }).unwrap();

      setAuctionForm({
        itemId: "",
        startPrice: "",
        minIncrement: "",
        reservePrice: "",
        buyNowPrice: "",
        duration: "24",
      });
      alert("Auction created successfully!");
    } catch (error) {
      alert("Failed to create auction. Please try again.");
    } finally {
      setIsCreatingAuction(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Sell Your Products</h1>
        <p className="text-gray-600 mt-2">
          Create items and start auctions to sell your products to the
          community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Item Form */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Item</CardTitle>
            <CardDescription>
              First, create an item listing with details about your product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <Label htmlFor="sellerId">Seller ID *</Label>
                <Input
                  id="sellerId"
                  value={itemForm.sellerId}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      sellerId: e.target.value,
                    }))
                  }
                  placeholder="Enter your seller ID"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  In a real app, this would be automatically filled from your
                  profile.
                </p>
              </div>

              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={itemForm.title}
                  onChange={(e) =>
                    setItemForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isCreatingItem}
                className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 disabled:opacity-50"
              >
                {isCreatingItem ? "Creating Item..." : "Create Item"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Create Auction Form */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Create Auction</CardTitle>
            <CardDescription>
              Set up an auction for one of your items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAuction} className="space-y-4">
              <div>
                <Label htmlFor="itemId">Select Item *</Label>
                <select
                  id="itemId"
                  value={auctionForm.itemId}
                  onChange={(e) =>
                    setAuctionForm((prev) => ({
                      ...prev,
                      itemId: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5cfc] focus:border-[#1b5cfc]"
                  required
                >
                  <option value="">Choose an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title} (ID: {item.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
                {isLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading your items...
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startPrice">Starting Price (VND) *</Label>
                  <Input
                    id="startPrice"
                    type="number"
                    value={auctionForm.startPrice}
                    onChange={(e) =>
                      setAuctionForm((prev) => ({
                        ...prev,
                        startPrice: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minIncrement">Min Increment (VND) *</Label>
                  <Input
                    id="minIncrement"
                    type="number"
                    value={auctionForm.minIncrement}
                    onChange={(e) =>
                      setAuctionForm((prev) => ({
                        ...prev,
                        minIncrement: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reservePrice">Reserve Price (VND)</Label>
                  <Input
                    id="reservePrice"
                    type="number"
                    value={auctionForm.reservePrice}
                    onChange={(e) =>
                      setAuctionForm((prev) => ({
                        ...prev,
                        reservePrice: e.target.value,
                      }))
                    }
                    placeholder="Optional"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="buyNowPrice">Buy Now Price (VND)</Label>
                  <Input
                    id="buyNowPrice"
                    type="number"
                    value={auctionForm.buyNowPrice}
                    onChange={(e) =>
                      setAuctionForm((prev) => ({
                        ...prev,
                        buyNowPrice: e.target.value,
                      }))
                    }
                    placeholder="Optional"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Auction Duration</Label>
                <select
                  id="duration"
                  value={auctionForm.duration}
                  onChange={(e) =>
                    setAuctionForm((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b5cfc] focus:border-[#1b5cfc]"
                >
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours (1 day)</option>
                  <option value="72">72 hours (3 days)</option>
                  <option value="168">168 hours (1 week)</option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isCreatingAuction}
                className="w-full bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 disabled:opacity-50"
              >
                {isCreatingAuction ? "Creating Auction..." : "Create Auction"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Your Items */}
      <Card>
        <CardHeader>
          <CardTitle>Your Items ({items.length})</CardTitle>
          <CardDescription>
            Items you have created that can be used for auctions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    ID: {item.id.slice(0, 8)}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No items created yet.</p>
              <p className="text-sm text-gray-500">
                Create your first item using the form above to get started!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
