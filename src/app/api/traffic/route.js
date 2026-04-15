import { NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "This Week";

    const propertyId = process.env.GA4_PROPERTY_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!propertyId || !clientEmail || !privateKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GA4 keys are missing in environment variables.",
        },
        { status: 400 },
      );
    }

    // Initialize GA4 Client with Service Account Credentials
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
    });

    // Determine Date Range
    let startDate = "7daysAgo";
    if (range === "This Month") startDate = "30daysAgo";

    // Call Google Analytics API
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });

    // EMPTY STATE HANDLING
    if (!response.rows || response.rows.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // Data Formatting for Frontend Recharts
    const formattedData = response.rows.map((row) => {
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
        visitors: parseInt(row.metricValues[0].value) || 0,
        views: parseInt(row.metricValues[1].value) || 0,
      };
    });

    return NextResponse.json(
      { success: true, data: formattedData },
      { status: 200 },
    );
  } catch (error) {
    console.error("GA4 Traffic API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch traffic data from Google Analytics.",
      },
      { status: 500 },
    );
  }
};