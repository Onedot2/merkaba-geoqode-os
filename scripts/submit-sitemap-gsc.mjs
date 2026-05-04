/**
 * submit-sitemap-gsc.mjs
 * Submits realaios.com sitemap to Google Search Console via API.
 * Uses GMAIL_REFRESH_TOKEN + GOOGLE_SIGNIN_CLIENT_ID/SECRET for OAuth.
 * Run: node scripts/submit-sitemap-gsc.mjs
 */

import { readFileSync } from "fs";

// Load .env if present
try {
  const env = readFileSync(new URL("../.env", import.meta.url), "utf-8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const CLIENT_ID = process.env.GOOGLE_SIGNIN_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_SIGNIN_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error("❌ Missing required env vars:");
  if (!CLIENT_ID) console.error("   GOOGLE_SIGNIN_CLIENT_ID");
  if (!CLIENT_SECRET) console.error("   GOOGLE_SIGNIN_CLIENT_SECRET");
  if (!REFRESH_TOKEN) console.error("   GMAIL_REFRESH_TOKEN");
  console.error("\nThese should be set in Railway shared variables.");
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function submitSitemap(accessToken, siteUrl, sitemapUrl) {
  // URL-encode the site URL for the API path
  const encodedSite = encodeURIComponent(siteUrl);
  const encodedSitemap = encodeURIComponent(sitemapUrl);
  const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 204 || res.status === 200) {
    return { success: true, status: res.status };
  }
  const body = await res.text();
  return { success: false, status: res.status, body };
}

async function listSitemaps(accessToken, siteUrl) {
  const encodedSite = encodeURIComponent(siteUrl);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/sitemaps`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return res.json();
}

async function listSites(accessToken) {
  const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

(async () => {
  console.log("🔑 Getting GSC access token...");
  const token = await getAccessToken();
  console.log("✅ Access token obtained\n");

  // List all verified properties
  console.log("📋 Verified GSC properties:");
  const sites = await listSites(token);
  if (sites.siteEntry) {
    for (const s of sites.siteEntry) {
      console.log(`   ${s.siteUrl} (${s.permissionLevel})`);
    }
  } else {
    console.log("   (none found or API error)", JSON.stringify(sites));
  }
  console.log("");

  const SITE = "https://realaios.com/";
  const SITEMAP = "https://realaios.com/sitemap.xml";

  console.log(`📤 Submitting sitemap: ${SITEMAP}`);
  console.log(`   to property: ${SITE}`);
  const result = await submitSitemap(token, SITE, SITEMAP);

  if (result.success) {
    console.log(`✅ Sitemap submitted successfully (HTTP ${result.status})\n`);
  } else {
    console.error(`❌ Sitemap submission failed (HTTP ${result.status}):`);
    console.error(result.body);
    console.log("\nTrying sc-domain: format...");

    const result2 = await submitSitemap(
      token,
      "sc-domain:realaios.com",
      SITEMAP,
    );
    if (result2.success) {
      console.log(
        `✅ Submitted via sc-domain: format (HTTP ${result2.status})`,
      );
    } else {
      console.error(`❌ Also failed: ${result2.body}`);
    }
  }

  // List current sitemaps
  console.log("\n📋 Current sitemaps for realaios.com:");
  try {
    const sitemaps = await listSitemaps(token, SITE);
    if (sitemaps.sitemap) {
      for (const s of sitemaps.sitemap) {
        console.log(
          `   ${s.path} — ${s.lastSubmitted} — ${s.isPending ? "pending" : "indexed"}`,
        );
      }
    } else {
      console.log("   " + JSON.stringify(sitemaps));
    }
  } catch (e) {
    console.log("   Could not list:", e.message);
  }
})();
