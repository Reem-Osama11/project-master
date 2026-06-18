# Career Craft – AI-Powered Job Portal with Smart Career Path Upskilling

## Team Members

* Reem Osama Hamdy
* Alaa Abopaker Khalifa
* Nada Sayed Mohamed
* Huda Sameh Mohamed
* Mohamed Refaat Mohamed
* Ahmed Sayed Ahmed Soliman
* Ahmed Yasser Sayed Mohamed
* Hager Hatem Rabiea
* Eshak Sameh Attia

## Project Overview

Career Craft is an AI-powered recruitment and career development platform designed to bridge the gap between job seekers and labor market requirements. Unlike traditional job portals, the platform not only connects candidates with job opportunities but also identifies skill gaps and provides personalized learning recommendations to enhance employability.

The system integrates Artificial Intelligence technologies with a modern full-stack architecture to automate resume analysis, candidate-job matching, and career path guidance.

---

## Key AI Features

### 1. AI Resume Analyzer

The Resume Analyzer automatically processes uploaded resumes and extracts structured information, including:

* Technical skills
* Soft skills
* Work experience
* Educational background
* Professional summaries

This enables efficient candidate profiling and accurate data analysis.

### 2. AI Matching Score Engine

The platform evaluates the compatibility between a candidate's resume and a specific job description.

The AI generates a matching score percentage that reflects how well the candidate satisfies the job requirements based on skills, qualifications, and experience.

### 3. AI Feedback & Skill Gap Analysis

The system provides detailed feedback explaining why a candidate may not be a strong match for a particular role.

It identifies missing skills and competencies required by the target position and highlights improvement opportunities.

---

## Smart Career Upskilling Workflow

The platform implements a continuous career development cycle:

Upload Resume
↓
AI Resume Analysis
↓
Matching Score & Feedback
↓
Skill Gap Detection
↓
Recommended Learning Courses
↓
Course Completion
↓
Automatic Skill & CV Update
↓
Improved Matching Score

For example, if a candidate applies for a Full-Stack Developer position but lacks Backend development skills such as Node.js or Express.js, the system automatically detects the gap and recommends suitable learning resources. Upon successful completion of the recommended courses, the candidate’s profile and skills are updated, leading to improved future matching results.

---

## System Architecture

### Frontend

* React.js
* Responsive User Interface
* Interactive Dashboards
* React Router Navigation

### Backend

* Node.js
* Express.js
* RESTful APIs
* Authentication & Authorization

### Database

* MongoDB
* User Profiles
* Job Listings
* Applications
* Courses Database

### AI Integration

* Large Language Models (LLMs)
* OpenRouter API
* Structured JSON Responses
* Resume Analysis
* Candidate Evaluation
* Skill Gap Detection

---

## Project Objectives

* Automate recruitment screening and candidate evaluation.
* Improve candidate-job matching accuracy.
* Provide transparent AI-generated feedback.
* Identify missing skills and recommend learning paths.
* Support continuous career development and upskilling.
* Reduce recruitment time and administrative workload.
* Create an intelligent, growth-oriented recruitment ecosystem.

## Conclusion

Career Craft transforms traditional recruitment platforms into intelligent career development ecosystems by combining AI-powered recruitment, skill-gap analysis, personalized learning recommendations, and automated profile enhancement within a single integrated solution.
# Installation & Running the Project

## 1. Clone the Repository

```bash
git clone <repository-url>
cd project-master
```

## 2. Install Frontend Dependencies

Navigate to the client folder and install all required packages:

```bash
cd client
npm install
```

This command downloads all required dependencies and automatically creates the `node_modules` folder.

## 3. Install Backend Dependencies

Open a new terminal and navigate to the server folder:

```bash
cd server
npm install
```

This command installs all backend dependencies and creates the corresponding `node_modules` folder.

## 4. Configure Environment Variables

Create a `.env` file inside the `server` directory and add the required environment variables:

```env
OPENROUTER_API_KEY=YOUR_API_KEY
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

## 5. Run the Backend Server

From the `server` directory:

```bash
npm start
```

Or, if the project uses Nodemon:

```bash
npm run dev
```

## 6. Run the Frontend Application

Open another terminal and navigate to the client folder:

```bash
cd client
npm run dev
```

For Create React App projects:

```bash
npm start
```

## 7. Access the Application

After successfully starting both frontend and backend services, open your browser and navigate to:

```text
http://localhost:5173
```

or

```text
http://localhost:3000
```

depending on the frontend configuration.

## Notes

* Make sure Node.js is installed before running the project.
* MongoDB must be running locally or connected through MongoDB Atlas.
* A valid OpenRouter API Key is required for AI-powered features such as Resume Analysis, Matching Score Generation, and Skill Gap Detection.
