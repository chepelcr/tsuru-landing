# Landing build configuration

Deploy the public build settings with:

```sh
aws cloudformation deploy --stack-name tsuru-dev-landing-ssm-params --template-file cloudformation/landing-params.yml --parameter-overrides Environment=dev --profile PACIFIC-PROD --region us-east-1
```

The template imports the public API endpoint, guest identity pool and region from
the corresponding infrastructure stacks. It creates three String parameters
under `/tsuru/dev/landing`. Substitute `stag` or `prod` only after those stacks
and exports exist in that environment.

Run `pnpm env:ssm dev PACIFIC-PROD` to generate the ignored `.env.local` before
starting Vite. The workspace `reboot-server.sh` does this automatically alongside
the dashboard loader. Missing settings fail without replacing a working file.
These are public browser settings, not backend secrets. The GitHub Pages workflow
continues to use its configured repository variables for public builds.
