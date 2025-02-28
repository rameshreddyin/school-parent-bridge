
import { Announcement } from '../utils/mockData';
import { BellRing } from 'lucide-react';

interface AnnouncementCardProps {
  announcements: Announcement[];
}

const AnnouncementCard = ({ announcements }: AnnouncementCardProps) => {
  return (
    <div className="bg-white rounded-2xl card-shadow p-5 border animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Announcements</h3>
        <div className="bg-primary/10 text-primary rounded-full p-1.5">
          <BellRing size={18} />
        </div>
      </div>
      
      <div className="space-y-3">
        {announcements.map((announcement) => {
          const date = new Date(announcement.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          
          return (
            <div 
              key={announcement.id}
              className={`p-3 rounded-xl border transition-all duration-300 hover:border-primary/30 ${
                announcement.important ? 'bg-accent/20 border-accent' : 'bg-white'
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-sm">
                  {announcement.important && (
                    <span className="inline-block px-1.5 py-0.5 bg-accent text-accent-foreground text-xs rounded mr-1">
                      Important
                    </span>
                  )}
                  {announcement.title}
                </h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formattedDate}
                </span>
              </div>
              
              <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                {announcement.content}
              </p>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  From: {announcement.from}
                </span>
                <button className="text-xs text-primary hover:underline">Read more</button>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-center text-sm text-primary font-medium py-2 hover:underline">
        View All Announcements
      </button>
    </div>
  );
};

export default AnnouncementCard;
