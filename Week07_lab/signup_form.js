
const form = document.getElementById('signup-form');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const interests = document.getElementById('interests');
const strengthBar = document.getElementById('password-strength-bar');
const strengthText = document.getElementById('password-strength-text');
const termsCheckbox = document.getElementById('terms');

window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('signupData')) || {};
  for (const key in saved) {
    const input = document.getElementById(key);
    if (input) input.value = saved[key];
  }
});

form.addEventListener('input', (e) => {
  if (e.target.matches('input')) {
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem('signupData', JSON.stringify(data));
  }
});

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
    if (value.length < 8) return setError(input, '密碼至少需 8 碼且含數字及英文字母');
  }

  if (input.id === 'confirm') {
    const pwd = document.getElementById('password').value.trim();
    if (!value) return setError(input, '請再次輸入密碼');
    if (value !== pwd) return setError(input, '兩次密碼不一致');
  }

  setError(input, '');
}

function updateStrength(password) {
  let strength = '弱';
  let color = '#dc3545'; 
  let width = 33;

  const hasLetters = /[A-Za-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecials = /[^A-Za-z0-9]/.test(password);

  if (password.length >= 8 && (hasLetters || hasNumbers)) {
    strength = '中';
    color = '#ff9800';
    width = 66;
  }

  if (hasLetters && hasNumbers && password.length > 16) {
    strength = '強';
    color = '#28a745';
    width = 100;
  }

  strengthBar.style.width = width + '%';
  strengthBar.style.backgroundColor = color;
  strengthText.textContent = `密碼強度：${strength}`;
  strengthText.style.color = color;
}

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

function showTermsModal() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.classList.add('terms-modal');
    modal.innerHTML = `
      <div class="terms-backdrop" style="
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.5);display:flex;
        align-items:center;justify-content:center;z-index:9999;">
        <div style="background:white;padding:20px;max-width:500px;border-radius:8px;">
          <h5>服務條款</h5>
          <p style="max-height:200px;overflow:auto;">
            歡迎使用本網站！請詳細閱讀以下條款：
            <br>1. 您的個人資料僅用於會員服務。
            <br>2. 請勿濫用或違法使用本網站。
            <br>3. 本公司保留隨時修改條款的權利。
            <br><br>點選「確認」表示您已閱讀並同意上述條款。
          </p>
          <div class="text-end mt-3">
            <button id="terms-ok" class="btn btn-primary btn-sm">確認</button>
            <button id="terms-cancel" class="btn btn-secondary btn-sm ms-2">取消</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#terms-ok').addEventListener('click', () => {
      modal.remove();
      resolve(true);
    });

    modal.querySelector('#terms-cancel').addEventListener('click', () => {
      modal.remove();
      resolve(false);
    });
  });
}

termsCheckbox.addEventListener('click', async (e) => {
  e.preventDefault(); 
  const agree = await showTermsModal();
  if (agree) {
    termsCheckbox.checked = true;
    document.getElementById('terms-error').textContent = '';
  } else {
    termsCheckbox.checked = false;
  }
});

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
form.addEventListener('blur', (e) => {
  if (e.target.matches('input:not([type="checkbox"])')) validateInput(e.target);
}, true);

form.addEventListener('input', (e) => {
  if (e.target.id === 'password') updateStrength(e.target.value);
  if (e.target.matches('input:not([type="checkbox"])')) validateInput(e.target);
});
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
