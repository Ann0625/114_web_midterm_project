

const form = document.getElementById('full-form');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const agreeCheckbox = document.getElementById('agree');

function createPrivacyModal() {
  const modal = document.createElement('div');
  modal.id = 'privacy-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modal.style.display = 'none';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.innerHTML = `
    <div style="
      background: white;
      width: 90%;
      max-width: 500px;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    ">
      <h5 class="mb-3">隱私權條款</h5>
      <div style="max-height: 250px; overflow-y: auto;">
        <p>感謝您使用本網站。我們重視您的個人資料保護，您的姓名、聯絡方式與留言內容僅用於回覆您的詢問，不會提供給第三方使用。</p>
        <p>如您希望查閱、更正或刪除您的資料，請與我們聯絡。</p>
        <p>詳細內容請參閱完整的《隱私權政策》。</p>
      </div>
      <div class="text-end mt-3">
        <button id="privacy-confirm" class="btn btn-primary">我已閱讀並同意</button>
        <button id="privacy-cancel" class="btn btn-outline-secondary ms-2">取消</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

const privacyModal = createPrivacyModal();
const confirmBtn = privacyModal.querySelector('#privacy-confirm');
const cancelBtn = privacyModal.querySelector('#privacy-cancel');

function showPrivacyModal() {
  privacyModal.style.display = 'flex';
}

function hidePrivacyModal() {
  privacyModal.style.display = 'none';
}
agreeCheckbox.addEventListener('change', (e) => {
  if (e.target.checked) {
    e.target.checked = false;
    showPrivacyModal();
  }
});

confirmBtn.addEventListener('click', () => {
  hidePrivacyModal();
  agreeCheckbox.checked = true;
  agreeCheckbox.classList.remove('is-invalid');
});

cancelBtn.addEventListener('click', () => {
  hidePrivacyModal();
  agreeCheckbox.checked = false;
});
function validateAllInputs(formElement) {
  let firstInvalid = null;
  const controls = Array.from(formElement.querySelectorAll('input, select, textarea'));
  controls.forEach((control) => {
    control.classList.remove('is-invalid');
    if (!control.checkValidity()) {
      control.classList.add('is-invalid');
      if (!firstInvalid) {
        firstInvalid = control;
      }
    }
  });
  return firstInvalid;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  const firstInvalid = validateAllInputs(form);
  if (firstInvalid) {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    firstInvalid.focus();
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('資料已送出，感謝您的聯絡！');
  form.reset();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  Array.from(form.elements).forEach((element) => {
    element.classList.remove('is-invalid');
  });
});

form.addEventListener('input', (event) => {
  const target = event.target;
  if (target.classList.contains('is-invalid') && target.checkValidity()) {
    target.classList.remove('is-invalid');
  }
});
