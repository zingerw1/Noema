document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  } else {
    console.error('Registration form not found.');
  }
});

function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.querySelector('input[name="name"]').value.trim();
  const surname = document.querySelector('input[name="surname"]').value.trim();
  const age = parseInt(document.querySelector('input[name="age"]').value.trim(), 10);
  const gender = document.querySelector('select[name="gender"]').value;
  const phone = document.querySelector('input[name="phone"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const country_of_origin = document.querySelector('input[name="country"]').value.trim();
  const marital_status = document.querySelector('select[name="marital_status"]').value;
  const password = document.querySelector('input[name="password"]').value.trim();
  const confirmPassword = document.querySelector('input[name="confirm_password"]').value.trim();

  // === Validations ===
  if (!name || !surname || !age || !gender || !phone || !email || !country_of_origin || !marital_status || !password || !confirmPassword) {
    alert("Please fill out all fields.");
    return;
  }

  if (isNaN(age) || age <= 0 || age > 120) {
    alert("Please enter a valid age between 1 and 120.");
    return;
  }

  if (!/^\d{8}$/.test(phone)) {
    alert("Phone number must be exactly 8 digits.");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if (password.length < 6 || password.length > 45) {
    alert("Password must be between 6 and 45 characters.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // Disable button to prevent multiple submissions
  const submitBtn = document.getElementById('submit-button');
  submitBtn.disabled = true;
  submitBtn.innerText = 'Submitting...';

  // Send the data via fetch
  fetch('user-submit.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      surname,
      age,
      gender,
      phone,
      email,
      country_of_origin,
      marital_status,
      password
    })
  })
    .then(res => res.text())
    .then(text => {
      try {
        const response = JSON.parse(text);
        console.log("Server response:", response);

        if (response.message === 'Registration successful') {
          alert("Registration successful!");
          document.getElementById('registration-form').reset();
        } else {
          alert(response.message || "Something went wrong.");
        }
      } catch (e) {
        console.error("Invalid JSON from server:", text);
        alert("Server returned an unexpected response.");
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
      alert("There was an error submitting the form.");
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Register';
    });
}
