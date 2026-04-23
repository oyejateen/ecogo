# EcoGo Project Documentation

## Project Overview

EcoGo is a mobile application designed to connect users with nature through technology. The app enables users to identify plants, animals, and other natural elements using AI-powered image recognition, build a personal collection of discoveries, and share findings with the community.

### Key Goals

- **Promote nature exploration** by providing tools for species identification
- **Build a knowledge base** of local flora and fauna through user contributions
- **Foster a community** of nature enthusiasts through shared discoveries
- **Increase awareness** of biodiversity and conservation

## Technical Stack

The application is built using the following technologies:

- **Frontend Framework**: React Native with Expo
- **Navigation**: Expo Router v4
- **Authentication**: Firebase Authentication
- **Database**: MongoDB Atlas
- **Storage**: Firebase Storage
- **AI Recognition**: Google Gemini Vision API
- **Location Services**: Expo Location
- **UI Styling**: React Native StyleSheet (previously used NativeWind)

## Core Features & Screens

### Authentication Flow

- **Welcome Screen** (`app/(auth)/welcome.tsx`): Entry point with app introduction and login/register options
- **Login Screen** (`app/(auth)/login.tsx`): User authentication with email/password and Google sign-in
- **Register Screen** (`app/(auth)/register.tsx`): New user registration
- **Forgot Password** (`app/(auth)/forgot-password.tsx`): Password recovery functionality

### Main Navigation Tabs

- **Home Screen** (`app/(tabs)/index.tsx`): Dashboard with recent discoveries, quick actions, and community activities
- **Discover Screen** (`app/(tabs)/discover.tsx`): Interactive games and learning activities related to nature
- **Camera Tab** (routes to Camera Screen): Central action button for capturing new discoveries
- **Library Screen** (`app/(tabs)/library.tsx`): Collection of user's personal discoveries
- **Profile Screen** (`app/(tabs)/profile.tsx`): User profile with discovery history and account management

### Core Functionality

- **Camera Screen** (`app/camera.tsx`): Species capture interface with camera access
- **Image Preview** (`app/image-preview.tsx`): Review and crop captured images
- **AI Review** (`app/ai-review.tsx`): AI-powered species identification using Google Gemini Vision API
- **Image Detail** (`app/image-detail.tsx`): Detailed view of a discovery with species information
- **Settings** (`app/settings.tsx`): App configuration, privacy settings, and account management

## Services & Integrations

### Authentication Service

The app uses Firebase Authentication for user management:
- Email/password authentication
- Google OAuth integration
- User profile management
- Secure session handling

### AI Species Recognition

Integration with Google Gemini Vision API for:
- Plant and animal species identification
- Classification and taxonomy
- Scientific and common name retrieval
- Confidence scoring

### Geolocation Services

Using Expo Location for:
- Capturing geographic coordinates of discoveries
- Mapping functionality
- Location-based features and search

### Data Storage

- **User Data**: MongoDB Atlas for user profiles and relationships
- **Media Storage**: Firebase Storage for discovery images
- **Local Cache**: AsyncStorage for offline data persistence

## Project Structure

```
ecogo-new/
├── app/                  # Main application screens using Expo Router
│   ├── (auth)/           # Authentication flow screens
│   ├── (tabs)/           # Main tab navigation screens
│   └── _layout.tsx       # Root layout with navigation configuration
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers (Auth, etc.)
│   ├── screens/          # Screen implementations
│   │   └── main/         # Core screen functionality
│   ├── services/         # API integration and services
│   ├── theme/            # UI theme and styling
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── assets/               # Images, fonts, and static resources
├── components/           # Root-level shared components
├── constants/            # Application constants and configuration
├── global.css            # Global styles (previously for NativeWind)
└── index.js              # Application entry point
```

## Setup Instructions

### Prerequisites

- Node.js (v20 or newer)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Google Cloud Configuration (for Gemini Vision API)
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id

# MongoDB Atlas Configuration
MONGODB_URI=your_mongodb_uri
MONGODB_DB_NAME=ecogo

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other Configuration
EXPO_PUBLIC_APP_NAME=EcoGo
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Development Challenges & Solutions

### Navigation Architecture

The app uses Expo Router for a file-system based routing approach:
- Group routing with `(auth)`, `(tabs)` directories
- Dynamic routing for details pages using parameters
- Nested navigation for complex flows

### Authentication Flow

Implemented a protected routes system in `app/_layout.tsx` that:
- Redirects unauthorized users to the welcome screen
- Routes authenticated users to the main application
- Preserves navigation state during authentication changes

### Offline Capabilities

For areas with limited connectivity, the app implements:
- Local storage of discoveries until connectivity is restored
- Offline authentication persistence
- Image caching for previously viewed content

## Future Enhancements

### Planned Features

1. **Community Feed**: Social sharing of discoveries with commenting and liking
2. **Challenges & Achievements**: Gamification elements to encourage exploration
3. **Advanced Filtering**: Search and filter discoveries by species, location, etc.
4. **Educational Content**: Structured learning about different ecosystems and species
5. **Conservation Integration**: Connecting users with conservation initiatives

### Technical Roadmap

1. Implement background sync for offline data
2. Add push notifications for community engagement
3. Enhance AR capabilities for immersive nature exploration
4. Optimize performance for low-end devices
5. Expand platform support to web and desktop 
