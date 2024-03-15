# markdown-combiner

## default config

```
GITHUB_OWNER=BuntinJP
GITHUB_REPO=xlog-images
GITHUB_PATH=docs
```

## How to use

### development

```bash
bun install
bun dev
```

### build

```bash
bun install
bun build
bun start
```

### cloudflare pages

- set enviroment

- set conpatibility flags

Workers & Pages->your project->`settings`->`functions`->`compatibility flags`

add the following flags

```
nodejs_compat
```
