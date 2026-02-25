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


### Configuration

- Global styles are imported from `src/index.css` (Tailwind config is embedded there).
- The entrypoint is `src/main.tsx` which renders `<App />`.
- You can drop a custom favicon in `public/` and it will be served at `/favicon.svg` (or `/favicon.ico`).
- Adjust aliases and server settings in `vite.config.ts`.

---

Feel free to replace `favicon.svg` with any valid image (ICO/PNG/SVG).

---

## Contribution

Pull requests are welcome! Make sure to run the dev server and verify your changes before submitting.

---

Enjoy exploring and extending DevStation! 🎉
