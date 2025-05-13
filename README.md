# Smart Pantry Assistant – Google Cloud Function Webhook

This is the backend webhook service for the Smart Pantry Assistant, a voice-enabled pantry management system integrated with Google Assistant via Dialogflow CX. This Cloud Function handles user voice intents for adding, removing, and listing pantry items in Firestore.

## Tech Stack

- Google Cloud Functions (2nd gen)
- Firebase Admin SDK
- Firestore (NoSQL)
- Dialogflow CX webhook format
- Node.js / TypeScript

## Project Structure
```
functions/
├── src/
│ └── index.ts # Main Cloud Function handler
├── package.json
├── tsconfig.json
└── .eslintrc.js
```

## Setup & Deployment

### 1. Clone & Initialize

```bash
firebase init functions
cd functions
npm install
```

### 2. Set Up Firebase Admin
Make sure Firestore is initialized in your Firebase Console. No additional config is needed for admin SDK when deployed via Firebase.

3. Deploy the Function
```bash
firebase deploy --only functions
```

Make note of the generated HTTPS URL — you’ll use this as your webhook endpoint in Dialogflow CX.

## Dialogflow CX Integration
Webhook Settings:
Method: POST

Auth: None (allow unauthenticated access via Cloud Run permissions)

Tag Routing:

add-item → Adds item to pantry

remove-item → Removes item

Sample Fulfillment Handler (TypeScript):

```ts
exports.dialogflowWebhook = functions.https.onRequest(async (req, res) => {
  const tag = req.body.fulfillmentInfo.tag;
  const params = req.body.sessionInfo.parameters;

  if (tag === 'add-item') {
    await db.collection('pantry').add({ item: params.item });
    return res.send({
      fulfillment_response: {
        messages: [{ text: { text: [`Added ${params.item} to your pantry.`] } }]
      }
    });
  }

  // Additional logic for remove-item 
});

```

## Resources
- [Smart Pantry Assistant: Project Execution Plan](https://docs.google.com/document/d/1JssDPkg--uEA79bTqc58HewIPLeJNF53QGX8u9A5C-o/edit?usp=sharing)
- [Smart Pantry Assistant: Project Overview](https://docs.google.com/document/d/1M_RUGyyI8DmCIYrEZMCRjs2C1C4-Znz6BI2Gmj3ZLoY/edit?usp=sharing)
