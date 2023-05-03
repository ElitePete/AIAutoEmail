const {google} = require('googleapis');


/**
 * Extract the message parts from a given Gmail message.
 *
 * @param {Object} message A Gmail message object.
 * @return {{subject: string, body: string}} The subject and body of the message.
 */
const { htmlToText } = require('html-to-text');

function extractMessageParts(payload) {
    if (!payload || !payload.headers) {
      console.error('Message payload or headers not found:', JSON.stringify(payload, null, 2));
      return { subject: '', body: '' };
    }
  
    let encodedBody = '';
    if (typeof payload.parts === 'undefined') {
      encodedBody = payload.body.data;
    } else {
      encodedBody = findPart(payload.parts, 'text/html') || findPart(payload.parts, 'text/plain');
    }
  
    const decodedBody = Buffer.from(encodedBody, 'base64').toString('utf-8');
    const subjectHeader = payload.headers.find(header => header.name === 'Subject');
  
    const textBody = htmlToText(decodedBody, {
        wordwrap: 130,
        ignoreHref: true,
        ignoreImage: true,
      });

    return {
      subject: subjectHeader ? subjectHeader.value : '',
      body: textBody,
    };
  }
  
  

/**
 * Find a specific part in a message part array by MIME type.
 *
 * @param {Array<Object>} parts An array of message parts.
 * @param {string} mimeType The MIME type to find.
 * @return {string|null} The matching message part or null if not found.
 */
function findPart(parts, mimeType) {
  for (let part of parts) {
    if (part.mimeType === mimeType) {
      return part.body.data;
    }
    if (part.parts) {
      const childParts = findPart(part.parts, mimeType);
      if (childParts !== null) {
        return childParts;
      }
    }
  }
  return null;
}

async function sendReply(auth, messageId, message) {
    const gmail = google.gmail({ version: 'v1', auth });
  
    // Create the reply message
    const raw = `To: ${message.to}\r\n` +
      `Subject: Re: ${message.subject}\r\n` +
      `In-Reply-To: ${messageId}\r\n` +
      `References: ${messageId}\r\n\r\n` +
      `${message.body}`;
  
    // Encode the message in base64url format
    const buff = Buffer.from(raw);
    const base64Url = buff.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
    // Send the reply message
    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: base64Url },
    });
  
    console.log(`Reply sent: ${res.data.id}`);
  }


  module.exports = {sendReply, findPart, extractMessageParts};