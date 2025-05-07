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
        html: `
            <div class="swal-container-gift-card">
                <h1>Darčeková poukážka</h1>
                <img src="/static/images/poukaz.jpg" alt="Gift Card" style="width: 100%; max-width: 600px; margin-bottom: 15px;">
                <p>Potešte svojich blízkych darčekovou poukážkou! <br> Zavolajte na číslo <strong>+421 903 773 400</strong> a dohodneme objednávku. </p>
            </div>
        `,
        showCloseButton: false,
        confirmButtonText: 'Zavrieť'
    });
}

function openViberInfo() {
    Swal.fire({
        html: `
            <div class="swal-container-gift-card">
                <h1><i class="fa-brands fa-whatsapp"></i> WhatsApp a Viber <i class="fa-brands fa-viber"></i></h1>
                <h2 style="margin: 0px;"><strong>Pavol Kysela</strong></h2>
                <h2 style="margin: 0px;"><strong>+421 903 773 400</strong></h2>
            </div>
        `,
        showCloseButton: false,
        confirmButtonText: 'Zavrieť'
    });
}
