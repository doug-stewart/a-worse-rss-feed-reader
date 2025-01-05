# A Worse RSS Feed Reader

You know what the world needs? Another feed reader. Especially one made by a single developer. Look,
I made this for myself and I'm sharing it with you. It's not perfect, but it's mine. Use it if you
want.

## Setup

1. Install [NVM](https://github.com/nvm-sh/nvm).
2. Run `nvm install` to install the appropriate version of Node.js.
3. Run `npm i` to install relevant packages.

## Commands

| Command            | Description                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `npm run dev`      | Start a local developer server that is accessible from http://localhost:5173/.           |
| `npm run build`    | Build the site for production and place it in a `build` folder in the root directory.    |
| `npm run test`     | Start the test server in your terminal.                                                  |
| `npm run lint`     | Runs all lint commands in sequence: CSS, TS, JS.                                         |
| `npm run lint:css` | Alert you of any SCSS linter errors and will automatically fix them.                     |
| `npm run lint:js`  | Alert you of any JS linter errors and will automatically fix them.                       |
| `npm run lint:ts`  | Alert you of any TypeScript errors and will automatically fix them.                      |
| `npm run pretty`   | Will run through all compatible files and format them based on Prettier's configuration. |
