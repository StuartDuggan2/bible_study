// Client-only build for Vercel deployments. Vercel bundles the API
// serverless function itself, so we only need the static SPA output.
import { build as viteBuild } from "vite";
import { rm } from "node:fs/promises";

async function build() {
  await rm("dist", { recursive: true, force: true });
  console.log("building client...");
  await viteBuild();
  console.log("done.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
