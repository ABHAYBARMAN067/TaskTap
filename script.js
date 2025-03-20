// Modal functionality
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const workerProfileModal = document.getElementById('workerProfileModal');
const chatInterface = document.getElementById('chatInterface');
const closeButtons = document.getElementsByClassName('close');

function showLoginModal() {
    loginModal.style.display = 'block';
}

function showSignupModal() {
    signupModal.style.display = 'block';
}

function showWorkerProfile(worker) {
    document.getElementById('worker-photo').src = worker.photo;
    document.getElementById('worker-name').textContent = worker.name;
    document.getElementById('worker-category').textContent = worker.category;
    document.getElementById('worker-experience').textContent = `${worker.experience} years`;
    document.getElementById('worker-skills').textContent = worker.skills;
    document.getElementById('hourly-rate').textContent = `$${worker.hourlyRate}/hour`;
    document.getElementById('daily-rate').textContent = `$${worker.dailyRate}/day`;
    
    // Set rating stars
    const starsContainer = document.querySelector('.rating .stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        starsContainer.innerHTML += `<i class="fas fa-star${i < worker.rating ? '' : ' far'}"></i>`;
    }
    document.querySelector('.rating .review-count').textContent = `(${worker.reviewCount} reviews)`;
    
    workerProfileModal.style.display = 'block';
}

// Close modals when clicking the close button
Array.from(closeButtons).forEach(button => {
    button.onclick = function() {
        loginModal.style.display = 'none';
        signupModal.style.display = 'none';
        workerProfileModal.style.display = 'none';
        chatInterface.style.display = 'none';
    }
});

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
    if (event.target == workerProfileModal) {
        workerProfileModal.style.display = 'none';
    }
}

// Mobile menu functionality
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Sample worker data (in a real application, this would come from a backend)
const sampleWorkers = [
    {
        id: 1,
        name: 'John Smith',
        category: 'Painter',
        photo: 'https://randomuser.me/api/portraits/men/1.jpg',
        experience: 5,
        skills: 'Interior painting, Exterior painting, Wallpaper installation',
        hourlyRate: 25,
        dailyRate: 200,
        rating: 4.5,
        reviewCount: 128,
        location: 'New York, NY',
        verified: true
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        category: 'Plumber',
        photo: 'https://randomuser.me/api/portraits/women/1.jpg',
        experience: 8,
        skills: 'General plumbing, Pipe repair, Drain cleaning',
        hourlyRate: 35,
        dailyRate: 280,
        rating: 4.8,
        reviewCount: 256,
        location: 'Los Angeles, CA',
        verified: true
    },
    {
        id: 3,
        name: 'Mike Wilson',
        category: 'Electrician',
        photo: 'https://randomuser.me/api/portraits/men/2.jpg',
        experience: 6,
        skills: 'Electrical repair, Installation, Safety inspection',
        hourlyRate: 40,
        dailyRate: 320,
        rating: 4.7,
        reviewCount: 189,
        location: 'Chicago, IL',
        verified: true
    }
];

// Function to create worker cards
function createWorkerCards(workers = sampleWorkers) {
    const workersGrid = document.getElementById('workers-grid');
    workersGrid.innerHTML = '';
    
    workers.forEach(worker => {
        const workerCard = document.createElement('div');
        workerCard.className = 'worker-card';
        workerCard.innerHTML = `
            <img src="${worker.photo}" alt="${worker.name}" class="worker-image">
            <div class="worker-info">
                <div class="worker-header">
                    <h3>${worker.name}</h3>
                    ${worker.verified ? '<i class="fas fa-check-circle verified"></i>' : ''}
                </div>
                <p>${worker.category}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${worker.location}</p>
                <div class="rating">
                    ${Array(5).fill().map((_, i) => 
                        `<i class="fas fa-star${i < Math.floor(worker.rating) ? '' : ' far'}"></i>`
                    ).join('')}
                    <span>(${worker.reviewCount} reviews)</span>
                </div>
                <p><i class="fas fa-dollar-sign"></i> ${worker.hourlyRate}/hour</p>
                <button onclick="showWorkerProfile(${JSON.stringify(worker)})">View Profile</button>
            </div>
        `;
        workersGrid.appendChild(workerCard);
    });
}

// Search functionality
function searchWorkers() {
    const category = document.getElementById('category-select').value;
    const location = document.getElementById('location-input').value.toLowerCase();
    
    let filteredWorkers = sampleWorkers;
    
    if (category) {
        filteredWorkers = filteredWorkers.filter(worker => 
            worker.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (location) {
        filteredWorkers = filteredWorkers.filter(worker => 
            worker.location.toLowerCase().includes(location)
        );
    }
    
    createWorkerCards(filteredWorkers);
}

// Geolocation functionality
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                // In a real application, you would use these coordinates to find nearby workers
                // For now, we'll just show all workers
                createWorkerCards();
            },
            error => {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please enter it manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Chat functionality
let currentChatWorker = null;

function startChat(worker) {
    currentChatWorker = worker;
    document.getElementById('chat-worker-name').textContent = worker.name;
    chatInterface.style.display = 'flex';
    loadChatHistory(worker.id);
}

function closeChat() {
    chatInterface.style.display = 'none';
    currentChatWorker = null;
}

function sendMessage() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    
    if (message && currentChatWorker) {
        const chatMessages = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <p>${message}</p>
            <span class="time">${new Date().toLocaleTimeString()}</span>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        input.value = '';
        
        // Simulate worker response
        setTimeout(() => {
            const responseElement = document.createElement('div');
            responseElement.className = 'message worker-message';
            responseElement.innerHTML = `
                <p>Thank you for your message. I'll get back to you shortly.</p>
                <span class="time">${new Date().toLocaleTimeString()}</span>
            `;
            chatMessages.appendChild(responseElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

function loadChatHistory(workerId) {
    // In a real application, this would load chat history from a backend
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
}

// Call functionality
function startCall() {
    // In a real application, this would initiate a call using a VoIP service
    alert('Call functionality will be implemented with a VoIP service.');
}

// Form submission handling
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add login logic here
    console.log('Login form submitted');
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add signup logic here
    console.log('Signup form submitted');
});

// Show/hide worker fields in signup form
document.querySelector('#signupForm select').addEventListener('change', function(e) {
    const workerFields = document.getElementById('worker-fields');
    workerFields.style.display = e.target.value === 'worker' ? 'block' : 'none';
});

// Booking form handling
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Initialize Razorpay payment
    const options = {
        key: 'YOUR_RAZORPAY_KEY', // Replace with your actual Razorpay key
        amount: 50000, // Amount in paise
        currency: 'INR',
        name: 'TaskMaster',
        description: 'Worker Booking',
        handler: function(response) {
            alert('Payment successful! Booking confirmed.');
            workerProfileModal.style.display = 'none';
        },
        prefill: {
            name: 'User Name',
            email: 'user@example.com',
            contact: '9999999999'
        },
        theme: {
            color: '#2563eb'
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
});

// Initialize worker cards when the page loads
document.addEventListener('DOMContentLoaded', function() {
    createWorkerCards();
});