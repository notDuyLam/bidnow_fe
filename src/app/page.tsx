import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">BidNow Frontend</h1>
      <p className="text-neutral-600">Base URL: {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}</p>
      <ul className="list-disc pl-6">
        <li><Link className="underline" href="/users">Users</Link></li>
        <li><Link className="underline" href="/items">Items</Link></li>
        <li><Link className="underline" href="/auctions">Auctions</Link></li>
        <li><a className="underline" href="http://localhost:3000/docs" target="_blank" rel="noreferrer">Swagger Docs</a></li>
      </ul>
    </div>
  );
}
