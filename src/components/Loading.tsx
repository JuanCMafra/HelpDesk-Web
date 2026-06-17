export function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-gray-600 rounded-[10px] p-20 flex flex-row items-center gap-4">
        <span className="text-lg text-gray-200">Carregando</span>

        <div className="flex gap-2 pt-3">
          <span className="w-2 h-2 rounded-full bg-blue-base animate-bounce" />

          <span
            className="w-2 h-2 rounded-full bg-blue-base animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />

          <span
            className="w-2 h-2 rounded-full bg-blue-base animate-bounce"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
}
