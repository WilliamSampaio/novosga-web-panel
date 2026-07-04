# NovoSGA Web Panel

[Portugues](README.md) | [English](README.en.md) | [Espanol](README.es.md)

Un panel web para mostrar llamadas de atencion de NovoSGA en una pantalla.

Piense en el asi:

```text
NovoSGA -> API/Mercure -> este panel -> pantalla con ticket, cliente, local e historial
```

Tambien permite configurar colores, logos, sonidos, voz, unidad y servicios desde la
propia interfaz.

## Que Hace Este Proyecto

- Muestra el ticket llamado en el panel.
- Mantiene un historial de las ultimas llamadas.
- Reproduce un sonido cuando llega una nueva llamada.
- Puede hablar la llamada usando la voz del navegador.
- Permite elegir unidad y servicios de NovoSGA.
- Permite personalizar modelo, colores, logos y reloj del panel.
- Guarda configuraciones en el `localStorage` del navegador.

## Stack Principal

- Vue 3
- Vite
- Vue Router
- Pinia
- Vuetify
- vue-i18n
- Axios + axios-retry
- Vitest
- ESLint, Oxlint y Prettier
- Docker + nginx para produccion

## Antes de Comenzar

Instale una version compatible de Node.js:

```sh
node --version
```

El proyecto espera Node `^20.19.0` o `>=22.12.0`.

Luego instale las dependencias:

```sh
npm install
```

## Como Ejecutar Localmente

Inicie el servidor de desarrollo:

```sh
npm run dev
```

Abra la URL que aparece en la terminal. Normalmente sera algo como:

```text
http://localhost:5173/
```

Rutas principales:

- `/#/`: panel de llamadas.
- `/#/settings`: pantalla de configuracion.

La primera vez, vaya a `/#/settings` y configure:

1. URL del servidor NovoSGA.
2. Usuario y contrasena de la API.
3. Client ID y Client Secret.
4. Unidad.
5. Servicios que deben aparecer en el panel.
6. Apariencia, sonido y voz, si desea.

## Comandos Importantes

| Comando | Para que sirve |
| --- | --- |
| `npm install` | Instala las dependencias. |
| `npm run dev` | Ejecuta el proyecto en modo desarrollo. |
| `npm run test:unit` | Ejecuta las pruebas unitarias con Vitest. |
| `npm run lint` | Ejecuta Oxlint y ESLint con correccion automatica. |
| `npm run format` | Formatea `src/` con Prettier. |
| `npm run build` | Genera la version de produccion en `dist/`. |
| `npm run preview` | Sirve localmente el build generado. |

Atencion: `npm run lint` usa `--fix`, entonces puede alterar archivos. Revise el diff
despues.

## Como Ejecutar Pruebas

```sh
npm run test:unit
```

Las pruebas quedan en:

```text
src/__tests__/
```

Toda nueva funcionalidad o alteracion de regla debe incluir o actualizar pruebas
unitarias. Si no se puede probar automaticamente, explique el motivo en la spec o en el
PR y describa la verificacion manual.

## Como Hacer Build

```sh
npm run build
```

Vite genera los archivos finales en:

```text
dist/
```

Para probar ese build localmente:

```sh
npm run preview
```

## Como Ejecutar con Docker

```sh
docker compose up --build
```

Por defecto, el panel queda en:

```text
http://localhost:8081/
```

Puede cambiar el puerto con:

```sh
DOCKER_COMPOSE_HOST_PORT=8082 docker compose up --build
```

Las imagenes personalizadas pueden montarse en el container. Por defecto, `compose.yml`
usa:

```text
./images -> /usr/share/nginx/html/images/custom
```

## Configuracion por Variables de Entorno

Algunas configuraciones pueden venir de variables `VITE_*`:

| Variable | Uso |
| --- | --- |
| `VITE_API_VERSION` | Version configurada de la API. |
| `VITE_API_URL` | URL del servidor NovoSGA. |
| `VITE_API_USERNAME` | Usuario de la API. |
| `VITE_API_PASSWORD` | Contrasena de la API. |
| `VITE_API_CLIENT_ID` | Client ID OAuth. |
| `VITE_API_CLIENT_SECRET` | Client Secret OAuth. |
| `VITE_API_RETRIES` | Numero de intentos en fallas de red/API. |
| `VITE_PANEL` | Modelo inicial del panel, como `default` o `model001`. |

