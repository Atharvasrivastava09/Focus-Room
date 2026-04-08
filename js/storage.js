document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('weeklyChart').getContext('2d');

    // Create a gradient for the bars to match the "Glow" look
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 1)');   // Bright Cyan
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0.1)'); // Faded Cyan

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            datasets: [{
                label: 'Minutes Focused',
                data: [120, 150, 180, 90, 210, 60, 30], // Placeholder data
                backgroundColor: gradient,
                borderColor: '#22d3ee',
                borderWidth: 1,
                borderRadius: 8, // Rounded bars to match your card corners
                hoverBackgroundColor: '#22d3ee'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // Hide legend to match the clean mockup
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)', // Very subtle grid lines
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b', // Muted text color for axis
                        font: { family: 'Inter, sans-serif', size: 12 }
                    }
                },
                x: {
                    grid: {
                        display: false // Hide vertical lines for a cleaner look
                    },
                    ticks: {
                        color: '#64748b',
                        font: { family: 'Inter, sans-serif', size: 12 }
                    }
                }
            }
        }
    });
});

const distCtx = document.getElementById('distributionChart').getContext('2d');

const distributionChart = new Chart(distCtx, {
    type: 'doughnut',
    data: {
        labels: ['Focus', 'Short Break', 'Long Break'],
        datasets: [{
            data: [75, 15, 10], // Placeholder percentages
            backgroundColor: [
                '#22d3ee', // Cyan for Focus
                '#0ea5e9', // Blue for Short Break
                '#1e293b'  // Darker Slate for Long Break
            ],
            borderColor: '#0f172a', // Matches your background color
            borderWidth: 5,
            hoverOffset: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%', // This makes the "hole" in the middle larger/thinner
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#64748b',
                    padding: 20,
                    font: { size: 12, family: 'Inter, sans-serif' }
                }
            }
        }
    }
});

