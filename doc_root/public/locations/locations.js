import { SessionManager } from '../DataHandler.js';

// DOM Elements
const configBtn = document.getElementById('configLocationsBtn');
const configModal = document.getElementById('locationConfigModal');
const formModal = document.getElementById('locationFormModal');
const locationForm = document.getElementById('locationForm');
const locationsList = document.getElementById('locationsList');
const alertMessage = document.getElementById('alertMessage');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const locationSelect = document.getElementById('locationSelect');
const addLocationBtn = document.getElementById('addLocationBtn');

let currentLocationId = null;

// Initialize
async function initLocations() {
    try {
        await loadLocations();
        setupEventListeners();
        setupChart();
        await updateReport();
    } catch (error) {
        showAlert('Failed to initialize: ' + error.message, false);
    }
}

function setupEventListeners() {
    // Configuration button
    configBtn.addEventListener('click', () => {
        configModal.classList.add('show');
    });

    // Add location button
    addLocationBtn.addEventListener('click', () => {
        openFormModal();
    });

    // Form submission
    locationForm.addEventListener('submit', handleFormSubmit);

    // Close buttons
    document.querySelectorAll('.close-button, .cancel-button').forEach(button => {
        button.addEventListener('click', () => {
            configModal.classList.remove('show');
            formModal.classList.remove('show');
        });
    });

    // Report filters
    startDate.addEventListener('change', updateReport);
    endDate.addEventListener('change', updateReport);
    locationSelect.addEventListener('change', updateReport);
}

async function loadLocations() {
    try {
        // TODO: Replace with actual API call
        const locations = [
            { id: 1, name: 'Main Campus', address: '123 Main St', description: 'Main teaching location' },
            { id: 2, name: 'Library Study Room', address: '456 Library Ave', description: 'Quiet study space' }
        ];

        renderLocationsList(locations);
        populateLocationSelect(locations);
    } catch (error) {
        showAlert('Failed to load locations: ' + error.message, false);
    }
}

function renderLocationsList(locations) {
    locationsList.innerHTML = locations.map(location => `
        <div class="config-item">
            <div class="config-item-content">
                <h3>${location.name}</h3>
                <p class="address">${location.address}</p>
                <p>${location.description || ''}</p>
            </div>
            <div class="config-item-actions">
                <button onclick="editLocation(${location.id})" class="edit-button">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteLocation(${location.id})" class="delete-button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function populateLocationSelect(locations) {
    locationSelect.innerHTML = locations.map(location => 
        `<option value="${location.id}">${location.name}</option>`
    ).join('');
}

function openFormModal(locationData = null) {
    const modalTitle = document.getElementById('locationFormTitle');
    const submitButton = locationForm.querySelector('.submit-button');
    
    if (locationData) {
        modalTitle.textContent = 'Edit Location';
        submitButton.textContent = 'Update Location';
        currentLocationId = locationData.id;
        document.getElementById('locationName').value = locationData.name;
        document.getElementById('locationAddress').value = locationData.address;
        document.getElementById('locationDescription').value = locationData.description || '';
    } else {
        modalTitle.textContent = 'Add New Location';
        submitButton.textContent = 'Add Location';
        currentLocationId = null;
        locationForm.reset();
    }
    
    formModal.classList.add('show');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('locationName').value,
        address: document.getElementById('locationAddress').value,
        description: document.getElementById('locationDescription').value
    };

    try {
        // TODO: Replace with actual API calls
        if (currentLocationId) {
            // Update existing location
            showAlert('Location updated successfully', true);
        } else {
            // Add new location
            showAlert('Location added successfully', true);
        }

        await loadLocations();
        formModal.classList.remove('show');
    } catch (error) {
        showAlert('Failed to save location: ' + error.message, false);
    }
}

async function updateReport() {
    try {
        // TODO: Replace with actual API call to get report data
        const data = {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            values: [8, 12, 10, 15, 9]
        };

        updateChart(data);
        updateStats(data);
    } catch (error) {
        showAlert('Failed to update report: ' + error.message, false);
    }
}

let chart = null;

function setupChart() {
    const ctx = document.getElementById('locationChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Hours Used',
                data: [],
                backgroundColor: '#57cc02',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Hours'
                    }
                }
            }
        }
    });
}

function updateChart(data) {
    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.values;
    chart.update();
}

function updateStats(data) {
    const totalHours = data.values.reduce((a, b) => a + b, 0);
    const average = totalHours / data.values.length;
    const max = Math.max(...data.values);

    document.querySelector('.stats-container').innerHTML = `
        <div class="stat-card">
            <h3>Total Hours</h3>
            <p>${totalHours}</p>
        </div>
        <div class="stat-card">
            <h3>Average Daily</h3>
            <p>${average.toFixed(1)} hrs</p>
        </div>
        <div class="stat-card">
            <h3>Peak Usage</h3>
            <p>${max} hrs</p>
        </div>
    `;
}

function showAlert(message, isSuccess) {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${isSuccess ? 'success' : 'error'} show`;
    
    setTimeout(() => {
        alertMessage.classList.remove('show');
    }, 3000);
}

// Make functions available globally
window.editLocation = function(id) {
    // TODO: Fetch location data and open form modal
    const locationData = { 
        id, 
        name: 'Sample Location', 
        address: '123 Sample St',
        description: 'Sample description' 
    };
    openFormModal(locationData);
};

window.deleteLocation = async function(id) {
    if (confirm('Are you sure you want to delete this location?')) {
        try {
            // TODO: Replace with actual API call
            showAlert('Location deleted successfully', true);
            await loadLocations();
        } catch (error) {
            showAlert('Failed to delete location: ' + error.message, false);
        }
    }
};

// Initialize the page
initLocations();