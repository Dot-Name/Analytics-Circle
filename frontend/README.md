# 🎓 Analytics Circle - Frontend Documentation

Welcome to the React Frontend repository for the Analytics Circle LMS. This project is a modern, responsive, and dynamic Learning Management System interface built to provide a seamless educational experience.

---

## 🚀 Tech Stack Overview
* **Core Framework:** React.js (Bootstrapped with [Vite](https://vitejs.dev/) for blazing fast performance)
* **Styling:** Tailwind CSS (Utility-first CSS framework)
* **Routing:** React Router DOM (v6)
* **HTTP Client:** Axios (For communicating with the Node.js backend)
* **Animations:** AOS (Animate On Scroll library)

---

## 📂 Deep Dive into Folder Structure

All the core logic and UI code lives inside the `src/` directory. Here is how it is organized:

### 1. `src/pages/`
Contains the top-level views/routes of the application. Each file here represents a unique URL in the browser.
* `Home.jsx` - The main landing page (`/`).
* `Programs.jsx` & `Course.jsx` - Display available courses and individual course details.
* `Blogs.jsx` & `BlogDetail.jsx` - The blog section of the website.
* `Login.jsx` & `Signup.jsx` - User authentication pages handling forms and API requests.

### 2. `src/components/`
Contains reusable UI building blocks. This folder is heavily modularized:
* **Global Components:** `Navbar.jsx`, `Footer.jsx`, `HeroSection.jsx`, `ScrollToTop.jsx`.
* **Blog Specific:** `src/components/Blog/` (contains sub-components like `Testimonials.jsx`, `Newsletter.jsx`, `TrendingTopics.jsx`).
* **Course Specific:** `src/components/course/` (contains `CourseCurriculum.jsx`, `CourseFAQ.jsx`, `CourseFeatures.jsx`).

### 3. `src/data/`
Currently acts as a local database containing static `.json` files (e.g., `courses.json`, `team.json`, `faqs.json`). 
* **⚠️ Transition Note:** The project is currently transitioning from utilizing this static JSON data to fetching dynamic data from our MongoDB backend via APIs.

### 4. `src/App.jsx`
The central nervous system for **Routing**. Every new page created must be registered here inside the `<Routes>` wrapper. It also initializes global animations (AOS) on mount.

---

## 🔐 Authentication Flow (Important)
1. **Signup/Login:** Handled in `Signup.jsx` and `Login.jsx`.
2. **API Call:** Form data is sent to the backend (`http://localhost:5000/api/auth/login`) via `axios.post`.
3. **Token Storage:** Upon successful login, the backend returns a JWT (JSON Web Token) and user details. These are stored in the browser's `localStorage` (`localStorage.setItem('token', ...)`).
4. **Session Verification:** For any protected API calls in the future, retrieve this token from `localStorage` and pass it in the Axios headers.

---

## 🛠️ Setup & Local Development Commands

To get this project running on your local machine, follow these steps:

1. **Install Dependencies:**
   Make sure you are in the `frontend` directory, then run:
   ```bash
   npm install
Start the Development Server:

Bash
npm run dev
The app will typically run on http://localhost:5173.

Build for Production:
When ready to deploy, run:

Bash
npm run build
This will generate an optimized dist/ folder.

📝 Developer "How-To" Guide
How to create a new page?
Create a new file inside src/pages/ (e.g., Profile.jsx).

Build your UI using React and Tailwind CSS.

Open src/App.jsx.

Import your page: import Profile from './pages/Profile';

Add the route: <Route path="/profile" element={<Profile />} />

How to fetch data from the Backend?
Whenever you need to fetch real data (replacing the src/data/ JSON files):

JavaScript
import axios from 'axios';
import { useEffect, useState } from 'react';

const fetchCourses = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/courses');
    setCourses(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
Note on CSS & Styling
We strictly use Tailwind CSS. Avoid writing custom CSS in index.css unless absolutely necessary (like defining custom Tailwind base layers or specific keyframe animations). Rely on Tailwind utility classes directly in the className attributes.