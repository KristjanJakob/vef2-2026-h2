# Vefforritun 2 - Hópverkefni 2

## Um verkefnið

Þetta verkefni er React framendi sem tengist vefþjónustu úr Hópverkefni 1.

Vefurinn sýnir viðburði, styður leit, innskráningu og admin panel til að búa til viðburði.

## Keyrsla

### 1. Keyra backend (H1)

Fara í H1 möppu:

`npm run dev`

Backend keyrir á:

`npm run dev`

### 2. Keyra frontend (H2)

Fara í H2 möppu:

`npm install`
`npm run dev`

Frontend keyrir á:

`http://localhost:3000`

### Umhverfisbreytur(.env.local)

Búa til `.env.local` í H2:

`NEXT_PUBLIC_API_URL=http://localhost:4000`

### Innskráning í Admin

Til að skrá sig inn þarf að búa til notanda í backend:

`curl -X POST http://localhost:4000/auth/register \ -H "Content-Type: application/json" \ -d '{"username":"admin","password":"123456"}'`

Síðan bara skrá sig inn með þessu:

username: admin
password: 123456

### Virkni

- Forsíða
- Listi af viðburðum
- Síða fyrir viðburð og viðburði
- Leitarsíða
- Header og navigation
- Footer

### Admin virkni

- Búa til viðburð
- Hlaða upp mynd fyrir viðburðinn
- Eyða viðburði

## Tækni

- Next.js
- TypeScript
- Express
- Prisma
- Cloudinary
- CSS

## Hýsing
H2: https://vef2-2026-h2-5sql.vercel.app/
H1: https://vef2-2026-h1.onrender.com

## Hópur

Kristján Jakob Ásgrímsson - kja15@hi.is
Repo:https://github.com/KristjanJakob/vef2-2026-h2