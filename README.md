# ProjectHammerAndAnvil

Your one stop shop to trap and defeat the enemy.

## Tech Stack

- [Next.js](https://nextjs.org/) (static export)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/ProjectHammerAndAnvil](http://localhost:3000/ProjectHammerAndAnvil) in your browser.

## Building for Production

```bash
npm run build
```

This generates a static site in the `out/` directory via `output: 'export'` in `next.config.ts`.

## Deployment (GitHub Pages)

The site is automatically deployed to GitHub Pages on every push to the `main` branch via the GitHub Actions workflow in `.github/workflows/deploy.yml`.

**Live site:** `https://jitha-afk.github.io/ProjectHammerAndAnvil/`

To enable GitHub Pages for the first time:
1. Go to **Settings → Pages** in this repository.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` — the workflow will build and deploy automatically.
