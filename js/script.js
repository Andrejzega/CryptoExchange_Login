/* MadeUpCompany - Minimal Educational Client-Side Script */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_EMAIL = "user@example.com";

// Password Visibility Toggle
function togglePassword(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  const icon = btn.querySelector("img");
  if (icon) {
    icon.src = isHidden ? icon.src.replace("eye.svg", "eye-closed.svg") : icon.src.replace("eye-closed.svg", "eye.svg");
    icon.alt = isHidden ? "Hide password" : "Show password";
  } else {
    btn.textContent = isHidden ? "Hide" : "Show";
  }
}

// Personal vs Business Tab Switch with Kraken Sliding Animation (register.html)
function switchTab(type) {
  const isP = type === "personal";
  const image = document.getElementById("image");
  const tabP = document.getElementById("tab-personal");
  const tabB = document.getElementById("tab-business");
  const formP = document.getElementById("form-personal");
  const formB = document.getElementById("form-business");
  const title = document.getElementById("signup-title");
  if (!tabP || !tabB || !formP || !formB) return;

  tabP.classList.toggle("active", isP);
  tabB.classList.toggle("active", !isP);
  if (title) {
    title.textContent = isP ? "Create an account" : "Create a business account";
  }

  if (isP) {
    image.src = "../img/reg-personal.png"
    formB.hidden = true;
    formP.hidden = false;
    formP.classList.remove("slide-right", "slide-left");
    void formP.offsetWidth;
    formP.classList.add("slide-left");
  } else {
    image.src = "../img/reg-business.png"
    formP.hidden = true;
    formB.hidden = false;
    formB.classList.remove("slide-right", "slide-left");
    void formB.offsetWidth;
    formB.classList.add("slide-right");
  }
}

// 6-Digit OTP Auto-advance & Clipboard Paste (Confirm pages)
function setupOTP() {
  const boxes = document.querySelectorAll(".otp-box");
  boxes.forEach((box, i) => {
    box.addEventListener("input", () => {
      box.value = box.value.replace(/\D/g, "");
      if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
    });
    box.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !box.value && i > 0) boxes[i - 1].focus();
    });
  });
}

function pasteOTP(id) {
  const boxes = document.querySelectorAll(`#${id} .otp-box`);
  "123456".split("").forEach((d, i) => { if (boxes[i]) boxes[i].value = d; });
  if (boxes[5]) boxes[5].focus();
}

// Password requirement chips - only appear when password field is selected
function setupPasswordChips() {
  document.querySelectorAll(".password-field input").forEach(input => {
    const form = input.closest("form") || input.closest(".card");
    const chipsWrapper = form ? form.querySelector(".req-chips") : null;
    const chips = form ? form.querySelectorAll(".chip") : [];
    if (!chipsWrapper || !chips.length) return;

    input.addEventListener("focus", () => chipsWrapper.classList.add("show"));
    input.addEventListener("blur", () => chipsWrapper.classList.remove("show"));

    input.addEventListener("input", () => {
      const val = input.value;
      const checks = {
        length: val.length >= 12,
        number: /\d/.test(val),
        special: /[^a-zA-Z0-9\s]/.test(val),
        letter: /[a-zA-Z]/.test(val)
      };
      chips.forEach(chip => {
        const req = chip.dataset.req;
        const ok = Boolean(req && checks[req]);
        chip.classList.toggle("valid", ok);
        const icon = chip.querySelector(".chip-icon");
        if (icon) icon.textContent = ok ? "✓" : "✕";
      });
    });
  });
}

// Email & Field Validation Helpers
function showFieldError(input, message) {
  if (!input) return;
  const group = input.closest(".field-group");
  if (!group) return;
  group.classList.add("has-error");
  let err = group.querySelector(".field-error-msg");
  if (!err) {
    err = document.createElement("div");
    err.className = "field-error-msg";
    group.appendChild(err);
  }
  if (message) err.textContent = message;
}

function clearFieldError(input) {
  if (!input) return;
  const group = input.closest(".field-group");
  if (group) group.classList.remove("has-error");
}

function setupEmailLiveValidation(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => {
    if (EMAIL_REGEX.test(input.value.trim())) clearFieldError(input);
  });
  input.addEventListener("blur", () => {
    const val = input.value.trim();
    if (val && !EMAIL_REGEX.test(val)) {
      showFieldError(input, "Please enter a valid email address");
    }
  });
}

