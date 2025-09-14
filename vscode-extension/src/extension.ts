
import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { eventNames } from 'process';
import { METHODS } from 'http';
import { brotliDecompressSync } from 'zlib';

const API_BASE_URL='http://localhost:5000';

export function activate(context: vscode.ExtensionContext) {

	//Login Command
	context.subscriptions.push(
		vscode.commands.registerCommand('onePassword.login',async()=>{
			const email=await vscode.window.showInputBox({prompt:'Enter your email'});
			if(!email)
				return;

			const password=await vscode.window.showInputBox({prompt:'Enter your password'});
			if(!password)
				return;
			
			try {
				const res=await fetch(`${API_BASE_URL}/auth/login`,{
					method:'POST',
					headers:{'Content-Type':"application/json"},
					body:JSON.stringify({email,password}),

				})

				if(!res.ok){
					const err=await res.text();
					throw new Error(err||'Login failed');
				}
				const data=await res.json();

				await context.globalState.update('onePasswordToken',data.token);
				vscode.window.showInformationMessage('Login successful!');
			} catch(err:any){
				vscode.window.showErrorMessage('Login failed: '+err.message)
			}
		})
	)
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
