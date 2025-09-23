
import * as vscode from 'vscode';
import fetch from 'node-fetch';

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const EXTENSION_NAME = 'OnePassword API Key Manager';

// Types
interface APIKey {
	id: number;
	name: string;
	description?: string;
	tags?: string;
	createdAt: string;
	updatedAt: string;
}

interface User {
	id: number;
	fullName: string;
	email: string;
}

// Utility functions
function showError(message: string, error?: unknown) {
	const errorMsg = error instanceof Error ? error.message : String(error);
	vscode.window.showErrorMessage(`${EXTENSION_NAME}: ${message}${errorMsg ? ` - ${errorMsg}` : ''}`);
}

function showInfo(message: string) {
	vscode.window.showInformationMessage(`${EXTENSION_NAME}: ${message}`);
}

function showWarning(message: string) {
	vscode.window.showWarningMessage(`${EXTENSION_NAME}: ${message}`);
}

async function makeAPIRequest(endpoint: string, options: any = {}) {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			timeout: 10000,
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
			throw new Error('Cannot connect to OnePassword server. Make sure the server is running on localhost:5000');
		}
		throw error;
	}
}

export function activate(context: vscode.ExtensionContext) {
	// Status bar item
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	statusBarItem.command = 'onePassword.showStatus';
	context.subscriptions.push(statusBarItem);

	// Update status bar
	function updateStatusBar() {
		const token = context.globalState.get<string>('onePasswordToken');
		const user = context.globalState.get<User>('onePasswordUser');
		
		if (token && user) {
			statusBarItem.text = `$(key) OnePassword: ${user.fullName}`;
			statusBarItem.tooltip = `Logged in as ${user.email}\nClick to view options`;
		} else {
			statusBarItem.text = `$(key) OnePassword: Not logged in`;
			statusBarItem.tooltip = 'Click to login to OnePassword';
		}
		statusBarItem.show();
	}

	// Login Command
	context.subscriptions.push(
		vscode.commands.registerCommand('onePassword.login', async () => {
			try {
				const email = await vscode.window.showInputBox({
					prompt: 'Enter your email address',
					placeHolder: 'user@example.com',
					validateInput: (value) => {
						if (!value) return 'Email is required';
						if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email address';
						return null;
					}
				});
				
				if (!email) return;

				const password = await vscode.window.showInputBox({
					prompt: 'Enter your password',
					password: true,
					validateInput: (value) => {
						if (!value) return 'Password is required';
						if (value.length < 6) return 'Password must be at least 6 characters';
						return null;
					}
				});
				
				if (!password) return;

				// Show progress
				await vscode.window.withProgress({
					location: vscode.ProgressLocation.Notification,
					title: 'Logging in to OnePassword...',
					cancellable: false
				}, async () => {
					const data = await makeAPIRequest('/auth/login', {
						method: 'POST',
						body: JSON.stringify({ email, password })
					});

					await context.globalState.update('onePasswordToken', data.token);
					await context.globalState.update('onePasswordUser', {
						id: data.id,
						fullName: data.fullName,
						email: data.email
					});
				});

				updateStatusBar();
				showInfo(`Successfully logged in as ${email}`);
			} catch (error) {
				showError('Login failed', error);
			}
		})
	);

	// Logout Command
	context.subscriptions.push(
		vscode.commands.registerCommand('onePassword.logout', async () => {
			const result = await vscode.window.showWarningMessage(
				'Are you sure you want to logout from OnePassword?',
				'Logout', 'Cancel'
			);
			
			if (result === 'Logout') {
				await context.globalState.update('onePasswordToken', undefined);
				await context.globalState.update('onePasswordUser', undefined);
				updateStatusBar();
				showInfo('Successfully logged out');
			}
		})
	);

	// Status Command
	context.subscriptions.push(
		vscode.commands.registerCommand('onePassword.showStatus', async () => {
			const token = context.globalState.get<string>('onePasswordToken');
			const user = context.globalState.get<User>('onePasswordUser');
			
			if (!token || !user) {
				const result = await vscode.window.showInformationMessage(
					'You are not logged in to OnePassword',
					'Login'
				);
				if (result === 'Login') {
					vscode.commands.executeCommand('onePassword.login');
				}
				return;
			}

			const options = [
				'View API Keys',
				'Refresh Connection',
				'Logout'
			];

			const selected = await vscode.window.showQuickPick(options, {
				placeHolder: `Logged in as ${user.fullName} (${user.email})`
			});

			switch (selected) {
				case 'View API Keys':
					vscode.commands.executeCommand('onePassword.listKeys');
					break;
				case 'Refresh Connection':
					vscode.commands.executeCommand('onePassword.refreshConnection');
					break;
				case 'Logout':
					vscode.commands.executeCommand('onePassword.logout');
					break;
			}
		})
	);

	// List API Keys Command
	context.subscriptions.push(
		vscode.commands.registerCommand('onePassword.listKeys', async () => {
			const token = context.globalState.get<string>('onePasswordToken');
			if (!token) {
				showWarning('Please login first');
				return;
			}

			try {
				const apiKeys = await makeAPIRequest('/apikeys/list', {
					headers: { 'Authorization': `Bearer ${token}` }
				});

				if (!apiKeys || apiKeys.length === 0) {
					showInfo('No API keys found in your account');
					return;
				}

				const items = apiKeys.map((key: APIKey) => ({
					label: key.name,
					description: key.description || 'No description',
					detail: `Created: ${new Date(key.createdAt).toLocaleDateString()}${key.tags ? ` • Tags: ${key.tags}` : ''}`,
					key
				}));

				const selected = await vscode.window.showQuickPick(items, {
					placeHolder: `Select an API key (${apiKeys.length} available)`
				});

				if (selected) {
					const actions = ['Copy Name', 'View Details', 'Insert in Current File'];
					const action = await vscode.window.showQuickPick(actions, {
						placeHolder: `What would you like to do with "${selected.label}"?`
					});

					switch (action) {
						case 'Copy Name':
							await vscode.env.clipboard.writeText(selected.key.name);
							showInfo(`Copied "${selected.key.name}" to clipboard`);
							break;
						case 'View Details':
							const details = `Name: ${selected.key.name}\nDescription: ${selected.key.description || 'None'}\nTags: ${selected.key.tags || 'None'}\nCreated: ${new Date(selected.key.createdAt).toLocaleString()}`;
							vscode.window.showInformationMessage(details, { modal: true });
							break;
						case 'Insert in Current File':
							const editor = vscode.window.activeTextEditor;
							if (editor) {
								const position = editor.selection.active;
								await editor.edit(editBuilder => {
									editBuilder.insert(position, selected.key.name);
								});
								showInfo(`Inserted "${selected.key.name}" at cursor position`);
							} else {
								showWarning('No active editor found');
							}
							break;
					}
				}
			} catch (error) {
				showError('Failed to fetch API keys', error);
			}
		})
	);

	// Refresh Connection Command
	context.subscriptions.push(
		vscode.commands.registerCommand('onePassword.refreshConnection', async () => {
			const token = context.globalState.get<string>('onePasswordToken');
			if (!token) {
				showWarning('Please login first');
				return;
			}

			try {
				await vscode.window.withProgress({
					location: vscode.ProgressLocation.Notification,
					title: 'Testing OnePassword connection...',
					cancellable: false
				}, async () => {
					await makeAPIRequest('/dashboard', {
						headers: { 'Authorization': `Bearer ${token}` }
					});
				});

				showInfo('Connection to OnePassword server is working');
			} catch (error) {
				showError('Connection test failed', error);
				const result = await vscode.window.showErrorMessage(
					'Connection failed. Would you like to login again?',
					'Login', 'Cancel'
				);
				if (result === 'Login') {
					vscode.commands.executeCommand('onePassword.login');
				}
			}
		})
	);

	// Initialize status bar
	updateStatusBar();
	//Detect .env file changes and show API key picker

	vscode.workspace.onDidChangeTextDocument(async (event)=>{
		const editor=vscode.window.activeTextEditor;

		if(!editor || !editor.document.fileName.endsWith('.env')) return;
		if(event.document!==editor.document) return;

		const change=event.contentChanges[0];

		if(!change) return;

		const lineText=editor.document.lineAt(change.range.start.line).text;
		console.log(lineText)
		

		const match=lineText.match(/(\w+_API_KEY)\s*=\s*$/);
		console.log(match)

		if(!match)
			return;
		
		const token = context.globalState.get<string>('onePasswordToken');
		if (!token) {
		vscode.window.showWarningMessage('Please login with OnePassword first.');
		return;
		}
		
		let apiKeys: { name: string; description?: string; value: string }[] = [];
		try {
		const res = await fetch(`${API_BASE_URL}/apikeys/list`, {
			headers: { 'Authorization': `Bearer ${token}` }
		});
		
		if (!res.ok) throw new Error('Failed to fetch API keys');
		const data = await res.json();


		apiKeys = data.apiKeys || [];

		if (apiKeys.length === 0) {
			vscode.window.showInformationMessage('No API keys found in your account.');
			return;
		}
		} catch (err: any) {
			vscode.window.showErrorMessage('Error fetching API keys: ' + err.message);
			return;
		}

		 // Show QuickPick
		const selected = await vscode.window.showQuickPick(
		apiKeys.map(k => ({
			label: k.name,
			description: k.description,
			detail: k.value,
		})),
			{ placeHolder: 'Select an API key to insert' }
		);
		if (!selected) return;


		const keyStart = lineText.indexOf(match[1]) + match[1].length + 1;
		const range = new vscode.Range(
			change.range.start.line,
			keyStart,
			change.range.start.line,
			lineText.length
		);
		await editor.edit(editBuilder => {
			editBuilder.replace(range, selected.detail);
		});

		try{
			await fetch(`${API_BASE_URL}/dashboard/activity`,{
				method:'POST',
				headers:{
					'Content-Type':'application/json',
					'Authorization':`Bearer ${token}`
				},
				body: JSON.stringify({apiKeyName:selected.label,action:'used'})
			}) 
		}catch{

		}
	})
}


export function deactivate() {}
