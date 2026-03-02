import LandingPage from './pages/LandingPage';
import AuthPage from './pages/auth/AuthPage';
import BuyerDashboard from './pages/dashboard/BuyerDashboard';
import SavedPropertiesPage from './pages/dashboard/SavedPropertiesPage';
import AIPropertyMatchPage from './pages/dashboard/AIPropertyMatchPage';
import BrokerDashboard from './pages/broker/BrokerDashboard';
import AddPropertyPage from './pages/broker/AddPropertyPage';
import PropertyDetailPage from './pages/property/PropertyDetailPage';
import AllPropertiesPage from './pages/property/AllPropertiesPage';
import MarketAnalyticsPage from './pages/market/MarketAnalyticsPage';
import MessagesPage from './pages/messages/MessagesPage';
import ProfilePage from './pages/profile/ProfilePage';
import ReclaimSeekerDashboard from './pages/reclaim/ReclaimSeekerDashboard';
import ReclaimHelperDashboard from './pages/reclaim/ReclaimHelperDashboard';
import AIHomeFinderPage from './pages/ai/AIHomeFinderPage';
import EmergencyHousingPage from './pages/emergency/EmergencyHousingPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Landing',
    path: '/',
    element: <LandingPage />
  },
  {
    name: 'Auth',
    path: '/auth',
    element: <AuthPage />
  },
  {
    name: 'All Properties',
    path: '/properties',
    element: <AllPropertiesPage />
  },
  {
    name: 'Emergency Housing',
    path: '/emergency-housing',
    element: <EmergencyHousingPage />
  },
  {
    name: 'Home Finder',
    path: '/ai-finder',
    element: <AIHomeFinderPage />
  },
  {
    name: 'Emergency Housing Seeker Dashboard',
    path: '/emergency/seeker',
    element: <ReclaimSeekerDashboard />
  },
  {
    name: 'Emergency Housing Helper Dashboard',
    path: '/emergency/helper',
    element: <ReclaimHelperDashboard />
  },
  {
    name: 'Resident Dashboard',
    path: '/dashboard',
    element: <BuyerDashboard />
  },
  {
    name: 'Saved Properties',
    path: '/dashboard/saved',
    element: <SavedPropertiesPage />
  },
  {
    name: 'AI Property Match',
    path: '/dashboard/match',
    element: <AIPropertyMatchPage />
  },
  {
    name: 'Housing Partner Dashboard',
    path: '/broker',
    element: <BrokerDashboard />
  },
  {
    name: 'Add Property',
    path: '/broker/add-property',
    element: <AddPropertyPage />
  },
  {
    name: 'Property Detail',
    path: '/property/:id',
    element: <PropertyDetailPage />
  },
  {
    name: 'Market Analytics',
    path: '/market',
    element: <MarketAnalyticsPage />
  },
  {
    name: 'Messages',
    path: '/messages',
    element: <MessagesPage />
  },
  {
    name: 'Profile',
    path: '/profile',
    element: <ProfilePage />
  }
];

export default routes;