Tambien existen variables para colores, logos y visualizacion del reloj. Vea
`src/stores/panel.js` para la lista completa.

## Estructura de Carpetas

```text
src/
  pages/              pantallas principales: home y settings
  components/         componentes de interfaz
  components/panels/  modelos visuales del panel
  stores/             estado global y reglas con Pinia
  composables/        API, storage, audio y speech
  plugins/            Vuetify, Pinia, i18n y registry de los paneles
  locales/            traducciones
  __tests__/          pruebas unitarias
public/
  images/             logos e imagenes
  sound/              sonidos de alerta
docs/
  arquitetura.md      vision tecnica de la arquitectura
  sdd/                specs y workflow de Spec-Driven Development
```

## Como Funciona la Aplicacion

Flujo simple:

```text
1. La app inicia en src/main.js
2. Vue registra router, Pinia, i18n y Vuetify
3. La ruta /#/ abre el panel
4. El panel verifica si existe configuracion
5. La app autentica en la API de NovoSGA
6. La app conecta a Mercure con EventSource
7. Cuando llega una llamada, busca el mensaje en la API
8. La store normaliza los datos
9. El componente de panel muestra la llamada en la pantalla
10. Sonido y voz pueden ejecutarse
```

## Archivos Principales

- `src/main.js`: inicia la aplicacion.
- `src/App.vue`: base visual, tema y mensajes globales.
- `src/router/index.js`: rutas `/#/` y `/#/settings`.
- `src/pages/home.vue`: panel en ejecucion, autenticacion y Mercure.
- `src/pages/settings.vue`: pantalla de configuraciones.
- `src/stores/auth.js`: token, refresh token y logout.
- `src/stores/main.js`: mensaje actual, historial y normalizacion.
- `src/stores/panel.js`: modelo, colores, logos y texto de voz.
- `src/stores/settings.js`: unidad, servicios, idioma, sonido y tema.
- `src/composables/api/21.js`: cliente HTTP para API.
- `src/composables/storage.js`: persistencia en `localStorage`.
- `src/plugins/registry.js`: lista de modelos de panel.

## Agregando un Nuevo Modelo de Panel

1. Cree una carpeta en `src/components/panels/NombreDelModelo/`.
2. Cree el componente principal `Panel.vue`.
3. Cree el preview `Preview.vue`.
4. Registre el modelo en `src/plugins/registry.js`.
5. Agregue o actualice pruebas unitarias.
6. Actualice este README si el usuario necesita saber sobre la novedad.

## Workflow SDD

Para cambios mayores, use el flujo en:

```text
docs/sdd/
```

Resumen:

1. Cree una spec a partir de `docs/sdd/template.md`.
2. Escriba problema, alcance, requisitos y criterios de aceptacion.
3. Planifique pruebas unitarias.
4. Implemente solo lo que la spec pide.
5. Ejecute pruebas, lint y build cuando tenga sentido.

## Regla de Documentacion

Toda nueva funcionalidad o alteracion debe verificar si el README necesita ser actualizado.

Actualice este README cuando el cambio:

- agregue un comando nuevo;
- cambie como instalar, ejecutar, probar o hacer build;
- agregue una pantalla, flujo o configuracion importante;
- cambie variables de entorno;
- agregue un modelo de panel;
- altere un comportamiento que el usuario necesita entender.

Si el cambio es interno y no afecta el uso, instalacion o entendimiento del proyecto, el
README puede quedar igual.

## Cuidados de Seguridad

- Credenciales y tokens pueden guardarse en `localStorage`.
- Evite usar este panel en una computadora compartida sin cuidado.
- No commitee `.env`, secrets o datos reales de acceso.
- Revise con atencion cualquier cambio que renderice contenido venido de la API.

## Donde Leer Mas

- `docs/arquitetura.md`: explicacion tecnica de la arquitectura.
- `docs/sdd/README.md`: flujo de Spec-Driven Development.
- `AGENTS.md`: guia rapida para contribuidores y agentes.
