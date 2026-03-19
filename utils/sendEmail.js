const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

// Initialize Brevo client
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

/**
 * sendEmail({ to, subject, html })
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - html content
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      sender: {
        name: "EventKaro",                // ✅ Must be a verified sender in Brevo
        email: "anuragkumarmait@gmail.com",  // Example: no-reply@eventkaro.com
      },
      to: Array.isArray(to)
        ? to.map((email) => ({ email }))   // Support multiple recipients
        : [{ email: to }],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent to ${to} successfully`);
  } catch (error) {
    console.error("❌ Failed to send email via Brevo:", error.response?.body || error);
    throw error; // throw so controller can handle it
  }
};

module.exports = sendEmail;