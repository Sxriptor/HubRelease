# Release Notes Generator

Generate professional GitHub release notes using OpenAI's GPT-4.

## Installation

```bash
npm install -g @coler/release-notes-generator
```

## Usage

Simply run the command and follow the prompts:

```bash
release-notes
```

You'll be asked to provide:
- Product name
- Version number
- Release notes style (Normal or Expanded)
- Features/fixes description
- OpenAI API key

## API Key

You'll need an OpenAI API key. Get one at: https://platform.openai.com/api-keys

**Note:** Your API key is never stored and is only used for the current session.

## Example

```
Enter product name: Whispra
Enter version: 1.9.2
Select release notes style: Expanded
Enter features/fixes: windows 11 fixes, improved performance
Enter your OpenAI API key: sk-...
```

## License

MIT
