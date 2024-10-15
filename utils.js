// utils.js

// Hard-coded date and time
const lastUpdatedDate = new Date('2024-10-15T00:00:00');

// Function to calculate time difference
function timeSince(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    return "just now";
}

// Update the span with the time since last updated
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('last-updated').innerText = "Last updated " + timeSince(lastUpdatedDate);
});