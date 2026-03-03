import { getSidebar } from '@/lib/content';
import { DocsSidebar } from '@/components/docs-sidebar';
import { MobileSidebar } from '@/components/mobile-sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const sidebar = getSidebar();

  return (
    <div className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 lg:px-8">
      <div className="flex gap-8 py-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 pr-2 -mr-2">
            <DocsSidebar categories={sidebar} />
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Mobile sidebar trigger */}
          <div className="mb-4 lg:hidden">
            <MobileSidebar categories={sidebar} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
