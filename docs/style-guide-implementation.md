# Complete Wizard Implementation Guide

A comprehensive guide for building a fully functional, beautifully styled wizard from scratch.

## HTML Structure Foundation

### Basic Wizard Container
```html
<div class="wizard-container">
    <!-- Progress Bar -->
    <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
    </div>
    
    <!-- Step 1 -->
    <div class="step active" id="step1">
        <div class="step-header">
            <a href="#" class="view-content">View Content</a>
            <div class="step-icon">
                <!-- SVG icon here -->
            </div>
            <h1 class="step-title">Step Title</h1>
            <p class="step-subtitle">Step description</p>
        </div>
        
        <div class="step-content">
            <!-- Form content here -->
        </div>
        
        <div class="navigation">
            <button class="btn btn-secondary" onclick="prevStep()">Back</button>
            <button class="btn btn-primary" onclick="nextStep()">Next</button>
        </div>
    </div>
    
    <!-- Additional steps... -->
</div>
```

## CSS Foundation (Essential Styles)

### Base Setup
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8f9fa;
    color: #2c3e50;
    line-height: 1.6;
}

/* Hide all steps by default, show only active */
.step {
    display: none;
}

.step.active {
    display: block;
}
```

### Wizard Container
```css
.wizard-container {
    max-width: 900px;
    margin: 0 auto;
    min-height: 100vh;
    background: white;
    box-shadow: 0 0 40px rgba(0,0,0,0.1);
}
```

### Progress Bar
```css
.progress-bar {
    height: 6px;
    background: #e9ecef;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4A90FF 0%, #6BA3FF 100%);
    transition: width 0.3s ease;
    border-radius: 0 3px 3px 0;
    width: 0%;
}
```

### Step Header
```css
.step-header {
    padding: 40px 48px 32px;
    background: white;
    border-bottom: 1px solid #e9ecef;
    position: relative;
}

.step-icon {
    width: 56px;
    height: 56px;
    background: #4A90FF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(74, 144, 255, 0.3);
}

.step-title {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 8px;
}

.step-subtitle {
    font-size: 18px;
    color: #718096;
}

.view-content {
    position: absolute;
    top: 40px;
    right: 48px;
    color: #718096;
    text-decoration: none;
    font-size: 14px;
}
```

### Content Area
```css
.step-content {
    padding: 48px;
}

.navigation {
    padding: 32px 48px;
    background: white;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

## JavaScript Wizard Logic

### Core Wizard Functionality
```javascript
let currentStep = 1;
let totalSteps = 5; // Set based on your wizard length

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById('step' + stepNumber);
    if (targetStep) {
        targetStep.classList.add('active');
        updateProgress();
    }
}

function nextStep() {
    if (validateCurrentStep() && currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function validateCurrentStep() {
    // Add validation logic here
    return true;
}

// Initialize wizard
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
});
```

## Form Components Implementation

### Text Input/Textarea
```html
<div class="form-section">
    <label class="form-label">
        <svg><!-- icon --></svg>
        Label Text
    </label>
    <textarea class="form-input" placeholder="Enter text..."></textarea>
</div>
```

```css
.form-section {
    margin-bottom: 40px;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 16px;
}

.form-input {
    width: 100%;
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    min-height: 120px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #4A90FF;
    box-shadow: 0 0 0 3px rgba(74, 144, 255, 0.1);
}
```

### Dropdown Component
```html
<div class="dropdown-container">
    <div class="dropdown-field" id="dropdown1" onclick="toggleDropdown('dropdown1')">
        <span id="selected-value">Select option...</span>
        <svg class="dropdown-arrow"><!-- arrow icon --></svg>
    </div>
    <div class="dropdown-menu" id="menu1">
        <div class="dropdown-option" onclick="selectOption('dropdown1', 'option1', 'Option 1')">
            Option 1
        </div>
        <div class="dropdown-option" onclick="selectOption('dropdown1', 'option2', 'Option 2')">
            Option 2
        </div>
    </div>
</div>
```

```css
.dropdown-container {
    position: relative;
}

.dropdown-field {
    width: 100%;
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: border-color 0.2s;
}

.dropdown-field:hover {
    border-color: #cbd5e0;
}

.dropdown-field.active {
    border-color: #4A90FF;
    box-shadow: 0 0 0 3px rgba(74, 144, 255, 0.1);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    z-index: 10;
    display: none;
}

.dropdown-menu.show {
    display: block;
}

.dropdown-option {
    padding: 12px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.dropdown-option:hover {
    background: #f7fafc;
}
```

```javascript
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const menu = document.getElementById(dropdownId.replace('dropdown', 'menu'));
    
    dropdown.classList.toggle('active');
    menu.classList.toggle('show');
}

function selectOption(dropdownId, value, text) {
    const selectedSpan = document.querySelector(`#${dropdownId} span`);
    selectedSpan.textContent = text;
    
    // Close dropdown
    document.getElementById(dropdownId).classList.remove('active');
    document.getElementById(dropdownId.replace('dropdown', 'menu')).classList.remove('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown-container')) {
        document.querySelectorAll('.dropdown-field').forEach(field => {
            field.classList.remove('active');
        });
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});
```

### Selection Cards
```html
<div class="selection-cards">
    <div class="selection-card" onclick="selectCard(this)">
        <h3 class="card-title">Option 1</h3>
        <p class="card-description">Description text...</p>
    </div>
    <div class="selection-card" onclick="selectCard(this)">
        <h3 class="card-title">Option 2</h3>
        <p class="card-description">Description text...</p>
    </div>
