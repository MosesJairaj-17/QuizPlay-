🎯 QuizPlay – Interactive Web-Based Quiz Application

🧠 Project Overview

QuizPlay is an interactive, responsive, web-based quiz application designed to provide users with an engaging learning and assessment experience. The platform supports both guest users and authenticated users, offering features such as real-time quizzes, score tracking, dashboards, and leaderboards.

This project was developed as part of an internship program under Inlighntech Private Limited, focusing on practical implementation of full-stack web development concepts.

🎯 Objectives

To design and develop a user-friendly quiz platform

To implement secure authentication using Firebase

To store quiz history and leaderboard data efficiently using MongoDB

To provide real-time scoring and performance tracking

To ensure responsiveness across desktop and mobile devices

🛠️ Tech Stack Used
Frontend

HTML5

CSS3 (Responsive Design)

JavaScript (Vanilla JS)

Backend

Node.js

Express.js

Database

MongoDB (Quiz history, user points, leaderboard data)

Authentication

Firebase Authentication

Email & Password Login

Google Login

✨ Features

User Authentication

Secure login using Email & Password

Google OAuth login support

Email verification for registered users

Guest Mode Access

Users can play quizzes without logging in

Guest progress is not stored

Multiple Quiz Categories

General Knowledge

Science

Technology

Sports

History

Movies

Mathematics

Music

Difficulty Levels

Easy

Medium

Hard

Timer-Based Quizzes

Configurable time limits per quiz

Visual timer bar and warnings

Real-Time Score Calculation

Instant feedback for correct and incorrect answers

Automatic score calculation

User Dashboard

View total points

Quiz history

Performance statistics

Progress graph using charts

Leaderboard

Displays top performers

Filter by category and difficulty

View Top 10 and Top 30 players

Rule-Based Chatbot

Helps users navigate the platform

Provides predefined responses to common queries

Feedback & Contact Form

Users can submit feedback and queries through a contact form

Dark Mode Support

Toggle between light and dark themes

Responsive Design

Optimized for desktop, tablet, and mobile devices

🧩 Module Description
1. Authentication Module

Handles user signup, login, Google authentication, and guest access using Firebase.

2. Quiz Module

Manages quiz setup, question rendering, timer handling, and scoring logic.

3. Dashboard Module

Displays user profile, quiz history, total points, rank, and progress charts.

4. Leaderboard Module

Fetches and displays ranked users based on scores with filtering options.

5. Chatbot Module

Rule-based chatbot for basic assistance and navigation help.

6. Backend API Module

REST APIs built with Node.js and Express.js to handle quiz history, leaderboard, and dashboard data.

🗄️ Database Design
MongoDB Collections
User Collection

userId (Firebase email/UID)

name

totalPoints

createdAt

QuizHistory Collection

userType (user / guest)

userId

category

level

timer

score

totalQuestions

earnedPoints

playedAt

🔐 Note: Authentication credentials are not stored in MongoDB.
Firebase securely handles all authentication data.

🖼️ Screenshots

Screenshots of the following pages can be added:

Home Page

Quiz Setup & Quiz Play

Dashboard

Leaderboard

Authentication Page

Rule-Based Chatbot

🚀 Future Enhancements

Add AI-based adaptive quizzes

Admin panel for quiz management

More detailed analytics and reports

Multiplayer or live quiz mode

Backend authentication middleware

Cloud deployment

📌 Conclusion

QuizPlay successfully demonstrates the implementation of a complete full-stack web application using modern web technologies. The project enhanced practical knowledge in frontend design, backend development, database management, and authentication mechanisms, fulfilling the objectives of the internship program at Inlighntech Private Limited.

📚 References

MDN Web Docs – https://developer.mozilla.org

MongoDB Documentation – https://www.mongodb.com/docs

Firebase Documentation – https://firebase.google.com/docs

Node.js Documentation – https://nodejs.org

👨‍💻 Developed By

Moses Jairaj


🔗 GitHub Repository

👉 https://github.com/MosesJairaj-17/QuizPlay-
