# Create RN Boilerplate

`create-rn-boilerplate` is a CLI tool designed to help developers quickly set up a new React Native project by cloning a pre-configured boilerplate repository. This tool is perfect for developers who want to skip the repetitive setup process and dive straight into building their application.

## Features

- Clones a pre-configured React Native boilerplate from [React-Native-Boiler-Plate](https://github.com/Tanishk-P/React-Native-Boiler-Plate).
- Sets up your project with best practices for structure, navigation, and state management(coming soon!)
- Set up the project structure for both iOS and Android
- Automatically rename project files (iOS and Android)
- Update `package.json`, `app.json`, and other configuration files with your app name
- Initialize Git, stage, and commit the initial files
- Install dependencies using yarn
- Automatically installs dependencies
- Easily start developing with a clean, ready-to-go project

## Prerequisites

- Node.js (>= 14.x)
- npm (>= 6.x) or yarn
- Git

## Installation

You can install `create-rn-boilerplate` globally using npm or yarn:

```bash
npm install -g create-rn-boilerplate
```

or

```bash
yarn global add create-rn-boilerplate
```

## Usage

To create a new React Native project, simply run the following command and provide a name when prompted:

```bash
create-rn-boilerplate
```

### Example

```bash
create-rn-boilerplate
```

You will be prompted to enter a name for your new project, e.g., `MyNewApp`.

This will:

1. Clone the boilerplate repository to a folder named `MyNewApp`.
2. Install the necessary dependencies.
3. Initialize your new React Native project.

## Options

- `--help`: Displays usage information.
- `--version`: Displays the current version of the CLI tool.
- `--no-install`: Skips the dependency installation step.

## Boilerplate Repository

The boilerplate repository used by this CLI tool is located at [https://github.com/Tanishk-P/React-Native-Boiler-Plate](https://github.com/Tanishk-P/React-Native-Boiler-Plate). It includes:

- Pre-configured navigation (e.g., React Navigation).
- State management setup (e.g., Redux, Context API).
- A clean and scalable folder structure.
- Essential utilities and custom hooks.

## Contributing

Contributions are welcome! If you have ideas for improving this CLI tool or the boilerplate, feel free to open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Feedback

If you encounter any issues or have suggestions for improvement, please open an issue in this repository or the boilerplate repository.

## Source Code

The source code for `create-rn-boilerplate` is available on GitHub: [https://github.com/Tanishk-P/create-rn-boilerplate](https://github.com/Tanishk-P/create-rn-boilerplate).
