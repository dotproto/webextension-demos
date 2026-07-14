# webextension-demos

## Install a single demo

To fetch and install an individual demo, start by executing

```bash
npx degit dotproto/extension-demos/demos/<DEMO>
```

where `<DEMO>` is the directory name of the demo you want to retrieve.

Once you've retrieved the demo, some (but not all) demos may need you to fetch
dependencies and run a build.

```bash
cd <DEMO>
pnpm install
pnpm build
```

## Contributor setup

Install dependencies for the top level project and all demos:

```bash
pnpm install
```

## Technology choices

### Dependency management

We use [`pnpm`](https://pnpm.io/) to ensure that each demo's dependencies (if
any) are explicitly defined in that demo's project folder.

## Licenses

Code samples are licensed under MIT. Documentation is licensed under CC-BY 4.0.
