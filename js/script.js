const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEMO_EMAIL = "user@example.com";
const DEMO_PASSWORD = "Password123!";

const swal = (title, text, icon = "info", html, cb) =>
  typeof Swal !== "undefined"
    ? Swal.fire({ title, text, html, icon, confirmButtonColor: "#7132F5" }).then(cb)
    : (alert(text || title), cb && cb());

function preklopiGeslo(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const isPass = el.type === "password";
  el.type = isPass ? "text" : "password";
  const img = btn.querySelector("img");
  img ? (img.src = img.src.replace(isPass ? "eye.svg" : "eye-closed.svg", isPass ? "eye-closed.svg" : "eye.svg")) : (btn.textContent = isPass ? "Skrij" : "Pokaži");
}

function uveljaviKodo() {
  typeof Swal !== "undefined"
    ? Swal.fire({ icon: "success", title: "Koda povabila uveljavljena!", timer: 1800, showConfirmButton: false })
    : alert("Koda povabila uveljavljena!");
}

function zamenjajZavihek(vrsta) {
  const jeOsebno = vrsta === "personal";
  const [pTab, bTab, pForm, bForm, slika, naslov] = ["tab-personal", "tab-business", "form-personal", "form-business", "image", "signup-title"].map(id => document.getElementById(id));
  if (!pTab || !bTab || !pForm || !bForm) return;
  pTab.classList.toggle("aktiven", jeOsebno);
  bTab.classList.toggle("aktiven", !jeOsebno);
  if (naslov) naslov.textContent = jeOsebno ? "Create an account" : "Create a business account";
  slika.src = `../img/reg-${jeOsebno ? "personal" : "business"}.png`;
  const [show, hide, anim] = jeOsebno ? [pForm, bForm, "podrsaj-levo"] : [bForm, pForm, "podrsaj-desno"];
  hide.hidden = true;
  show.hidden = false;
  show.classList.remove("podrsaj-desno", "podrsaj-levo");
  void show.offsetWidth;
  show.classList.add(anim);
}

function nastaviOTP() {
  const b = document.querySelectorAll(".polje-otp");
  b.forEach((el, i) => {
    el.addEventListener("input", () => {
      el.value = el.value.replace(/\D/g, "");
      if (el.value && i < b.length - 1) b[i + 1].focus();
    });
    el.addEventListener("keydown", e => e.key === "Backspace" && !el.value && i > 0 && b[i - 1].focus());
  });
}

function nastaviZnackeGesla() {
  document.querySelectorAll(".polje-geslo input").forEach(vnos => {
    const f = vnos.closest("form") || vnos.closest(".kartica");
    const ovoj = f?.querySelector(".zahteve-znacke");
    const znacke = f ? f.querySelectorAll(".znacka") : [];
    if (!ovoj || !znacke.length) return;
    vnos.addEventListener("focus", () => ovoj.classList.add("prikazi"));
    vnos.addEventListener("blur", () => ovoj.classList.remove("prikazi"));
    vnos.addEventListener("input", () => {
      const v = vnos.value;
      const c = { length: v.length >= 12, number: /\d/.test(v), special: /[^a-zA-Z0-9\s]/.test(v), letter: /[a-zA-Z]/.test(v) };
      znacke.forEach(z => {
        const ok = Boolean(c[z.dataset.req]);
        z.classList.toggle("veljavno", ok);
        const ic = z.querySelector(".icon-znacke, .ikona-znacke");
        if (ic) ic.textContent = ok ? "✓" : "✕";
      });
    });
  });
}

function pokaziNapakoPolja(el, msg) {
  const grp = el?.closest(".skupina-polja");
  if (!grp) return;
  grp.classList.add("ima-napako");
  let err = grp.querySelector(".sporocilo-napake");
  if (!err) grp.appendChild(err = Object.assign(document.createElement("div"), { className: "sporocilo-napake" }));
  if (msg) err.textContent = msg;
}

function pocistiNapakoPolja(el) {
  el?.closest(".skupina-polja")?.classList.remove("ima-napako");
}

