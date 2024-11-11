import { backend } from "declarations/backend";

document.addEventListener('DOMContentLoaded', () => {
    loadGuests();

    document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('guestName');
        const attendingInput = document.getElementById('attending');
        
        const name = nameInput.value.trim();
        const attending = attendingInput.checked;

        if (name) {
            // Disable form while submitting
            const submitButton = e.target.querySelector('button');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';

            try {
                await backend.addGuest(name, attending);
                nameInput.value = '';
                await loadGuests();
            } catch (error) {
                console.error('Error adding guest:', error);
                alert('Failed to add guest. Please try again.');
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = "Let's Disco! 🕺";
            }
        }
    });
});

async function loadGuests() {
    const guestListElement = document.getElementById('guestList');
    const loadingElement = document.getElementById('loading');
    
    try {
        const guests = await backend.getGuests();
        
        // Hide loading spinner
        loadingElement.style.display = 'none';
        
        // Clear current list
        guestListElement.innerHTML = '';
        
        if (guests.length === 0) {
            guestListElement.innerHTML = '<p class="text-center">No guests yet - be the first to RSVP!</p>';
            return;
        }

        // Add each guest to the list
        guests.forEach(guest => {
            const guestElement = document.createElement('div');
            guestElement.className = 'guest-item';
            guestElement.innerHTML = `
                <span>${guest.name}</span>
                <span class="guest-status ${guest.attending ? 'attending' : 'not-attending'}">
                    ${guest.attending ? '🎉 Attending' : '😢 Not Attending'}
                </span>
            `;
            guestListElement.appendChild(guestElement);
        });
    } catch (error) {
        console.error('Error loading guests:', error);
        loadingElement.style.display = 'none';
        guestListElement.innerHTML = '<p class="text-center text-danger">Failed to load guest list. Please refresh the page.</p>';
    }
}
