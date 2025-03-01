
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { announcementData } from '../utils/mockData';
import { Bell, Calendar, Search, Clock } from 'lucide-react';

const Announcements = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAnnouncements = announcementData.filter(announcement => {
    // Filter by category
    if (filter !== 'all' && filter === 'important') {
      if (!announcement.important) return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        announcement.title.toLowerCase().includes(query) ||
        announcement.content.toLowerCase().includes(query) ||
        announcement.from.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <Layout title="Announcements" showBackButton>
      <div className="space-y-4">
        <div className="relative">
          <Input 
            placeholder="Search announcements..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="important">Important</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 subtle-scroll">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="border-l-4 hover:bg-muted/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{announcement.title}</h3>
                        {announcement.important && (
                          <Badge variant="destructive" className="text-xs">Important</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center text-xs text-muted-foreground pt-1">
                        <div className="flex items-center mr-3">
                          <Bell className="h-3 w-3 mr-1" />
                          <span>{announcement.from}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(announcement.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(announcement.date).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No announcements found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;
