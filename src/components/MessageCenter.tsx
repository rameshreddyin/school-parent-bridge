
import { Message } from '../utils/mockData';
import { MessagesSquare } from 'lucide-react';

interface MessageCenterProps {
  messages: Message[];
}

const MessageCenter = ({ messages }: MessageCenterProps) => {
  const unreadCount = messages.filter(msg => !msg.read).length;
  
  return (
    <div className="bg-white rounded-2xl card-shadow p-5 border animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-lg">Messages</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` 
              : 'No new messages'}
          </p>
        </div>
        <div className="bg-primary/10 text-primary rounded-full p-1.5 relative">
          <MessagesSquare size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto subtle-scroll">
        {messages.map((message) => {
          const date = new Date(message.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });
          
          return (
            <div 
              key={message.id}
              className={`p-3 rounded-xl border transition-all duration-300 hover:border-primary/30 ${
                !message.read ? 'bg-primary/5 border-primary/20' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  {message.avatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={message.avatar} 
                        alt={message.from} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      {message.from.substring(0, 1)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-sm">{message.from}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {message.subject}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formattedDate}
                </span>
              </div>
              
              <p className="text-sm mt-2 text-muted-foreground line-clamp-2 ml-10">
                {message.content}
              </p>
              
              <div className="flex justify-end items-center mt-2">
                <button className="text-xs text-primary hover:underline">Read full message</button>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
        View All Messages
      </button>
    </div>
  );
};

export default MessageCenter;
