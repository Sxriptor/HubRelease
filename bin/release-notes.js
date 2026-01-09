#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { generateReleaseNotes } = require('../lib/generator');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_PATH = path.join(os.homedir(), '.release-notes-config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch (error) {
    // Ignore error if config is corrupt or unreadable
  }
  return {};
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not save API key to config file.'));
  }
}

async function main() {
  console.log(chalk.blue.bold('\n🚀 Release Notes Generator\n'));

  const config = loadConfig();
  let apiKey = config.apiKey;

  if (apiKey) {
    console.log(chalk.green('🔑 Found saved OpenAI API key. Using it automatically.'));
  } else {
    // Ask for API key first if not found
    const keyAnswer = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your OpenAI API key (will be saved for future use):',
        validate: (input) => {
          if (input.trim() === '') return 'API key is required';
          if (!input.startsWith('sk-')) return 'Invalid API key format (should start with sk-)';
          return true;
        }
      }
    ]);
    apiKey = keyAnswer.apiKey;
    saveConfig({ apiKey });
    console.log(chalk.green('✅ API key saved!'));
  }

  // Prompt user for other input
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'productName',
      message: 'Enter product name:',
      validate: (input) => input.trim() !== '' || 'Product name is required'
    },
    {
      type: 'input',
      name: 'version',
      message: 'Enter version (e.g., 1.9.2):',
      validate: (input) => input.trim() !== '' || 'Version is required'
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Select release notes style:',
      choices: ['Normal', 'Expanded'],
      default: 'Normal'
    },
    {
      type: 'input',
      name: 'features',
      message: 'Enter features/fixes (describe the changes):',
      validate: (input) => input.trim() !== '' || 'Features/fixes are required'
    }
  ]);

  console.log(chalk.yellow('\n⏳ Generating release notes...\n'));

  try {
    const releaseNotes = await generateReleaseNotes({
      productName: answers.productName,
      version: answers.version,
      mode: answers.mode.toLowerCase(),
      features: answers.features,
      apiKey: apiKey
    });

    // Display the release notes
    console.log(chalk.green.bold('--- Release Notes ---'));
    console.log(releaseNotes);

    // Save to file
    const safeProductName = answers.productName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    const fileName = `${safeProductName}-${answers.version}-release-notes.md`;
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);

    fs.writeFileSync(filePath, releaseNotes, 'utf8');

    console.log(chalk.green(`\n✅ Saved to: ${filePath}`));

    // Copy to clipboard prompt
    const { copyToClipboard } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'copyToClipboard',
        message: 'Would you like to copy to clipboard?',
        default: false
      }
    ]);

    if (copyToClipboard) {
      console.log(chalk.blue('ℹ️  Install clipboardy package for clipboard support: npm install clipboardy'));
    }

  } catch (error) {
    if (error.message.includes('401')) {
      console.error(chalk.red('\n❌ Error: Unauthorized (401). Your saved API key might be invalid.'));
      console.error(chalk.yellow(`💡 Try determining the issue and then delete the config file to reset: ${CONFIG_PATH}`));
    } else {
      console.error(chalk.red(`\n❌ Error: ${error.message}`));
    }
    process.exit(1);
  }
}

main();
