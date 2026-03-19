
// controllers/eventRegistrationController.js

const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User");
const Event = require("../models/Event");
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Brevo setup
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// ---------------------
// Register for Event and send OTP
// ---------------------
async function registerEvent(req, res) {
    try {
        const { eventId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const event = await Event.findById(eventId).populate("college");

        if (!user || !event) return res.status(404).json({ message: "User or Event not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const registration = await EventRegistration.create({
            user: user._id,
            event: event._id,
            otp
        });

        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
            to: [{ email: user.email, name: user.name }],
            templateId: 1,
            params: { OTP: otp, eventName: event.title, collegeName: event.college.name },
            subject: `Your OTP for ${event.title} Registration`
        });

        await tranEmailApi.sendTransacEmail(sendSmtpEmail);

        res.status(201).json({ message: "OTP sent to your email", registrationId: registration._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// ---------------------
// Verify OTP
// ---------------------
async function verifyOtp(req, res) {
    try {
        const { registrationId, otp } = req.body;
        const registration = await EventRegistration.findById(registrationId);
        if (!registration) return res.status(404).json({ message: "Registration not found" });

        if (registration.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        registration.isVerified = true;
        await registration.save();

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// ---------------------
// Send Bulk Email (College Admin)
// ---------------------
async function sendBulkEmail(req, res) {
    try {
        const { eventId, subject, content } = req.body;

        const registrations = await EventRegistration.find({ event: eventId, isVerified: true }).populate("user");
        const emails = registrations.map(r => ({ email: r.user.email, name: r.user.name }));

        if (emails.length === 0) return res.status(400).json({ message: "No registered users found" });

        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
            to: emails,
            subject,
            htmlContent: content,
            sender: { email: "no-reply@eventkaro.com", name: "EventKaro" }
        });

        await tranEmailApi.sendTransacEmail(sendSmtpEmail);

        res.json({ message: `Bulk email sent to ${emails.length} users.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// ---------------------
// Get Registered Users (College Admin)
// ---------------------
async function getRegisteredUsers(req, res) {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId).populate("college");
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (req.user.role !== "collegeadmin" || req.user.college.toString() !== event.college._id.toString()) {
            return res.status(403).json({ message: "Forbidden: Not authorized for this event" });
        }

        const registrations = await EventRegistration.find({ event: eventId, isVerified: true })
            .populate("user", "name email");

        const users = registrations.map(r => ({
            name: r.user.name,
            email: r.user.email,
            registrationId: r._id,
            registeredAt: r.createdAt
        }));

        res.json({ event: event.title, college: event.college.name, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}

// ---------------------
// Export all functions correctly
// ---------------------
module.exports = { registerEvent, verifyOtp, sendBulkEmail, getRegisteredUsers };