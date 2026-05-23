document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('qrInput');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const qrContainer = document.getElementById('qrCode');
  const errorEl = document.getElementById('qrError');
  const sizeSelect = document.getElementById('qrSize');
  let qr = null;

  function generate() {
    const text = input.value.trim();
    errorEl.textContent = '';
    qrContainer.innerHTML = '';

    if (!text) {
      errorEl.textContent = 'Enter text or a URL to generate a QR code.';
      return;
    }

    const size = parseInt(sizeSelect.value);

    qr = new QRCode(qrContainer, {
      text,
      width: size,
      height: size,
      colorDark: getComputedStyle(document.documentElement).getPropertyValue('--bs-body-color').trim() || '#212529',
      colorLight: getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg').trim() || '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });

    downloadBtn.classList.remove('d-none');
  }

  downloadBtn.addEventListener('click', () => {
    const canvas = qrContainer.querySelector('canvas');
    const img = qrContainer.querySelector('img');
    const src = canvas ? canvas.toDataURL('image/png') : (img ? img.src : null);
    if (!src) return;
    const a = document.createElement('a');
    a.download = 'qrcode.png';
    a.href = src;
    a.click();
  });

  generateBtn.addEventListener('click', generate);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') generate(); });
  generate();
});
