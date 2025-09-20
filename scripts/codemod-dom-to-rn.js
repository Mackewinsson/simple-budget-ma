// Quick-and-dirty textual codemod (use on your copied components)
// NOTE: review diffs! This covers 80% cases.
import fs from "fs";
import path from "path";

const ROOT = path.resolve("components");

const REPLACERS = [
  // tags
  [/\bdiv\b/g, "View"],
  [/\bspan\b/g, "Text"],
  [/\bp\b/g, "Text"],
  [/\bbutton\b/g, "Pressable"],
  [/\bimg\b/g, "Image"],
  [/\binput\b/g, "TextInput"],
  // props
  [/onClick=/g, "onPress="],
  [/href=/g, "// href="], // manual conversion to router Link later
  [/className=/g, "/*tw*/ className="], // If using NativeWind; otherwise swap to style
];

function processFile(file) {
  let code = fs.readFileSync(file, "utf8");
  let changed = false;
  REPLACERS.forEach(([re, rep]) => {
    const next = code.replace(re, rep);
    if (next !== code) { code = next; changed = true; }
  });

  // Ensure RN imports exist
  if (changed && !/from "react-native"/.test(code)) {
    code = `import { View, Text, Pressable, Image, TextInput } from "react-native";\n` + code;
  }
  fs.writeFileSync(file, code, "utf8");
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (p.endsWith(".tsx") || p.endsWith(".ts")) processFile(p);
  }
}

walk(ROOT);
console.log("Codemod complete. Review diffs carefully.");
