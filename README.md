# Obsidian Community Lib

This is a community-maintaned library of commonly used functions when developing Obsidian plugins.

To use the library in your plugin, install it using `npm i obsidian-community-lib`.
Then grab functions out of the library using `import { function } from "obsidian-community-lib"`.

## Contributing

This library is very much made for everyone to use and contribute to. If you would like to add a function or edit existing functions, please submit a pull request with your changes.

To add new functions, go to `src/utils.ts` and add your code as an exported function.
You can also add an entirely new file under `src` to better organise everything!

Then, go to `src/index.ts` and export your functions from the appropriate file. See `src/index.ts` for examples of how to do this.

### Conventional Commits

In your commit messages, it is highly encouraged for you to use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format. This helps keep everything standardised, and allows us to automatically create a changelog file using the commit messages.

VS Code has a conventional commits extension you can use to make this even easier!

![](https://i.imgur.com/9TXVdwA.png)
