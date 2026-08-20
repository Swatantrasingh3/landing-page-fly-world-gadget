import { chmodSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const platformPackages = {
  "linux-x64": "@esbuild/linux-x64",
  "linux-arm64": "@esbuild/linux-arm64",
  "darwin-x64": "@esbuild/darwin-x64",
  "darwin-arm64": "@esbuild/darwin-arm64",
};
const platformPackage = platformPackages[`${process.platform}-${process.arch}`];
if (!platformPackage) {
  throw new Error(`Unsupported esbuild platform: ${process.platform}-${process.arch}`);
}

const pnpmStore = join(process.cwd(), "node_modules", ".pnpm");
if (!existsSync(pnpmStore)) {
  throw new Error("node_modules/.pnpm is missing; run pnpm install first");
}

const esbuildPackages = readdirSync(pnpmStore).filter(name => name.startsWith("esbuild@"));
for (const packageName of esbuildPackages) {
  const packageDir = join(pnpmStore, packageName, "node_modules", "esbuild");
  const binaryPath = join(packageDir, "bin", "esbuild");
  const nativeBinary = join(pnpmStore, packageName, "node_modules", platformPackage, "bin", "esbuild");
  if (!existsSync(nativeBinary)) {
    throw new Error(`Missing ${platformPackage} for ${packageName}`);
  }
  chmodSync(nativeBinary, 0o755);

  if (!existsSync(binaryPath)) {
    writeFileSync(
      binaryPath,
      `#!/usr/bin/env node\nrequire("node:child_process").execFileSync(${JSON.stringify(nativeBinary)}, process.argv.slice(2), { stdio: "inherit" });\n`,
    );
  }
  chmodSync(binaryPath, 0o755);
}
