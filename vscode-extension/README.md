# OnePassword VS Code Extension

This extension lets you securely manage and insert API keys from your OnePassword backend.

## Features

- Login with your OnePassword account (`OnePassword: Login` command)
- When editing `.env` files, typing a key ending with `_API_KEY` shows a popup with your API keys
- Select and insert an API key value directly
- Usage is tracked in your backend

## Setup

1. Install the extension in VS Code.
2. Run the command `OnePassword: Login` and enter your credentials.
3. Edit a `.env` file and type a key ending with `_API_KEY` (e.g. `GEMINI_API_KEY=`).
4. Select an API key from the popup to insert its value.

## Requirements

- Your backend must be running at `http://localhost:5000` and support the `/auth/login`, `/apikeys/list`, and `/dashboard/activity` endpoints.
