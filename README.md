# Bao UI

Shared component library and design system for my apps. Food Friends (`food-friends`) is the first baseline: its UI is gathered here so the same control can be seen in every variation it currently ships with.

This repo is the place changes get made. Apps should consume a published package, not a copy of these files.

## Now

`npm run dev` opens a catalog page; `npm test` runs the vitest suite and `npm run build` type-checks and bundles. Shared components are the real Food Friends files. One-off controls that were never extracted are reproduced with the class strings from the source file they came from, labeled with that path, and grouped with the others.

The page is for resolving consistency. It is not a published API yet.

## Consistency

Work through these one at a time. Each item is a control that ships in more than one style in Food Friends. The catalog shows the variants side by side, labeled with the source file.

- [ ] **Text buttons.** The same ink button appears with six different paddings. Most disabled states use 60% opacity; the category action uses 50% and has no hover style.
- [ ] **Fields.** Auth and review forms use a shadowed `neutral-300` border. Search uses `neutral-200` and no shadow. The email and friend-code fields are written as `text-sm` with no focus ring, while the global CSS forces inputs to 16px so iOS does not zoom.
- [ ] **Icon buttons.** Signup and login draw their own back button. Its hover is `neutral-100`; `IconButton` uses `neutral-300`. The map add button overrides the shared colours with a purple circle.
- [ ] **Avatars.** The default is a rounded square. Friend rows and the leaderboard pass `rounded-full`.

## How apps will consume it

1. Change components here and check them on the catalog page.
2. Publish the package to a private feed when the change is ready.
3. Apps install that version.

GitHub Packages is the intended feed. **The GitHub repo is public**, the package is scoped (for example `@bot19/bao-ui`), and `publishConfig.registry` points at `https://npm.pkg.github.com`. Consuming apps add an `.npmrc` that maps that scope to the GitHub registry and authenticate with a read token. npm publish from this repo is the release step. Storybook and a changelog come before the first real publish, so apps are not pinned to a moving catalog.

Because the repo is public, nothing committed here names an employer, a client, a private repository or an internal tool.

## How work moves

Every change is a story, driven through one lane by [satelle](.satelle/). The agent does the shaping and building; you hold the two decisions: approving a story, and merging to main.

```
PLAN  ◄──── "change X" ──── agent revises, shows the story as tables
  │                         (loop as often as you like; it costs nothing)
  │ you: "happy"
  ▼
SIGNOFF  (yours: nothing moves until you run a command)
  ├─ approve <id> ──► IN_PROGRESS ──► READY ──► you merge ──► DONE
  │                   agent builds    committed,             on main
  │                                   checks green
  ├─ rework <id>  ──► back to PLAN
  └─ cancel <id>  ──► CANCELLED
```

- **ready** means built, committed on the branch, with the checks and reviewers satisfied. It is not shipped.
- **done** means on `origin/main`. Merging is your call, whenever you choose.

### Your commands

Run these in your own terminal. The agent cannot run `approve`, `rework` or `cancel`; it names the one you need and stops.

| Command | What it does | When |
|---|---|---|
| `waiting` | Lists stories sitting in signoff | Checking what needs you |
| `story <id>` | Shows a story, where it is, and what its gates said | Reading before deciding |
| `approve <id> [note]` | Records your approval; the agent then starts building | You are happy with the story as shown |
| `rework <id> [note]` | Records "rework" and sends the story back to plan | You want changes after it reached signoff |
| `cancel <id> [note]` | Records "cancel" and drops the story | It is no longer wanted |

Those three each ask you to retype the story ID, so a session cannot record your word for you.

**One-time setup** to load the commands in every new terminal:

```sh
mkdir -p ~/.satelle
cp .satelle/operator-loader.sh ~/.satelle/approve.sh
echo '[ -f "$HOME/.satelle/approve.sh" ] && . "$HOME/.satelle/approve.sh"' >> ~/.zshrc
```

Or load them for one shell with `. .satelle/operator.sh`.

### The full rules

This section explains the process; the rules themselves live in `.satelle/` and win if anything here disagrees:

- [constitution.md](.satelle/constitution.md): what the agent must know and do in this repo
- [workflows/delivery.toml](.satelle/workflows/delivery.toml): the states, gates and transitions
- [skills/bao-plan.md](.satelle/skills/bao-plan.md): how a story is shaped in plan
- [operator.sh](.satelle/operator.sh): your commands

## Roadmap

- **Storybook** for isolated component stories, controls, and the docs that replace this single catalog page.
- **Docs** for tokens, usage, and when to reach for which variant.
- **Tests** for interaction and accessibility of the shared components. vitest covers the `src/lib` helpers today; the components have none.
- **Visual snapshots.** [Chromatic](https://www.chromatic.com/) (the Storybook snapshot service) uploads each story, compares it to the last accepted baseline, and flags visual diffs in CI. Percy is the other common option if Chromatic is a poor fit.
- **GitHub Packages** publish, then switch Food Friends over to the package and delete the duplicated UI.
