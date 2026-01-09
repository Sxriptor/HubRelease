# Release Notes Generator

Generate professional GitHub release notes using OpenAI's GPT-4.

## Installation

```bash
npm install -g @scriptorxtor/release-notes-generator
```
Run npm root -g to find the global node_modules directory
(you can drag it out to desktop or leave it here)
## Usage

Simply run the command and follow the prompts:

Save the hub.txt file as a .bat file and double click it to run the tool.

- You can then add the .bat file to your system path to run it from anywhere.
(search up environment variables, click add environment variable, click path under users, click edit, click new, and add the path to the .bat file)

```bash
release-notes
```

You'll be asked to provide:
- Product name
- Version number
- Release notes style (Normal or Expanded)
- Features/fixes description
- OpenAI API key **(Only asked on first run, then saved securely)**

## Configuration & API Key

You'll need an OpenAI API key. Get one at: https://platform.openai.com/api-keys

**Note:** Your API key is saved locally in your user home directory (`.release-notes-config.json`) so you don't have to enter it every time. To reset it, simply delete this file.


## Example

```
Enter product name: Whispra
Enter version: 1.9.2
Select release notes style: Expanded
Enter features/fixes: windows 11 fixes, improved performance
```

## License

MIT
