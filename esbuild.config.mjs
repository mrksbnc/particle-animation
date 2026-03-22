import { build } from "esbuild";
import { cpSync } from "node:fs";

await build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	minify: true,
	format: "esm",
	outdir: "dist",
});

cpSync("index.html", "dist/index.html");
cpSync("src/index.css", "dist/index.css");