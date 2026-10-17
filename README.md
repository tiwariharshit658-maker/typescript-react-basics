# Daymark — a little more focus

A small, responsive task tracker built with React and TypeScript. Add tasks, choose a category, mark work done, remove tasks, and filter the list.

## Run it locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To run a production type-check and build:

```bash
npm run build
npm run preview
```

## TypeScript tour

- **Types and unions:** `TaskStatus` and `TaskFilter` restrict task state and filter choices to known values.
- **Interfaces:** `Task` defines the task data shape; `TaskRowProps` describes the props passed to the reusable task row.
- **Generics:** `filterItems<T>` is a reusable, type-safe filtering helper that works with any item type while preserving the item type in its result.
- **Typed React code:** `useState<Task[]>` keeps task updates checked, and the form handler uses React's `FormEvent<HTMLFormElement>` type.

Start in `src/App.tsx`; the layout and responsive styles are in `src/styles.css`.