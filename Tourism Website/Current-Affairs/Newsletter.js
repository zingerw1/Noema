document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeButton = newsletterForm.querySelector('button');
    const feedbackMessage = document.createElement('p');
    feedbackMessage.className = 'mt-2 text-sm';
    newsletterForm.appendChild(feedbackMessage);

    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        try {
            subscribeButton.disabled = true;
            subscribeButton.innerHTML = 'Subscribing...';
            
            const response = await fetch('http://localhost:3000/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                feedbackMessage.className = 'mt-2 text-sm text-green-600';
                feedbackMessage.textContent = data.message;
                emailInput.value = '';
            } else {
                feedbackMessage.className = 'mt-2 text-sm text-red-600';
                feedbackMessage.textContent = data.message;
            }
        } catch (error) {
            feedbackMessage.className = 'mt-2 text-sm text-red-600';
            feedbackMessage.textContent = 'An error occurred. Please try again later.';
        } finally {
            subscribeButton.disabled = false;
            subscribeButton.innerHTML = 'Subscribe';
        }
    });
});
