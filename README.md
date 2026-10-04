This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Administration du contenu (Decap CMS)

Le contenu du site (`src/lib/data-store.json`) est éditable sans coder via
Decap CMS : ouvrir **`/admin`** dans le navigateur (ex :
https://aephat.netlify.app/admin), se connecter, modifier, publier.
Chaque publication crée un commit GitHub sur `main` et Netlify
reconstruit le site automatiquement.

Configuration : `public/admin/config.yml` (backend `github`, médias dans
`public/uploads`). Habillage aux couleurs AEPHAT : écran de démarrage
(`DecapStudio.tsx`), feuille d'aperçu `public/admin/preview.css` et gabarit
d'aperçu `src/app/admin/cms-setup.tsx` (cartes comme sur le site), plus une
feuille globale `public/admin/aephat-cms.css` qui repeint le shell du CMS
(header, boutons, champs, badges) aux couleurs du logo.
Authentification : Git Gateway + Netlify Identity (recommandé, voir
commentaires en tête du fichier) ou GitHub OAuth App + proxy OAuth
(`base_url` / `auth_endpoint`). Édition locale : `npx decap-server` puis
ouvrir `/admin`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
