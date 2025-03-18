import express from 'express';
import bodyParser from 'body-parser';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import { getSheetData } from './sheets';

const app = express();
const port = process.env.PORT || 3000;

// Parse incoming POST requests
app.use(bodyParser.urlencoded({ extended: false }));

// Webhook endpoint for incoming SMS
app.post('/sms', async (req, res) => {
  try {
    // Create TwiML response
    const twiml = new MessagingResponse();

    // Get lunch info from sheets
    const { lunchMessage } = await getSheetData();

    // Add message to response
    twiml.message(lunchMessage);

    // Send response
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  } catch (error) {
    console.error('Error handling SMS webhook:', error);
    res.status(500).send('Error processing request');
  }
});

module.exports = app;

// export function startServer() {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// }
