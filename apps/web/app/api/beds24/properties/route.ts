import { NextResponse } from "next/server";
import { fetchBeds24Properties } from "@discoverwhitby/integrations";

export async function GET() {
  try {
    // Try to fetch real Beds24 properties
    const properties = await fetchBeds24Properties();
    
    if (properties && properties.length > 0) {
      return NextResponse.json(properties.map((p: any) => ({
        id: String(p.id),
        name: String(p.name ?? "Untitled Property"),
        bedrooms: p.bedrooms ?? 1,
        maxGuests: p.maxGuests ?? 2,
        priceNight: p.priceNight ?? 100,
        images: p.images || []
      })));
    }

    // Fallback to demo properties if no real data
    const demoProperties = [
      { id: "demo-1", name: "Harbour View Cottage", bedrooms: 2, maxGuests: 4, priceNight: 120, images: [] },
      { id: "demo-2", name: "Abbey Loft Apartment", bedrooms: 1, maxGuests: 2, priceNight: 90, images: [] },
      { id: "demo-3", name: "Sea Breeze House", bedrooms: 3, maxGuests: 6, priceNight: 180, images: [] },
      { id: "demo-4", name: "Whitby Lighthouse Suite", bedrooms: 2, maxGuests: 4, priceNight: 150, images: [] },
    ];

    return NextResponse.json(demoProperties);
  } catch (error) {
    console.error('Failed to fetch Beds24 properties:', error);
    
    // Return demo properties as fallback
    const demoProperties = [
      { id: "demo-1", name: "Harbour View Cottage", bedrooms: 2, maxGuests: 4, priceNight: 120, images: [] },
      { id: "demo-2", name: "Abbey Loft Apartment", bedrooms: 1, maxGuests: 2, priceNight: 90, images: [] },
      { id: "demo-3", name: "Sea Breeze House", bedrooms: 3, maxGuests: 6, priceNight: 180, images: [] },
      { id: "demo-4", name: "Whitby Lighthouse Suite", bedrooms: 2, maxGuests: 4, priceNight: 150, images: [] },
    ];

    return NextResponse.json(demoProperties);
  }
}
