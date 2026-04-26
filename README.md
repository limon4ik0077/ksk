# KSK Shop

Next.js storefront for `KSK Shop` with catalog, account, checkout, admin panel, local file database, and product image uploads.

## Dependencies

Runtime dependencies:

- `next`
- `react`
- `react-dom`
- `framer-motion`
- `bcryptjs`
- `nedb-promises`

Development dependencies:

- `typescript`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `eslint`
- `eslint-config-next`
- `@types/node`
- `@types/react`
- `@types/react-dom`

## Local run

```bash
npm install
npm run dev
```

## Server deploy in one command

Requirements:

- Docker
- Docker Compose

From the project root:

```bash
docker compose up -d --build
```

The app will start on port `3000`.

Optional environment variable:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

You can export it before launch or place it in `.env`.

## Useful commands

```bash
npm run build
npm run start
npm run deploy:server
docker compose logs -f
docker compose down
```

## Notes

- Uploaded images are stored in `public/uploads`.
- Application data is stored in `data`.
- `docker-compose.yml` mounts both directories so data survives container rebuilds.
