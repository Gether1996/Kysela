const selectedDays = new Set();

function saveDaysAhead(days_ahead_person) {
    var days_ahead = document.getElementById(days_ahead_person).value;
    var body = {days_ahead: days_ahead};
    var title = 'Počet dní zmenený.';
    sendFetchRequest(body, title);
}

function saveTimeRange(time_from, time_to) {
    const dayMatch = time_from.match(/_(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/);
    const day = dayMatch ? dayMatch[1] : '';

    var time_from_value = document.getElementById(time_from).value;
    var time_to_value = document.getElementById(time_to).value;

    var body;
    body = {
        [`time_from_${day}`]: time_from_value,
        [`time_to_${day}`]: time_to_value
    };

    var title = 'Sloty zmenené.';
    sendFetchRequest(body, title);
}

function saveWorkingDays() {
    const selectedDaysForPerson = Array.from(selectedDays);

    let body;
    body = {
        selected_days: selectedDaysForPerson
    };

    var title = 'Pracovné dni boli zmenené.';
    sendFetchRequest(body, title);
}

function sendFetchRequest(body, title) {
    Swal.fire({
        title: 'Ukladanie...',
        didOpen: () => {
            Swal.showLoading();
            fetch('/save_settings/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(body)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: title,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1000,
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: data.message,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1000,
                    });
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                Swal.fire({
                    title: 'Chyba pri ukladaní!',
                    text: 'Niečo sa pokazilo, skúste to znova.',
                    icon: 'error',
                    showConfirmButton: true,
                });
            });
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        // Get the currently focused element
        var focusedElement = document.activeElement;

        if (focusedElement && focusedElement.tagName === 'INPUT') {
            if (focusedElement.id === 'emps_per_page') {
                document.getElementById('save_emps_per_page_button').click();
            } else if (focusedElement.id === 'line_manager_emplid') {
                document.getElementById('save_emplid_button').click();
            }
        }
    }
});

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Function to populate the select options with half-hour intervals
function populateTimeSelects(start_slot, end_slot, start_container, end_container) {
    var startSelect = document.getElementById(start_container);
    var endSelect = document.getElementById(end_container);

        // Check if the selects are found
    if (!startSelect || !endSelect) {
        console.error("Select elements not found:", start_container, end_container);
        return;
    }

    // Loop from 00:00 (0 minutes) to 23:30 (1410 minutes) by 30-minute intervals
    for (let i = 0; i <= 1410; i += 30) {
        let hours = Math.floor(i / 60);
        let minutes = i % 60;
        let time = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

        // Create and append option for start time select
        let startOption = document.createElement('option');
        startOption.value = time;
        startOption.text = time;
        if (time === start_slot) {
            startOption.selected = true;
        }
        startSelect.appendChild(startOption);

        // Create and append option for end time select
        let endOption = document.createElement('option');
        endOption.value = time;
        endOption.text = time;
        if (time === end_slot) {
            endOption.selected = true;
        }
        endSelect.appendChild(endOption);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Populate for Roman
    populateTimeSelects(startingSlotHourMonday, endingSlotHourMonday, 'start_time_monday', 'end_time_monday');
    populateTimeSelects(startingSlotHourTuesday, endingSlotHourTuesday, 'start_time_tuesday', 'end_time_tuesday');
    populateTimeSelects(startingSlotHourWednesday, endingSlotHourWednesday, 'start_time_wednesday', 'end_time_wednesday');
    populateTimeSelects(startingSlotHourThursday, endingSlotHourThursday, 'start_time_thursday', 'end_time_thursday');
    populateTimeSelects(startingSlotHourFriday, endingSlotHourFriday, 'start_time_friday', 'end_time_friday');
    populateTimeSelects(startingSlotHourSaturday, endingSlotHourSaturday, 'start_time_saturday', 'end_time_saturday');
    populateTimeSelects(startingSlotHourSunday, endingSlotHourSunday, 'start_time_sunday', 'end_time_sunday');
});

var dayLabels = {
    'Monday': 'Pon',
    'Tuesday': 'Ut',
    'Wednesday': 'Str',
    'Thursday': 'Št',
    'Friday': 'Pi',
    'Saturday': 'So',
    'Sunday': 'Ne'
};

function initializeWorkingDays(working_days_person, container_name) {
    var container = document.getElementById(container_name);

    Object.keys(dayLabels).forEach(day => {
        var button = document.createElement('button');
        button.innerText = dayLabels[day];
        button.value = day;
        button.className = 'day-button';

        // Pre-select the buttons based on workingDays
        if (working_days_person.includes(day)) {
            button.classList.add('selected');
            selectedDays.add(day);
        }

        // Add event listener for button clicks
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            if (button.classList.contains('selected')) {
                selectedDays.add(day);
            } else {
                selectedDays.delete(day);
            }
        });

        container.appendChild(button);
    });
}

