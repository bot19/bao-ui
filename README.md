# Bao UI

Shared component library and design system for my apps. Food Friends (`food-friends`) is the first baseline: its UI is gathered here so the same control can be seen in every variation it currently ships with.

This repo is the place changes get made. Apps should consume a published package, not a copy of these files.

## Now

`npm run dev` opens a catalog page. Shared components are the real Food Friends files. One-off controls that were never extracted are reproduced with the class strings from the source file they came from, labeled with that path, and grouped with the others.

The page is for resolving consistency. It is not a published API yet.

## How apps will consume it

1. Change components here and check them on the catalog page.
2. Publish the package to a private feed when the change is ready.
3. Apps install that version.

GitHub Packages is the intended feed. The GitHub repo stays private, the package is scoped (for example `@bot19/bao-ui`), and `publishConfig.registry` points at `https://npm.pkg.github.com`. Consuming apps add an `.npmrc` that maps that scope to the GitHub registry and authenticate with a read token. npm publish from this repo is the release step. Storybook and a changelog come before the first real publish, so apps are not pinned to a moving catalog.

## Roadmap

- **Storybook** for isolated component stories, controls, and the docs that replace this single catalog page.
- **Docs** for tokens, usage, and when to reach for which variant.
- **Tests** for interaction and accessibility of the shared components.
- **Visual snapshots.** [Chromatic](https://www.chromatic.com/) (the Storybook snapshot service) uploads each story, compares it to the last accepted baseline, and flags visual diffs in CI. Percy is the other common option if Chromatic is a poor fit.
- **GitHub Packages** publish, then switch Food Friends over to the package and delete the duplicated UI.
