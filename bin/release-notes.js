#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { generateReleaseNotes } = require('../lib/generator');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  console.log(chalk.blue.bold('\n🚀 Release Notes Generator\n'));

  // Prompt user for input
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
    },
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter your OpenAI API key:',
      validate: (input) => {
        if (input.trim() === '') return 'API key is required';
        if (!input.startsWith('sk-')) return 'Invalid API key format (should start with sk-)';
        return true;
      }
    }
  ]);

  console.log(chalk.yellow('\n⏳ Generating release notes...\n'));

  try {
    const releaseNotes = await generateReleaseNotes({
      productName: answers.productName,
      version: answers.version,
      mode: answers.mode.toLowerCase(),
      features: answers.features,
      apiKey: answers.apiKey
    });

    // Display the release notes
    console.log(chalk.green.bold('--- Release Notes ---'));
    console.log(releaseNotes);

    // Save to file
    const fileName = `${answers.productName.replace(/\s+/g, '-')}-${answers.version}-release-notes.md`;
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, fileName);
    
    fs.writeFileSync(filePath, releaseNotes, 'utf8');
    
    console.log(chalk.green(`\n✅ Saved to: ${filePath}`));
    
    // Ask if user wants to copy to clipboard (optional feature)
    const { copyToClipboard } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'copyToClipboard',
        message: 'Would you like to copy to clipboard?',
        default: false
      }
    ]);

    if (copyToClipboard) {
      // Copy to clipboard (requires clipboardy package - optional)
      console.log(chalk.blue('ℹ️  Install clipboardy package for clipboard support: npm install clipboardy'));
    }

  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

main();