</div>
```

```css
.selection-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.selection-card {
    padding: 24px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    background: white;
}

.selection-card:hover {
    border-color: #cbd5e0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.selection-card.selected {
    border-color: #4A90FF;
    background: #f0f9ff;
}

.selection-card.selected::after {
    content: '✓';
    position: absolute;
    top: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
    background: #10b981;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
}

.card-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 8px;
}

.card-description {
    color: #718096;
    line-height: 1.5;
}
```

```javascript
function selectCard(element) {
    // Remove selection from all cards in the same container
    const container = element.closest('.selection-cards');
    container.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    element.classList.add('selected');
}
```

### Buttons
```css
.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
}

.btn-primary {
    background: #1a202c;
    color: white;
}

.btn-primary:hover {
    background: #2d3748;
    transform: translateY(-1px);
}

.btn-primary:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background: transparent;
    color: #718096;
    border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
}
```

## Loading States

### Loading Spinner
```html
<div class="loading-state">
    <div class="spinner"></div>
    <div class="loading-text">Loading...</div>
</div>
```

```css
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 24px;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #4A90FF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 18px;
    color: #718096;
}
```

## Complete Step Template

```html
<div class="step" id="step2">
    <div class="step-header">
        <a href="#" class="view-content">
            <svg width="16" height="16"><!-- icon --></svg>
            View Content
        </a>
        <div class="step-icon">
            <svg width="28" height="28"><!-- step icon --></svg>
        </div>
        <h1 class="step-title">Step Title</h1>
        <p class="step-subtitle">Step description goes here.</p>
    </div>

    <div class="step-content">
        <!-- Your form content here -->
        <div class="form-section">
            <label class="form-label">
                <svg width="20" height="20"><!-- icon --></svg>
                Form Label
            </label>
            <input type="text" class="form-input" placeholder="Enter value...">
        </div>
    </div>

    <div class="navigation">
        <button class="btn btn-secondary" onclick="prevStep()">
            <svg width="16" height="16"><!-- back arrow --></svg>
            Back
        </button>
        <button class="btn btn-primary" onclick="nextStep()">
            Next
            <svg width="16" height="16"><!-- forward arrow --></svg>
        </button>
    </div>
</div>
```

## Implementation Checklist

### 1. HTML Structure
- [ ] Create wizard container with progress bar
- [ ] Add step containers with unique IDs
- [ ] Include step headers with icons, titles, subtitles
- [ ] Add step content areas
- [ ] Include navigation sections

### 2. CSS Styling
- [ ] Apply base styles and resets
- [ ] Style wizard container and layout
- [ ] Implement progress bar styling
- [ ] Style step headers and content
- [ ] Add form component styles
- [ ] Include button styles
- [ ] Add loading states

### 3. JavaScript Functionality
- [ ] Implement step navigation functions
- [ ] Add progress bar updates
- [ ] Create form validation
- [ ] Handle dropdown interactions
- [ ] Manage card selections
- [ ] Add loading state management

### 4. Final Polish
- [ ] Test all interactions
- [ ] Verify responsive behavior
- [ ] Check accessibility
- [ ] Optimize animations
- [ ] Test form validation

## Quick Start Template

Use this minimal template to get started quickly:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wizard</title>
    <style>
        /* Copy all CSS from above sections */
    </style>
</head>
<body>
    <div class="wizard-container">
        <!-- Progress bar -->
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
        </div>
        
        <!-- Add your steps here using the templates above -->
        
    </div>
    
    <script>
        /* Copy all JavaScript from above sections */
    </script>
</body>
</html>
```

This implementation guide provides everything needed to build a fully functional wizard with beautiful styling. Start with the basic structure, add your specific content, and customize as needed.