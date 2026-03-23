# 🚀 CertFlow – Digital Certificate Automation System

A full-stack web application that automates the process of applying, approving, and generating academic certificates using a secure multi-level approval workflow.

---

## 📱 Live Demo

🌐 **Web App:** https://certfloww.vercel.app/

📱 **Android App:** Deployed using WebView (Android Studio)

---

## 🎯 Project Overview

CertFlow streamlines certificate management in academic institutions by replacing manual processes with a fully digital system.

It enables students to apply for certificates online while allowing HOD and Principal to approve them through a structured workflow.

---

## 🔁 Workflow

```
Student applies
→ HOD approves
→ Principal approves
→ PDF generated
→ Student downloads certificate
```

---

## 👥 User Roles

### 👨‍🎓 Student
- Register & login (using Register Number)
- Apply for certificates
- Track application status
- Download certificate after approval

### 👨‍🏫 HOD
- View pending applications
- Approve student requests

### 👨‍💼 Principal
- View HOD-approved applications
- Final approval
- Trigger PDF generation

---

## 🔐 Features

- Secure authentication system  
- Role-based access control  
- Multi-level approval workflow  
- Automatic PDF generation  
- Token-based password reset  
- Session management & logout  
- MongoDB Cloud (Atlas) integration  
- Production-ready backend  

---

## 🛠 Tech Stack

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### Frontend
- HTML  
- CSS  
- JavaScript  

### Deployment
- Vercel (Backend Hosting)  
- MongoDB Atlas (Cloud Database)  
- Android Studio (WebView App)  

---

## 🗄 Database Schema

### Users
- name  
- regNo (unique, sparse)  
- department  
- year  
- semester  
- email (unique)  
- password  
- role (student / hod / principal)  
- resetToken  
- resetTokenExpiry  

---

### Certificates
- studentRegNo  
- certificateType  
- purpose  
- appliedDate  
- hodStatus  
- hodApprovedDate  
- principalStatus  
- principalApprovedDate  
- finalStatus  
- pdfFile  

---

## 🔐 Authentication Flow

- Students login using **Register Number + Password**
- Admins (HOD & Principal) login using **Email + Password**
- Token-based password reset with expiry
- Role-based protected dashboards

---

## 📄 PDF Generation

- Certificates are generated automatically after Principal approval  
- Stored securely on server  
- Download available only after final approval  

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/certflow.git
cd certflow
```

---

### 2️⃣ Install dependencies

```bash
cd backend
npm install
```

---

### 3️⃣ Setup environment variables

Create a `.env` file inside the backend folder:

```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

---

### 4️⃣ Run backend

```bash
node server.js
```

---

### 5️⃣ Run frontend

Open this file in your browser:

```
frontend/index.html
```

---

## 🌟 Future Enhancements

- Email-based password reset  
- QR code verification on certificates  
- React frontend (Full MERN stack)  
- UI/UX improvements  
- Mobile app (PWA / Play Store release)  

---

## 🧠 Learnings

- Backend architecture design  
- Role-based authentication systems  
- Multi-level workflow implementation  
- Cloud database integration  
- Full-stack deployment  

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📬 Contact

- LinkedIn: https://www.linkedin.com/in/nagireddi8919/
- Email: abhinay891984@gmail.com  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
