import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
          >
            BidNow
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Link
              className="hover:text-[#1b5cfc] dark:hover:text-blue-400 transition-colors"
              href="/auction"
            >
              Browse Auctions
            </Link>
            <Link
              className="hover:text-[#1b5cfc] dark:hover:text-blue-400 transition-colors"
              href="/products"
            >
              Sell Products
            </Link>
            <Link
              className="hover:text-[#1b5cfc] dark:hover:text-blue-400 transition-colors"
              href="/about"
            >
              About
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/notification">
            <Button
              variant="outline"
              className="px-3 py-1.5 text-sm border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
            >
              🔔 Notifications
            </Button>
          </Link>
          <Link href="/auth">
            <Button className="px-3 py-1.5 text-sm bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
