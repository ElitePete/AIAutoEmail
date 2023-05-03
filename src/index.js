const { authorize } = require('./google-auth');
const {google} = require('googleapis');


const { extractMessageParts, sendReply } = require('./message-extract');

const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = 'API KEY';

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);




async function checkInbox() {
    const auth = await authorize();
    const gmail = google.gmail({version: 'v1', auth});
  
    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
    });
  
    if (!res.data.messages) {
      console.log('No unread messages found.');
      return;
    }
  
    const messageIds = res.data.messages.map((message) => message.id);
  
    for (const messageId of messageIds) {
      const message = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
      });

      const fromHeader = message.data.payload.headers.find(header => header.name === 'From');
      if (!fromHeader) {
        console.error('From header not found:', JSON.stringify(message.data.payload.headers, null, 2));
        continue;
      }
      
      const {subject, body} = extractMessageParts(message.data.payload);

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Make a professional open ended reply to: ${body} (End the message with Sincerely, AutoHelper)`,
        temperature: 0.5,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      
      const generatedResponse = response.data.choices[0].text.trim();

      const replyMessage = {
        to: fromHeader.value,
        subject: subject,
        body: `${generatedResponse}`,
        };

        
        
        console.log('________________________');
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        console.log('________________________');
        
        await sendReply(auth, message.id, replyMessage);
        
        await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: {
          removeLabelIds: ['UNREAD'],
          addLabelIds: ['INBOX'],
        },
      });
    }
  }
  
  checkInbox().catch(console.error);
  
  
  