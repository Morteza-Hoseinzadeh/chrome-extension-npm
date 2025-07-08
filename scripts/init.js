import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import util from 'util';

const execPromise = util.promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateManifest(useTs, type) {
  const backgroundFile = `background.${useTs ? 'ts' : 'js'}`;
  const manifest = {
    manifest_version: 3,
    name: 'Zephyr Extension',
    version: '1.0.0',
    permissions: ['storage'],
  };

  if (type === 'background' || type === 'both') {
    manifest.background = { service_worker: backgroundFile };
  }

  if (type === 'popup' || type === 'both') {
    manifest.action = { default_popup: 'popup.html' };
  }

  return JSON.stringify(manifest, null, 2);
}

function getExtensionFiles(framework, useTs, type) {
  const ext = useTs ? 'ts' : 'js';
  const files = {
    'manifest.json': generateManifest(useTs, type),
  };

  if (type === 'popup' || type === 'both') {
    files['popup.html'] = `<html><body><h1>${framework} Extension Popup</h1></body></html>`;
  }

  if (type === 'background' || type === 'both') {
    files[`background.${ext}`] = `// ${framework} background logic (${useTs ? 'TypeScript' : 'JavaScript'})`;
  }

  return files;
}

async function runCreateNextApp(targetDir, useTs) {
  const tsFlag = useTs ? '--typescript' : '';
  console.log('🚀 Running create-next-app...');
  await execPromise(`npx create-next-app@latest ${targetDir} ${tsFlag}`, {
    stdio: 'inherit',
  });
}

async function runCreateReactApp(targetDir, useTs) {
  const tsFlag = useTs ? '--template typescript' : '';
  console.log('🚀 Running create-react-app...');
  await execPromise(`npx create-react-app ${targetDir} ${tsFlag}`, {
    stdio: 'inherit',
  });
}

async function scaffoldFiles(targetDir, files) {
  for (const [filename, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(targetDir, filename), content);
  }
}

async function init() {
  console.log('🧱 Welcome to ZephyrExt scaffolder!');

  const { framework } = await inquirer.prompt([
    {
      type: 'list',
      name: 'framework',
      message: 'Choose your extension framework:',
      choices: ['Next.js', 'React.js', 'Pure JS'],
    },
  ]);

  const { useTs } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'useTs',
      message: 'Do you want to use TypeScript?',
      default: true,
    },
  ]);

  const { extType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'extType',
      message: 'What type of extension are you building?',
      choices: ['popup', 'background', 'both'],
    },
  ]);

  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Enter your project name:',
      default: 'zephyr-extension',
      validate(input) {
        if (!input) return 'Project name cannot be empty!';
        if (fs.existsSync(path.join(process.cwd(), input))) {
          return 'Directory already exists. Choose another name.';
        }
        return true;
      },
    },
  ]);

  const targetDir = path.join(process.cwd(), projectName);
  if (fs.existsSync(targetDir)) {
    console.log(`⚠️ Directory ${targetDir} already exists. Please remove or choose a different location.`);
    process.exit(1);
  }

  if (framework === 'Next.js') {
    await runCreateNextApp(targetDir, useTs);
  } else if (framework === 'React.js') {
    await runCreateReactApp(targetDir, useTs);
  } else {
    // Pure JS minimal setup
    fs.mkdirSync(targetDir);
    console.log('🧩 Creating Pure JS minimal project...');
  }

  // Add extension files
  const files = getExtensionFiles(framework, useTs, extType);
  await scaffoldFiles(targetDir, files);

  console.log(`✅ ${framework} extension scaffolded successfully in ${targetDir}`);
}

init().catch((err) => {
  console.error('❌ Unexpected error:', err);
});
