# SafeGuardian - Emergency SOS App

## 🚀 Overview
SafeGuardian is a personal safety app that allows users to send emergency alerts, share their live location, and call for help instantly. Designed for real-time safety, it includes features like shake-to-trigger SOS, AI-powered sound detection, and background location tracking.

## Link - https://safeguardians.vercel.app/
![safeguardians vercel app_](https://github.com/user-attachments/assets/e5e75d91-564b-4822-890a-3ba868740819)

## 📌 Features

### ✅ Instant SOS Alert 🚨
- One-tap SOS button to send alerts via SMS, WhatsApp, and email.
- Sends real-time GPS location to emergency contacts.

### ✅ Live Location Tracking 🌍
- Google Maps integration for real-time tracking.
- Updates every 5 seconds and shares a live tracking link.

### ✅ Auto Call to Emergency Services 📞
- Automatically dials emergency contacts (e.g., 911, 112).
- Fake call feature to simulate an incoming call in unsafe situations.

 ![sos](https://github.com/user-attachments/assets/ea73d4ae-a01f-4464-b119-461dac056f44)

![sos1](https://github.com/user-attachments/assets/288f86c7-c8d3-41ff-82d1-807e66dcd8d7)

### ✅ Shake-to-Trigger SOS 📳
- Activates SOS alert by shaking the phone.
- Uses accelerometer for distress detection.


![sos2](https://github.com/user-attachments/assets/fcb394f8-f341-44ab-ba71-78bab4473db3)


![sos3](https://github.com/user-attachments/assets/493b3892-5199-4fe2-8111-91ac83728849)

### ✅ AI-Powered Danger Detection 🤖
- Detects screams, gunshots, or unusual sounds.
- Auto-triggers SOS and records audio for evidence.

### ✅ Offline Mode 📲
- Sends emergency SMS with location even without the internet.

### ✅ Background Mode 🕵️
- Runs silently and records location in emergencies.
- Safe Walk Mode: Shares live location while traveling alone.

### ✅ Emergency Contacts Management 📋
- Add/edit up to 5 emergency contacts.
- Sends alerts via WhatsApp and email.

### ✅ Voice & Gesture Commands 🎙️
- Activates SOS using voice commands (e.g., “Help me!”).
- Supports gesture-based activation (e.g., drawing "S").

### ✅ Panic Mode - Auto Video Recording 🎥
- Starts front camera recording when SOS is triggered.
- Uploads video to cloud storage for security.

---

## 🛠️ Installation
### Android Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/safeguardian.git
   ```
2. Open the project in Android Studio.
3. Install dependencies:
   ```sh
   flutter pub get  # For Flutter version
   npm install      # If React Native
   ```
4. Connect a physical or virtual device.
5. Run the app:
   ```sh
   flutter run  # For Flutter
   react-native run-android  # For React Native
   ```

### Backend Setup
1. Install dependencies:
   ```sh
   composer install  # If PHP backend
   npm install       # If Node.js backend
   ```
2. Configure the `.env` file with API keys (Google Maps, Firebase, Twilio, etc.).
3. Start the backend server:
   ```sh
   php artisan serve  # For Laravel backend
   node server.js     # For Node.js backend
   ```

---

## 🔑 API & Services Used
- **Google Maps API** (Live tracking)
- **Firebase Firestore** (Emergency contacts & alerts)
- **Twilio API** (SMS alert service)
- **Google Drive API** (Video upload for panic mode)
- **Speech Recognition API** (Voice-activated SOS)

---

## 🎨 UI/UX Design
- **Color Theme:** Violet, Black, White, Beige
- **Simple, clean, and accessible interface.**
- **Large SOS button for easy accessibility.**

---

## 📌 Future Enhancements
- **Wearable device support (Smartwatches).**
- **AI-powered movement tracking.**
- **Integration with national emergency services.**

---

## 🛠️ Contributors
- **[Your Name]** - Developer
- **[Other Contributors]**

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support
For any issues, open an issue on GitHub or contact **support@safeguardian.com**.

---

🚀 **Stay Safe with SafeGuardian!** 🚀

