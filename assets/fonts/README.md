# Fonts

Two typefaces, one per language. Both are served directly from this folder —
there is no CDN and no download step.

| Files | Used for | Set in |
| --- | --- | --- |
| `inter-latin-wght-normal.woff2`, `inter-latin-ext-wght-normal.woff2` | All English and Dutch text | `--font-latin` |
| `IranSans-Bold.woff`, `IranSans-Light.woff`, `IranSans-UltraLight.woff` | All Persian text | `--font-fa` |

Both tokens live in `assets/css/styles.css`, section 1. The `@font-face` blocks
that load the files are in section 0 of the same file.

---

## Inter — English and Dutch

**Licence: SIL Open Font License 1.1.** The full text is in
`Inter-LICENSE.txt`, next to this file. That file must stay here: the OFL
requires the notice to travel with the font files wherever they are
redistributed, and this repository is public and serves them.

Nothing needs to be bought or renewed. The OFL permits commercial use, web
embedding and redistribution, including inside a public repository like this
one. The only real restriction is that the fonts may not be sold on their own.

Copied from the `@fontsource-variable/inter` package used by the Mithra
foundation site, so both sites render latin text identically.

These are **variable** fonts: a single file contains every weight from 100 to
900, which is why the `@font-face` rules say `font-weight: 100 900` rather than
a single number. Two files are needed because each covers a different set of
characters — the browser reads the `unicode-range` list and downloads only the
one it actually needs.

## IRANSans — Persian

**Licence: held, but the document was not on hand as of 2026-08-11.** IRANSans
is a commercial Persian typeface. The maintainer has confirmed a licence exists;
the paperwork was simply not accessible at the time of writing. Attach it here
when it can be retrieved, so this folder documents its own terms the way the
Inter files do.

Copied from the maintainer's Lion-and-Sun-Nederland project on 2026-08-03.

**There is no Regular weight.** Only Bold, Light and UltraLight exist. Because
of that, `styles.css` deliberately declares the **Light** file as
`font-weight: 400` so that ordinary Persian text renders in Light without every
rule having to ask for weight 300. The filename and the declared weight
disagree on purpose — do not "correct" it. Changing Light back to 300 drops
Persian body text to Tahoma unless the Persian card's weight is changed in the
same edit.

If the licence ever turns out to be a problem, the drop-in replacement is an
open-licence Persian face — **Vazirmatn**, Estedad or Sahel. Any of them would
also supply the Regular weight IRANSans lacks, which would remove the need for
the 400 mapping above.

---

## Replacing a font

1. Put the new files in this folder.
2. In `assets/css/styles.css` section **0**, update the `@font-face` blocks to
   point at the new filenames, and the `format(...)` if the file type changed
   (`.woff` → `format('woff')`, `.woff2` → `format('woff2')`).
3. In section **1**, update `--font-latin` or `--font-fa` if the family name
   changed.
4. Add the new font's licence file to this folder and record it above.
5. In `index.html`, find `styles.css?v=` followed by a number and add one to it,
   so visitors get the new stylesheet instead of a cached copy.

Then check the page in a browser — the Persian instruction card and the preview
box are where a font change shows up first.
