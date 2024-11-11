import { backend } from "declarations/backend";
import { Principal } from "@dfinity/principal";

let principal = null;

async function checkPlugConnection() {
    if (window.ic?.plug) {
        const connected = await window.ic.plug.isConnected();
        if (connected) {
            const principalId = await window.ic.plug.agent.getPrincipal();
            principal = principalId;
            updateAuthStatus(true);
            return true;
        }
    }
    updateAuthStatus(false);
    return false;
}

async function connectPlug() {
    if (!window.ic?.plug) {
        window.open('https://plugwallet.ooo/', '_blank');
        return;
    }

    try {
        const connectBtn = document.getElementById('connectPlugBtn');
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Connecting...';

        const whitelist = [process.env.CANISTER_ID_BACKEND];
        const host = "https://mainnet.dfinity.network";

        await window.ic.plug.requestConnect({
            whitelist,
            host,
        });

        const connected = await window.ic.plug.isConnected();
        if (connected) {
            principal = await window.ic.plug.agent.getPrincipal();
            updateAuthStatus(true);
            loadGuests();
        }
    } catch (error) {
        console.error("Failed to connect Plug wallet:", error);
        updateAuthStatus(false);
    }
}

function updateAuthStatus(isConnected) {
    const connectBtn = document.getElementById('connectPlugBtn');
    const connectedStatus = document.getElementById('connectedStatus');
    const principalElement = document.getElementById('principalId');
    const submitButton = document.querySelector('#rsvpForm button[type="submit"]');

    connectBtn.disabled = false;
    connectBtn.innerHTML = isConnected ? 
        'Plug Wallet Connected <img src="https://plugwallet.ooo/assets/images/plug-logo.svg" alt="Plug" class="plug-icon">' : 
        'Connect Plug Wallet <img src="https://plugwallet.ooo/assets/images/plug-logo.svg" alt="Plug" class="plug-icon">';

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
    await checkPlugConnection();
    loadGuests();

    document.getElementById('connectPlugBtn').addEventListener('click', connectPlug);

    // Rest of the event listeners and functions remain the same
    // Previous code for form submission and guest list loading remains unchanged
});

// Previous loadGuests function remains unchanged
