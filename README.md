<h1 align="center">Crypto Exchange Sign in & Register Flow Replica</h1>

<p align="center">
  A school project replicating the authentication and onboarding forms of a Crypto Exchange using <strong>HTML5</strong>, <strong>CSS3</strong>, and <strong>Vanilla JavaScript</strong>.
  <br>
  Created for learning front-end web development, form validation, and responsive design. No real data is collected or stored.
</p>

---

## 🌐 Live Demo

You can try the live project here:  
👉 **[Crypto Exchange Live Demo](https://<your-username>.github.io/loginWebsite/)** *(via GitHub Pages)*

---

## ✨ Features

- **Landing Page (`index.html`)**: Simple disclaimer page with a button to enter the sign-in flow.
- **Login Form (`html/login.html`)**: Sign-in with email validation, red error popup, floating labels, password toggle, and success alert.
- **Registration (`html/register.html`)**: Personal and Business account toggle with full world country selector.
- **Password Validation**: Dynamic requirement chips (12+ characters, letter, number, special character) shown on focus.
- **OTP Verification (`html/register-confirm.html`, `html/login-confirm.html`)**: 6-digit confirmation code simulation with paste helper.
- **Onboarding Flow (`html/register-country.html`, `html/poll-1.html`–`poll-3.html`)**: Country selector, personal details, phone regex verification, and multi-step questionnaire.
- **Responsive Design**: Clean layout that adapts to both mobile and desktop screens.

---

## 🔑 Test Credentials

Use these credentials to test the forms:

| Field | Test Value | Notes |
| :--- | :--- | :--- |
| **Email** | `student@example.com` | Verified placeholder account |
| **Password** | `Password123!` | Any password accepted on sign-in |
| **OTP Code** | `123456` | Simulation code |

---

## 📁 Project Structure

```text
loginWebsite/
├── index.html                  # Landing page (educational disclaimer)
├── html/                       # All form pages
│   ├── login.html              # Sign-in page
│   ├── login-confirm.html      # Sign-in OTP confirmation
│   ├── register.html           # Registration page (Personal / Business)
│   ├── register-confirm.html   # Registration OTP confirmation
│   ├── register-country.html   # Country of residence selector
│   ├── poll-1.html             # Personal details & phone verification
│   ├── poll-2.html             # Questionnaire
│   └── poll-3.html             # Summary confirmation
├── css/
│   └── style.css               # Main stylesheet
├── js/
│   └── script.js               # Form validation & interaction sript
└── img/                        # Icons, logos, and animations
```

---

## 🛠️ Technologies Used

- **HTML5** – Semantic page structure and native form inputs
- **CSS3** – Responsive layout, Flexbox, custom variables
- **Vanilla JavaScript** – Form validation (email, password, phone) and step navigation

---

## ⚠️ Disclaimer

This project is created strictly for educational purposes as part of a school assignment.
