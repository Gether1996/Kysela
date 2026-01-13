var Swal = Swal.mixin({
  confirmButtonColor: '#3fbb46',
  cancelButtonText: isEnglish ? 'Cancel' : 'Zrušiť',
  scrollbarPadding: false
});

function switchLanguage(language_code) {
  fetch("/switch_language/" + String(language_code) + '/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRFToken': csrfToken,
    },
  })
    .then(response => response.json())
    .then(data => {
        location.reload();
    })
    .catch(error => {
      console.error("Error switching language:", error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var avatarIcon = document.getElementById('avatar-user-icon');
    var dropdownMenu = document.getElementById('dropdown-menu');

    function toggleDropdown(dropdown, menu) {
        if (dropdown.opacity === '1') {
            dropdown.opacity = '0';
            setTimeout(function() {
                dropdown.display = 'none';
            }, 300);
        } else {
            dropdown.display = 'block';
            setTimeout(function() {
                dropdown.opacity = '1';
            }, 10);
        }
    }

    function closeDropdownOnClickOutside(event, dropdown, menu) {
        if (!event.target.matches(menu) && dropdown.opacity === '1') {
            dropdown.opacity = '0';
            setTimeout(function() {
                dropdown.display = 'none';
            }, 300);
        }
    }

    avatarIcon.addEventListener('click', function() {
        toggleDropdown(dropdownMenu.style, dropdownMenu);
        event.stopPropagation();
    });

    window.addEventListener('click', function(event) {
        closeDropdownOnClickOutside(event, dropdownMenu.style, '#avatar-user-icon');
    });
});

function openGiftCard() {
    Swal.fire({
        width: '850px',
        html: `
            <div class="swal-modern-container">
                <div class="swal-icon-header">
                    <i class="fa-solid fa-gift-card" style="font-size: 50px; color: #4CAF50;"></i>
                </div>
                <h2 class="swal-title">Darčeková poukážka</h2>
                <div class="swal-image-container">
                    <img src="/static/images/poukaz.jpg" alt="Gift Card" class="swal-gift-image">
                </div>
                <div class="swal-info-box">
                    <p class="swal-description">Potešte svojich blízkych darčekovou poukážkou na profesionálnu masáž!</p>
                    <div class="swal-contact-box">
                        <i class="fa-duotone fa-phone" style="font-size: 24px; color: #4CAF50;"></i>
                        <div>
                            <p style="margin: 0; font-size: 14px; color: #666;">Objednajte telefonicky</p>
                            <a href="tel:+421903773400" style="font-size: 22px; font-weight: 700; color: #2E7D32; text-decoration: none;">+421 903 773 400</a>
                        </div>
                    </div>
                </div>
            </div>
        `,
        showCloseButton: false,
        confirmButtonText: 'Zavrieť',
        confirmButtonColor: '#4CAF50',
        customClass: {
            popup: 'swal-modern-popup'
        }
    });
}

function openViberInfo() {
    Swal.fire({
        width: '700px',
        html: `
            <div class="swal-modern-container">
                <div class="swal-icon-header">
                    <i class="fa-brands fa-whatsapp" style="font-size: 50px; color: #25D366;"></i>
                    <i class="fa-brands fa-viber" style="font-size: 50px; color: #7360F2; margin-left: 20px;"></i>
                </div>
                <h2 class="swal-title">Kontaktujte nás cez messenger</h2>
                <div class="swal-messenger-grid">
                    <div class="swal-messenger-card">
                        <i class="fa-brands fa-whatsapp" style="font-size: 40px; color: #25D366;"></i>
                        <h3>WhatsApp</h3>
                        <a href="https://wa.me/421903773400" target="_blank" class="swal-messenger-btn whatsapp-btn">
                            <i class="fa-brands fa-whatsapp"></i> Otvoriť WhatsApp
                        </a>
                    </div>
                    <div class="swal-messenger-card">
                        <i class="fa-brands fa-viber" style="font-size: 40px; color: #7360F2;"></i>
                        <h3>Viber</h3>
                        <a href="viber://chat?number=421903773400" class="swal-messenger-btn viber-btn">
                            <i class="fa-brands fa-viber"></i> Otvoriť Viber
                        </a>
                    </div>
                </div>
                <div class="swal-info-box" style="margin-top: 25px;">
                    <p style="margin: 0; font-weight: 600; color: #333;">Pavol Kysela</p>
                    <a href="tel:+421903773400" style="font-size: 20px; font-weight: 700; color: #2E7D32; text-decoration: none;">+421 903 773 400</a>
                </div>
            </div>
        `,
        showCloseButton: false,
        confirmButtonText: 'Zavrieť',
        confirmButtonColor: '#4CAF50',
        customClass: {
            popup: 'swal-modern-popup'
        }
    });
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger-menu');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger-menu');
    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
}
