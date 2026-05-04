/**
 * add-gsc-dns-txt.mjs
 * Adds the Google Search Console DNS TXT verification record to Cloudflare.
 * Run once: node scripts/add-gsc-dns-txt.mjs
 * Requires env vars: CLOUDFLARE_API_TOKEN, CLOUDFLARE_API_ZONE_ID
 */

const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE = process.env.CLOUDFLARE_API_ZONE_ID;
const GSC_TXT =
  "google-site-verification=tmtbFW4NtmRAviebhnpYumANQ8Z6d8H7oqsrRiKq_9E";

if (!CF_TOKEN || !CF_ZONE) {
  console.error(
    "❌  Set CLOUDFLARE_API_TOKEN and CLOUDFLARE_API_ZONE_ID first.",
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${CF_TOKEN}`,
  "Content-Type": "application/json",
};

// Check if the TXT record already exists
const list = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${CF_ZONE}/dns_records?type=TXT&name=realaios.com`,
  { headers },
).then((r) => r.json());

const existing = (list.result || []).find((r) => r.content === GSC_TXT);
if (existing) {
  console.log("✅  TXT record already exists:", existing.id);
  process.exit(0);
}

// Create it
const create = await fetch(
  `https://api.cloudflare.com/client/v4/zones/${CF_ZONE}/dns_records`,
  {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "TXT",
      name: "@",
      content: GSC_TXT,
      ttl: 3600,
      comment: "Google Search Console verification - realaios.com",
    }),
  },
).then((r) => r.json());

if (create.success) {
  console.log("✅  DNS TXT record added:", create.result.id);
  console.log("    Name:    @  (realaios.com)");
  console.log("    Type:    TXT");
  console.log("   ", GSC_TXT);
  console.log("\n→  Now click VERIFY in Google Search Console.");
} else {
  console.error("❌  Failed:", JSON.stringify(create.errors, null, 2));
}
