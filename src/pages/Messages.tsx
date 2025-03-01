
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { messageData } from '../utils/mockData';
import { Search, MessageSquare, Clock } from 'lucide-react';

const Messages = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messageData.filter(message => {
    // Filter by read/unread
    if (filter === 'unread' && message.read) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        message.from.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Layout title="Messages" showBackButton>
      <div className="space-y-4">
        <div className="relative">
          <Input 
            placeholder="Search messages..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 subtle-scroll">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <Card 
                key={message.id} 
                className={`hover:bg-muted/20 transition-colors ${!message.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      {message.avatar && <AvatarImage src={message.avatar} alt={message.from} />}
                      <AvatarFallback>{getInitials(message.from)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm font-medium truncate ${!message.read ? 'font-semibold' : ''}`}>
                          {message.from}
                        </h3>
                        <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(message.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short'
                          })}</span>
                        </div>
                      </div>
                      <h4 className={`text-sm truncate ${!message.read ? 'font-medium' : ''}`}>
                        {message.subject}
                        {!message.read && (
                          <Badge className="ml-2 text-[10px] h-4" variant="default">New</Badge>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>No messages found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
