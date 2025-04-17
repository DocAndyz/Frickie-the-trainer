const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

// Set up Express
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(bodyParser.json());

// Set up Dialogflow client
const sessionClient = new dialogflow.SessionsClient();
const projectId = 'your-dialogflow-project-id';  // Replace with your Dialogflow project ID

// Create a unique session ID
const sessionId = uuid.v4();

// Create session path
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

// Handle incoming chat requests
app.post('/chat', async (req, res) => {
    const userText = req.body.query;

    // Create a request object for Dialogflow
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userText,
                languageCode: 'en',
            },
        },
    };

    try {
        // Send request to Dialogflow
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        res.json({ reply: result.fulfillmentText });
    } catch (error) {
        console.error(error);
        res.json({ reply: 'Sorry, I couldn't understand your question.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(\`Server is running on port \${port}\`);
});