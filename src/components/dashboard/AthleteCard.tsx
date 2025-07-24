import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { User, AlertCircle, DollarSign } from "lucide-react";

interface AthleteCardProps {
  name: string;
  category: string;
  occurrenceCount: number;
  totalValue: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  fotoUrl?: string;
}

export function AthleteCard({ 
  name, 
  category, 
  occurrenceCount, 
  totalValue, 
  isSelected = false,
  onClick,
  className,
  fotoUrl
}: AthleteCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 group",
        isSelected 
          ? 'ring-2 ring-red-500 border-red-300 bg-gradient-to-br from-red-50 to-white' 
          : 'bg-white border border-red-100 hover:border-red-200',
        className
      )}
      style={{
        boxShadow: isSelected 
          ? '0 12px 40px rgba(229, 5, 15, 0.25)' 
          : '0 8px 32px rgba(0, 0, 0, 0.12)',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.18)';
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
        }
      }}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20 rounded-lg border-2 border-red-100 group-hover:border-red-200 transiti       {fotoUrl ? (
              <AvatarImage 
                src={fotoUrl} 
                alt={`Foto de ${name}`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-red-50 text-red-700 font-bold text-lg group-hover:bg-red-100 transiti
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-red-700 transiti
              {name}
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                <User className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end space-x-1">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-xl font-bold text-red-600">
                {occurrenceCount}
              </span>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              ocorrências
            </div>
            <div className="flex items-center justify-end space-x-1 mt-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-bold text-gray-700">
                R$ {totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

