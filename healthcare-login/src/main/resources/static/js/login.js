/**
 * Healthcare Pro — Login Page Interactive Logic
 * Handles role selection, form transitions, authentication, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Element References ----
    const roleSelection = document.getElementById('role-selection');
    const loginFormSection = document.getElementById('login-form-section');
    const loginForm = document.getElementById('login-form');
    const roleInput = document.getElementById('role-input');
    const backBtn = document.getElementById('back-btn');
    const loginBtn = document.getElementById('login-btn');
    const btnLoader = document.getElementById('btn-loader');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const passwordToggle = document.getElementById('password-toggle');
    const alertMessage = document.getElementById('alert-message');
    const alertIcon = document.getElementById('alert-icon');
    const alertText = document.getElementById('alert-text');
    const badgeText = document.getElementById('badge-text');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const demoCreds = document.getElementById('demo-creds-content');

    const roleCards = document.querySelectorAll('.role-card');

    // ---- Role Configurations ----
    const roleConfig = {
        DOCTOR: {
            title: 'Doctor Login',
            subtitle: 'Enter your credentials to access the medical portal',
            badge: 'Doctor',
            primary: '#06b6d4',
            secondary: '#0891b2',
            glow: 'rgba(6, 182, 212, 0.25)',
            demoUsers: [
                { username: 'doctor', password: 'doctor123', name: 'Dr. Sarah Johnson' },
                { username: 'dr.smith', password: 'smith456', name: 'Dr. James Smith' }
            ]
        },
        ADMIN: {
            title: 'Admin Login',
            subtitle: 'Enter your credentials to access the administration panel',
            badge: 'Administrator',
            primary: '#a855f7',
            secondary: '#9333ea',
            glow: 'rgba(168, 85, 247, 0.25)',
            demoUsers: [
                { username: 'admin', password: 'admin123', name: 'Alex Thompson' },
                { username: 'sysadmin', password: 'sys456', name: 'Morgan Lee' }
            ]
        },
        PATIENT: {
            title: 'Patient Login',
            subtitle: 'Enter your credentials to access your health portal',
            badge: 'Patient',
            primary: '#22c55e',
            secondary: '#16a34a',
            glow: 'rgba(34, 197, 94, 0.25)',
            demoUsers: [
                { username: 'patient', password: 'patient123', name: 'Emily Davis' },
                { username: 'john.doe', password: 'john456', name: 'John Doe' }
            ]
        }
    };

    let selectedRole = null;

    // ---- Create Floating Particles ----
    function createParticles() {
        const container = document.getElementById('particles-container');
        const count = 30;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (15 + Math.random() * 25) + 's';
            particle.style.animationDelay = -(Math.random() * 30) + 's';
            particle.style.width = (2 + Math.random() * 3) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = 0.1 + Math.random() * 0.2;
            container.appendChild(particle);
        }
    }
    createParticles();

    // ---- Update CSS Variables for Active Role ----
    function setActiveRoleColors(role) {
        const config = roleConfig[role];
        document.documentElement.style.setProperty('--active-primary', config.primary);
        document.documentElement.style.setProperty('--active-secondary', config.secondary);
        document.documentElement.style.setProperty('--active-glow', config.glow);
    }

    // ---- Role Card Click Handlers ----
    roleCards.forEach(card => {
        card.addEventListener('click', () => selectRole(card.dataset.role));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectRole(card.dataset.role);
            }
        });
    });

    function selectRole(role) {
        selectedRole = role;
        const config = roleConfig[role];

        // Update role colors
        setActiveRoleColors(role);

        // Update form content
        roleInput.value = role;
        badgeText.textContent = config.badge;
        formTitle.textContent = config.title;
        formSubtitle.textContent = config.subtitle;

        // Populate demo credentials
        populateDemoCredentials(config.demoUsers);

        // Clear previous form state
        loginForm.reset();
        hideAlert();
        clearErrors();

        // Animate transition
        roleSelection.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            roleSelection.style.display = 'none';
            loginFormSection.classList.remove('hidden');
            loginFormSection.style.animation = 'slideIn 0.4s ease-out forwards';
            usernameInput.focus();
        }, 300);
    }

    // ---- Back Button ----
    backBtn.addEventListener('click', () => {
        loginFormSection.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            loginFormSection.classList.add('hidden');
            loginFormSection.style.animation = '';
            roleSelection.style.display = '';
            roleSelection.style.animation = 'slideIn 0.4s ease-out forwards';
        }, 300);
    });

    // ---- Password Toggle ----
    passwordToggle.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordToggle.querySelector('.eye-open').classList.toggle('hidden');
        passwordToggle.querySelector('.eye-closed').classList.toggle('hidden');
    });

    // ---- Demo Credentials ----
    function populateDemoCredentials(users) {
        demoCreds.innerHTML = '';
        users.forEach(user => {
            const item = document.createElement('div');
            item.className = 'demo-cred-item';
            item.innerHTML = `
                <div class="demo-cred-info">
                    <span class="demo-cred-user">${user.name}</span>
                    <span class="demo-cred-pass">${user.username} / ${user.password}</span>
                </div>
                <span class="demo-cred-fill">Click to fill →</span>
            `;
            item.addEventListener('click', () => {
                usernameInput.value = user.username;
                passwordInput.value = user.password;
                // Trigger visual feedback
                item.style.borderColor = 'var(--active-primary)';
                item.style.background = 'var(--active-glow)';
                setTimeout(() => {
                    item.style.borderColor = '';
                    item.style.background = '';
                }, 500);
            });
            demoCreds.appendChild(item);
        });
    }

    // ---- Form Validation ----
    function validateForm() {
        let isValid = true;

        if (!usernameInput.value.trim()) {
            showError('username', 'Username is required');
            isValid = false;
        } else {
            clearError('username');
        }

        if (!passwordInput.value.trim()) {
            showError('password', 'Password is required');
            isValid = false;
        } else {
            clearError('password');
        }

        return isValid;
    }

    function showError(field, message) {
        const group = document.getElementById(`input-group-${field}`);
        const error = document.getElementById(`${field}-error`);
        group.classList.add('error');
        error.textContent = message;
    }

    function clearError(field) {
        const group = document.getElementById(`input-group-${field}`);
        const error = document.getElementById(`${field}-error`);
        group.classList.remove('error');
        error.textContent = '';
    }

    function clearErrors() {
        clearError('username');
        clearError('password');
    }

    // ---- Alert Messages ----
    function showAlert(type, message) {
        alertMessage.className = `alert-message ${type}`;
        alertIcon.textContent = type === 'success' ? '✓' : '✕';
        alertText.textContent = message;
    }

    function hideAlert() {
        alertMessage.className = 'alert-message hidden';
    }

    // ---- Form Submission ----
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlert();

        if (!validateForm()) return;

        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        const payload = {
            username: usernameInput.value.trim(),
            password: passwordInput.value,
            role: roleInput.value
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                showAlert('success', data.message);

                // Animate success and redirect
                loginBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                loginBtn.innerHTML = '<span class="btn-text">✓ Redirecting...</span>';

                setTimeout(() => {
                    window.location.href = data.redirectUrl;
                }, 1500);
            } else {
                showAlert('error', data.message);
                // Shake animation on error
                loginForm.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => { loginForm.style.animation = ''; }, 500);
            }
        } catch (error) {
            showAlert('error', 'Connection error. Please try again.');
        } finally {
            // Reset button (skip if success redirect)
            setTimeout(() => {
                if (!loginBtn.innerHTML.includes('Redirecting')) {
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;
                }
            }, 600);
        }
    });

    // ---- Real-time Input Validation ----
    usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim()) clearError('username');
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.trim()) clearError('password');
    });

    // ---- Add Shake Animation ----
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 50%, 90% { transform: translateX(-6px); }
            30%, 70% { transform: translateX(6px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // ---- Keyboard Navigation for Role Cards ----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !loginFormSection.classList.contains('hidden')) {
            backBtn.click();
        }
    });
});
