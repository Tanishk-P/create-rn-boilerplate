#!/usr/bin/env node

import chalk from 'chalk';
import degit from 'degit';
import { execa } from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to run shell commands
const runCommand = async (cmd, args, cwd = process.cwd()) => {
    try {
        await execa(cmd, args, { cwd, stdio: 'inherit' });
    } catch (error) {
        console.error(chalk.red(`Error executing command: ${cmd} ${args.join(' ')}`));
        throw error;
    }
};

// Replace all occurrences of the old name in iOS files
const replaceInFile = (filePath, oldName, newName) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(new RegExp(oldName, 'g'), newName);
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(chalk.green(`✅ Replaced in ${filePath}`));
};

// Replace package name in Android files
const replaceAndroidPackageName = (targetDir, oldName, newName) => {
    const androidDir = path.join(targetDir, 'android', 'app', 'src', 'main', 'java', 'com', oldName);
    const filesToReplace = [
        `${androidDir}/MainActivity.kt`,
        `${androidDir}/MainApplication.kt`,
        `${targetDir}/android/app/src/main/res/values/strings.xml`,
    ];

    filesToReplace.forEach((file) => {
        if (fs.existsSync(file)) {
            console.log(chalk.green(`🔄 Updating package name in ${file}...`));
            replaceInFile(file, oldName, newName);
        } else {
            console.warn(chalk.yellow(`⚠️ File not found: ${file}. Skipping...`));
        }
    });

    // Rename the Android directory for the package name
    const oldAndroidDir = path.join(targetDir, 'android', 'app', 'src', 'main', 'java', 'com', oldName);
    const newAndroidDir = path.join(targetDir, 'android', 'app', 'src', 'main', 'java', 'com', newName);
    if (fs.existsSync(oldAndroidDir)) {
        console.log(chalk.green(`🔄 Renaming directory: ${oldAndroidDir} -> ${newAndroidDir}`));
        fs.renameSync(oldAndroidDir, newAndroidDir);
    } else {
        console.warn(chalk.yellow(`⚠️ Android directory not found: ${oldAndroidDir}. Skipping rename...`));
    }
};

// Main CLI function
const createApp = async () => {
    console.log(chalk.cyan.bold("🚀 Welcome to Create My React Native App!"));

    // Step 1: Prompt for app name
    const { appName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'appName',
            message: 'What is your new app name?',
            validate: (input) => (input ? true : 'App name cannot be empty'),
        },
    ]);

    const boilerplateRepo = 'Tanishk-P/React-Native-Boiler-Plate';
    const targetDir = path.resolve(process.cwd(), appName);

    // Step 2: Clone the boilerplate
    console.log(chalk.green(`\n📥 Cloning boilerplate into ${appName}...`));
    const emitter = degit(boilerplateRepo, { cache: false, force: true });
    await emitter.clone(targetDir);

    // Step 3: Update package.json
    console.log(chalk.green("\n🔄 Updating package.json..."));
    const packageJsonPath = `${targetDir}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.name = appName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Step 3.1: Update app.json
    console.log(chalk.green("\n🔄 Updating app.json..."));
    const appJsonPath = `${targetDir}/app.json`;
    if (fs.existsSync(appJsonPath)) {
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
        appJson.name = appName; // Update the name
        appJson.displayName = appName; // Update the display name if present
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
    } else {
        console.warn(chalk.yellow("⚠️ app.json not found. Skipping..."));
    }

    // Step 4: Initialize Git
    console.log(chalk.green("\n📂 Initializing Git..."));
    await runCommand('git', ['init', '--initial-branch', 'main'], targetDir); // Initialize with 'main' branch

    // Step 5: Rename the project
    console.log(chalk.green("\n🔄 Renaming the project..."));
    try {
        await runCommand('npx', ['react-native-rename', appName, '--skipGitStatusCheck'], targetDir);
    } catch (error) {
        console.error(chalk.red("Failed to rename the project."));
        throw error;
    }

    // Step 6: Replace old app name in iOS folder
    console.log(chalk.green("\n🔧 Fixing iOS folder references..."));
    const iosPath = path.join(targetDir, 'ios');
    const oldAppName = 'reactNativeBoilerPlate'; // Replace with your boilerplate's actual name
    const filesToReplace = [
        `${iosPath}/Podfile`,
        `${iosPath}/${oldAppName}.xcodeproj/project.pbxproj`,
        `${iosPath}/${oldAppName}.xcworkspace/contents.xcworkspacedata`,
    ];

    filesToReplace.forEach((file) => {
        if (fs.existsSync(file)) {
            replaceInFile(file, oldAppName, appName);
        } else {
            console.warn(chalk.yellow(`⚠️ File not found: ${file}`));
        }
    });

    // Rename iOS directories
    const oldAppDir = path.join(iosPath, oldAppName);
    const newAppDir = path.join(iosPath, appName);
    if (fs.existsSync(oldAppDir)) {
        fs.renameSync(oldAppDir, newAppDir);
        console.log(chalk.green(`✅ Renamed iOS directory: ${oldAppName} -> ${appName}`));
    } else {
        console.warn(chalk.yellow(`⚠️ Directory not found: ${oldAppDir}`));
    }

    // Update Android package name
    console.log(chalk.green("\n🔧 Fixing Android package name..."));
    const oldAndroidAppName = 'reactnativeboilerplate'; // Replace with your boilerplate's actual Android package name
    replaceAndroidPackageName(targetDir, oldAndroidAppName, appName.toLowerCase());

    // Step 7: Stage files for commit (but don't commit yet)
    console.log(chalk.green("\n📦 Staging files..."));
    await runCommand('git', ['add', '.'], targetDir);

    // Step 8: Install dependencies
    console.log(chalk.green("\n📦 Installing dependencies..."));
    await runCommand('yarn', [], targetDir);

    // Step 9: Commit after iOS renaming and dependencies installation
    console.log(chalk.green("\n📦 Committing changes..."));
    await runCommand('git', ['commit', '-m', 'React Naitve Boiler Plate initalised'], targetDir);

    console.log(chalk.green.bold(`\n🎉 Success! Your React Native app "${appName}" is ready.`));

    // Add GitHub Star request
    console.log(chalk.green(`\nIf you like this tool, please give it a star on GitHub:`));
    console.log(chalk.blue(`   https://github.com/Tanishk-P/create-rn-boilerplate`));

    console.log(chalk.blue(`\n👉 Next Steps:`));
    console.log(chalk.yellow(`   cd ${appName}`));
    console.log(chalk.yellow(`   yarn ios # or yarn android`));
};

// Run the CLI
createApp().catch((error) => {
    console.error(chalk.red("\n❌ An error occurred:"), error.message);
});