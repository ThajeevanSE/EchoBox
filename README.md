# 🎧 EchoBox – Entertainment Discovery App

**A Cross-Platform Mobile Application built with React Native (Expo)**

## 📌 Overview

EchoBox is a modern entertainment mobile application that allows users to explore trending movies, music, and podcasts.

The app includes user authentication, dynamic API-based content, favourites, and smooth navigation with a clean UI built following industry standards.

This project is developed as part of **IN3210 – Mobile Applications Development (Assignment 2)**.

---

## 🚀 Features

### 🔐 User Authentication

* User Registration & Login
* Form validation (Formik/Yup or custom)
* Successful login redirects to the Home screen
* Auth state stored securely in local storage
* Logged-in username displayed on the app header

### 🧭 Navigation

Implemented using **React Navigation**.

App includes:
* Stack Navigation
* Bottom Tab Navigation (Home, Favourites, Profile)
* Item Details Screen

### 🎬 Entertainment Content

* Fetch trending entertainment content (movies/music/podcasts) from public APIs
* Each item displayed as a card with:
    * Image
    * Title
    * Description / Rating / Status

### ⭐ Favourites

* Users can add/remove favourites
* Favourites stored using **Redux Toolkit + persistence**
* Dedicated Favourites Screen

### 🎨 UI & Styling

* Clean, modern, responsive UI
* Feather Icons
* Consistent color theme
* Works on all screen sizes

### 🌙 Bonus Feature

* Dark Mode toggle (optional)

---

## 🔧 Tech Stack

| Category | Technology |
| :--- | :--- |
| Framework | **React Native (Expo)** |
| Navigation | **React Navigation** |
| State Management | **Redux Toolkit** |
| Persistence | AsyncStorage / Redux-Persist |
| API | TheMovieDB or other entertainment APIs |
| Icons | Feather Icons |
| Validation | Formik + Yup |
| Styling | StyleSheet / Tailwind RN (optional) |

---

## 🌐 API Used

**TheMovieDB API (recommended)**

Documentation: [https://developer.themoviedb.org/](https://developer.themoviedb.org/)

Example endpoint:
https://api.themoviedb.org/3/trending/movie/day?api_key=YOUR_API_KEY

*(You may replace this with podcasts or mixed APIs depending on your implementation.)*

---

## 📂 Project Structure

EchoBox/ │ ├── assets/ │ ├── src/ │ ├── components/ │ ├── navigation/ │ ├── redux/ │ │ ├── slices/ │ │ └── store.js │ ├── screens/ │ │ ├── Auth/ │ │ ├── Home/ │ │ ├── Details/ │ │ ├── Favourites/ │ │ └── Profile/ │ ├── utils/ │ └── services/ │ ├── App.js ├── package.json └── README.md


---

## 📸 Screenshots





---

## 🎥 Demo Video



---

## 🛠️ Installation & Running the App

### 1️⃣ Clone the Repository

```bash
git clone [https://github.com/yourusername/EchoBox.git](https://github.com/yourusername/EchoBox.git)
cd EchoBox
## 2️⃣ Install Dependencies
Bash

npm install
## 3️⃣ Start App
Bash

npx expo start

## 📘 How It Works
Login → Home → View Entertainment Items → Details → Add to Favourites → View Favourites

The app maintains global state (auth, favourites) using Redux Toolkit and persists locally for a smooth user experience.

## 🏗️ Future Enhancements
Offline support

Push notifications

User playlists

Multi-language support

## 👨‍💻 Developer
Vasanthakumar Thajeevan

BSc (Hons) Information Technology

University of Moratuwa

## 📄 License
This project is developed for academic purposes only.