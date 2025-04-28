var Swal = Swal.mixin({
  confirmButtonColor: '#3fbb46',
  cancelButtonText: isEnglish ? 'Cancel' : 'Zrušiť',
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