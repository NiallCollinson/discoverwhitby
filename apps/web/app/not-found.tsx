export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-4">Could not find the requested resource</p>
        <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Return Home
        </a>
      </div>
    </div>
  )
}
