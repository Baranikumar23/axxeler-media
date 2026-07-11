// js/firebase-config.js

// 🚨 TODO: Replace this block with your Firebase Web Config from the Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase only if keys have been updated
let app = null;
let db = null;

// Ensure Firebase SDK is loaded via CDN before initializing
if (typeof firebase !== 'undefined') {
    if (!firebaseConfig.apiKey.includes("YOUR_")) {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log("Firebase initialized successfully.");
    } else {
        console.warn("Firebase config is missing. Operating in local-only fallback mode.");
    }
} else {
    console.warn("Firebase SDK not detected. Operating in local-only fallback mode.");
}

// ------------------------------------------------------------------
// DB Helper Functions (Automatically fallback to LocalStorage)
// ------------------------------------------------------------------

const saveTestimonial = async (testimonialData) => {
    if (db) {
        try {
            await db.collection("testimonials").add(testimonialData);
            return true;
        } catch (e) {
            console.error("Error adding document: ", e);
            return false;
        }
    } else {
        // Fallback to localStorage
        const existing = JSON.parse(localStorage.getItem('axxeler_testimonials') || '[]');
        existing.push(testimonialData);
        localStorage.setItem('axxeler_testimonials', JSON.stringify(existing));
        return true;
    }
};

const getTestimonials = async () => {
    if (db) {
        try {
            const snapshot = await db.collection("testimonials").orderBy('timestamp', 'desc').get();
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error("Error fetching testimonials: ", e);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('axxeler_testimonials') || '[]').reverse();
    }
};

const saveVideoUrl = async (videoData) => {
    if (db) {
        try {
            await db.collection("videos").add(videoData);
            return true;
        } catch (e) {
            console.error("Error adding video: ", e);
            return false;
        }
    } else {
        // Fallback to localStorage
        const existing = JSON.parse(localStorage.getItem('axxeler_videos') || '[]');
        existing.push(videoData);
        localStorage.setItem('axxeler_videos', JSON.stringify(existing));
        return true;
    }
};

const getVideos = async () => {
    if (db) {
        try {
            const snapshot = await db.collection("videos").orderBy('timestamp', 'desc').get();
            return snapshot.docs.map(doc => doc.data());
        } catch (e) {
            console.error("Error fetching videos: ", e);
            return [];
        }
    } else {
        return JSON.parse(localStorage.getItem('axxeler_videos') || '[]').reverse();
    }
};
