import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-200">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-semibold">BidNow</Link>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/users">Users</Link>
          <Link href="/items">Items</Link>
          <Link href="/auctions">Auctions</Link>
          <Link href="/bids">Bids</Link>
          <Link href="/watchlists">Watchlists</Link>
          <Link href="/notifications">Notifications</Link>
          <Link href="/sessions">Sessions</Link>
        </div>
      </div>
    </nav>
  );
}


