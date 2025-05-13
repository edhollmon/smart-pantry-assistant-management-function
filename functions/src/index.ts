import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

interface DialogflowRequest {
  fulfillmentInfo: {
    tag: string;
  };
  sessionInfo: {
    parameters: { [key: string]: string | number | boolean };
  };
}

export const dialogflowWebhook = functions.https.onRequest(async (req, res) => {
  const body = req.body as DialogflowRequest;
  const tag = body.fulfillmentInfo.tag;
  const params = body.sessionInfo.parameters;

  if (tag === "add-item") {
    const item = params.item;
    await db.collection("pantry").add({item});
    console.log(`Added ${item} to pantry.`);
    res.send({
      fulfillment_response: {
        messages: [{text: {text: [`Added ${item} to your pantry.`]}}],
      },
    });
  } else if (tag === "remove-item") {
    const item = params.item;
    const snapshot = await db.collection("pantry")
      .where("item", "==", item)
      .get();
    snapshot.forEach((doc) => doc.ref.delete());
    console.log(`Removed ${item} from pantry.`);
    res.send({
      fulfillment_response: {
        messages: [{text: {text: [`Removed ${item} from your pantry.`]}}],
      },
    });
  } else {
    console.log(`Unknown tag: ${tag}`);
    res.send({
      fulfillment_response: {
        messages: [{text: {text: ["Sorry, I didn't understand that."]}}],
      },
    });
  }
});
