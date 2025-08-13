import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  return (
    <nav className="w-full">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">
            BidNow
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-3 text-sm text-neutral-700">
            <Link className="hover:underline" href="/users">
              Users
            </Link>
            <Link className="hover:underline" href="/items">
              Items
            </Link>
            <Link className="hover:underline" href="/auctions">
              Auctions
            </Link>
            <Link className="hover:underline" href="/bids">
              Bids
            </Link>
            <Link className="hover:underline" href="/watchlists">
              Watchlists
            </Link>
            <Link className="hover:underline" href="/notifications">
              Notifications
            </Link>
            <Link className="hover:underline" href="/sessions">
              Sessions
            </Link>
          </div>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
