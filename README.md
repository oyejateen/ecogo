# EcoGo

EcoGo is a mobile application for discovering and collecting natural species using AI-powered image recognition. The app allows users to identify plants, animals, and other natural elements through their camera, save them to a personal collection, and share discoveries with the community.

## Demo


https://github.com/user-attachments/assets/adc0bfd9-62da-4814-a481-c927525980eb


## Features

- **AI-Powered Species Identification**: Identify plants, animals, and fungi using the camera
- **Personal Discovery Library**: Save and organize your discoveries
- **Community Feed**: Share your findings with other users and see their discoveries
- **Location Tagging**: Map where you found each species
- **User Profiles**: Track your discovery statistics and manage preferences

## Technology Stack

- **Frontend**: React Native (Expo)
- **Authentication**: Firebase Auth
- **Database**: MongoDB Atlas
- **Storage**: Firebase Storage
- **AI Recognition**: Google Gemini Vision API
- **Location Services**: Expo Location
- **UI Framework**: NativeWind + Shadcn UI
- **Animation**: Framer Motion
- **Analytics**: Firebase Analytics

## Getting Started

### Prerequisites

- Node.js (v20 or newer)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Start the development server
   ```bash
   npm start
   ```

### Running on a Device

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Project Structure

- `/app`: Main application screens and navigation
- `/components`: Reusable UI components
- `/hooks`: Custom React hooks
- `/services`: API and service integrations
- `/contexts`: React Context providers
- `/assets`: Images, fonts, and other static assets

## Documentation

- [Development Plan](./DEVELOPMENT_PLAN.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Firebase Setup](./FIREBASE_SETUP.md)

## License

This project is licensed under the MIT License.

## Acknowledgments

- Thanks to all contributors who have helped build EcoGo
- Inspired by a passion for nature conservation and biodiversity awareness 
