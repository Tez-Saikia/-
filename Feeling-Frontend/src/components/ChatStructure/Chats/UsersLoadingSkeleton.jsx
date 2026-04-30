function UsersLoadingSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          <div className="h-10 w-40 bg-gray-700/40 rounded-2xl"></div>
        </div>
      ))}
    </div>
  );
}

export default UsersLoadingSkeleton;