
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, MapPin, Clock, Phone, Navigation, User } from 'lucide-react';

// Mock bus location data
const busData = {
  id: 'B001',
  routeNumber: '12A',
  driverName: 'Mr. Rajesh Kumar',
  driverPhone: '+91 98765 43210',
  currentLocation: 'Near City Mall, Sector 12',
  nextStop: 'Green Valley Apartments',
  estimatedArrival: '5 mins',
  status: 'on-route', // on-route, arrived, delayed
  lastUpdated: new Date(),
  completedStops: 2,
  totalStops: 8,
  morningPickupTime: '7:30 AM',
  afternoonDropTime: '3:15 PM',
  coordinates: { lat: 28.6139, lng: 77.2090 } // Demo coordinates (Delhi)
};

// Mock route stops
const routeStops = [
  { id: 1, name: 'School', time: '7:00 AM', status: 'completed' },
  { id: 2, name: 'Sector 5 Market', time: '7:15 AM', status: 'completed' },
  { id: 3, name: 'Green Valley Apartments', time: '7:25 AM', status: 'next' },
  { id: 4, name: 'City Park', time: '7:35 AM', status: 'pending' },
  { id: 5, name: 'Riverside Colony', time: '7:45 AM', status: 'pending' },
  { id: 6, name: 'Metro Station', time: '7:55 AM', status: 'pending' },
  { id: 7, name: 'Sector 18 Market', time: '8:05 AM', status: 'pending' },
  { id: 8, name: 'Final Stop', time: '8:15 AM', status: 'pending' }
];

const Transport = () => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [refreshTime, setRefreshTime] = useState(new Date());
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Mock progress calculation
  const progress = (busData.completedStops / busData.totalStops) * 100;

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-route': return 'bg-green-100 text-green-800';
      case 'arrived': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-route': return <Bus size={16} />;
      case 'arrived': return <MapPin size={16} />;
      case 'delayed': return <Clock size={16} />;
      default: return <Bus size={16} />;
    }
  };

  // Stop status styling
  const getStopStatusStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'next': return 'bg-amber-500 animate-pulse';
      default: return 'bg-gray-300';
    }
  };

  // Placeholder for map view instructions
  const handleMapView = () => {
    alert('This would open a full map view in a real app');
  };

  return (
    <Layout title="Transport" showBackButton>
      <div className="space-y-4">
        <Tabs defaultValue="tracking" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="info">Bus Information</TabsTrigger>
          </TabsList>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-4">
            {/* Bus Status Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="text-lg font-semibold">Route {busData.routeNumber}</h3>
                      <Badge className={getStatusColor(busData.status)}>
                        {getStatusIcon(busData.status)}
                        <span className="ml-1 capitalize">{busData.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Bus #{busData.id}</p>
                  </div>
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <Bus size={20} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-primary mr-2" />
                      <div>
                        <p className="text-xs text-muted-foreground">Current Location</p>
                        <p className="text-sm font-medium">{busData.currentLocation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next Stop</p>
                      <p className="text-sm font-medium">{busData.nextStop}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Bus Journey Progress</div>
                    <div className="text-xs text-muted-foreground">
                      {busData.completedStops}/{busData.totalStops} stops
                    </div>
                  </div>
                  
                  <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-1" />
                      <span>ETA: {busData.estimatedArrival}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Updated: {refreshTime.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleMapView}
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Mock Map Preview */}
            <Card className="overflow-hidden">
              <div 
                ref={mapContainerRef} 
                className="w-full h-40 bg-gray-100 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Map preview would appear here</p>
                </div>
                
                {/* Map overlay with current location pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -top-8 -left-16 bg-white p-1 rounded-md shadow-md text-xs whitespace-nowrap">
                      Bus is here
                    </div>
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white animate-pulse">
                      <Bus size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Route Stops */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Route Stops</h3>
              <div className="relative">
                <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                {routeStops.map((stop, index) => (
                  <div key={stop.id} className="flex items-start mb-3 relative z-10">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center mr-3 ${getStopStatusStyle(stop.status)}`}>
                      {stop.status === 'completed' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <span className="text-xs text-white">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className={`text-sm ${stop.status === 'next' ? 'font-medium' : ''}`}>{stop.name}</p>
                        <p className="text-xs text-muted-foreground">{stop.time}</p>
                      </div>
                      {stop.status === 'next' && (
                        <p className="text-xs text-amber-600">Arriving in approximately {busData.estimatedArrival}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bus Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <Bus className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Bus Number</span>
                    </div>
                    <span className="font-medium">{busData.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Route Number</span>
                    </div>
                    <span className="font-medium">{busData.routeNumber}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Morning Pickup</span>
                    </div>
                    <span className="font-medium">{busData.morningPickupTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Afternoon Drop</span>
                    </div>
                    <span className="font-medium">{busData.afternoonDropTime}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium mb-2">Driver Information</h3>
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{busData.driverName}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1" />
                        <span>{busData.driverPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Driver
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bus Rules & Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <span>Students must be at the bus stop 5 minutes before scheduled pickup time.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <span>Bus will not wait more than 1 minute at any stop.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <span>For any changes in pickup/drop schedule, inform the school 24 hours in advance.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2 mt-0.5">
                      <span className="text-xs">4</span>
                    </div>
                    <span>In case of emergency, contact school transport office at +91 98765 43210.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Transport;
