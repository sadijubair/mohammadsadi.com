export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-600 space-y-4">

        <div className="flex flex-col md:flex-row justify-between gap-6">

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Sadi Blog
            </h3>
            <p className="max-w-md">
              Political, technology, Islamic and opinion-based writing.
              Independent ideas and thoughtful analysis.
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-900">Categories</p>
            <a href="/category/politics" className="block hover:text-blue-600">Politics</a>
            <a href="/category/tech" className="block hover:text-blue-600">Tech</a>
            <a href="/category/islam" className="block hover:text-blue-600">Islamic</a>
            <a href="/category/opinion" className="block hover:text-blue-600">Opinion</a>
          </div>

        </div>

        <div className="border-t pt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} Sadi. All rights reserved.
          <br />
          Content is for informational and opinion purposes only.
        </div>

      </div>
    </footer>
  )
}