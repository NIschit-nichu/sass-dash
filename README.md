# SaaS Landing Page with Email Verification

## Setup

### Backend
1. `cd server`
2. `npm install`
3. Create `.env` (see sample in code)
4. `npm start`

### Frontend
- Open `client/index.html` in your browser (or serve via Express as above).

## Features
- Responsive landing page
- Sign-up with email verification
- MongoDB for user storage
- Nodemailer for email delivery

## Security
- Passwords hashed with bcrypt
- Email verification required for access
