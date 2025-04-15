document.addEventListener('DOMContentLoaded', () => {
    if (document.cookie.includes('tbnpDismissed=true')) return;

    setTimeout(() => {
        document.getElementById('tbnp-popup').style.display = 'flex';
        document.body.style.overflow = 'hidden'; // blokuje scroll
    }, 5000);
});

function tbnpSubmit() {
    const emailInput = document.getElementById('tbnp-email');
    const error = document.getElementById('tbnp-error');
    const message = document.getElementById('tbnp-message');
    const email = emailInput.value.trim();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const disposableDomains = [
        '10minutemail.com', 'mailinator.com', 'tempmail.com',
        'guerrillamail.com', 'trashmail.com', 'dispostable.com',
        'getnada.com', 'yopmail.com', 'fakeinbox.com'
    ];
    const domain = email.split('@')[1]?.toLowerCase();

    if (!email || !isValidEmail) {
        error.textContent = 'Proszę podać adres e-mail';
        error.style.display = 'initial';
        message.style.display = 'none';
        return;
    }

    if (disposableDomains.includes(domain)) {
        error.textContent = 'Nie akceptujemy tymczasowych adresów e-mail';
        error.style.display = 'initial';
        message.style.display = 'none';
        return;
    }

    error.style.display = 'none';
    message.style.display = 'none';

    fetch(tbnp_ajax.ajax_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=tbnp_submit&email=${encodeURIComponent(email)}`
    })
        .then(response => {
            if (!response.ok) throw new Error('Błąd odpowiedzi');
            return response.text();
        })
        .then(() => {
            message.textContent = 'Dziękujemy! Zgłoszenie zostało wysłane.';
            message.style.color = 'green';
            message.style.display = 'initial';
            document.cookie = 'tbnpDismissed=true; path=/; max-age=31536000';
            setTimeout(() => {
                document.getElementById('tbnp-popup').style.display = 'none';
                document.body.style.overflow = '';
            }, 3000); // 3 sekundy do zamknięcia popupu
        })
        .catch(() => {
            message.textContent = 'Wysyłka wiadomości się nie powiodła. Spróbuj ponownie.';
            message.style.color = 'red';
            message.style.display = 'initial';
        });
}
