document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("eventSearch");
    const cards = document.querySelectorAll(".event-card");
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
  
      cards.forEach(card => {
        const title = card.querySelector(".event-title").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
      });
    });

    // Modal popup for registration form
    const modal = document.getElementById("registrationModal");
    const closeModalBtn = document.getElementById("closeModal");
    const registerButtons = document.querySelectorAll(".register-btn");
    const form = document.getElementById("registrationForm");

    registerButtons.forEach(button => {
      button.addEventListener("click", () => {
        modal.classList.remove("hidden");
      });
    });

    closeModalBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Here you can add form submission logic, e.g., send data to server
      alert("Registration successful!");
      form.reset();
      modal.classList.add("hidden");
    });
  });
  