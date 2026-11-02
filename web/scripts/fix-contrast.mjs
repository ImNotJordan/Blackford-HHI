import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name.endsWith(".tsx")) {
      let c = fs.readFileSync(p, "utf8");
      const n = c
        .replaceAll("label-mono !text-gold-deep", "label-mono")
        .replaceAll(
          'className="font-medium no-underline"',
          'className="font-medium text-ink no-underline"',
        )
        .replaceAll(
          'className="text-sm font-medium no-underline"',
          'className="text-link text-sm"',
        )
        .replaceAll(
          'className="inline-flex items-center gap-1 text-sm font-medium no-underline"',
          'className="inline-flex items-center gap-1 text-sm font-medium text-ink no-underline"',
        )
        .replaceAll(
          'className="mt-4 text-sm font-medium text-gold-deep underline"',
          'className="text-link mt-4 text-sm"',
        )
        .replaceAll(
          'className="w-full text-sm text-gold-deep underline"',
          'className="text-link w-full text-sm"',
        )
        .replaceAll(
          "font-mono text-xs text-gold-deep",
          "font-mono text-xs text-ink",
        );
      if (n !== c) {
        fs.writeFileSync(p, n);
        console.log("updated", path.relative(process.cwd(), p));
      }
    }
  }
}

walk(root);
console.log("done");
