<img width="1325" height="774" alt="Screenshot 2025-11-30 at 9 39 58 PM" src="https://github.com/user-attachments/assets/579cb367-195c-4493-ac86-53bc8953ba26" /># 🏪 Coimbatore Student Business Directory

> Discover local businesses and student-friendly services near colleges and schools in Coimbatore

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57)](https://www.sqlite.org/)

## 📸 Screenshots

### Homepage
![Homepage

<img width="1325" height="774" alt="homepage" src="https://github.com/user-attachments/assets/54332507-8fa3-4c27-af92-25c9ce118c25" />

### Business Directory

<img width="1346" height="813" alt="buisness deirectory" src="https://github.com/user-attachments/assets/2f4d9054-c4a4-45e8-8f12-1d8467e8b8da" />


## ✨ Features

### 🏢 Business Discovery
- **Institution-Based Search**: Find businesses near specific colleges and schools
- **Category Filtering**: Browse by food, services, retail, and entertainment
- **Real-Time Data**: Live business data from OpenStreetMap and Google Places API
- **Student Discounts**: Special pricing for college students

### 🗺️ Interactive Maps
- **Multiple Map Providers**: Leaflet, Mapbox GL, and Google Maps integration
- **Location Clustering**: Efficient display of nearby businesses
- **Distance Calculation**: Real-time distance from selected institutions

### 🎓 Student-Focused
- **College Integration**: Direct integration with Coimbatore educational institutions
- **Discount Tracking**: Businesses offering student discounts
- **Late-Night Services**: Study-friendly locations with extended hours

### 📱 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Support**: Automatic theme switching
- **Accessible Components**: Built with Radix UI primitives
- **Smooth Animations**: Enhanced user interactions

### 🔧 Technical Features
- **Full-Stack Architecture**: Next.js frontend with FastAPI backend
- **Type-Safe Development**: Complete TypeScript coverage
- **API Integration**: RESTful APIs with automatic documentation
- **Database Management**: SQLAlchemy ORM with SQLite

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Maps & Geo
- **Leaflet**: Interactive maps with [React-Leaflet](https://react-leaflet.js.org/)
- **Mapbox GL**: Advanced mapping with [React Map GL](https://visgl.github.io/react-map-gl/)
- **Google Maps**: Integration via [@googlemaps/react-wrapper](https://www.npmjs.com/package/@googlemaps/react-wrapper)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.8+
- **Database**: [SQLAlchemy](https://www.sqlalchemy.org/) with SQLite
- **Authentication**: JWT tokens with [python-jose](https://github.com/mpdavis/python-jose)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

### Development Tools
- **Linting**: [ESLint](https://eslint.org/)
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm
- **Version Control**: Git

## 📁 Project Structure

```
local-business-directory/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── businesses/    # Business data endpoint
│   │   │   └── institutions/  # Institution data endpoint
│   │   ├── businesses/        # Business directory page
│   │   ├── dashboard/         # Business owner dashboard
│   │   ├── events/           # Events page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   └── ...              # Page-specific components
│   └── lib/                 # Utilities and configurations
│       ├── api.ts           # API client functions
│       ├── types.ts         # TypeScript type definitions
│       └── utils.ts         # Helper functions
├── backend/                  # FastAPI backend
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── database.py          # Database configuration
│   ├── auth.py              # Authentication utilities
│   └── routers/             # API route handlers
├── public/                  # Static assets
├── data/                    # Static data files
├── scripts/                 # Utility scripts
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.8+ (for backend)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/coimbatore-student-directory.git
   cd coimbatore-student-directory
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up the backend** (optional, for full functionality)
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: Google Places API (for enhanced business data)
GOOGLE_PLACES_API_KEY=your_google_api_key_here

# Optional: Mapbox token (for Mapbox GL maps)
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# Database (SQLite by default, no configuration needed)
DATABASE_URL=sqlite:///./local_business.db
```

### Running the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Start the backend server** (in a separate terminal)
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

3. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### Building for Production

```bash
# Build the frontend
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Frontend API Routes (Next.js)

- `GET /api/businesses?lat={lat}&lng={lng}` - Fetch nearby businesses
- `GET /api/institutions` - Get educational institutions data

### Backend API (FastAPI)

- `GET /` - API root
- `GET /businesses/` - List businesses with filtering
- `GET /businesses/{id}` - Get specific business
- `POST /businesses/` - Create new business (authenticated)
- `PUT /businesses/{id}` - Update business (owner only)
- `GET /auth/token` - User authentication
- `POST /auth/register` - User registration
- `GET /events/` - List events

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and TypeScript conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- **OpenStreetMap** for geospatial data
- **Google Places API** for business information
- **Mapbox** for mapping services
- **Radix UI** for accessible components
- **Tailwind CSS** for utility-first styling

## 📞 Support

If you have any questions or need help:

- Open an issue on GitHub
- Contact: your.email@example.com

---

**Made with ❤️ for Coimbatore students and local businesses**
