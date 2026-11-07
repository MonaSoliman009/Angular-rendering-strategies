# Angular Rendering Modes: CSR vs SSR vs SSG

One Angular 20 app that serves the same page in three rendering modes, so you can compare them side by side:

| Route  | Mode | Angular setting | When the HTML is built |
|--------|------|-----------------|------------------------|
| `/csr` | Client-side rendering | `RenderMode.Client` | In the browser, after JavaScript loads |
| `/ssr` | Server-side rendering | `RenderMode.Server` | On the server, on every request |
| `/ssg` | Static site generation | `RenderMode.Prerender` | Once, at build time |

Each route renders the same to-do list, fetched from a mock API. The only thing that changes is the render mode, so any difference you see comes from the mode.

## What this project shows

- **Per-route render modes** with Angular's `ServerRoute` config ([`app.routes.server.ts`](src/app/app.routes.server.ts)), instead of one mode for the whole app.
- **Client hydration with event replay** (`provideClientHydration(withEventReplay())`), so server-rendered pages become interactive without re-rendering, and clicks made before hydration aren't lost.
- **Zoneless change detection** (`provideZonelessChangeDetection()`).
- **Signal-based data loading** with Angular's `resource()` API and a `computed()` view of loading and error states ([`services/todos.ts`](src/app/services/todos.ts)).

## Choosing a mode

| Mode | Good fit | Trade-offs |
|------|----------|------------|
| CSR | Dashboards and pages behind a login, where SEO doesn't matter | Blank first paint until JavaScript loads. Crawlers may see little content. |
| SSR | Public pages with data that changes often or depends on the user | Needs a running Node server. Each request costs server time. |
| SSG | Content that changes rarely: marketing pages, docs, blogs | Data is fixed at build time. Updating content means rebuilding. |

## Run it

Prerequisites: Node.js 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run build
npm run serve:ssr:my-app
```

Then open http://localhost:4000 and switch between the three routes with the navbar.

For development with live reload, use `npm start` (http://localhost:4200).

## How to see the difference

1. Open each route and use **View Page Source** (not DevTools Elements).
2. Compare the HTML the server sent:
   - `/csr`: the list should be missing from the source, because the browser builds it.
   - `/ssr` and `/ssg`: the list should already be in the source.
3. After `npm run build`, look in `dist/my-app/browser/`. The prerendered `/ssg` page is written there as a static HTML file. The `/ssr` page is not, because it's rendered per request.

## Project structure

```
src/
├── app/
│   ├── components/
│   │   ├── csr/      # route rendered in the browser
│   │   ├── ssr/      # route rendered per request
│   │   ├── ssg/      # route prerendered at build time
│   │   └── navbar/
│   ├── services/todos.ts      # resource() + computed() data loading
│   ├── app.routes.ts          # client routes
│   ├── app.routes.server.ts   # render mode per route
│   └── app.config.ts          # hydration, zoneless change detection
├── main.server.ts
└── server.ts                  # Express server for SSR
```

## Author

Mona Soliman, Senior Frontend Engineer (Angular).
[LinkedIn](https://www.linkedin.com/in/mona-soliman-481748bb/) · [YouTube](https://www.youtube.com/@MonaCodingGirl)
