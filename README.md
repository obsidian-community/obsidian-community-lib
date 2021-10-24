# Obsidian Community Lib

This is a community-maintaned library of commonly used functions when developing Obsidian plugins.

To use the library in your plugin:

1. Install it using `npm i obsidian-community-lib`,
2. Then grab functions out of the library using `import { function } from "obsidian-community-lib"`.

**Read more about the included methods [here](https://obsidian-community.github.io/obsidian-community-lib/modules.html).**

## Contributing

> **Disclaimer**: By contributing to this repository, you grant the maintainer an irrevocable license to use the contribution under the license specified in the `LICENSE` file found in the root of this repository.
> The maintainer of this project can choose to change the license, or transfer maintainer status at any time.
> Every contributor must not infringe any copyright in their contribution.

This library is very much made for everyone to use and contribute to. If you would like to add a function or edit existing functions, please submit a pull request with your changes.

To add new functions, go to `src/utils.ts` and add your code as an exported function.
You can also add an entirely new file under `src` to better organise everything!

Then, go to `src/index.ts` and export your functions from the appropriate file. See `src/index.ts` for examples of how to do this.

### Conventional Commits

In your commit messages, it is highly encouraged for you to use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format. This helps keep everything standardised, and allows us to automatically create a changelog file using the commit messages.

VS Code has a conventional commits extension you can use to make this even easier!

![](https://i.imgur.com/9TXVdwA.png)

### TS Doc

In order to make your functions more useable for others, please consider using [TS Doc](https://tsdoc.org) to document your code in a standardised way.

This will show a nicely formatted description of your function when a user hovers over it:

![](https://i.imgur.com/VOPAybr.png)

VS Code has an extension to automate alot of this process based on the type declarations in the function definition:

![image](https://user-images.githubusercontent.com/70717676/138588097-9c4601f7-234d-409d-8cf1-d49722ebe47d.png)
