
# 🌿 EcoGlow Skincare Hub

**Sustainable e-commerce platform for eco-friendly skincare products with AI personalization, AR try-on, and carbon footprint tracking.**

Built with React, TypeScript, Express & PostgreSQL - A full-stack solution for conscious beauty consumers.

## ✨ Features

### 🛍️ **E-commerce Core**
- **Product Catalog**: Curated selection of sustainable skincare, vegan makeup, and eco-friendly beauty products
- **Smart Search**: Full-text search with PostgreSQL pg_trgm extension for intelligent product discovery
- **Shopping Cart**: Persistent cart with real-time inventory checking
- **Secure Checkout**: Stripe integration for safe payment processing

### 🧠 **AI-Powered Personalization**
- **Skincare Quiz**: Multi-step questionnaire to determine skin type, concerns, and preferences
- **OpenAI Integration**: GPT-4o powered product recommendations based on quiz results
- **Personalized Results**: Tailored product suggestions with ingredient analysis

### 🌍 **Sustainability Focus**
- **Carbon Footprint Tracking**: Calculate and display environmental impact of products
- **Eco-Badges**: Automatic certification badges (vegan, cruelty-free, organic)
- **Impact Metrics**: Trees planted and CO2 offset tracking
- **Sustainable Packaging**: Emphasis on eco-friendly packaging solutions

### 🎯 **AR & Interactive Features**
- **AR Try-On**: Virtual makeup testing using camera integration
- **3D Models**: GLB/GLTF model support for immersive product visualization
- **Voice Search**: Speech-to-text product search functionality

### 📊 **Admin Panel**
- **Product Management**: Comprehensive product CRUD with drag-and-drop interfaces
- **Analytics Dashboard**: Real-time KPI monitoring and performance metrics
- **Quiz Builder**: Visual quiz creation tools with multiple question types
- **Sustainability Tools**: Carbon calculator and eco-certification management

## 🏗️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Tailwind CSS** for responsive design
- **Vite** for fast development builds
- **React Query** for state management
- **ShadCN UI** components

### **Backend**
- **Express.js** with TypeScript
- **Node.js** runtime environment
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** (Neon serverless) database

### **Database**
- **PostgreSQL 15+** with advanced features
- **Full-text search** with pg_trgm extension
- **JSONB** for flexible schema design
- **Comprehensive indexing** for performance

### **External Services**
- **OpenAI GPT-4o** for AI recommendations
- **Stripe** for payment processing
- **AR/WebGL** for virtual try-on features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Required API keys (OpenAI, Stripe)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecoglow-skincare-hub.git
   cd ecoglow-skincare-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/ecoglow"
   
   # API Keys
   OPENAI_API_KEY="your_openai_api_key"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   
   # Session
   SESSION_SECRET="your_session_secret"
   ```

4. **Initialize database**
   ```bash
   npm run db:setup
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:5000` to view the application.

## 📁 Project Structure

```
ecoglow-skincare-hub/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and types
├── server/                # Express backend
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── storage/          # Database operations
├── database/             # Schema and migrations
├── admin/               # Admin panel (HTML/JS)
├── scripts/             # Database and utility scripts
└── shared/              # Shared TypeScript types
```

## 🔌 API Endpoints

### **Products**
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)

### **Quiz & AI**
- `POST /api/quiz/submit` - Submit quiz responses
- `GET /api/quiz/recommendations` - Get AI recommendations

### **Cart & Orders**
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders` - Create new order

### **User Management**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/users/profile` - Get user profile

## 🌱 Database Schema

### **Core Tables**
- **users** - User accounts with preferences and quiz results
- **products** - Product catalog with sustainability metrics
- **categories** - Hierarchical product categorization
- **orders** - Order management and tracking
- **quiz_responses** - User quiz data and recommendations

### **Advanced Features**
- **Full-text search** indexes on product names and descriptions
- **JSONB fields** for flexible user preferences and product metadata
- **Automated triggers** for inventory management
- **Performance optimizations** with strategic indexing

## 🎨 Design System

### **Color Palette**
- **Primary Green**: #228B22 (Forest Green)
- **Secondary**: #90EE90 (Light Green)
- **Accent**: #32CD32 (Lime Green)
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headers**: Inter font family, bold weights
- **Body**: Inter font family, regular weights
- **Monospace**: Fira Code for technical content

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push schema changes
npm run db:seed      # Seed database with sample data
npm run type-check   # TypeScript type checking
```

### **Environment Setup**
- **Development**: Uses Vite dev server with HMR
- **Production**: Builds to `/dist` with optimizations
- **Database**: Neon PostgreSQL with connection pooling

## 🚀 Deployment

### **Replit Deployment**
1. Import project to Replit
2. Set up environment variables in Secrets
3. Configure database connection
4. Deploy using Replit's deployment features

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates enabled
- [ ] Performance monitoring setup
- [ ] Backup procedures in place

## 🧪 Testing

Comprehensive testing suite covering:
- **Frontend**: Component testing with React Testing Library
- **Backend**: API endpoint testing with Jest
- **Database**: Schema validation and data integrity
- **Integration**: End-to-end user workflows

Run tests with:
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage reports
```

## 📊 Performance

- **Page Load**: <2 seconds average load time
- **Database**: Optimized queries with <100ms response time
- **Caching**: 5-minute product cache for improved performance
- **CDN**: Static assets served via CDN for global performance

## 🔒 Security

- **Authentication**: Session-based auth with secure cookies
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive validation on all inputs
- **HTTPS**: Enforced SSL in production
- **CSRF Protection**: Cross-site request forgery protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the GPL 3.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our comprehensive guides
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our sustainability-focused developer community

## 🌟 Acknowledgments

- **Sustainable Beauty Industry** for inspiration
- **Open Source Community** for amazing tools and libraries
- **Environmental Organizations** for guidance on sustainability metrics

---

**Built with ❤️ for a more sustainable future in beauty and skincare.**

*EcoGlow Skincare Hub - Where technology meets sustainability in the beauty industry.*
