import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AthleteCardProps {
  name: string;
  category: string;
  occurrenceCount: number;
  totalValue: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export function AthleteCard({ 
  name, 
  category, 
  occurrenceCount, 
  totalValue, 
  isSelected = false,
  onClick 
}: AthleteCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-primary border-primary bg-gradient-to-br from-primary/10 to-primary/5' 
          : 'bg-gradient-to-br from-card to-card/80 border-border/50 hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {category}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-destructive">
              {occurrenceCount}
            </div>
            <div className="text-xs text-muted-foreground">
              ocorrências
            </div>
            <div className="text-sm font-semibold text-accent mt-1">
              R$ {totalValue}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}