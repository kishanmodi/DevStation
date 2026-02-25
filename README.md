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
> The markdown tool offers two ways to get a PDF:
>
> * **Download PDF** – converts the preview into a file using `html2pdf.js` and
>   saves it directly; works in any browser environment.
> * **Print** – opens the browser's print dialog (`window.print()`), so you can
>   choose “Save as PDF” or send to a printer.
>
> In some cloud preview environments (Codespaces, GitHub etc.) the print dialog is
> disabled. If the “Print” button appears to do nothing, use the **Download PDF**
> option or run the app locally.


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
