# NovoSGA Web Panel

[Portugues](README.md) | [English](README.en.md) | [Espanol](README.es.md)

A web panel for showing NovoSGA service calls on a screen.

Think of it like this:

```text
NovoSGA -> API/Mercure -> this panel -> screen with ticket, customer, location and history
```

It also lets you configure colors, logos, sounds, voice, unit and services through the
interface itself.

## What This Project Does

- Shows the called ticket on the panel.
- Keeps a history of the latest calls.
- Plays a sound when a new call arrives.
- Can speak the call using the browser voice.
- Lets you choose the NovoSGA unit and services.
- Lets you customize the panel model, colors, logos and clock.
- Saves settings in the browser `localStorage`.

## Main Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Vuetify
- vue-i18n
- Axios + axios-retry
- Vitest
- ESLint, Oxlint and Prettier
- Docker + nginx for production

## Before You Start

Install a compatible Node.js version:

```sh
node --version
```

The project expects Node `^20.19.0` or `>=22.12.0`.

Then install the dependencies:

```sh
npm install
```

## How to Run Locally

Start the development server:

```sh
npm run dev
```

Open the URL shown in the terminal. It will usually be something like:

```text
http://localhost:5173/
```

Main routes:

- `/#/`: call panel.
- `/#/settings`: settings screen.

On the first run, go to `/#/settings` and configure:

1. NovoSGA server URL.
2. API username and password.
3. Client ID and Client Secret.
4. Unit.
5. Services that should appear on the panel.
6. Appearance, sound and voice, if you want.

## Important Commands

| Command | What it does |
| --- | --- |
| `npm install` | Installs the dependencies. |
| `npm run dev` | Runs the project in development mode. |
| `npm run test:unit` | Runs unit tests with Vitest. |
| `npm run lint` | Runs Oxlint and ESLint with automatic fixes. |
| `npm run format` | Formats `src/` with Prettier. |
| `npm run build` | Generates the production version in `dist/`. |
| `npm run preview` | Serves the generated build locally. |

Attention: `npm run lint` uses `--fix`, so it may change files. Check the diff
afterwards.

## How to Run Tests

```sh
npm run test:unit
```

Tests are located in:

```text
src/__tests__/
```

Every new feature or rule change must include or update unit tests. If automatic tests are
not possible, explain why in the spec or PR and describe the manual verification.

## How to Build

```sh
npm run build
```

Vite generates the final files in:

```text
dist/
```

To test this build locally:

```sh
npm run preview
```

## How to Run with Docker

```sh
docker compose up --build
```

By default, the panel is available at:

```text
http://localhost:8081/
```

You can change the port with:

```sh
DOCKER_COMPOSE_HOST_PORT=8082 docker compose up --build
```

Custom images can be mounted in the container. By default, `compose.yml` uses:

```text
./images -> /usr/share/nginx/html/images/custom
```

## Configuration Through Environment Variables

Some settings can come from `VITE_*` variables:

| Variable | Usage |
| --- | --- |
| `VITE_API_VERSION` | Configured API version. |
| `VITE_API_URL` | NovoSGA server URL. |
| `VITE_API_USERNAME` | API username. |
| `VITE_API_PASSWORD` | API password. |
| `VITE_API_CLIENT_ID` | OAuth Client ID. |
| `VITE_API_CLIENT_SECRET` | OAuth Client Secret. |
| `VITE_API_RETRIES` | Number of attempts on network/API failures. |
| `VITE_PANEL` | Initial panel model, such as `default` or `model001`. |

There are also variables for colors, logos and clock display. See `src/stores/panel.js`
for the complete list.

## Folder Structure

```text
src/
  pages/              main screens: home and settings
  components/         interface components
  components/panels/  visual panel models
  stores/             global state and rules with Pinia
  composables/        API, storage, audio and speech
  plugins/            Vuetify, Pinia, i18n and panel registry
  locales/            translations
  __tests__/          unit tests
public/
  images/             logos and images
  sound/              alert sounds
docs/
  arquitetura.md      technical architecture overview
  sdd/                specs and Spec-Driven Development workflow
```

## How the Application Works

Simple flow:

```text
1. The app starts in src/main.js
2. Vue registers router, Pinia, i18n and Vuetify
3. The /#/ route opens the panel
4. The panel checks whether settings exist
5. The app authenticates with the NovoSGA API
6. The app connects to Mercure with EventSource
7. When a call arrives, it fetches the message from the API
8. The store normalizes the data
9. The panel component shows the call on screen
10. Sound and voice can be executed
```

## Main Files

- `src/main.js`: starts the application.
- `src/App.vue`: visual base, theme and global messages.
- `src/router/index.js`: routes `/#/` and `/#/settings`.
- `src/pages/home.vue`: running panel, authentication and Mercure.
- `src/pages/settings.vue`: settings screen.
- `src/stores/auth.js`: token, refresh token and logout.
- `src/stores/main.js`: current message, history and normalization.
- `src/stores/panel.js`: model, colors, logos and voice text.
- `src/stores/settings.js`: unit, services, language, sound and theme.
- `src/composables/api/21.js`: HTTP client for the API.
- `src/composables/storage.js`: persistence in `localStorage`.
- `src/plugins/registry.js`: list of panel models.

## Adding a New Panel Model

1. Create a folder in `src/components/panels/ModelName/`.
2. Create the main component `Panel.vue`.
3. Create the preview `Preview.vue`.
4. Register the model in `src/plugins/registry.js`.
5. Add or update unit tests.
6. Update this README if the user needs to know about the new item.

## SDD Workflow

For larger changes, use the flow in:

```text
docs/sdd/
```

Summary:

1. Create a spec from `docs/sdd/template.md`.
2. Write problem, scope, requirements and acceptance criteria.
3. Plan unit tests.
4. Implement only what the spec asks for.
5. Run tests, lint and build when it makes sense.

## Documentation Rule

Every new feature or change must check whether the README needs to be updated.

Update this README when the change:

- adds a new command;
- changes how to install, run, test or build;
- adds an important screen, flow or setting;
- changes environment variables;
- adds a panel model;
- changes behavior the user needs to understand.

If the change is internal and does not affect project usage, installation or understanding,
the README can stay the same.

## Security Notes

- Credentials and tokens may be saved in `localStorage`.
- Avoid using this panel on a shared computer without care.
- Do not commit `.env`, secrets or real access data.
- Carefully review any change that renders content coming from the API.

## Where to Read More

- `docs/arquitetura.md`: technical architecture explanation.
- `docs/sdd/README.md`: Spec-Driven Development workflow.
- `AGENTS.md`: quick guide for contributors and agents.
