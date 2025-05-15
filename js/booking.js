document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking calendar
    const calendarEl = document.getElementById('booking-calendar');
    
    if (calendarEl) {
        // Get current date information
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Available time slots (would typically come from a database or API)
        const availableTimeSlots = {
            // Format: 'YYYY-MM-DD': ['HH:MM', 'HH:MM', ...]
            '2025-05-16': ['09:00', '10:00', '11:00', '14:00', '15:00'],
            '2025-05-17': ['10:00', '11:00', '13:00', '14:00'],
            '2025-05-19': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
            '2025-05-20': ['09:00', '10:00', '13:00', '14:00', '15:00'],
            '2025-05-21': ['11:00', '13:00', '14:00', '15:00', '16:00'],
            '2025-05-22': ['09:00', '10:00', '11:00', '13:00', '14:00'],
            '2025-05-23': ['10:00', '11:00', '14:00', '15:00', '16:00'],
            '2025-05-24': ['10:00', '11:00', '12:00']
        };
        
        // Calendar configuration
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            selectable: true,
            selectMirror: true,
            navLinks: true,
            businessHours: {
                daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
                startTime: '09:00',
                endTime: '17:00',
            },
            selectConstraint: 'businessHours',
            select: function(info) {
                const selectedDate = info.startStr;
                showAvailableTimeSlots(selectedDate);
            },
            dateClick: function(info) {
                const clickedDate = info.dateStr;
                showAvailableTimeSlots(clickedDate);
            },
            eventClick: function(info) {
                // Handle event click if needed
            },
            events: generateEventsFromAvailableSlots(availableTimeSlots),
            eventColor: '#5e8b7e',
            eventTextColor: '#ffffff',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: 'short'
            }
        });
        
        calendar.render();
        
        // Function to generate events from available time slots
        function generateEventsFromAvailableSlots(slots) {
            const events = [];
            
            for (const date in slots) {
                if (slots.hasOwnProperty(date)) {
                    events.push({
                        title: `${slots[date].length} available slots`,
                        start: date,
                        allDay: true,
                        display: 'background'
                    });
                }
            }
            
            return events;
        }
        
        // Function to display available time slots for a selected date
        function showAvailableTimeSlots(date) {
            const timeSlotsContainer = document.getElementById('available-time-slots');
            const selectedDateDisplay = document.getElementById('selected-date');
            const bookingForm = document.getElementById('booking-form');
            
            if (timeSlotsContainer && selectedDateDisplay) {
                // Format the date for display
                const formattedDate = new Date(date);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                selectedDateDisplay.textContent = formattedDate.toLocaleDateString('en-US', options);
                
                // Clear previous time slots
                timeSlotsContainer.innerHTML = '';
                
                // Check if there are available slots for the selected date
                if (availableTimeSlots[date] && availableTimeSlots[date].length > 0) {
                    // Create time slot buttons
                    availableTimeSlots[date].forEach(time => {
                        const timeSlot = document.createElement('button');
                        timeSlot.type = 'button';
                        timeSlot.classList.add('time-slot');
                        timeSlot.textContent = time;
                        timeSlot.dataset.time = time;
                        
                        timeSlot.addEventListener('click', function() {
                            // Remove active class from all time slots
                            document.querySelectorAll('.time-slot').forEach(slot => {
                                slot.classList.remove('active');
                            });
                            
                            // Add active class to selected time slot
                            this.classList.add('active');
                            
                            // Update hidden input field with selected time
                            const selectedTimeInput = document.getElementById('selected-time');
                            if (selectedTimeInput) {
                                selectedTimeInput.value = this.dataset.time;
                            }
                            
                            // Show booking form
                            if (bookingForm) {
                                bookingForm.classList.add('visible');
                            }
                        });
                        
                        timeSlotsContainer.appendChild(timeSlot);
                    });
                    
                    // Show time slots container
                    document.getElementById('time-slots-section').classList.remove('hidden');
                } else {
                    // No available slots for the selected date
                    timeSlotsContainer.innerHTML = '<p class="no-slots">No available appointments on this date. Please select another date.</p>';
                    document.getElementById('time-slots-section').classList.remove('hidden');
                    
                    // Hide booking form
                    if (bookingForm) {
                        bookingForm.classList.remove('visible');
                    }
                }
                
                // Update hidden input field with selected date
                const selectedDateInput = document.getElementById('selected-date-input');
                if (selectedDateInput) {
                    selectedDateInput.value = date;
                }
                
                // Scroll to time slots section
                document.getElementById('time-slots-section').scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    // Form validation for booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let valid = true;
            const requiredFields = bookingForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    
                    // Create or update error message
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                    errorMessage.textContent = 'This field is required';
                } else {
                    field.classList.remove('error');
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }
                }
            });
            
            // Email validation
            const emailField = bookingForm.querySelector('#email');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    valid = false;
                    emailField.classList.add('error');
                    
                    let errorMessage = emailField.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        emailField.parentNode.insertBefore(errorMessage, emailField.nextSibling);
                    }
                    errorMessage.textContent = 'Please enter a valid email address';
                }
            }
            
            // Phone validation
            const phoneField = bookingForm.querySelector('#phone');
            if (phoneField && phoneField.value.trim()) {
                const phonePattern = /^[\d\s\-\+\(\)]{10,15}$/;
                if (!phonePattern.test(phoneField.value.trim())) {
                    valid = false;
                    phoneField.classList.add('error');
                    
                    let errorMessage = phoneField.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('error-message');
                        phoneField.parentNode.insertBefore(errorMessage, phoneField.nextSibling);
                    }
                    errorMessage.textContent = 'Please enter a valid phone number';
                }
            }
            
            if (valid) {
                // Simulate form submission (in a real application, this would be an API call)
                const formData = new FormData(bookingForm);
                const bookingData = {};
                
                for (const [key, value] of formData.entries()) {
                    bookingData[key] = value;
                }
                
                // Show success message
                bookingForm.classList.add('hidden');
                const successMessage = document.getElementById('booking-success');
                if (successMessage) {
                    successMessage.classList.remove('hidden');
                }
                
                // In a real application, you would send the data to a server
                console.log('Booking data:', bookingData);
            }
        });
    }
});
