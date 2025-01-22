# LeaseCalc Chrome Extension Documentation

## Overview
The LeaseCalc Chrome Extension is a browser-based extension developed by Mohammed Isa that enhances the LeaseCalc web application with additional features and seamless browser integration. This extension provides quick access to lease calculations and management capabilities directly from your browser.

## Project Structure

```
lease-calc-extension/
├── components/              # React components
│   ├── Footer/             # Footer component
│   ├── Header/             # Header component
│   ├── Index/              # Main extension view
│   └── New/                # New calculation view
├── pages/                  # Next.js pages
│   ├── _app.js            # Custom App component
│   └── index.js           # Extension entry point
├── public/                 # Static assets
├── styles/                # CSS styles
├── out.js                 # Build output script
├── package.json           # Project dependencies and scripts
└── README.md             # Project documentation
```

## Key Components

### 1. Extension Entry Point (pages/index.js)
- Serves as the main entry point of the extension
- Manages extension popup state and views
- Handles communication with LeaseCalc web application
- Uses component-based architecture for modularity

### 2. Main Extension View (components/Index/index.js)
- Primary extension popup interface
- Displays quick access to lease calculations
- Provides integration with LeaseCalc web app
- Implements clean UI with styled components

### 3. New Calculation View (components/New/index.js)
- Quick calculation interface
- Maintains consistent UI with LeaseCalc web app
- Provides streamlined calculation form
- Syncs with main LeaseCalc application

## Technical Stack

### Dependencies
- Next.js (v13.4.1) - React framework
- React (v18.2.0) - UI library
- React DOM (v18.2.0) - DOM manipulation
- Glob (v10.2.3) - File system operations

### Development Features
- Modern React Hooks usage
- Chrome Extension APIs integration
- CSS Modules for styling
- Built-in routing system

## Build and Development Scripts

```json
"scripts": {
  "build": "npm run prep",
  "prep": "npm run exp && node out.js",
  "exp": "next build && next export",
  "run": "next start",
  "dev": "next dev"
}
```

## Extension Features
The LeaseCalc Chrome Extension provides:
1. Quick access to lease calculations
2. Integration with LeaseCalc web app
3. Offline calculation capability
4. Browser toolbar integration
5. Synchronized data with main application

## Styling
- Uses CSS Modules for component-specific styling
- Implements Chrome extension UI guidelines
- Maintains consistent styling with LeaseCalc web app
- Utilizes modern CSS features

## Browser Integration
The extension provides seamless integration with Chrome:
- Browser toolbar presence
- Context menu integration
- Web page interaction capabilities
- Data synchronization
- Offline functionality

## Development Workflow
1. Run `npm install` to install dependencies
2. Use `npm run dev` for development
3. Build the extension using `npm run build`
4. Load the extension in Chrome from the `out` directory

## Best Practices Implemented
1. Component-based architecture
2. Clean code structure
3. Modular styling
4. Efficient state management
5. Chrome extension best practices
6. Responsive design
7. Secure data handling

## Conclusion
The LeaseCalc Chrome Extension enhances the LeaseCalc web application by providing quick access to lease calculations directly from the browser. It demonstrates best practices in both React development and Chrome extension implementation while maintaining seamless integration with the main LeaseCalc application.
