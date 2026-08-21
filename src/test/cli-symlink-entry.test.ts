import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("../cli.js", import.meta.url));

test(
  "the CLI executes when npm launches it through a .bin symlink",
  { skip: process.platform === "win32" },
  () => {
    const dir = mkdtempSync(join(tmpdir(), "plumb-cli-symlink-"));
    const linkedCli = join(dir, "plumbline");
    try {
      symlinkSync(CLI, linkedCli);
      const output = execFileSync(process.execPath, [linkedCli, "schema"], {
        encoding: "utf8",
      });

      assert.match(output, /plumbline receipt schema/);
      assert.match(output, /diff_sha256/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  },
);
