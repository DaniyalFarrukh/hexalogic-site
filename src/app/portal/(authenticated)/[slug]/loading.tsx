export default function ProjectLoading() {
  return (
    <div className="w-full max-w-[1600px] mx-auto pb-8 space-y-6 md:space-y-8 animate-pulse" aria-busy="true" aria-label="Loading project">
      {/* Header skeleton */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 w-full md:w-2/3">
          <div className="h-7 w-2/3 bg-gray-200 rounded-lg" />
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="h-4 w-1/2 bg-gray-100 rounded" />
          <div className="h-2 w-full bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 p-5 md:p-6 rounded-2xl space-y-3">
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl min-h-[600px] overflow-hidden">
          <div className="flex gap-6 px-6 py-5 border-b border-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-16 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="p-6 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </div>
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-5/6 bg-gray-100 rounded" />
                <div className="h-3 w-4/6 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
              <div className="h-5 w-1/2 bg-gray-200 rounded" />
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-3 w-1/3 bg-gray-100 rounded" />
                  <div className="h-3 w-1/4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
