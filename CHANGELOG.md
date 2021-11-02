## Advanced Cursors Changelog

## [1.0.0](https://github.com/obsidian-community/obsidian-community-lib/compare/0.1.3...1.0.0) (2021-11-02)

### Features

- :sparkles: Extend functionality of `RenderedMarkdownModal` ([08027ca](https://github.com/obsidian-community/obsidian-community-lib/commit/08027ca6970fe83d5d4a0ab615eca81b81b3f03e))

### Documentation

- :memo: RenderedMarkdownModal docs ([3c2ed65](https://github.com/obsidian-community/obsidian-community-lib/commit/3c2ed653a589c29b5809203f88163a86cac54fe2))

### [0.1.3](https://github.com/obsidian-community/obsidian-community-lib/compare/0.1.2...0.1.3) (2021-11-01)

### Features

- :sparkles: Function: waitForResolvedLinks ([1e5e4df](https://github.com/obsidian-community/obsidian-community-lib/commit/1e5e4dffa2cf6361f8aade1bb949ea8cf41782ca))

### [0.1.2](https://github.com/obsidian-community/obsidian-community-lib/compare/0.1.1...0.1.2) (2021-11-01)

### Features

- :sparkles: Two util functions: stripMD + addMD ([1b3d7ac](https://github.com/obsidian-community/obsidian-community-lib/commit/1b3d7ac670d917df9a347f5eeaa21d5172581ded))

### Bug Fixes

- :bug: Fix [#17](https://github.com/obsidian-community/obsidian-community-lib/issues/17): openOrSwitch shouldn't need an open md note to work ([3fabd62](https://github.com/obsidian-community/obsidian-community-lib/commit/3fabd62d98f26a46b9d9726179966785296e2647))

### [0.1.1](https://github.com/obsidian-community/obsidian-community-lib/compare/0.1.0...0.1.1) (2021-10-30)

### Bug Fixes

- :bug: Only saveViewSide if leaf of `viewType` is open ([3b2eb58](https://github.com/obsidian-community/obsidian-community-lib/commit/3b2eb58ece49ca1f28645dd12621c639cd9d2050))

### Documentation

## [0.1.0](https://github.com/obsidian-community/obsidian-community-lib/compare/0.0.19...0.1.0) (2021-10-30)

### Features

- :sparkles: Not necessary to pass in `to` to `hoverPreview` if the `event.target.innerText` is already the `linkText` ([5ce91cc](https://github.com/obsidian-community/obsidian-community-lib/commit/5ce91cc5a9e7c65b8bafebf06a1d752207dd21e6))
- :sparkles: openView + saveViewSide ([6dc48c6](https://github.com/obsidian-community/obsidian-community-lib/commit/6dc48c6c123578a8bbd474231f68517f428ddbb2))

### [0.0.19](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.17...0.0.19) (2021-10-28)

### Features

- :sparkles: addChanglogButton and ChanglogModal ([895747e](https://github.com/SkepticMystic/obsidian-community-lib/commit/895747e6c19daae8eca69bb6166bd19ce48c1616))
- :sparkles: Return featherIcon name ([29f2fb9](https://github.com/SkepticMystic/obsidian-community-lib/commit/29f2fb95b1a29e86113cd8294457438e3876721b))

### [0.0.18](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.17...0.0.18) (2021-10-27)

### Features

- :sparkles: addChanglogButton and ChanglogModal ([895747e](https://github.com/SkepticMystic/obsidian-community-lib/commit/895747e6c19daae8eca69bb6166bd19ce48c1616))
- :sparkles: Return featherIcon name ([29f2fb9](https://github.com/SkepticMystic/obsidian-community-lib/commit/29f2fb95b1a29e86113cd8294457438e3876721b))

### [0.0.17](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.16...0.0.17) (2021-10-26)

### Features

- :sparkles: Add directed option to linkedQ ([ab10d2d](https://github.com/SkepticMystic/obsidian-community-lib/commit/ab10d2dc2b351ed2c89c0492b45991f5cf1ec3ea))

### Bug Fixes

- :bug: Remove module override ([c8a781e](https://github.com/SkepticMystic/obsidian-community-lib/commit/c8a781ed9e29121596a841d45a3870976540972d))

### [0.0.16](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.15...0.0.16) (2021-10-25)

### Features

- :sparkles: createNewNote function ([745acb4](https://github.com/SkepticMystic/obsidian-community-lib/commit/745acb47a8722beae4c23fa42ef2040bb919c5bf))
- :sparkles: Expand vault interface ([0fa320a](https://github.com/SkepticMystic/obsidian-community-lib/commit/0fa320a6ffad6a2b3224b3a9121e3030c51d1358))
- :sparkles: linkedQ function ([7973df2](https://github.com/SkepticMystic/obsidian-community-lib/commit/7973df2c88d153b0eabc1186bac5e7e9ffe25127))

### Bug Fixes

- :bug: createwNewMDNote: Append '.md' to `newName` if not present ([e797c85](https://github.com/SkepticMystic/obsidian-community-lib/commit/e797c85f1f61079526b6d498733d3241d2e77369))
- :bug: Remove redundant declaration ([176fa8e](https://github.com/SkepticMystic/obsidian-community-lib/commit/176fa8e6d3ec9410e374bd52bdb2227d1f0fcdb0))

### [0.0.15](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.14...0.0.15) (2021-10-24)

### Bug Fixes

- :bug: Check if leaf.view instanceof MarkdownView to confirm view.file exists ([007e474](https://github.com/SkepticMystic/obsidian-community-lib/commit/007e474b943b1664ab523b5dc365837268168c0c))

### [0.0.14](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.13...0.0.14) (2021-10-24)

### [0.0.13](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.12...0.0.13) (2021-10-24)

### [0.0.12](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.11...0.0.12) (2021-10-24)

### Features

- :sparkles: Add my functions ([14ab90e](https://github.com/SkepticMystic/obsidian-community-lib/commit/14ab90e56ba0a4eb2559d92be0d37762362543b2))
- :sparkles: Attempt to extend obsidian module ([e8e3d58](https://github.com/SkepticMystic/obsidian-community-lib/commit/e8e3d587db20287c69746cc56e35db7faaa211d4))

### [0.0.11](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.10...0.0.11) (2021-10-24)

### [0.0.10](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.9...0.0.10) (2021-10-24)

### [0.0.9](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.8...0.0.9) (2021-10-24)

### [0.0.8](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.7...0.0.8) (2021-10-24)

### Features

- :rocket: Add my often used Methods ([4956509](https://github.com/SkepticMystic/obsidian-community-lib/commit/4956509fb5f4a3fb62544b2977f1de9bc3bf543d))

### Bug Fixes

- add yarn.lock to gitignore ([9e1d37d](https://github.com/SkepticMystic/obsidian-community-lib/commit/9e1d37d3d3f19375e0c4fb4259a719472c934d01))

### [0.0.7](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.6...0.0.7) (2021-10-24)

### [0.0.6](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.5...0.0.6) (2021-10-24)

### [0.0.5](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.4...0.0.5) (2021-10-24)

### Features

- :sparkles: Add `copy` function ([91b28ea](https://github.com/SkepticMystic/obsidian-community-lib/commit/91b28eae5a12c7d925efe6f7f7e7c60851d89761))

### [0.0.3](https://github.com/SkepticMystic/obsidian-community-lib/compare/0.0.4...0.0.3) (2021-10-24)

### 0.0.2 (2021-10-24)

### Features

- :sparkles: Add standard-version ([acbf022](https://github.com/SkepticMystic/obsidian-community-lib/commit/acbf02260a41206f4c7ec5a4c86d7b77b70be3e4))
- :sparkles: init package! ([d2f7897](https://github.com/SkepticMystic/obsidian-community-lib/commit/d2f7897bd02726ff6947d9c9dadbd12d88c4d9ea))
