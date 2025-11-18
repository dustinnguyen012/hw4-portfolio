// ===== PART 3: JAVASCRIPT VALIDATION =====

// Form errors array to track all validation issues across multiple submissions
let form_errors = [];

// Get form elements
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const subjectInput = document.getElementById('subject');
const commentsTextarea = document.getElementById('comments');
const errorOutput = document.getElementById('error-output');
const infoOutput = document.getElementById('info-output');

// Character limits
const COMMENTS_MAX_LENGTH = 500;
const COMMENTS_WARNING_THRESHOLD = 450;

// ===== UTILITY FUNCTIONS =====

function flashField(field, message) {
    field.classList.add('flash-error');
    showTemporaryError(message);
    setTimeout(() => {
        field.classList.remove('flash-error');
    }, 500);
}

function showTemporaryError(message) {
    errorOutput.textContent = message;
    errorOutput.style.display = 'block';
    setTimeout(() => {
        errorOutput.textContent = '';
        errorOutput.style.display = 'none';
    }, 3000);
}

function showError(message) {
    errorOutput.textContent = message;
    errorOutput.style.display = 'block';
}

function showInfo(message) {
    infoOutput.textContent = message;
    infoOutput.style.display = 'block';
}

function clearMessages() {
    errorOutput.textContent = '';
    errorOutput.style.display = 'none';
    infoOutput.textContent = '';
    infoOutput.style.display = 'none';
}

// ===== CHARACTER MASKING =====

nameInput.addEventListener('input', function(e) {
    const pattern = /^[A-Za-z\s\-']*$/;
    if (!pattern.test(this.value)) {
        const invalidChar = this.value[this.value.length - 1];
        this.value = this.value.slice(0, -1);
        flashField(this, `⚠️ Invalid character "${invalidChar}" - Only letters, spaces, hyphens, and apostrophes allowed`);
    }
});

if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        const pattern = /^[\d\s\-\(\)\+]*$/;
        if (!pattern.test(this.value)) {
            const invalidChar = this.value[this.value.length - 1];
            this.value = this.value.slice(0, -1);
            flashField(this, `⚠️ Invalid character "${invalidChar}" - Only numbers and phone symbols allowed`);
        }
    });
}

subjectInput.addEventListener('input', function(e) {
    const pattern = /^[A-Za-z0-9\s\-_,.!?]*$/;
    if (!pattern.test(this.value)) {
        const invalidChar = this.value[this.value.length - 1];
        this.value = this.value.slice(0, -1);
        flashField(this, `⚠️ Invalid character "${invalidChar}" - Only letters, numbers, and basic punctuation allowed`);
    }
});

// ===== TEXTAREA CHARACTER COUNTDOWN =====

const charCounter = document.createElement('div');
charCounter.id = 'char-counter';
charCounter.className = 'char-counter';
commentsTextarea.parentNode.appendChild(charCounter);

function updateCharCounter() {
    const currentLength = commentsTextarea.value.length;
    const remaining = COMMENTS_MAX_LENGTH - currentLength;
    
    charCounter.textContent = `${remaining} characters remaining (${currentLength}/${COMMENTS_MAX_LENGTH})`;
    charCounter.classList.remove('warning', 'danger');
    
    if (currentLength >= COMMENTS_MAX_LENGTH) {
        charCounter.classList.add('danger');
        charCounter.textContent = `⚠️ Maximum character limit reached! (${currentLength}/${COMMENTS_MAX_LENGTH})`;
    } else if (currentLength >= COMMENTS_WARNING_THRESHOLD) {
        charCounter.classList.add('warning');
    }
}

commentsTextarea.addEventListener('input', updateCharCounter);
updateCharCounter();

// ===== CUSTOM VALIDATION MESSAGES =====

function setCustomValidationMessage(field, message) {
    field.setCustomValidity(message);
}

function clearCustomValidationMessage(field) {
    field.setCustomValidity('');
}

nameInput.addEventListener('blur', function() {
    if (this.validity.valueMissing) {
        setCustomValidationMessage(this, 'Please enter your name');
    } else if (this.validity.tooShort) {
        setCustomValidationMessage(this, 'Name must be at least 2 characters long');
    } else if (this.validity.patternMismatch) {
        setCustomValidationMessage(this, 'Name can only contain letters, spaces, hyphens, and apostrophes');
    } else {
        clearCustomValidationMessage(this);
    }
});

emailInput.addEventListener('blur', function() {
    if (this.validity.valueMissing) {
        setCustomValidationMessage(this, 'Please enter your email address');
    } else if (this.validity.typeMismatch) {
        setCustomValidationMessage(this, 'Please enter a valid email address (e.g., name@example.com)');
    } else {
        clearCustomValidationMessage(this);
    }
});

