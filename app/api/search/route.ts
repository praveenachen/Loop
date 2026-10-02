import { NextResponse } from "next/server";
import { GET as listings } from "@/app/api/marketplace/listings/route";
import { GET as rides } from "@/app/api/rides/route";
import { GET as groups } from "@/app/api/study-groups/route";
import { getCurrentUser } from "@/lib/server-auth";
import { unauthorized } from "@/lib/api";
export async function GET(req: Request) {
  if (!await getCurrentUser()) return unauthorized();
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 140);
  if (!q) return NextResponse.json({ listings: [], rides: [], groups: [] });
  // Reuse domain serialization and current-user flags instead of duplicating business logic.
  const responses = await Promise.all([listings(), rides(), groups()]);
  for (const response of responses) if (!response.ok) return response;
  const [l, r, g] = await Promise.all(responses.map(response => response.json()));
  const matches = (values: (string | number)[]) => values.some(value => String(value).toLowerCase().includes(q));
  return NextResponse.json({
    listings: l.filter((v: { title: string; description: string; category: string; location: string; seller: { name: string } }) => matches([v.title, v.description, v.category, v.location, v.seller.name])),
    rides: r.filter((v: { route: string; departure: string; car: string; pricePerSeat: number; driver: { name: string } }) => matches([v.route, v.departure, v.car, v.pricePerSeat, v.driver.name])),
    groups: g.filter((v: { course: string; title: string; focus: string; location: string; host: { name: string } }) => matches([v.course, v.title, v.focus, v.location, v.host.name]))
  });
}