// Form Handlers Setup
function setupFormHandlers() {
  // 1. Login Form (login.html)
  const loginUser = document.getElementById("login-user");
  const loginPass = document.getElementById("login-pass");
  if (loginUser && loginPass) {
    setupEmailLiveValidation("login-user");
    const form = loginUser.closest("form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const email = loginUser.value.trim();
        const pass = loginPass.value;

        if (!EMAIL_REGEX.test(email)) {
          showFieldError(loginUser, "Please enter a valid email address");
          loginUser.focus();
          return;
        }

        if (email.toLowerCase() !== DEMO_EMAIL.toLowerCase()) {
          showFieldError(loginUser, `Unknown account. Demo email: ${DEMO_EMAIL}`);
          loginUser.focus();
          return;
        }

        if (!pass) {
          showFieldError(loginPass, "Please enter your password");
          loginPass.focus();
          return;
        }

        clearFieldError(loginUser);
        clearFieldError(loginPass);
        alert("Login successful!");
        window.location.href = "login.html";
      });
    }
  }

  // 2. Personal Register Form (register.html)
  const pEmail = document.getElementById("signup-personal-email");
  const pForm = document.getElementById("form-personal");
  if (pEmail && pForm) {
    setupEmailLiveValidation("signup-personal-email");
    pForm.addEventListener("submit", e => {
      e.preventDefault();
      const val = pEmail.value.trim();
      if (!EMAIL_REGEX.test(val)) {
        showFieldError(pEmail, "Please enter a valid email address");
        pEmail.focus();
        return;
      }
      clearFieldError(pEmail);
      localStorage.setItem("userEmail", val);
      localStorage.setItem("accountType", "personal");
      window.location.href = "register-confirm.html";
    });
  }

  // 3. Business Register Form (register.html)
  const bEmail = document.getElementById("signup-biz-email");
  const bPass = document.getElementById("signup-biz-pass");
  const bForm = document.getElementById("form-business");
  if (bEmail && bPass && bForm) {
    setupEmailLiveValidation("signup-biz-email");
    bForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = bEmail.value.trim();
      const pass = bPass.value;

      if (!EMAIL_REGEX.test(email)) {
        showFieldError(bEmail, "Please enter a valid email address");
        bEmail.focus();
        return;
      }
      clearFieldError(bEmail);

      const passValid = pass.length >= 12 && /\d/.test(pass) && /[^a-zA-Z0-9\s]/.test(pass) && /[a-zA-Z]/.test(pass);
      if (!passValid) {
        showFieldError(bPass, "Password must fulfill all 4 security criteria");
        bPass.focus();
        return;
      }
      clearFieldError(bPass);

      const country = document.getElementById("signup-biz-country");
      if (country && !country.value) {
        showFieldError(country, "Please select your country of formation");
        country.focus();
        return;
      }

      localStorage.setItem("userEmail", email);
      localStorage.setItem("accountType", "business");
      if (country) localStorage.setItem("userCountry", country.value);
      window.location.href = "register-confirm.html?type=business";
    });
  }

  // 4. Confirm Email OTP Page (register-confirm.html)
  const regConfirmForm = document.getElementById("register-confirm-form") || document.querySelector(".flow-container form");
  if (regConfirmForm && window.location.pathname.includes("register-confirm")) {
    const isBusiness = new URLSearchParams(window.location.search).get("type") === "business" || localStorage.getItem("accountType") === "business";
    regConfirmForm.addEventListener("submit", e => {
      e.preventDefault();
      if (isBusiness) {
        window.location.href = "login.html";
      } else {
        window.location.href = "register-password.html";
      }
    });
  }

  // 5. Register Password Form (register-password.html)
  const step3Pass = document.getElementById("step3-pass");
  if (step3Pass) {
    const form = step3Pass.closest("form");
    if (form) {
      form.addEventListener("submit", e => {
        const pass = step3Pass.value;
        const passValid = pass.length >= 12 && /\d/.test(pass) && /[^a-zA-Z0-9\s]/.test(pass) && /[a-zA-Z]/.test(pass);
        if (!passValid) {
          e.preventDefault();
          showFieldError(step3Pass, "Password must fulfill all 4 security criteria");
          step3Pass.focus();
        }
      });
    }
  }

  // 6. Register Country Form (register-country.html)
  const countrySelect = document.getElementById("country-select");
  if (countrySelect) {
    const form = countrySelect.closest("form");
    if (form) {
      form.addEventListener("submit", () => {
        localStorage.setItem("userCountry", countrySelect.value);
      });
    }
  }

  // 7. Poll 1 Form with Phone Number Regex (poll-1.html)
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    const form = phoneInput.closest("form");
    const fname = document.getElementById("fname");
    const lname = document.getElementById("lname");

    phoneInput.addEventListener("input", () => {
      const cleanDigits = phoneInput.value.replace(/\D/g, "");
      if (cleanDigits.length >= 5 && cleanDigits.length <= 15) clearFieldError(phoneInput);
    });

    if (form) {
      form.addEventListener("submit", e => {
        let hasError = false;
        if (fname && !fname.value.trim()) {
          showFieldError(fname, "Missing required field");
          hasError = true;
        } else {
          clearFieldError(fname);
        }

        if (lname && !lname.value.trim()) {
          showFieldError(lname, "Missing required field");
          hasError = true;
        } else {
          clearFieldError(lname);
        }

        const cleanDigits = phoneInput.value.replace(/\D/g, "");
        if (!cleanDigits || cleanDigits.length < 5 || cleanDigits.length > 15) {
          showFieldError(phoneInput, "Please enter a valid phone number (5-15 digits)");
          hasError = true;
        } else {
          clearFieldError(phoneInput);
        }

        if (hasError) {
          e.preventDefault();
        }
      });
    }
  }

  // 8. Login OTP Confirm Form (login-confirm.html)
  const loginConfirmForm = document.getElementById("login-confirm-form") || document.querySelector(".flow-container form");
  if (loginConfirmForm && window.location.pathname.includes("login-confirm")) {
    loginConfirmForm.addEventListener("submit", e => {
      e.preventDefault();
      alert("Login successful!");
      window.location.href = "login.html";
    });
  }

  // 9. Summary Country Display (poll-3.html)
  const summaryCountry = document.getElementById("summary-country-text");
  if (summaryCountry) {
    const saved = localStorage.getItem("userCountry");
    if (saved) summaryCountry.textContent = saved;
  }
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  setupOTP();
  setupPasswordChips();
  setupFormHandlers();
});
