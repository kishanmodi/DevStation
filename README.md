# DevStation

**DevStation** is a local developer toolkit built with React, Vite, and Tailwind CSS. It provides a suite of handy utilities such as a code formatter, JSON viewer, HTTP client, kubernetes helper, and more — all accessible through a sidebar UI.

The repo includes everything needed to run and build the application.

---

## Features

- Modular tool architecture with lazy-loaded components
- Dark mode by default with Tailwind-powered theming
- Sidebar navigation and tabbed interface for switching between tools
- Built with Vite for fast development and production builds

---

## Getting Started

### Prerequisites

- Node.js 16+ (npm or yarn)

### Installation

```bash
npm install      # or `yarn`
```

### Development

```bash
npm run dev      # starts Vite on http://localhost:3000
```

### Build

```bash
npm run build    # outputs optimized files to `dist/`
```

> **Printing/Exporting PDF**
>
> The markdown tool now uses a manual flow built from `html2canvas` + `jsPDF`.
> Instead of relying on the monolithic `html2pdf.js` bundle (which had trouble
> parsing Tailwind’s `oklch` colours), the export works by:
>
> 1. cloning the preview and stripping all CSS classes,
> 2. rendering the clone to an off‑screen `<canvas>` using `html2canvas`, and
> 3. embedding the resulting image in a PDF document with `jsPDF`.
>
> This approach produces a faithful snapshot of the preview, avoids screen
> flicker, and completely sidesteps the previous colour‑function errors.  When
> you click **Download PDF** you'll be asked for a filename (the `.pdf` extension
> is added automatically).
>
> * **Print** – opens the browser's print dialog (`window.print()`), so you can
>   choose “Save as PDF” or send to a printer.
>
> In some cloud preview environments (Codespaces, GitHub etc.) the print dialog is
> disabled. If the “Print” button appears to do nothing, use the **Download PDF**
> option or run the app locally.
>
> **PDF libraries loaded from CDN** – the download button injects script tags
> for `html2canvas` and `jsPDF` from jsDelivr at runtime. This avoids the local
> dev server 504s that occurred when Vite attempted to serve those large
> dependencies from `/node_modules/.vite/deps`. The trade‑off is that export
> won’t work offline without the CDN, but the application bundle itself stays
> small. If you later decide to bundle the libraries, restore the static
> imports or configure manual chunks.

> **Diff Viewer**
>
> The diff tool now lets you type in **both** sides of the editor (the left pane
> is no longer read‑only) and updates are handled directly by Monaco rather than
> via React state, so typing feels smooth and instantaneous.
>
> Occasionally you may see the following error in the console when switching
> away from the diff tab or clearing the editors:
>
> ```
> Error: TextModel got disposed before DiffEditorWidget model got reset
> ```
>
> This is a known Monaco bug that occurs when the editor disposes its models
> during unmount; it does not indicate a problem with the application and can be
> safely ignored. The UI should continue to function normally.
> **Diff Viewer**
>
> The diff tool uses Monaco’s `DiffEditor` and both sides are editable – you can
> type in either the original or modified pane. Use the selector at the top to
> choose the language for syntax highlighting, and the clear/copy buttons to
> manage the contents.


### Configuration

- Global styles are imported from `src/index.css` (Tailwind config is embedded there).
- The entrypoint is `src/main.tsx` which renders `<App />`.
- You can drop a custom favicon in `public/` and it will be served at `/favicon.svg` (or `/favicon.ico`).
- Adjust aliases and server settings in `vite.config.ts`.

---

## Customizing Title/Favicon

The HTML template is in `index.html`. Update the `<title>` tag and add a `<link rel="icon" ...>` pointing to a favicon file in `public/`:

```html
<title>DevStation</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

Feel free to replace `favicon.svg` with any valid image (ICO/PNG/SVG).

---

## Contribution

Pull requests are welcome! Make sure to run the dev server and verify your changes before submitting.

---

Enjoy exploring and extending DevStation! 🎉
