/* ===================================================
     PROGRESS DASHBOARD JAVASCRIPT - ENHANCED
     ---------------------------------------------------
    Author: Noraziela Binti Jepsin
    Date: 08 January 2026
    
    Features:
    - Animated progress circles
    - Number counting animations
    - Interactive hover effects
    - Refresh notifications
    - Progress bar animations
=================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Progress Dashboard initialized');
    
    // Initialize all animations
    initializeProgressDashboard();
});

/* =====================================
   MAIN INITIALIZATION
===================================== */
function initializeProgressDashboard() {
    // Animate circular progress
    animateProgressCircle();
    
    // Animate statistics numbers
    animateStatNumbers();
    
    // Animate progress bars
    animateProgressBars();
    
    // Add interactive hover effects
    addHoverEffects();
    
    // Show refresh notice if needed
    checkRefreshNotice();
    
    // Add smooth scroll
    addSmoothScroll();
    
    console.log('✨ All animations loaded');
}

/* =====================================
   ANIMATE CIRCULAR PROGRESS CHART
===================================== */
function animateProgressCircle() {
    const circle = document.querySelector('.circle-fill');
    if (!circle) return;
    
    const progress = parseInt(circle.getAttribute('data-progress')) || 0;
    const circumference = 2 * Math.PI * 80; // radius = 80
    const dashValue = (progress / 100) * circumference;
    
    // Start from 0
    circle.style.strokeDasharray = `0, ${circumference}`;
    
    // Animate to target value
    setTimeout(() => {
        circle.style.strokeDasharray = `${dashValue}, ${circumference}`;
    }, 300);
    
    console.log(`📊 Circle progress: ${progress}%`);
}

/* =====================================
   ANIMATE STATISTICS NUMBERS
===================================== */
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((element, index) => {
        const text = element.textContent.trim();
        const hasPercent = text.includes('%');
        const targetValue = parseInt(text);
        
        if (isNaN(targetValue)) return;
        
        // Animation settings
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetValue / steps;
        
        let current = 0;
        let step = 0;
        
        // Delayed start for stagger effect
        setTimeout(() => {
            const interval = setInterval(() => {
                step++;
                current += increment;
                
                if (step >= steps) {
                    clearInterval(interval);
                    element.textContent = hasPercent ? targetValue + '%' : targetValue;
                } else {
                    const displayValue = Math.floor(current);
                    element.textContent = hasPercent ? displayValue + '%' : displayValue;
                }
            }, duration / steps);
        }, index * 100); // Stagger by 100ms
    });
    
    console.log(`🔢 Animating ${statNumbers.length} stat numbers`);
}

/* =====================================
   ANIMATE PROGRESS BARS
===================================== */
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const targetWidth = bar.style.width;
        
        // Start from 0
        bar.style.width = '0%';
        
        // Animate to target with delay
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500 + (index * 100));
    });
    
    console.log(`📈 Animating ${progressBars.length} progress bars`);
}

/* =====================================
   HOVER EFFECTS FOR CARDS
===================================== */
function addHoverEffects() {
    const cards = document.querySelectorAll('.task-card, .item-card, .stat-card');
    
    cards.forEach(card => {
        // Mouse enter
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        // Mouse leave
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        // Click effect
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking a link
            if (e.target.tagName === 'A') return;
            
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log(`🎨 Added hover effects to ${cards.length} cards`);
}

/* =====================================
   REFRESH NOTICE
===================================== */
function checkRefreshNotice() {
    const referrer = document.referrer;
    
    // Show notice if coming from tasks or add-task page
    if (referrer.includes('tasks.php') || 
        referrer.includes('add-task.php') ||
        referrer.includes('task')) {
        showRefreshNotice();
    }
}

function showRefreshNotice() {
    const notice = document.getElementById('refreshNotice');
    if (!notice) return;
    
    // Show notice
    notice.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notice.classList.remove('show');
    }, 3000);
    
    console.log('📢 Refresh notice displayed');
}

/* =====================================
   SMOOTH SCROLL
===================================== */
function addSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =====================================
   REFRESH DATA (OPTIONAL)
===================================== */
function refreshProgressData() {
    // Show loading notice
    const notice = document.getElementById('refreshNotice');
    if (notice) {
        notice.textContent = '🔄 Refreshing data...';
        notice.classList.add('show');
    }
    
    // Reload page after short delay
    setTimeout(() => {
        location.reload();
    }, 500);
}

/* =====================================
   KEYBOARD SHORTCUTS
===================================== */
document.addEventListener('keydown', function(e) {
    // R key - Refresh
    if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey && !e.metaKey) {
            // Only if not Ctrl+R (browser refresh)
            e.preventDefault();
            refreshProgressData();
        }
    }
    
    // T key - Go to Tasks
    if (e.key === 't' || e.key === 'T') {
        if (!e.ctrlKey && !e.metaKey) {
            window.location.href = 'tasks.php';
        }
    }
    
    // N key - New Task
    if (e.key === 'n' || e.key === 'N') {
        if (!e.ctrlKey && !e.metaKey) {
            window.location.href = 'add-task.php';
        }
    }
});

/* =====================================
   EXPORT TO CSV (BONUS FEATURE)
===================================== */
function exportProgressToCSV() {
    const data = [];
    
    // Collect task data
    document.querySelectorAll('.task-card, .item-card').forEach(card => {
        const title = card.querySelector('h4')?.textContent || '';
        const info = card.querySelector('p')?.textContent || '';
        const progress = card.querySelector('.progress-label')?.textContent || 'N/A';
        
        data.push({
            title: title.trim(),
            info: info.trim(),
            progress: progress.trim()
        });
    });
    
    // Create CSV
    let csv = 'Task,Information,Progress\n';
    data.forEach(row => {
        csv += `"${row.title}","${row.info}","${row.progress}"\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('📥 Progress exported to CSV');
}

/* =====================================
   PRINT REPORT
===================================== */
function printProgressReport() {
    window.print();
}

/* =====================================
   UTILITY FUNCTIONS
===================================== */

// Show notification
function showNotification(message, type = 'success') {
    const notice = document.getElementById('refreshNotice');
    if (!notice) return;
    
    const colors = {
        success: 'linear-gradient(135deg, #43e97b, #38f9d7)',
        error: 'linear-gradient(135deg, #ff6b6b, #feca57)',
        info: 'linear-gradient(135deg, #4facfe, #00f2fe)'
    };
    
    notice.textContent = message;
    notice.style.background = colors[type] || colors.success;
    notice.classList.add('show');
    
    setTimeout(() => {
        notice.classList.remove('show');
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Calculate days until
function daysUntil(dateString) {
    const target = new Date(dateString);
    const today = new Date();
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* =====================================
   FAB BUTTON ANIMATIONS
===================================== */
document.querySelectorAll('.fab-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

/* =====================================
   CONSOLE INFO
===================================== */
console.log('%c📊 Progress Dashboard Loaded', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cKeyboard Shortcuts:', 'color: #764ba2; font-weight: bold;');
console.log('  R - Refresh data');
console.log('  T - Go to Tasks');
console.log('  N - New Task');
console.log('%c✨ Made with ❤️ by Noraziela', 'color: #43e97b; font-style: italic;');