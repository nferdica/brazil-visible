export default function DocsLoading() {
  return (
    <div className="animate-pulse space-y-6 py-8">
      {/* Title skeleton */}
      <div className="h-8 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />

      {/* Badges row */}
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-6 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-6 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Content lines */}
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-4/6 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Table skeleton */}
      <div className="space-y-2 pt-4">
        <div className="h-10 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-8 w-full rounded bg-neutral-100 dark:bg-neutral-800/50" />
        <div className="h-8 w-full rounded bg-neutral-100 dark:bg-neutral-800/50" />
        <div className="h-8 w-full rounded bg-neutral-100 dark:bg-neutral-800/50" />
      </div>

      {/* More content */}
      <div className="space-y-3 pt-4">
        <div className="h-6 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
