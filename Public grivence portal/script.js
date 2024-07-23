document.getElementById('grievance-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        complaint: document.getElementById('complaint').value,
        location: document.getElementById('location').value,
    };
    
    const response = await fetch('/grievances', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    
    if (response.ok) {
        loadGrievances();
        document.getElementById('grievance-form').reset();
    }
});

async function loadGrievances() {
    const response = await fetch('/grievances');
    const grievances = await response.json();
    
    const tableBody = document.querySelector('#grievance-table tbody');
    tableBody.innerHTML = '';
    
    grievances.forEach(grievance => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${grievance.name}</td>
            <td>${grievance.email}</td>
            <td>${grievance.phone}</td>
            <td>${grievance.message}</td>
            <td>${grievance.complaint}</td>
            <td>${grievance.location}</td>
            <td><button onclick="deleteGrievance(${grievance.id})">Delete</button></td>
        `;
        
        tableBody.appendChild(row);
    });
}

async function deleteGrievance(id) {
    const response = await fetch(`/grievances/${id}`, {
        method: 'DELETE',
    });
    
    if (response.ok) {
        loadGrievances();
    }
}

// Load grievances when the page loads
window.onload = loadGrievances;
