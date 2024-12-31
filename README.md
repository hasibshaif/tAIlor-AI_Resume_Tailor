# tAIlor - AI Resume Tailorer

Recruitment season always came with the tedious task of tailoring my resume for every job application. Editing the same document over and over was frustrating and time-consuming. To solve this problem, I created **tAIlor - AI Resume Tailorer** — an AI-powered app that makes customizing resumes easy.

tAIlor helps users upload a master resume and automatically generates tailored versions to match specific job descriptions using OpenAI's API. It’s designed to make job applications simpler and more effective.

## Demo

Try it out here: [tAIlor](https://ai-resume-tailorer.vercel.app/)

## Features

- **Upload Your Resume**: Upload and securely manage your `.docx` resume.
- **Generate Tailored Resumes**: Quickly create resumes tailored to specific job descriptions.
- **Resume Management**: Download and organize previously tailored resumes.
- **Seamless Authentication**: Sign in or sign up effortlessly with Clerk.
- **Responsive Design**: Modern, user-friendly, and responsive design that works great on both desktop and mobile devices.

## Tech Stack

### Frontend
- **Next.js**: For building the app with server-side rendering and seamless navigation.
- **React**: To create a dynamic, responsive user interface.
- **ShadCN/UI**: For a modern, consistent design.
- **Framer Motion**: Adds smooth animations and transitions.
- **Clerk**: Simplifies authentication and user management.
- **Axios**: Handles API calls for smooth frontend-backend communication.

### Backend
- **Python & Flask**: Powers the backend logic and API for generating resumes.
- **OpenAI API**: Enables AI-based customization of resumes.
- **Amazon S3**: Secure cloud storage for uploading and managing resumes.
- **IAM**: Manages AWS permissions to keep everything secure.

### Deployment
- **Render**: Hosts the backend Flask API for scalability and reliable performance.
- **Vercel**: Deploys the Next.js frontend with fast, globally distributed delivery.

## Usage

1. Visit the live application.
2. Sign in or create an account.
3. Upload your master resume in `.docx` format.
4. Generate tailored resumes by providing a job title and description.
5. Download or manage tailored resumes from the dashboard.

## Backend Repository

You can find the backend repository here: [tAIlor Backend](https://github.com/hasibshaif/ai-resume-tailor-backend)

---

Thank you for exploring **tAIlor**! I hope it makes your job applications easier and more effective.
