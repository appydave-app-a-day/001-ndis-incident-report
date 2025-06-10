## Front-End Architecture Summary

This document summarizes the key architectural decisions for the front-end, as derived from the main Architecture Document.

### Styling Approach
The project will use **shadcn/ui** as its primary component toolkit. This provides a set of accessible and reusable components that are built on top of **Tailwind CSS**. This allows for both pre-built components for rapid development and the flexibility of a utility-first CSS framework for custom styling.

### State Management In-Depth
Global application state (such as the Mock/Live mode, selected scenario, and loading status) will be managed using **Zustand**. It was chosen for its simplicity and minimal boilerplate, which is ideal for the MVP's requirements.

### Routing Strategy
Client-side navigation and routing will be handled by **React Router**. It is the industry standard for React applications and will manage the different views and wizard steps.
