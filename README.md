# Bouquet

A vanilla JavaScript single-page web application for browsing bouquets, filtering and sorting the catalogue, viewing bouquet details, and managing a deferred list.

The project follows a Model/Presenter/View architecture and uses an Observable-based model layer. API communication is isolated in services, while Presenters coordinate models and views.

## Features

- Browse a catalogue of bouquets.
- Filter bouquets by occasion and by one or several colors.
- Sort bouquets by price in ascending or descending order.
- Load the catalogue progressively with a “load more” interaction.
- Open a bouquet in a modal window with detailed information.
- View bouquet images in a Swiper slider.
- Add bouquets to the deferred list.
- Change the quantity of a deferred bouquet.
- Remove a single bouquet card or clear the entire deferred list.
- Restore catalogue state on return paths that request restoration, including:
  - scroll position;
  - number of rendered bouquets;
  - selected sorting option.
- Handle loading states and server errors.
- Use optimistic updates for deferred operations with rollback and server synchronization after partial failures.
- Block relevant UI controls while asynchronous operations are in progress.

## Architecture

The application is divided into several layers:

```text
                    ┌──────────────────┐
                    │      main.js      │
                    │ composition root │
                    └────────┬─────────┘
                             │
                  ┌──────────▼──────────┐
                  │    AppPresenter     │
                  │ app/page lifecycle  │
                  └───────┬───────┬─────┘
                          │       │
             ┌────────────▼─┐   ┌─▼──────────────┐
             │    Models    │   │   Presenters   │
             │              │   │                │
             │ Bouquets     │   │ Main page      │
             │ Deferred     │◄─►│ Catalogue       │
             │ Filters      │   │ Deferred        │
             └──────┬───────┘   │ Modal           │
                    │           └───────┬────────┘
                    │                   │
              ┌─────▼─────┐       ┌────▼──────┐
              │ API        │       │   Views   │
              │ services   │       │           │
              └────────────┘       └───────────┘
```

### Model

Models contain application state and communicate with API services.

They extend `Observable` and notify subscribed Presenters about state changes.

Main models:

- `BouquetsModel` — stores the bouquet catalogue and adapts API data to the client format.
- `DeferredModel` — manages the deferred list, quantities, optimistic updates, rollback, and synchronization after partial request failures.
- `FilterModel` — stores the selected occasion and color filters.

The basic data flow is:

```text
Model changes state
        ↓
Model notifies observers
        ↓
Presenter receives UpdateType
        ↓
Presenter decides what should be re-rendered
        ↓
View updates the DOM
```

### Presenters

Presenters coordinate application logic and connect Models with Views.

Important Presenters:

- `AppPresenter` — controls the application shell and switches between the main catalogue and deferred page.
- `MainPagePresenter` — builds the main page from static sections, filters, and the catalogue.
- `CataloguePresenter` — handles catalogue rendering, filtering, sorting, loading states, modal opening, and deferred actions.
- `DeferredPresenter` — renders and manages the deferred list.
- `ModalPresenter` — controls the modal lifecycle.
- `FilterReasonPresenter` / `FilterColorPresenter` — connect filter controls with `FilterModel`.
- `HeaderCountPresenter` — keeps the deferred item count in the header up to date.

Presenters also own the lifecycle of the components they create. When a page or modal is destroyed, related resources are explicitly released.

### Views

Views are responsible for generating and updating DOM elements.

They do not own application state. User interactions are converted into callbacks/actions that are handled by Presenters.

### API services

API services encapsulate network communication and keep request details outside Models and Presenters.

```text
BouquetsModel
      │
      ▼
BouquetsApiService ─────► backend API

DeferredModel
      │
      ▼
DeferredApiService ──────► backend API
```

### Framework layer

The `framework` directory contains reusable infrastructure used by the application:

- `Observable` — observer/subscriber mechanism.
- `render` helpers — render, replace, and remove View components.
- `ApiService` — base API communication.
- `UiBlocker` — temporarily blocks UI during asynchronous operations.
- other shared framework utilities.

## Error handling

Errors are represented by shared `ErrorType` values and mapped to user-facing `ErrorMessage` strings.

This keeps error identification separate from presentation:

```text
API operation fails
        ↓
Model / service identifies the operation
        ↓
ErrorType
        ↓
Presenter
        ↓
ErrorMessage
        ↓
Error view / modal
```

Deferred mutations use optimistic updates where the local state is changed before the server response.

When a request fails, the Model can roll the local state back. For operations where several server requests may partially succeed, the Model requests the actual deferred state from the server and synchronizes the local state with it.

## Lifecycle management

A key architectural rule in the project is explicit cleanup of created resources.

For example, the modal and its image slider follow this lifecycle:

```text
ModalPresenter
      ↓
ModalView
      ↓
ImageSlider
      ↓
Swiper instance
```

Destroying the modal propagates cleanup down this chain, so the external slider instance is destroyed before the modal View is removed from the DOM.

## Project structure

```text
src/
├── api-services/     # API-specific services
├── framework/        # reusable application infrastructure
├── model/            # application state
├── presenter/        # application coordination and presentation logic
├── utils/            # reusable utilities
├── vendor/           # third-party libraries
└── view/             # DOM views and templates
```

The application entry point is:

```text
src/main.js
```

It creates the Models and the top-level `AppPresenter`, initializes the application, and starts the initial API requests.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run start
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

The project uses ESLint with the HTML Academy Vanilla JavaScript configuration.

## Main technologies

- JavaScript (ES modules, classes, private fields, async/await)
- HTML
- CSS
- Webpack
- Swiper
- ESLint
- REST API

## Architecture principles

The project follows several principles that are important to its structure:

- **Separation of responsibilities** — Models, Presenters, Views, and API services have distinct roles.
- **Unidirectional state-driven rendering** — Models notify Presenters, and Presenters decide how the UI should change.
- **Explicit lifecycle management** — created Presenters, Views, and external library instances are destroyed when they are no longer needed.
- **Error isolation** — technical operation types are separated from user-facing messages.
- **Optimistic UI with recovery** — deferred operations update the interface immediately, with rollback or server synchronization when necessary.
- **Minimal DOM ownership** — application state lives in Models rather than in Views.

## Project status

The project is a learning and portfolio project focused on building a more production-oriented vanilla JavaScript architecture rather than only implementing UI functionality.

Current work has focused on improving lifecycle management, asynchronous state handling, error architecture, code quality, and maintainability.
