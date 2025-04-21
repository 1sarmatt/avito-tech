Project Management System

A modern, responsive project management system built with React and TypeScript.

## Features

- Task Management with drag-and-drop functionality
- Project Boards
- Task filtering and search
- Responsive design
- Real-time task status updates
- Modal/drawer for task details

## Technology Stack

### Core Technologies
- **React 18+**: For building a robust and efficient user interface
- **TypeScript**: Adds static typing, improving code quality and developer experience
- **Vite**: Modern build tool offering fast development and optimized production builds

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible React components built on Radix UI
- **Lucide React**: Beautiful, consistent icons

### State Management and Data Fetching
- **@tanstack/react-query**: For efficient server state management and data fetching
- **React Router DOM**: For client-side routing

### DnD Functionality
- **@dnd-kit/sortable**: For implementing drag-and-drop functionality

## Getting Started

### Prerequisites

- Node.js v20 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd avito-tech
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Technology Choice Rationale

### Why Vite?
- Faster development server start
- Quick hot module replacement (HMR)
- Optimized production builds
- Better developer experience compared to Create React App

### Why TypeScript?
- Enhanced code reliability through static typing
- Better IDE support and autocompletion
- Easier refactoring and maintenance
- Reduced runtime errors

### Why Tailwind CSS?
- Rapid UI development
- Consistent styling
- No context switching between files
- Small bundle size with purging unused styles

### Why @tanstack/react-query?
- Efficient server state management
- Automatic background data updates
- Built-in caching
- Request deduplication
- Optimistic updates

### Why shadcn/ui?
- High-quality, accessible components
- Customizable and themeable
- Built on robust Radix UI primitives
- Consistent design system

### Why @dnd-kit/sortable?
- Accessible drag-and-drop functionality
- Performance optimized
- Support for touch devices
- Customizable animations

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── pages/         # Page components
  ├── hooks/         # Custom React hooks
  ├── api/           # API client and utilities
  ├── types/         # TypeScript type definitions
  └── utils/         # Helper functions and utilities
```

