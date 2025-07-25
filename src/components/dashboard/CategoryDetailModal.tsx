import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from 'lucide-react';

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  month: string;
  count: number;
  color: string;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  isOpen,
  onClose,
  category,
  month,
  count,
  color,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-bold" style={{ color: color }}>
            Detalhes da Categoria
          </DialogTitle>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
            <X size={20} />
          </button>
        </DialogHeader>
        <DialogDescription>
          <p className="text-lg mb-2">Categoria: <span className="font-semibold" style={{ color: color }}>{category}</span></p>
          <p className="text-lg mb-2">Mês: <span className="font-semibold">{month}</span></p>
          <p className="text-lg">Contagem: <span className="font-semibold">{count}</span></p>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

