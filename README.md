# G9 App

[![License](https://img.shields.io/github/license/VMVT-DevHub/g9-app)](https://github.com/VMVT-DevHub/g9-app/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/VMVT-DevHub/g9-app)](https://github.com/VMVT-DevHub/g9-app/issues)
[![GitHub stars](https://img.shields.io/github/stars/VMVT-DevHub/g9-app)](https://github.com/VMVT-DevHub/g9-app/stargazers)

This repository contains the source code and documentation for the G9 App, developed by the Valstybinė maisto ir veterinarijos tarnyba

## Table of Contents

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About the Project

The G9 App is designed to provide information and functionalities related to drinkable water monitoring data.

This is a client application that utilizes
the [G9](https://github.com/VMVT-DevHub/G9).

Key features of the WEB include:

- Providing monitoring data of drinkable water
- Providing declarations of drinkable water monitoring data

## Getting Started

To get started with the G9 App, follow the instructions below.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/VMVT-DevHub/g9-app.git
   ```

2. Install the required dependencies:

   ```bash
   cd g9-app
   yarn install
   ```

### Usage

1. Set up the required environment variables. Copy the `.env.example` file to `.env` and provide the necessary values for the variables.

2. Start the WEB server:

   ```bash
   yarn start
   ```

The WEB will be available at `http://localhost:8080`.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a
pull request. For more information, see the [contribution guidelines](./CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](./LICENSE).
