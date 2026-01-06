/**
 * D&D Expeditionary Application Form
 * Password Gate & Form Submission Handler
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        password: 'STYGIA',
        sessionKey: 'styx_auth',
        maxRoleSelections: 2
    };

    // DOM Elements
    const elements = {
        passwordGate: document.getElementById('password-gate'),
        passwordInput: document.getElementById('gate-password'),
        gateSubmit: document.getElementById('gate-submit'),
        gateError: document.getElementById('gate-error'),
        applicationForm: document.getElementById('application-form'),
        ajaxForm: document.getElementById('ajaxForm'),
        successOverlay: document.getElementById('success-overlay'),
        refNumber: document.getElementById('ref-number')
    };

    // Initialize
    function init() {
        // Check if already authenticated
        if (sessionStorage.getItem(CONFIG.sessionKey) === 'true') {
            showForm();
        }

        // Bind events
        bindPasswordGate();
        bindFormSubmission();
        bindRoleSelectionLimit();
    }

    // Password Gate Logic
    function bindPasswordGate() {
        elements.gateSubmit.addEventListener('click', validatePassword);
        elements.passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                validatePassword();
            }
        });

        // Clear error on input
        elements.passwordInput.addEventListener('input', function() {
            elements.gateError.textContent = '';
        });
    }

    function validatePassword() {
        const input = elements.passwordInput.value.trim().toUpperCase();

        if (input === CONFIG.password) {
            sessionStorage.setItem(CONFIG.sessionKey, 'true');
            elements.passwordGate.classList.add('hidden');
            showForm();
        } else {
            elements.gateError.textContent = 'Access Denied. Clearance code invalid.';
            elements.passwordInput.value = '';
            elements.passwordInput.focus();

            // Shake animation
            elements.passwordInput.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                elements.passwordInput.style.animation = '';
            }, 500);
        }
    }

    function showForm() {
        elements.passwordGate.classList.add('hidden');
        elements.applicationForm.classList.remove('hidden');
    }

    // Role Selection Limit (Question 1: max 2 selections)
    function bindRoleSelectionLimit() {
        const roleCheckboxes = document.querySelectorAll('input[name="role_specialisation[]"]');

        roleCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checked = document.querySelectorAll('input[name="role_specialisation[]"]:checked');

                if (checked.length > CONFIG.maxRoleSelections) {
                    this.checked = false;
                }
            });
        });
    }

    // Form Submission
    function bindFormSubmission() {
        elements.ajaxForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const action = this.getAttribute('action');
            const submitBtn = this.querySelector('.submit-btn');

            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            $.ajax({
                type: 'POST',
                url: action,
                crossDomain: true,
                data: new FormData(this),
                dataType: 'json',
                processData: false,
                contentType: false,
                headers: {
                    'Accept': 'application/json'
                }
            }).done(function() {
                showSuccess();
            }).fail(function() {
                showError();
            }).always(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            });
        });
    }

    function showSuccess() {
        // Generate reference number
        const refNum = generateRefNumber();
        elements.refNumber.textContent = refNum;

        // Show success overlay
        elements.successOverlay.classList.remove('hidden');

        // Auto-hide after delay
        setTimeout(function() {
            elements.successOverlay.classList.add('hidden');
            elements.ajaxForm.reset();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 5000);
    }

    function showError() {
        // Create error overlay dynamically
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'overlay';
        errorOverlay.innerHTML = `
            <div class="success-container" style="border: 3px solid var(--accent-red);">
                <div class="stamp" style="color: var(--accent-red); border-color: var(--accent-red);">ERROR</div>
                <h2>Submission Failed</h2>
                <p>A planar disturbance has interrupted the transmission.</p>
                <p class="warning">Please attempt resubmission.</p>
                <button class="submit-btn" style="margin-top: 1.5rem;" onclick="this.closest('.overlay').remove()">Acknowledge</button>
            </div>
        `;
        document.body.appendChild(errorOverlay);
    }

    function generateRefNumber() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Add shake animation CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
