/* MadeUpCompany - Educational Client Script */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_EMAIL = "student@example.com";
const checkPass = p => p.length >= 12 && /\d/.test(p) && /[^a-zA-Z0-9\s]/.test(p) && /[a-zA-Z]/.test(p);

function setError(el, msg) {
  const g = el?.closest(".field-group");
  if (!g) return;
  g.classList.toggle("has-error", !!msg);
  let err = g.querySelector(".field-error-msg");
  if (!err && msg) { err = document.createElement("div"); err.className = "field-error-msg"; g.appendChild(err); }
  if (err && msg) err.textContent = msg;
  if (msg) el.focus();
}

function togglePassword(id, btn) {
  const i = document.getElementById(id), img = btn?.querySelector("img");
  if (!i) return;
  i.type = i.type === "password" ? "text" : "password";
  if (img) img.src = img.src.includes("-off") ? img.src.replace("-off", "") : img.src.replace(".svg", "-off.svg");
}

function switchTab(type) {
  const isP = type === "personal";
  document.getElementById("tab-personal")?.classList.toggle("active", isP);
  document.getElementById("tab-business")?.classList.toggle("active", !isP);
  const fp = document.getElementById("form-personal"), fb = document.getElementById("form-business");
  if (fp && fb) { fp.hidden = !isP; fb.hidden = isP; }
  const t = document.getElementById("signup-title");
  if (t) t.textContent = isP ? "Create an account" : "Create a business account";
}

function setupOTP() {
  const b = document.querySelectorAll(".otp-box");
  b.forEach((box, i) => {
    box.oninput = () => { box.value = box.value.replace(/\D/g, ""); if (box.value && b[i + 1]) b[i + 1].focus(); };
    box.onkeydown = e => { if (e.key === "Backspace" && !box.value && b[i - 1]) b[i - 1].focus(); };
  });
}

function pasteOTP(id) {
  const b = document.querySelectorAll(`#${id} .otp-box`);
  "123456".split("").forEach((d, i) => { if (b[i]) b[i].value = d; });
  b[5]?.focus();
}

function setupPasswordChips() {
  document.querySelectorAll(".password-field input").forEach(input => {
    const form = input.closest("form"), chips = form?.querySelector(".req-chips");
    if (!chips) return;
    input.onfocus = () => chips.classList.add("show");
    input.onblur = () => chips.classList.remove("show");
    input.oninput = () => {
      const v = input.value, rules = {
        length: v.length >= 12, number: /\d/.test(v), special: /[^a-zA-Z0-9\s]/.test(v), letter: /[a-zA-Z]/.test(v)
      };
      chips.querySelectorAll(".chip").forEach(c => {
        const ok = rules[c.dataset.req];
        c.classList.toggle("valid", ok);
        const ic = c.querySelector(".chip-icon");
        if (ic) ic.textContent = ok ? "✓" : "✕";
      });
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupOTP();
  setupPasswordChips();

  // Live email validation
  document.querySelectorAll("input[type='email'], #login-user").forEach(i => {
    i.addEventListener("input", () => { if (EMAIL_REGEX.test(i.value.trim())) setError(i, ""); });
    i.addEventListener("blur", () => { if (i.value.trim() && !EMAIL_REGEX.test(i.value.trim())) setError(i, "Please enter a valid email address"); });
  });

  // Login Form
  const u = document.getElementById("login-user"), p = document.getElementById("login-pass");
  u?.closest("form")?.addEventListener("submit", e => {
    e.preventDefault();
    const em = u.value.trim();
    if (!EMAIL_REGEX.test(em)) return setError(u, "Please enter a valid email address");
    if (em.toLowerCase() !== DEMO_EMAIL) return setError(u, `Unknown account. Demo email: ${DEMO_EMAIL}`);
    if (!p.value) return setError(p, "Please enter your password");
    setError(u, ""); setError(p, "");
    alert("Login successful!");
    window.location.href = "login.html";
  });

  // Personal Register Form
  const pu = document.getElementById("signup-personal-email");
  pu?.closest("form")?.addEventListener("submit", e => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(pu.value.trim())) return setError(pu, "Please enter a valid email address");
    localStorage.setItem("userEmail", pu.value.trim());
    localStorage.setItem("accountType", "personal");
    window.location.href = "register-confirm.html";
  });

  // Business Register Form
  const be = document.getElementById("signup-biz-email"), bp = document.getElementById("signup-biz-pass");
  be?.closest("form")?.addEventListener("submit", e => {
    e.preventDefault();
    const em = be.value.trim(), ps = bp.value, c = document.getElementById("signup-biz-country");
    if (!EMAIL_REGEX.test(em)) return setError(be, "Please enter a valid email address");
    if (!checkPass(ps)) return setError(bp, "Password must fulfill all 4 security criteria");
    if (c && !c.value) return setError(c, "Please select your country of formation");
    localStorage.setItem("userEmail", em);
    localStorage.setItem("accountType", "business");
    if (c) localStorage.setItem("userCountry", c.value);
    window.location.href = "register-confirm.html?type=business";
  });

  // Register OTP Confirm Form
  const rc = document.getElementById("register-confirm-form") || document.querySelector(".flow-container form");
  if (rc && location.pathname.includes("register-confirm")) {
    rc.onsubmit = e => {
      e.preventDefault();
      const isBiz = new URLSearchParams(location.search).get("type") === "business" || localStorage.getItem("accountType") === "business";
      window.location.href = isBiz ? "login.html" : "register-password.html";
    };
  }

  // Password Setup (Step 3)
  const s3 = document.getElementById("step3-pass");
  s3?.closest("form")?.addEventListener("submit", e => {
    if (!checkPass(s3.value)) { e.preventDefault(); setError(s3, "Password must fulfill all 4 security criteria"); }
  });

  // Register Country Selection
  const cSel = document.getElementById("country-select");
  cSel?.closest("form")?.addEventListener("submit", () => localStorage.setItem("userCountry", cSel.value));

  // Poll 1 Phone & Name Validation
  const phone = document.getElementById("phone");
  phone?.closest("form")?.addEventListener("submit", e => {
    const fn = document.getElementById("fname"), ln = document.getElementById("lname"), digits = phone.value.replace(/\D/g, "");
    if (fn && !fn.value.trim()) { e.preventDefault(); return setError(fn, "Missing required field"); }
    if (ln && !ln.value.trim()) { e.preventDefault(); return setError(ln, "Missing required field"); }
    if (digits.length < 5 || digits.length > 15) { e.preventDefault(); return setError(phone, "Please enter a valid phone number (5-15 digits)"); }
  });

  // Login OTP Confirm Form
  const lc = document.getElementById("login-confirm-form") || document.querySelector(".flow-container form");
  if (lc && location.pathname.includes("login-confirm")) {
    lc.onsubmit = e => { e.preventDefault(); alert("Login successful!"); window.location.href = "login.html"; };
  }

  // Summary Country Display (poll-3.html)
  const sc = document.getElementById("summary-country-text"), saved = localStorage.getItem("userCountry");
  if (sc && saved) sc.textContent = saved;
});
