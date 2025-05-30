
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiService } from "../services/api";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PassersTableProps {
  ptnCode: string;
  programCode: string;
  programName: string;
}

const PassersTable = ({ ptnCode, programCode, programName }: PassersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const itemsPerPage = 50; // Use larger page size for API

  const { data: passersResponse, isLoading } = useQuery({
    queryKey: ['passers', ptnCode, programCode, currentPage, searchTerm],
    queryFn: () => apiService.getPassers(ptnCode, programCode, currentPage, itemsPerPage, searchTerm || undefined),
  });

  const passers = passersResponse?.data || [];
  const meta = passersResponse?.meta;

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setCurrentPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const totalPages = meta?.pages || 1;
    
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

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Count */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Cari nama atau nomor UTBK..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 text-sm sm:text-base border-slate-200 focus:border-slate-500 focus:ring-slate-500 transition-all duration-200 h-10 sm:h-11"
          />
        </div>
        <div className="shrink-0">
          <Badge 
            variant="outline" 
            className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-50 border-slate-200 text-slate-700 whitespace-nowrap"
          >
            {meta?.total || 0} peserta ditemukan
          </Badge>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 sm:py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {passers.map((passer) => (
              <div key={passer.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-slate-900 text-sm">{passer.name}</h3>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] bg-slate-50 border-slate-200 text-slate-700 whitespace-normal text-left"
                  >
                    {passer.program}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded font-mono break-all">
                  {passer.utbkNumber}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-100">
                    <TableHead 
                      className="cursor-pointer px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap"
                      onClick={handleSort}
                    >
                      <div className="flex items-center gap-1.5">
                        Nama
                        {sortOrder === "asc" ? 
                          <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" /> : 
                          <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500" />
                        }
                      </div>
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Nomor UTBK
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                      Jurusan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passers.map((passer, index) => (
                    <TableRow 
                      key={passer.id} 
                      className="hover:bg-slate-50 border-slate-100"
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <TableCell className="px-4 py-3 text-sm sm:text-base font-medium text-slate-900">
                        {passer.name}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <code className="px-2 py-1 text-xs sm:text-sm bg-slate-100 rounded font-mono text-slate-600 break-all">
                          {passer.utbkNumber}
                        </code>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className="text-xs sm:text-sm bg-slate-50 border-slate-200 text-slate-700 whitespace-normal text-left"
                        >
                          {passer.program}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {meta && meta.pages > 1 && (
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
          {/* Mobile Pagination */}
          <div className="sm:hidden flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex-1 justify-center gap-1 h-9"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Sebelumnya</span>
              </Button>
              <div className="px-3 py-1.5 text-sm bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-medium">
                {currentPage}/{meta.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(meta.pages, currentPage + 1))}
                disabled={currentPage === meta.pages}
                className="flex-1 justify-center gap-1 h-9"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-slate-500">
              Menampilkan <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, meta.total)}</span> dari{' '}
              <span className="font-medium">{meta.total}</span> data
            </p>
          </div>
          
          {/* Desktop Pagination */}
          <div className="hidden sm:flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Menampilkan <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> sampai{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, meta.total)}</span> dari{' '}
              <span className="font-medium">{meta.total}</span> data
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 px-3 gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Sebelumnya</span>
              </Button>
              
              {meta.total >= 1000 ? (
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-2 py-1 text-slate-400">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page as number)}
                          className={`h-9 min-w-9 px-2 ${currentPage === page ? 'bg-slate-900 text-white' : 'text-slate-700'}`}
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-1.5 text-sm bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-medium">
                  Halaman {currentPage} dari {meta.pages}
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(meta.pages, currentPage + 1))}
                disabled={currentPage === meta.pages}
                className="h-9 px-3 gap-1"
              >
                <span className="sr-only sm:not-sr-only">Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassersTable;
