import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export const dynamic = "force-dynamic";

// Initialize GA4 Client (Will safely fail if env variables are missing)
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL || "",
    private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "This Week";
    const propertyId = process.env.GA4_PROPERTY_ID;

    // --- SMART FALLBACK FOR DEVELOPMENT ---
    // Agar env variables nahi hain, toh UI crash hone ke bajaye mock data bhej do
    if (!propertyId || !process.env.GOOGLE_CLIENT_EMAIL) {
      return NextResponse.json({
        success: true,
        isMock: true, // Frontend can use this to show a "Setup Required" badge
        data: getMockData(range),
      });
    }

    // Determine Date Range based on dropdown
    let startDate = "7daysAgo";
    if (range === "This Month") startDate = "30daysAgo";
    if (range === "This Year") startDate = "365daysAgo";

    // Call Google Analytics 4 API
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }], // Chronological order
    });

    // Format Data for Recharts
    const formattedData = response.rows.map((row) => {
      // GA4 returns date as YYYYMMDD. We parse it to a readable format (e.g., "15 Apr")
      const rawDate = row.dimensionValues[0].value;
      const parsedDate = new Date(
        rawDate.substring(0, 4),
        rawDate.substring(4, 6) - 1,
        rawDate.substring(6, 8),
      );

      return {
        name: parsedDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        }),
        visitors: parseInt(row.metricValues[0].value),
        views: parseInt(row.metricValues[1].value),
      };
    });

    return NextResponse.json({
      success: true,
      isMock: false,
      data: formattedData,
    });
  } catch (error) {
    console.error("GA4 Traffic API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch traffic data" },
      { status: 500 },
    );
  }
}

// --- Helper for Mock Data (Keeps UI beautiful until GA4 is linked) ---
function getMockData(range) {
  if (range === "This Month") {
    return Array.from({ length: 30 }, (_, i) => ({
      name: `${i + 1} Apr`,
      visitors: Math.floor(Math.random() * 500) + 100,
      views: Math.floor(Math.random() * 1500) + 300,
    }));
  }
  return [
    { name: "Mon", visitors: 120, views: 340 },
    { name: "Tue", visitors: 150, views: 410 },
    { name: "Wed", visitors: 110, views: 290 },
    { name: "Thu", visitors: 200, views: 580 },
    { name: "Fri", visitors: 250, views: 720 },
    { name: "Sat", visitors: 320, views: 950 },
    { name: "Sun", visitors: 280, views: 810 },
  ];
}
