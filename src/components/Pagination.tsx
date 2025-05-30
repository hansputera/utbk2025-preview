import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm mt-6 sm:mt-8">
      <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left w-full sm:w-auto">
        Showing <span className="font-medium">
          {((currentPage - 1) * itemsPerPage) + 1}
        </span> to {" "}
        <span className="font-medium">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span> of {" "}
        <span className="font-medium">{totalItems}</span> items
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        {/* Mobile: Previous/Next Buttons Top */}
        <div className="flex w-full sm:hidden justify-between mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex-1 max-w-[48%] hover:bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex-1 max-w-[48%] hover:bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-50 text-xs sm:text-sm"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
          </Button>
        </div>
        
        {/* Page Numbers - Always visible */}
        <div className="flex items-center gap-1 overflow-x-auto w-full justify-center sm:justify-start pb-1 sm:pb-0">
          {/* Desktop: Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="hidden sm:flex hover:bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <div key={index} className="flex-shrink-0">
                {page === '...' ? (
                  <span className="px-2 sm:px-3 py-1.5 sm:py-2 text-slate-400 text-sm">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={`min-w-[32px] h-8 sm:min-w-[36px] sm:h-9 px-2 sm:px-3 text-xs sm:text-sm ${
                      currentPage === page 
                        ? "bg-slate-700 text-white hover:bg-slate-800" 
                        : "hover:bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {/* Desktop: Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="hidden sm:flex hover:bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-50 text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
