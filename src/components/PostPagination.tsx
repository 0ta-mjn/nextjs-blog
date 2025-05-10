import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const VIEW_COUNT = 2;

export default function PostPagination({
  total,
  currentPage = 0,
  href,
  limit,
}: {
  total: number;
  limit: number;
  currentPage?: number;
  href: string;
}) {
  const pages = Array.from({ length: Math.ceil(total / limit) }, (_, i) => i);

  const previousPages = pages.slice(0, currentPage);
  const nextPages = pages.slice(currentPage + 1);

  return (
    <Pagination>
      <PaginationContent>
        {previousPages.length > 0 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={`${href}/${currentPage - 1}`} />
            </PaginationItem>

            {previousPages.length > VIEW_COUNT && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {previousPages.slice(-VIEW_COUNT).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href={`${href}/${page}`}>{page}</PaginationLink>
              </PaginationItem>
            ))}
          </>
        )}

        <PaginationItem>
          <PaginationLink href={`${href}/${currentPage}`} isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {nextPages.length > 0 && (
          <>
            {nextPages.slice(0, VIEW_COUNT).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href={`${href}/${page}`}>{page}</PaginationLink>
              </PaginationItem>
            ))}

            {nextPages.length > VIEW_COUNT && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext href={`${href}/${currentPage + 1}`} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
