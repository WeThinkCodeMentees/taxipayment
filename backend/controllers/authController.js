const { admin, db } = require("../../firestore/firebase-config");

/**
 * Register a new user (Auth + Firestore profile)
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.phone - User's phone number
 * @param {string} req.body.location - User's location
 * @param {boolean} req.body.isServiceProvider - Whether user offers services
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const register = async (req, res) => {
    const { email, password, name, phone, location, isServiceProvider } = req.body;

    try {
        // Register a user on firebase auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        //Create a suer profile on firestore
        await db.collection("users").doc(userRecord.uid).set({
            name,
            email,
            phone,
            location,
            isServiceProvider,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({
            message: "User registered successfully",
            uid: userRecord.uid,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Login user by verifying Firebase ID token
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.idToken - Firebase ID token from frontend
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        res.json({ message: "Login successful", uid: decodedToken.uid });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { register, login };
