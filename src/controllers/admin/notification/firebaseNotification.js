const admin = require("firebase-admin");
const path = require("path");

// Correct the path to your service account key
const serviceAccount = require(path.resolve(
  "E:/MERN COURSE/MERN STACK PROJECT/ExamDaur/serviceAccountKey.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.sendNotification = async (req, res) => {
  try { 
    const { token, payload } = req.body;
    const response = await admin.messaging().sendToDevice(token, payload);
    console.log("Successfully sent message:", response);
    res.status(200).send(response); // Respond with the success response
  } catch (error) {
    console.log("Error sending message:", error);
    res.status(500).send(error); // Respond with the error message
  }
};