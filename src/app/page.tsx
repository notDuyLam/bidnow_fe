import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          BidNow Frontend
        </h1>
        <p className="text-neutral-600">Base URL: {baseUrl}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
            <CardDescription>Navigate to common resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link className="underline" href="/users">
                Users
              </Link>
              <Link className="underline" href="/items">
                Items
              </Link>
              <Link className="underline" href="/auctions">
                Auctions
              </Link>
              <Link className="underline" href="/bids">
                Bids
              </Link>
              <Link className="underline" href="/watchlists">
                Watchlists
              </Link>
              <Link className="underline" href="/notifications">
                Notifications
              </Link>
              <Link className="underline" href="/sessions">
                Sessions
              </Link>
            </div>
            <Separator className="my-4" />
            <a
              className="underline text-sm"
              href="http://localhost:3000/docs"
              target="_blank"
              rel="noreferrer"
            >
              Swagger Docs
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>
              Use the links to create users, items, and auctions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-600">
              This UI is built with shadcn-like primitives for a clean,
              consistent look and quick testing against the API.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
