import { backend } from "declarations/backend";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";

let authClient;
let principal = null;

async function initAuth() {
    authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();

    if (isAuthenticated) {
        principal = authClient.getIdentity().getPrincipal();
        updateAuthStatus(true);
    } else {
        updateAuthStatus(false);
    }
}

async function connectWallet() {
    try {
        const connectBtn = document.getElementById('connectWalletBtn');
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';

        await authClient.login({
            identityProvider: "https://identity.ic0.app/#authorize",
            onSuccess: async () => {
                principal = authClient.getIdentity().getPrincipal();
                updateAuthStatus(true);
                loadGuests();
            },
        });
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        updateAuthStatus(false);
    }
}

function updateAuthStatus(isConnected) {
    const connectBtn = document.getElementById('connectWalletBtn');
    const connectedStatus = document.getElementById('connectedStatus');
    const principalElement = document.getElementById('principalId');
    const submitButton = document.querySelector('#rsvpForm button[type="submit"]');

    connectBtn.disabled = false;
    connectBtn.innerHTML = isConnected ? 'Wallet Connected' : 'Connect Wallet';

    if (isConnected && principal) {
        connectedStatus.style.display = 'block';
        principalElement.textContent = principal.toText().slice(0, 10) + '...';
        submitButton.disabled = false;
    } else {
        connectedStatus.style.display = 'none';
        principalElement.textContent = '';
        submitButton.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await initAuth();
    loadGuests();

    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);

    document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!principal) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = 'Please connect your wallet first';
            errorMessage.style.display = 'block';
            return;
        }
        
        const nameInput = document.getElementById('guestName');
        const attendingInput = document.getElementById('attending');
        const errorMessage = document.getElementById('errorMessage');
        
        const name = nameInput.value.trim();
        const attending = attendingInput.checked;

        if (name) {
            const submitButton = e.target.querySelector('button');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
            errorMessage.style.display = 'none';

            try {
                const result = await backend.addGuest(name, attending);
                
                switch (result.tag) {
                    case 'ok':
                        nameInput.value = '';
                        await loadGuests();
                        break;
                    case 'err':
                        errorMessage.textContent = result._0;
                        errorMessage.style.display = 'block';
                        break;
                }
            } catch (error) {
                console.error('Error adding guest:', error);
                errorMessage.textContent = 'Failed to add guest. Please try again.';
                errorMessage.style.display = 'block';
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
        
        loadingElement.style.display = 'none';
        guestListElement.innerHTML = '';
        
        if (guests.length === 0) {
            guestListElement.innerHTML = '<p class="text-center">No guests yet - be the first to RSVP!</p>';
            return;
        }

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
