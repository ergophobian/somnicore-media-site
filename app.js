const header = document.querySelector('[data-header]');
const reveals = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 30);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (reducedMotion) {
  reveals.forEach((element) => element.classList.add('visible'));
  document.querySelectorAll('video').forEach((video) => video.pause());
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  reveals.forEach((element) => observer.observe(element));
}

document.querySelectorAll('.faq details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq details').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const emailDialog = document.querySelector('[data-email-dialog]');
const emailDialogTriggers = document.querySelectorAll('[data-email-dialog-trigger]');
const emailDialogClose = document.querySelector('[data-email-dialog-close]');

const openEmailDialog = () => {
  if (!emailDialog) return;
  if (typeof emailDialog.showModal === 'function') {
    if (!emailDialog.open) emailDialog.showModal();
  } else {
    emailDialog.setAttribute('open', '');
  }
  document.body.classList.add('dialog-open');
};

const closeEmailDialog = () => {
  if (!emailDialog) return;
  if (typeof emailDialog.close === 'function' && emailDialog.open) {
    emailDialog.close();
  } else {
    emailDialog.removeAttribute('open');
  }
  document.body.classList.remove('dialog-open');
};

emailDialogTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openEmailDialog();
  });
});

emailDialogClose?.addEventListener('click', closeEmailDialog);
emailDialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));
emailDialog?.addEventListener('click', (event) => {
  if (event.target === emailDialog) closeEmailDialog();
});

const copyWithFallback = (text) => {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand('copy');
  field.remove();
  if (!copied) throw new Error('Copy command failed');
};

document.querySelectorAll('[data-copy-email]').forEach((copyEmailButton) => {
  copyEmailButton.addEventListener('click', async () => {
    const email = copyEmailButton.dataset.copyEmail;
    const label = copyEmailButton.querySelector('[data-copy-label]');
    const copyStatus = copyEmailButton.closest('[data-copy-zone]')?.querySelector('[data-copy-status]');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        copyWithFallback(email);
      }
      label.textContent = 'Email copied ✓';
      if (copyStatus) copyStatus.textContent = `${email} copied to your clipboard.`;
    } catch {
      label.textContent = 'Copy manually';
      if (copyStatus) copyStatus.textContent = `Copy this address: ${email}`;
    }

    window.setTimeout(() => {
      label.textContent = 'Copy email address';
      if (copyStatus) copyStatus.textContent = '';
    }, 4000);
  });
});