window.onload = () => initializeWorkingDays(workingDays, 'working_days_container');

function addTurnedOffDay() {
    Swal.fire({
        title: 'Pridať obmedzenie',
        html: `
            <div class="swal-layout">
                <div class="swal-group">
                    <label for="date_from">Dátum od:</label>
                    <input id="date_from" type="date" class="swal2-input" required>
                </div>
                <div class="swal-group">
                    <label for="date_to">Dátum do:</label>
                    <input id="date_to" type="date" class="swal2-input" required>
                </div>
                <div class="swal-group">
                    <label for="whole_day" style="margin-bottom: 20px;">Celý deň:</label>
                    <select id="whole_day" class="swal2-input">
                        <option value="true">Áno</option>
                        <option value="false">Nie</option>
                    </select>
                </div>
                <div id="time_range_container" style="display: none;">
                    <div class="swal-group">
                        <label for="time_from">Od:</label>
                        <input id="time_from" type="time" class="swal2-input">
                    </div>
                    <div class="swal-group">
                        <label for="time_to">Do:</label>
                        <input id="time_to" type="time" class="swal2-input">
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        preConfirm: () => {
            var date_from = document.getElementById('date_from').value;
            var date_to = document.getElementById('date_to').value;
            var whole_day = document.getElementById('whole_day').value === 'true';
            let time_from = null;
            let time_to = null;

            if (!whole_day) {
                time_from = document.getElementById('time_from').value;
                time_to = document.getElementById('time_to').value;
            }

            if (!date_from || !date_to || (!whole_day && (!time_from || !time_to))) {
                Swal.showValidationMessage('Prosím vyplňte všetky polia');
                return false;
            }

            if (new Date(date_to) < new Date(date_from)) {
                Swal.showValidationMessage('Koncový dátum nemôže byť menší ako počiatočný dátum');
                return false;
            }

            return { date_from, date_to, whole_day, time_from, time_to };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { date_from, date_to, whole_day, time_from, time_to } = result.value;

            fetch('/add_turned_off_day/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({ date_from, date_to, whole_day, time_from, time_to })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Obmedzenie pridané',
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1000,
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    Swal.fire('Chyba!', 'Nastala chyba pri pridávaní.', 'error');
                }
            })
            .catch(error => {
                Swal.fire('Chyba!', 'Nastala chyba pri pridávaní.', 'error');
            });
        }
    });

    document.getElementById('whole_day').addEventListener('change', function () {
        const timeRangeContainer = document.getElementById('time_range_container');
        if (this.value === 'false') {
            timeRangeContainer.style.display = 'block';
        } else {
            timeRangeContainer.style.display = 'none';
        }
    });
}

function cancelOffDay(turnedOffDayId) {
    Swal.fire({
        text: "Naozaj vymazať?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Áno',
        cancelButtonText: 'Zrušiť',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/delete_turned_off_day/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({ turnedOffDayId: turnedOffDayId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1000,
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: data.message,
                    });
                }
            })
            .catch(error => {
                Swal.fire('Chyba!', 'Nastala chyba pri mazani.', 'error');
            });
        }
    });
}

function cancelOffDays() {
    Swal.fire({
        text: "Naozaj vymazať?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Áno',
        cancelButtonText: 'Zrušiť',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const checkedCheckboxes = document.querySelectorAll('.turned-off-day-checkbox:checked');
            const idsToDelete = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

            const requestData = {
                ids: idsToDelete
            };

            fetch('/delete_turned_off_days/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.json())
            .then(data => {
                // Close loading Swal and show result Swal
                Swal.close();
                if (data.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: data.message,
                        showConfirmButton: false,
                        showCancelButton: false,
                        timer: 1000,
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: data.message,
                    });
                }
            })
            .catch(error => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: error.message,
                    showConfirmButton: false,
                });
            });
        }
    });
}

function toggleCancelAllDaysRow() {
    const anyChecked = document.querySelectorAll('.turned-off-day-checkbox:checked').length > 0;
    const cancelRow = document.getElementById('cancel-all-days-tr');
    const cancelCell = document.getElementById('cancel-all-days-td');

    // Add or remove the 'hidden-initially' class based on whether any checkboxes are checked
    if (anyChecked) {
        cancelRow.classList.remove('hidden-initially');
        cancelCell.classList.remove('hidden-initially');
    } else {
        cancelRow.classList.add('hidden-initially');
        cancelCell.classList.add('hidden-initially');
    }
}

// Attach the toggleCancelAllDaysRow function to checkbox change events
document.querySelectorAll('.turned-off-day-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', toggleCancelAllDaysRow);
});
