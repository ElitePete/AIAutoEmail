# Auto-Responder for Gmail

## Description
This Node.js program utilizes AI to automatically respond to unread Gmail messages. It employs the OpenAI GPT-3 engine to generate professional responses to emails, assisting in managing your inbox with minimal manual intervention.

## Files

### 1. **google-auth.js**:
   - Handles authentication to the Google API.
   - Reads and saves authorized credentials to a file.
   - Exports functions to load saved credentials, save credentials, and authorize the application.

### 2. **index.js**:
   - Contains the main function to check the inbox for unread emails.
   - Calls functions from `google-auth.js` and `message-extract.js` to authenticate, process messages, and send replies.

### 3. **message-extract.js**:
   - Contains functions to extract message details such as subject and body from Gmail messages.
   - Exports a function to send a reply to a specific message.
   - Utilizes `html-to-text` library to convert HTML email content to plain text.

## Setup

### 1. Install necessary node modules:
bash
`npm install @google-cloud/local-auth googleapis openai html-to-text dotenv`
### 2. Setup your credentials for Google API and OpenAI:
   - When you create an app in Google for this program, you must set up authentication for it. Go to: `https://developers.google.com/gmail/api/auth/web-server` for further details.
   - Update `OPENAI_API_KEY` variable in `index.js` with your OpenAI API key.

## Usage

Run the program:
bash
`node index.js`

The program will check your Gmail inbox for any unread messages, process them, and send professional, AI-generated replies to each.

## Notes
- The Google API scopes are set to read and modify Gmail messages. If you change these scopes, make sure to delete the `token.json` file. A new one will be remade when you re-run the program.
- Make sure your Google Cloud Project has the Gmail API enabled and the necessary OAuth 2.0 client IDs created.
- The OpenAI API key should have necessary permissions for generating text using the specified model.

## License
This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).


