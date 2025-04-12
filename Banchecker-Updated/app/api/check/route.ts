import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const check = searchParams.get("check")
  const playerId = searchParams.get("id")

  if (!playerId) {
    return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
  }

  // Handle ban check
  if (check === "checkbanned") {
    try {
      const url = `https://ff.garena.com/api/antihack/check_banned?lang=en&uid=${playerId}`

      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        Accept: "application/json, text/plain, */*",
        authority: "ff.garena.com",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        referer: "https://ff.garena.com/en/support/",
        "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "B6FksShzIgjfrYImLpTsadjS86sddhFH",
        Cookie:
          "_ga_8RFDT0P8N9=GS1.1.1706295767.2.0.1706295767.0.0.0; apple_state_key=8236785ac31b11ee960a621594e13693; datadome=bbC6XTzUAS0pXgvEs7u",
      }

      const response = await fetch(url, { headers })

      if (!response.ok) {
        return NextResponse.json({ error: "Failed to fetch data from server" }, { status: 500 })
      }

      const result = await response.json()
      const is_banned = result.data?.is_banned ?? 0

      return NextResponse.json({
        player_id: playerId,
        is_banned: Boolean(is_banned),
        status: is_banned ? "BANNED" : "NOT BANNED",
      })
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch data from server" }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
