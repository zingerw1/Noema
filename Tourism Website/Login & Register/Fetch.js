document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener after DOM is fully loaded
    const form = document.getElementById('registration-form'); // Updated ID
    if (form) {
      form.addEventListener('submit', showModal);
    } else {
      console.error('Form not found!');
    }
  });
  
  function showModal(event) {
    event.preventDefault();  // Prevent form default behavior (page reload)
  
    console.log('Form submission triggered'); // This should appear immediately when the form is submitted
  
    // Get form elements
    const name = document.querySelector('input[name="name"]').value.trim();
    const surname = document.querySelector('input[name="surname"]').value.trim();
    const age = document.querySelector('input[name="age"]').value.trim();
    const gender = document.querySelector('select[name="gender"]').value;
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const country = document.querySelector('input[name="country"]').value.trim();
    const maritalStatus = document.querySelector('select[name="marital_status"]').value;
    const nextOfKin = document.querySelector('input[name="next_of_kin"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value.trim(); // Updated name for confirm password
  
    // Validate inputs
    if (!name || !surname || !age || !gender || !phone || !email || !country || !maritalStatus || !nextOfKin || !password || !confirmPassword) {
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
  
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    console.log('Form data:', { name, surname, age, gender, phone, email, country, maritalStatus, nextOfKin, password });
  
    // Show loading state
    document.getElementById('submit-button').disabled = true;
    document.getElementById('submit-button').innerText = 'Submitting...';
  
    // Send data to the backend server
    fetch('http://localhost:3000/register', {
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
        country,
        maritalStatus,
        nextOfKin,
        password
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log('Server response:', result);
      if (result.message === 'Registration successful') {
        // Show success modal
        document.getElementById('success-modal').style.display = 'flex';
  
        // Optionally reset form if needed
        document.getElementById('registration-form').reset();
      } else {
        alert(result.message || 'Registration failed.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Registration failed.');
    })
    .finally(() => {
      // Reset the button state
      document.getElementById('submit-button').disabled = false;
      document.getElementById('submit-button').innerText = 'Submit';
    });
  }
  
  function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
  }
  