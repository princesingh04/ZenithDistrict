import { execSync } from "node:child_process";

// When opennextjs-cloudflare build runs, it sets NEXT_PRIVATE_STANDALONE = "true"
// and executes "npm run build" to compile Next.js in standalone mode.
if (process.env.NEXT_PRIVATE_STANDALONE === "true") {
  execSync("npx prisma generate && npx next build", { stdio: "inherit" });
} else {
  // If Cloudflare CI executes "npm run build" directly, delegate to opennextjs-cloudflare build
  execSync("npx opennextjs-cloudflare build", { stdio: "inherit" });
}
