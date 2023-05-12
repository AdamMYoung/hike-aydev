# AYDev Hike
This is a monorepo used to support the https://hike.aydev.uk project. The project structure is as follows:

- `apps`: Executable apps used by the project. This includes the main site, as well as any supporting services.
- `packages`: Standalone packages used by the aformentioned `apps`. These include database wrappers, UI components and linting configs.

## How to run
- Run `yarn install` to download all packages.
- Run `yarn dev` to start the development servers.
- Run `yarn build` to create a production build of the project.

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
