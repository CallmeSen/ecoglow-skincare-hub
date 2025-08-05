# EcoGlow Skincare Hub - E-commerce Platform

## Overview

EcoGlow Skincare Hub is a comprehensive e-commerce platform specializing in sustainable beauty and skincare products. The application focuses on eco-friendly formulations, plant-derived ingredients, and environmentally conscious beauty solutions. The platform targets conscious consumers interested in clean beauty products like bakuchiol serums, vegan makeup, and sustainable skincare kits.

The application features a full-stack architecture with React frontend, Express backend, and PostgreSQL database, emphasizing personalization through AI-driven quizzes, AR try-on capabilities, and sustainability tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with support for dynamic routes
- **State Management**: TanStack Query for server state management with caching and synchronization
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom CSS variables for the EcoGlow brand color system (forest green, sage green, gold gradients)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for consistent type safety across frontend and backend
- **API Design**: RESTful endpoints following conventional patterns for products, users, cart, wishlist, orders, blog, and quiz functionality
- **Storage Pattern**: Interface-based storage abstraction allowing for multiple implementations (currently in-memory, designed for database integration)

### Database Design
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud hosting
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Models**: Comprehensive schemas for products, users, cart items, wishlist items, orders, blog posts, and quiz responses with rich metadata support

### Component Architecture
- **Design System**: Modular component library with consistent styling and behavior patterns
- **Layout Components**: Header, Footer, and routing components for consistent navigation
- **Feature Components**: Specialized components for product display, shopping cart, AR try-on, quiz functionality, and sustainability tracking
- **UI Components**: Reusable Shadcn/ui components for forms, dialogs, cards, and interactive elements

### Authentication & User Management
- **User System**: Profile management with skin type preferences, sustainability values, and personalization data
- **Session Handling**: Cookie-based sessions with secure storage for user state
- **Personalization**: AI-driven recommendations based on quiz responses and user preferences

### E-commerce Features
- **Product Management**: Comprehensive product catalog with filtering, search, and categorization
- **Shopping Cart**: Persistent cart state with quantity management and shipping calculations
- **Wishlist**: User wishlist functionality with product saving and management
- **Order Processing**: Order creation and tracking with sustainability impact calculations

### Advanced Features
- **AR Try-On**: Camera-based augmented reality for virtual makeup testing using browser APIs
- **Voice Search**: Web Speech API integration for hands-free product discovery
- **Sustainability Tracking**: Carbon footprint calculation, tree planting programs, and eco-impact metrics
- **AI Personalization**: Quiz-driven product recommendations based on skin type, concerns, and preferences

## External Dependencies

### UI & Design
- **Radix UI**: Comprehensive primitive components for accessible interface elements
- **Tailwind CSS**: Utility-first CSS framework for rapid styling and responsive design
- **Lucide React**: Modern icon library for consistent iconography
- **React Icons**: Additional icon sets for social media and brand icons

### Data & State Management
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **Drizzle Zod**: Schema validation integration for runtime type checking

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL database with automatic scaling
- **Environment Variables**: Database connection and configuration management

### Development & Build Tools
- **Vite**: Fast build tool with hot module replacement and optimized bundling
- **TypeScript**: Static type checking for improved code quality and developer experience
- **ESBuild**: Fast JavaScript bundler for production builds

### Browser APIs
- **Web Speech API**: Voice recognition for hands-free search functionality
- **Camera API**: Device camera access for AR try-on features
- **Local Storage**: Client-side data persistence for user preferences and cart state

### Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime schema validation for type-safe data handling
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Styling & Animation
- **Class Variance Authority**: Utility for managing component style variants
- **CLSX**: Utility for conditional CSS class composition
- **Date-fns**: Date manipulation and formatting library for order tracking and blog dates