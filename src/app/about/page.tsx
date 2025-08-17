import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About BidNow</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your premier destination for online auctions. Experience the thrill of
          bidding and discover unique items from sellers around the world.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              To create a transparent, fair, and exciting marketplace where
              buyers and sellers can connect through the time-tested tradition
              of auctions. We believe everyone should have access to unique
              items and fair pricing through competitive bidding.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👁️ Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              To become the world's most trusted auction platform, fostering a
              community where authenticity, fairness, and excitement drive every
              transaction. We envision a future where auctions are accessible,
              secure, and enjoyable for everyone.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How BidNow Works</CardTitle>
          <CardDescription>
            Simple steps to start buying and selling through auctions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold">1. Sign Up</h3>
              <p className="text-sm text-gray-600">
                Create your account as a bidder or seller. It's free and takes
                just a few minutes.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold">2. Browse & Bid</h3>
              <p className="text-sm text-gray-600">
                Explore live auctions, place bids, and watch items you're
                interested in.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="font-semibold">3. Win & Enjoy</h3>
              <p className="text-sm text-gray-600">
                Win auctions, complete secure transactions, and enjoy your new
                items!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⚡ Real-time Bidding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Experience live auctions with instant bid updates, automatic
              extensions, and real-time notifications to keep you in the action.
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
              bank-level security and encrypted transactions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📱 Mobile Responsive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Bid from anywhere with our fully responsive design that works
              perfectly on desktop, tablet, and mobile devices.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔔 Smart Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Stay informed with intelligent notifications for bid updates,
              auction endings, and important account activities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Flexible Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Set starting prices, reserve prices, buy-now options, and minimum
              bid increments to maximize your selling potential.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👥 Community Focused
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Join a growing community of buyers and sellers who value
              transparency, fairness, and the excitement of auctions.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Technical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
          <CardDescription>
            Built with modern web technologies for performance and reliability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Frontend Technologies</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Next.js 14 with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Redux Toolkit for state management</li>
                <li>• RTK Query for API management</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time auction updates</li>
                <li>• Responsive design</li>
                <li>• Type-safe API integration</li>
                <li>• Component-based architecture</li>
                <li>• Modern UI/UX patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-[#1b5cfc]/10 to-[#9518fa]/10 border-0">
        <CardContent className="text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Join thousands of users who trust BidNow for their auction needs
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <Button className="px-6 py-3 bg-gradient-to-r from-[#1b5cfc] to-[#9518fa] hover:from-[#1b5cfc]/90 hover:to-[#9518fa]/90">
                Create Account
              </Button>
            </Link>
            <Link href="/auction">
              <Button
                variant="outline"
                className="px-6 py-3 border-[#1b5cfc] text-[#1b5cfc] hover:bg-[#1b5cfc] hover:text-white"
              >
                Browse Auctions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
