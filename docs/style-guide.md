# Modern Wizard UI Style Guide

A comprehensive design system for creating polished, professional wizard interfaces with modern SaaS aesthetics.

## Color Palette

### Primary Colors
- **Primary Blue**: `#4A90FF` - Main brand color for primary actions, icons, and emphasis
- **Primary Blue Gradient**: `linear-gradient(90deg, #4A90FF 0%, #6BA3FF 100%)` - For progress bars and highlights
- **Deep Navy**: `#1a202c` - For primary buttons and strong emphasis elements

### Secondary Colors
- **Light Blue**: `#ebf8ff` - For selected states and light backgrounds
- **Soft Blue**: `#f0f9ff` - For subtle backgrounds and card selections

### Neutral Palette
- **Primary Text**: `#2c3e50` - Main content text
- **Secondary Text**: `#718096` - Supporting text, descriptions, labels
- **Tertiary Text**: `#cbd5e0` - Placeholders and disabled text
- **Border Light**: `#e2e8f0` - Default borders and dividers
- **Border Medium**: `#cbd5e0` - Hover state borders
- **Background**: `#f8f9fa` - Main application background
- **Card Background**: `#ffffff` - Cards and content areas
- **Light Background**: `#f7fafc` - Subtle section backgrounds

### Functional Colors
- **Success Green**: `#10b981` - Success states, checkmarks, confirmations
- **Warning Orange**: `#fed7aa` - Warning backgrounds
- **Warning Text**: `#9a3412` - Warning text content
- **Error Red**: `#e53e3e` - Error states and destructive actions

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Font Weights
- **Regular**: `400` - Body text, descriptions
- **Medium**: `500` - Tab labels, secondary emphasis
- **Semibold**: `600` - Form labels, section headers
- **Bold**: `700` - Main titles, strong emphasis

### Text Hierarchy
- **Main Title**: `32px / 700 weight / #1a202c / letter-spacing: -0.02em`
- **Subtitle**: `18px / 400 weight / #718096`
- **Section Header**: `18px / 600 weight / #2d3748`
- **Body Text**: `16px / 400 weight / #2c3e50 / line-height: 1.6`
- **Label Text**: `14px / 600 weight / #2d3748`
- **Caption Text**: `14px / 400 weight / #718096`
- **Small Text**: `12px / 400 weight / #718096`

## Layout & Spacing

### Container Structure
- **Max Width**: `900px` with auto margins for centered layout
- **Main Background**: White with subtle shadow: `box-shadow: 0 0 40px rgba(0,0,0,0.1)`
- **Full Height**: `min-height: 100vh`

### Spacing System
- **Extra Small**: `8px` - Internal element spacing
- **Small**: `12px` - Close related elements
- **Medium**: `16px` - Standard spacing between elements
- **Large**: `24px` - Section spacing
- **Extra Large**: `32px` - Major section breaks
- **XXL**: `40px` - Content area padding
- **XXXL**: `48px` - Header/footer padding

### Border Radius
- **Small**: `6px` - Small elements, tags
- **Medium**: `8px` - Buttons, inputs
- **Large**: `12px` - Cards, major containers
- **Circle**: `50%` - Icons, avatars

## Component Styling

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
```

### Buttons

#### Primary Button
```css
.btn-primary {
    background: #1a202c;
    color: white;
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
}

.btn-primary:hover {
    background: #2d3748;
    transform: translateY(-1px);
}
```

#### Secondary Button
```css
.btn-secondary {
    background: transparent;
    color: #718096;
    border: 2px solid #e2e8f0;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-secondary:hover {
    background: #f7fafc;
    border-color: #cbd5e0;
}
```

### Form Elements

#### Text Input/Textarea
```css
.form-input {
    width: 100%;
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    font-family: inherit;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
    outline: none;
    border-color: #4A90FF;
    box-shadow: 0 0 0 3px rgba(74, 144, 255, 0.1);
}
```

#### Dropdown Field
```css
.dropdown-field {
    width: 100%;
    padding: 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
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
```

### Cards & Containers

#### Selection Card
```css
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
```

#### Content Card
```css
.content-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
```

### Interactive Elements

#### Checkbox
```css
.checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid #cbd5e0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
}

.checkbox.checked {
    background: #4A90FF;
    border-color: #4A90FF;
    color: white;
}
```

#### Tab Navigation
```css
.tab-container {
    display: flex;
    border-bottom: 2px solid #e2e8f0;
    margin-bottom: 32px;
}

.tab {
    padding: 16px 24px;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    color: #718096;
    font-weight: 500;
    transition: all 0.2s;
}

.tab.active {
    color: #1a202c;
    border-bottom-color: #4A90FF;
}
```

## Loading States & Feedback

### Spinner
```css
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
```

### Loading State Container
```css
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 24px;
}

.loading-text {
    font-size: 18px;
    color: #718096;
}
```

### Info Box (Notifications)
```css
.info-box {
    background: #fef7ed;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 32px;
}

.info-box-text {
    color: #9a3412;
    line-height: 1.5;
}
```

## Navigation Structure

### Bottom Navigation
```css
.navigation {
    padding: 32px 48px;
    background: white;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

### Top Right Action Link
```css
.view-content {
    position: absolute;
    top: 40px;
    right: 48px;
    color: #718096;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    transition: color 0.2s;
}

.view-content:hover {
    color: #4A90FF;
}
```

## Animations & Transitions

### Standard Transitions
- **Default**: `transition: all 0.2s`
- **Border/Color**: `transition: border-color 0.2s, box-shadow 0.2s`
- **Progress**: `transition: width 0.3s ease`

### Hover Effects
- **Button Lift**: `transform: translateY(-1px)`
- **Box Shadow**: `box-shadow: 0 4px 12px rgba(0,0,0,0.1)`

## Icons

### Icon Sizing
- **Small**: `16px` - Inline with text
- **Medium**: `20px` - Form labels
- **Large**: `28px` - Step icons
- **Navigation**: `16px` - Arrow icons

### Icon Styling
```css
.icon {
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 2;
}
```

## Form Layout Patterns

### Form Section
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
```

### Two-Column Layout
```css
.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
}
```

## Accessibility & States

### Focus States
- **Focus Ring**: `box-shadow: 0 0 0 3px rgba(74, 144, 255, 0.1)`
- **Focus Border**: `border-color: #4A90FF`

### Disabled States
- **Opacity**: `0.6`
- **Cursor**: `cursor: not-allowed`
- **Background**: Maintain original but with reduced opacity

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for text
- Use `#2c3e50` for primary text on white backgrounds
- Use `#718096` for secondary text with adequate contrast

## Implementation Notes

1. **Box Model**: Use `box-sizing: border-box` for all elements
2. **Font Smoothing**: Apply `-webkit-font-smoothing: antialiased`
3. **Responsive**: Ensure touch targets are minimum 44px for mobile
4. **Performance**: Use `transform` and `opacity` for animations
5. **Consistency**: Apply the spacing system consistently throughout