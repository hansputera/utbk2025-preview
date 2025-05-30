
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
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by name or UTBK number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 border-slate-200 focus:border-slate-500 focus:ring-slate-500 transition-all duration-200"
          />
        </div>
        <Badge 
          variant="outline" 
          className="text-sm px-4 py-2 bg-slate-50 border-slate-200 text-slate-700"
        >
          {meta?.total || 0} peserta ditemukan
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        </div>
      ) : (
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-100 transition-all duration-200">
              <TableHead 
                className="cursor-pointer hover:bg-slate-100 font-semibold text-slate-700 transition-all duration-200 select-none"
                onClick={handleSort}
              >
                <div className="flex items-center gap-2">
                  Nama
                  {sortOrder === "asc" ? 
                    <ChevronUp className="h-4 w-4 text-slate-500" /> : 
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  }
                </div>
              </TableHead>
              <TableHead className="font-semibold text-slate-700">Nomor UTBK</TableHead>
              <TableHead className="font-semibold text-slate-700">Jurusan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passers.map((passer, index) => (
              <TableRow 
                key={passer.id} 
                className="hover:bg-slate-50 transition-all duration-200 border-slate-100"
                style={{ animationDelay: `${index * 0.02}s` }}
              >
                <TableCell className="font-medium text-slate-900">{passer.name}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-slate-100 rounded text-sm font-mono text-slate-600">
                    {passer.utbkNumber}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700">
                    {passer.program}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      {meta && meta.pages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, meta.total)}</span> of{" "}
            <span className="font-medium">{meta.total}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="hover:bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {meta.total >= 1000 && (
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-slate-400">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page as number)}
                        className={currentPage === page 
                          ? "bg-slate-900 text-white hover:bg-slate-800" 
                          : "hover:bg-slate-50 border-slate-200 text-slate-600"
                        }
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {meta.total < 1000 && (
              <div className="px-4 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 text-slate-700 font-medium">
                Page {currentPage} of {meta.pages}
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(meta.pages, currentPage + 1))}
              disabled={currentPage === meta.pages}
              className="hover:bg-slate-50 border-slate-200 text-slate-600 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassersTable;