subjectInput.addEventListener('blur', function() {
    if (this.validity.valueMissing) {
        setCustomValidationMessage(this, 'Please enter a subject');
    } else if (this.validity.tooShort) {
        setCustomValidationMessage(this, 'Subject must be at least 3 characters long');
    } else if (this.validity.patternMismatch) {
        setCustomValidationMessage(this, 'Subject contains invalid characters');
    } else {
        clearCustomValidationMessage(this);
    }
});

commentsTextarea.addEventListener('blur', function() {
    if (this.validity.valueMissing) {
        setCustomValidationMessage(this, 'Please enter your comments');
    } else if (this.validity.tooShort) {
        setCustomValidationMessage(this, 'Comments must be at least 10 characters long');
    } else if (this.validity.tooLong) {
        setCustomValidationMessage(this, 'Comments must not exceed 500 characters');
    } else {
        clearCustomValidationMessage(this);
    }
});

[nameInput, emailInput, subjectInput, commentsTextarea].forEach(field => {
    field.addEventListener('input', function() {
        clearCustomValidationMessage(this);
    });
});

// ===== FORM SUBMISSION WITH ERROR TRACKING =====

form.addEventListener('submit', function(e) {
    // Clear messages but DON'T reset form_errors - we want to keep history
    clearMessages();
    
    // Check validity of each field
    const fields = [
        { element: nameInput, name: 'name' },
        { element: emailInput, name: 'email' },
        { element: phoneInput, name: 'phone' },
        { element: subjectInput, name: 'subject' },
        { element: commentsTextarea, name: 'comments' }
    ];
    
    let hasErrors = false;
    let currentErrors = []; // Track errors for THIS submission attempt
    
    fields.forEach(field => {
        if (!field.element.checkValidity()) {
            hasErrors = true;
            
            let errorType = 'unknown';
            let errorMessage = '';
            
            if (field.element.validity.valueMissing) {
                errorType = 'required';
                errorMessage = 'Field is required';
            } else if (field.element.validity.tooShort) {
                errorType = 'too_short';
                errorMessage = `Minimum length is ${field.element.minLength}`;
            } else if (field.element.validity.tooLong) {
                errorType = 'too_long';
                errorMessage = `Maximum length is ${field.element.maxLength}`;
            } else if (field.element.validity.patternMismatch) {
                errorType = 'pattern_mismatch';
                errorMessage = 'Invalid format';
            } else if (field.element.validity.typeMismatch) {
                errorType = 'type_mismatch';
                errorMessage = 'Invalid type (e.g., not a valid email)';
            }
            
            // Add to current errors
            const errorObj = {
                field: field.name,
                error_type: errorType,
                message: errorMessage,
                value: field.element.value,
                timestamp: new Date().toISOString()
            };
            
            currentErrors.push(errorObj);
            // Also add to historical form_errors array
            form_errors.push(errorObj);
        }
    });
    
    // If there are errors, prevent submission
    if (hasErrors) {
        e.preventDefault();
        showError(`⚠️ Please fix ${currentErrors.length} error(s) before submitting`);
        console.log('Form Errors (current attempt):', currentErrors);
        console.log('Form Errors (all historical):', form_errors);
        return false;
    }
    
    // If no errors, add form_errors field to submission
    let formErrorsInput = document.getElementById('form-errors-input');
    if (!formErrorsInput) {
        formErrorsInput = document.createElement('input');
        formErrorsInput.type = 'hidden';
        formErrorsInput.id = 'form-errors-input';
        formErrorsInput.name = 'form-errors';
        form.appendChild(formErrorsInput);
    }
    
    // Send ALL historical errors
    formErrorsInput.value = JSON.stringify(form_errors);
    
    showInfo('✓ Form is valid! Submitting...');
    console.log('Submitting with form_errors:', form_errors);
    
    return true;
});

// ===== INFO MESSAGE =====

function checkFormCompleteness() {
    const allFilled = nameInput.value && emailInput.value && subjectInput.value && commentsTextarea.value;
    const allValid = nameInput.checkValidity() && emailInput.checkValidity() && 
                     subjectInput.checkValidity() && commentsTextarea.checkValidity();
    
    if (allFilled && allValid) {
        showInfo('✓ All required fields are complete! You can now submit the form.');
    }
}

[nameInput, emailInput, subjectInput, commentsTextarea].forEach(field => {
    field.addEventListener('blur', checkFormCompleteness);
});

console.log('Form validation script loaded successfully!');
