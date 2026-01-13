document.addEventListener('DOMContentLoaded', function(){
  // Set current year
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if(!form) return;

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    // Simple client-side validation
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    if(!name.value.trim() || !email.value.trim()){
      status.textContent = 'Please provide your name and a valid email.';
      status.className = 'error';
      return;
    }

    // Honeypot field to deter bots
    const gotcha = form.querySelector('input[name="_gotcha"]');
    if(gotcha && gotcha.value){
      status.textContent = 'Spam detected.';
      status.className = 'error';
      return;
    }

    status.textContent = 'Sending…';
    status.className = '';

    try{
      // Decide endpoint: if the form action is still the Formspree placeholder, send to local API
      let submitUrl = form.action;
      let options;

      if (form.action && form.action.includes('formspree.io') && form.action.includes('your-form-id')) {
        // Send JSON to our backend
        submitUrl = '/api/contact';
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            service: form.service.value,
            message: form.message.value,
            _gotcha: form.querySelector('input[name="_gotcha"]').value || ''
          })
        };
      } else {
        // Use form action (e.g., Formspree or custom endpoint)
        options = {
          method: form.method || 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        };
      }

      const response = await fetch(submitUrl, options);

      if(response.ok){
        const data = await response.json().catch(()=>null);
        status.textContent = (data && data.message) ? data.message : 'Thanks! Your message was sent — we will contact you soon.';
        status.className = 'success';
        form.reset();
      } else {
        const data = await response.json().catch(()=>null);
        status.textContent = data && data.error ? data.error : 'There was a problem sending your message. Please try again later.';
        status.className = 'error';
      }
    } catch(err){
      status.textContent = 'Network error. Please check your connection and try again.';
      status.className = 'error';
      console.error(err);
    }
  });
});