function nastaviEmailPreverjanje(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener("input", () => EMAIL_REGEX.test(el.value.trim()) && pocistiNapakoPolja(el));
  el.addEventListener("blur", () => el.value.trim() && !EMAIL_REGEX.test(el.value.trim()) && pokaziNapakoPolja(el, "Please enter a valid email address"));
}

const preveriGesloZahteve = pass => pass.length >= 12 && /\d/.test(pass) && /[^a-zA-Z0-9\s]/.test(pass) && /[a-zA-Z]/.test(pass);


//Logika za registracijski form

function nastaviObracunObrazcev() {
  // 1. Prijava
  const u = document.getElementById("login-user"), p = document.getElementById("login-pass");
  if (u && p) {
    nastaviEmailPreverjanje("login-user");
    u.closest("form")?.addEventListener("submit", e => {
      e.preventDefault();
      const email = u.value.trim(), geslo = p.value;
      if (!EMAIL_REGEX.test(email)) return pokaziNapakoPolja(u, "Please enter a valid email address"), u.focus();
      if (email.toLowerCase() !== DEMO_EMAIL.toLowerCase()) return pokaziNapakoPolja(u, "Unknown account"), u.focus();
      if (!geslo) return pokaziNapakoPolja(p, "Please enter your password"), p.focus();
      if (geslo !== DEMO_PASSWORD) return pokaziNapakoPolja(p, "Incorrect password"), p.focus();
      pocistiNapakoPolja(u); pocistiNapakoPolja(p);
      swal("Login Successful!", "Welcome back to Kraken.", "success", null, () => window.location.href = "login.html");
    });
  }

  // 2. Osebna registracija
  const pu = document.getElementById("signup-personal-email"), pf = document.getElementById("form-personal");
  if (pu && pf) {
    nastaviEmailPreverjanje("signup-personal-email");
    pf.addEventListener("submit", e => {
      e.preventDefault();
      const v = pu.value.trim();
      if (!EMAIL_REGEX.test(v)) return pokaziNapakoPolja(pu, "Please enter a valid email address"), pu.focus();
      pocistiNapakoPolja(pu);
      localStorage.setItem("userEmail", v);
      localStorage.setItem("accountType", "personal");
      window.location.href = "register-confirm.html";
    });
  }

  // 3. Poslovna registracija
  const bu = document.getElementById("signup-biz-email"), bp = document.getElementById("signup-biz-pass"), bf = document.getElementById("form-business");
  if (bu && bp && bf) {
    nastaviEmailPreverjanje("signup-biz-email");
    bf.addEventListener("submit", e => {
      e.preventDefault();
      const email = bu.value.trim(), geslo = bp.value, country = document.getElementById("signup-biz-country");
      if (!EMAIL_REGEX.test(email)) return pokaziNapakoPolja(bu, "Please enter a valid email address"), bu.focus();
      pocistiNapakoPolja(bu);
      if (!preveriGesloZahteve(geslo)) return pokaziNapakoPolja(bp, "Password must fulfill all 4 security criteria"), bp.focus();
      pocistiNapakoPolja(bp);
      if (country && !country.value) return pokaziNapakoPolja(country, "Please select your country of formation"), country.focus();
      localStorage.setItem("userEmail", email);
      localStorage.setItem("accountType", "business");
      if (country) localStorage.setItem("userCountry", country.value);
      window.location.href = "register-confirm.html?type=business";
    });
  }

  // 4. Potrditev kode OTP
  const regConfirm = document.getElementById("register-confirm-form") || document.querySelector(".glavni-vsebnik form");
  if (regConfirm && location.pathname.includes("register-confirm")) {
    regConfirm.addEventListener("submit", e => {
      e.preventDefault();
      const jePosel = new URLSearchParams(location.search).get("type") === "business" || localStorage.getItem("accountType") === "business";
      jePosel
        ? swal("Registration Complete!", "Your demo business account has been registered successfully.", "success", null, () => window.location.href = "login.html")
        : window.location.href = "register-password.html";
    });
  }

  // 5. Izbira gesla
  const s3p = document.getElementById("step3-pass");
  s3p?.closest("form")?.addEventListener("submit", e => {
    if (!preveriGesloZahteve(s3p.value)) {
      e.preventDefault();
      pokaziNapakoPolja(s3p, "Password must fulfill all 4 security criteria");
      s3p.focus();
    }
  });

  // 6. Izbira države
  const cSel = document.getElementById("country-select");
  cSel?.closest("form")?.addEventListener("submit", () => localStorage.setItem("userCountry", cSel.value));

  // 7. Prvi korak ankete
  const phone = document.getElementById("phone"), dob = document.getElementById("dob");
  if (dob) {
    dob.max = new Date().toISOString().split("T")[0];
    dob.addEventListener("change", () => {
      if (dob.value) {
        const b = new Date(dob.value), now = new Date();
        let a = now.getFullYear() - b.getFullYear();
        if (now.getMonth() - b.getMonth() < 0 || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
        if (b <= now && a >= 18) pocistiNapakoPolja(dob);
      }
    });
  }
  if (phone) {
    phone.addEventListener("keydown", e => e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey && e.preventDefault());
    phone.addEventListener("input", () => {
      phone.value = phone.value.replace(/\D/g, "");
      if (phone.value.length >= 5 && phone.value.length <= 15) pocistiNapakoPolja(phone);
    });
    phone.closest("form")?.addEventListener("submit", e => {
      let err = false;
      const [fn, ln] = ["fname", "lname"].map(id => document.getElementById(id));
      [fn, ln].forEach(el => {
        if (el && !el.value.trim()) pokaziNapakoPolja(el, "Missing required field"), err = true;
        else if (el) pocistiNapakoPolja(el);
      });
      if (dob) {
        if (!dob.value) pokaziNapakoPolja(dob, "Missing required field"), err = true;
        else {
          const b = new Date(dob.value), now = new Date();
          let a = now.getFullYear() - b.getFullYear();
          if (now.getMonth() - b.getMonth() < 0 || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) a--;
          if (b > now) pokaziNapakoPolja(dob, "Date of birth cannot be in the future"), err = true;
          else if (a < 18) pokaziNapakoPolja(dob, "You must be at least 18 years old"), err = true;
          else pocistiNapakoPolja(dob);
        }
      }
      const digits = phone.value.replace(/\D/g, "");
      if (!digits || digits.length < 5 || digits.length > 15) {
        pokaziNapakoPolja(phone, "Please enter a valid phone number (5-15 digits)");
        err = true;
      } else pocistiNapakoPolja(phone);
      if (err) e.preventDefault();
    });
  }

  // 8. Tretji korak ankete
  const p3f = document.getElementById("poll-3-form") || document.querySelector(".kartica form");
  if (p3f && location.pathname.includes("poll-3")) {
    p3f.addEventListener("submit", e => {
      e.preventDefault();
      swal("Registration Complete!", "Your demo personal account has been created successfully.", "success", null, () => window.location.href = "login.html");
    });
  }

  // 9. Prikaz države
  const sumCountry = document.getElementById("summary-country-text");
  if (sumCountry && localStorage.getItem("userCountry")) sumCountry.textContent = localStorage.getItem("userCountry");
}

function nastaviPovezave() {
  document.addEventListener("click", e => {
    const a = e.target.closest("a");
    if (a) {
      const href = a.getAttribute("href");
      if (a.id === "forgot-password") return e.preventDefault(), swal("Password Recovery", `Demo password: ${DEMO_PASSWORD}`);
      if (a.id === "forgot-username") return e.preventDefault(), swal("Username Recovery", `Demo username / email: ${DEMO_EMAIL}`);
      if (a.id === "hidden-credits") return e.preventDefault(), swal("Credits", `Andrej  Zega,  4.RB,  2026`);
      if (href === "#" || href === "") {
        e.preventDefault();
        return swal("Notice", `You pressed the ${a.getAttribute("data-ime") || a.textContent.trim() || "Link"} button`);
      }
    }
    const btn = e.target.closest("button.druzbeni-button, button.okrogli-druzbeni-button, button.druzbeni-gumb, button.okrogli-druzbeni-gumb");
    if (btn) {
      e.preventDefault();
      return swal("Notice", `You pressed the ${btn.textContent.trim() || btn.querySelector("img")?.alt || "Social"} button`);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  nastaviOTP();
  nastaviZnackeGesla();
  nastaviObracunObrazcev();
  nastaviPovezave();
});
