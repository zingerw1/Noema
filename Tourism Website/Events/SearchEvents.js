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
  });
  