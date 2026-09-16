export default function ProjectLoading() {
  return (
    <div className="container mx-auto px-6 max-w-7xl pt-8 pb-24 space-y-12 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="w-full">
          <div className="w-24 h-6 bg-surface-dark rounded-full mb-4" />
          <div className="w-3/4 h-12 bg-surface-dark rounded-xl mb-4" />
          <div className="w-1/2 h-6 bg-surface-dark rounded-xl" />
        </div>
        <div className="flex flex-col md:items-end gap-2 min-w-[200px]">
          <div className="w-24 h-4 bg-surface-dark rounded" />
          <div className="w-32 h-8 bg-surface-dark rounded" />
          <div className="w-20 h-4 bg-surface-dark rounded" />
        </div>
      </div>

      {/* Stats Strip Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-dark border border-white/10 rounded-xl p-6 flex flex-col items-center">
            <div className="w-20 h-4 bg-surface-darkest rounded mb-4" />
            <div className="w-16 h-8 bg-surface-darkest rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Main Column Skeleton */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8">
            <div className="w-1/3 h-6 bg-surface-darkest rounded mb-6" />
            <div className="w-full h-3 bg-surface-darkest rounded-full mb-4" />
            <div className="flex justify-between">
              <div className="w-8 h-4 bg-surface-darkest rounded" />
              <div className="w-32 h-4 bg-surface-darkest rounded" />
              <div className="w-10 h-4 bg-surface-darkest rounded" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="w-48 h-6 bg-surface-dark rounded" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface-dark border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-surface-darkest" />
                    <div>
                      <div className="w-32 h-4 bg-surface-darkest rounded mb-2" />
                      <div className="w-24 h-3 bg-surface-darkest rounded" />
                    </div>
                  </div>
                  <div className="w-20 h-4 bg-surface-darkest rounded" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-4 bg-surface-darkest rounded" />
                  <div className="w-5/6 h-4 bg-surface-darkest rounded" />
                  <div className="w-4/6 h-4 bg-surface-darkest rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-12">
          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8">
            <div className="w-32 h-6 bg-surface-darkest rounded mb-8" />
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-surface-darkest shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 bg-surface-darkest rounded" />
                    <div className="w-3/4 h-3 bg-surface-darkest rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-dark border border-white/10 rounded-2xl p-8">
            <div className="w-32 h-6 bg-surface-darkest rounded mb-6" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-surface-darkest rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
