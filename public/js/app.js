// ============================================
// Dark Mode Toggle
// ============================================
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'true') {
    body.classList.add('dark-mode');
}

// Toggle dark mode
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    });
}

// ============================================
// Delete Confirmation
// ============================================
function confirmDelete() {
    return confirm('Are you sure you want to delete this note? This action cannot be undone.');
}

// ============================================
// Toast Message Auto-dismiss
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const toasts = document.querySelectorAll('.toast');
    toasts.forEach(toast => {
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    });
});

// ============================================
// Character Counter for Title Input
// ============================================
const titleInput = document.getElementById('title');
if (titleInput) {
    const maxLength = 150;
    
    // Add character counter if it doesn't exist
    let charCounter = document.querySelector('.char-counter');
    if (!charCounter) {
        charCounter = document.createElement('small');
        charCounter.className = 'char-counter';
        charCounter.style.cssText = 'color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem;';
        titleInput.parentNode.insertBefore(charCounter, titleInput.nextSibling);
    }
    
    const updateCounter = () => {
        const remaining = maxLength - titleInput.value.length;
        charCounter.textContent = `${remaining} characters remaining`;
        
        if (remaining <= 10) {
            charCounter.style.color = 'var(--danger-color)';
        } else if (remaining <= 30) {
            charCounter.style.color = 'var(--warning-color)';
        } else {
            charCounter.style.color = 'var(--text-muted)';
        }
    };
    
    titleInput.addEventListener('input', updateCounter);
    updateCounter();
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Form Validation Enhancement
// ============================================
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const requiredInputs = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--danger-color)';
                
                // Add shake animation
                input.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        
        if (!isValid) {
            e.preventDefault();
        }
    });
});

// Add shake animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// ============================================
// Search Input Enhancement
// ============================================
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    // Clear search button
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.innerHTML = '✕';
    clearBtn.className = 'search-clear';
    clearBtn.style.cssText = `
        position: absolute;
        right: 3rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        color: var(--text-muted);
        padding: 0.25rem;
        display: none;
    `;
    
    // Make search input parent relative
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(clearBtn);
    
    // Show/hide clear button
    searchInput.addEventListener('input', () => {
        clearBtn.style.display = searchInput.value ? 'block' : 'none';
    });
    
    // Clear search
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
    });
    
    // Check initial value
    if (searchInput.value) {
        clearBtn.style.display = 'block';
    }
}

// ============================================
// Note Card Hover Effects Enhancement
// ============================================
const noteCards = document.querySelectorAll('.note-card');
noteCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// Stat Card Animation on Scroll (Disabled to prevent blinking)
// ============================================
/*
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.5s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statCards = document.querySelectorAll('.stat-card');
statCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Add fadeInUp animation
const fadeInUpStyle = document.createElement('style');
fadeInUpStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInUpStyle);
*/

// ============================================
// Mobile Menu Toggle (for future enhancement)
// ============================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ============================================
// Tag Input Enhancement
// ============================================
const tagsInput = document.getElementById('tags');
if (tagsInput) {
    tagsInput.addEventListener('keydown', (e) => {
        // Allow comma to enter tags
        if (e.key === ',') {
            e.preventDefault();
            const currentValue = tagsInput.value.trim();
            if (currentValue && !currentValue.endsWith(',')) {
                tagsInput.value = currentValue + ', ';
            }
        }
    });
}

// ============================================
// Auto-resize Textarea
// ============================================
const textareas = document.querySelectorAll('.form-textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
});

// ============================================
// Button Ripple Effect
// ============================================
const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ============================================
// Keyboard Shortcuts
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals (for future enhancement)
    if (e.key === 'Escape') {
        // Add modal closing logic here when modals are implemented
    }
});

// ============================================
// Loading States for Forms
// ============================================
const noteForms = document.querySelectorAll('.note-form');
noteForms.forEach(form => {
    form.addEventListener('submit', () => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            submitBtn.style.opacity = '0.7';
        }
    });
});

// ============================================
// Category Filter Active State
// ============================================
const categorySelect = document.querySelector('select[name="category"]');
if (categorySelect) {
    categorySelect.addEventListener('change', () => {
        const options = categorySelect.querySelectorAll('option');
        options.forEach(option => {
            if (option.value === categorySelect.value) {
                option.style.fontWeight = 'bold';
            } else {
                option.style.fontWeight = 'normal';
            }
        });
    });
    
    // Set initial state
    categorySelect.dispatchEvent(new Event('change'));
}

// ============================================
// Print Styles Enhancement
// ============================================
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// ============================================
// Console Welcome Message
// ============================================
console.log('%c📝 Notes App', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%cBuilt with Node.js, Express, and EJS', 'font-size: 14px; color: #8b5cf6;');
console.log('%cPress Ctrl/Cmd + K to focus search', 'font-size: 12px; color: #94a3b8;');
