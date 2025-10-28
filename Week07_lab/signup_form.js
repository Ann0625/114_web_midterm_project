// signup_form.js
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const interests = document.getElementById('interests');
const strengthBar = document.getElementById('password-strength-bar');
const strengthText = document.getElementById('password-strength-text');

// ---------- LocalStorage：恢復暫存 ----------
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('signupData')) || {};
  for (const key in saved) {
    const input = document.getElementById(key);
    if (input) input.value = saved[key];
  }
});

// ---------- LocalStorage：即時暫存 ----------
form.addEventListener('input', (e) => {
  if (e.target.matches('input')) {
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem('signupData', JSON.stringify(data));
  }
});

// ---------- 驗證邏輯 ----------
function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setCustomValidity(message);
  error.textContent = message;
  input.classList.toggle('is-invalid', !!message);
}

function validateInput(input) {
  const value = input.value.trim();

  if (input.id === 'name') {
    if (!value) return setError(input, '姓名為必填欄位');
  }

  if (input.id === 'email') {
    if (!value) return setError(input, 'Email 為必填欄位');
    const pattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!pattern.test(value)) return setError(input, 'Email 格式須為 @gmail.com');
  }

  if (input.id === 'phone') {
    if (!value) return setError(input, '手機為必填欄位');
    if (!/^09\d{8}$/.test(value)) return setError(input, '手機須為 09 開頭共 10 碼數字');
  }

  if (input.id === 'password') {
    if (!value) return setError(input, '請輸入密碼');
    if (value.length < 8) return setError(input, '密碼至少需 8 碼');
  }

  if (input.id === 'confirm') {
    const pwd = document.getElementById('password').value.trim();
    if (!value) return setError(input, '請再次輸入密碼');
    if (value !== pwd) return setError(input, '兩次密碼不一致');
  }

  setError(input, '');
}

// ---------- 密碼強度條 ----------
function updateStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let strength = '';
  let color = '';
  let width = 0;

  if (score <= 1) {
    strength = '弱';
    color = '#dc3545';
    width = 25;
  } else if (score === 2 || score === 3) {
    strength = '中';
    color = '#ffc107';
    width = 60;
  } else {
    strength = '強';
    color = '#28a745';
    width = 100;
  }

  strengthBar.style.width = width + '%';
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = strength ? `密碼強度：${strength}` : '';
  strengthText.style.color = color;
}

// ---------- 興趣標籤事件委派 ----------
interests.addEventListener('click', (e) => {
  const label = e.target.closest('label');
  if (!label) return;
  const checkbox = label.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  label.classList.toggle('active', checkbox.checked);
});

function validateInterests() {
  const checked = [...interests.querySelectorAll('input[type="checkbox"]')].some(c => c.checked);
  const error = document.getElementById('interests-error');
  if (!checked) {
    error.textContent = '請至少選擇一項興趣';
    return false;
  }
  error.textContent = '';
  return true;
}

function validateTerms() {
  const terms = document.getElementById('terms');
  const error = document.getElementById('terms-error');
  if (!terms.checked) {
    error.textContent = '請勾選同意服務條款';
    return false;
  }
  error.textContent = '';
  return true;
}

// ---------- 即時驗證與強度更新 ----------
form.addEventListener('blur', (e) => {
  if (e.target.matches('input:not([type="checkbox"])')) validateInput(e.target);
}, true);

form.addEventListener('input', (e) => {
  if (e.target.id === 'password') updateStrength(e.target.value);
  if (e.target.matches('input:not([type="checkbox"])')) validateInput(e.target);
});

// ---------- 送出攔截 ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll('input:not([type="checkbox"])');
  let firstInvalid = null;

  inputs.forEach(input => {
    validateInput(input);
    if (input.validationMessage && !firstInvalid) firstInvalid = input;
  });

  const validInterests = validateInterests();
  const validTerms = validateTerms();

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  if (!validInterests || !validTerms) return;

  submitBtn.disabled = true;
  submitBtn.textContent = '註冊中...';
  await new Promise(r => setTimeout(r, 1000));

  alert('註冊成功！');
  form.reset();
  resetAll();
  submitBtn.disabled = false;
  submitBtn.textContent = '註冊';
});

// ---------- 重設按鈕 ----------
resetBtn.addEventListener('click', () => {
  form.reset();
  resetAll();
});

function resetAll() {
  strengthBar.style.width = '0%';
  strengthText.textContent = '';
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('p[id$="-error"]').forEach(p => (p.textContent = ''));
  document.querySelectorAll('.btn-outline-primary.active').forEach(btn => btn.classList.remove('active'));
  localStorage.removeItem('signupData');
}
