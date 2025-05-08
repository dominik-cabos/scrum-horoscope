// src/components/Loading.tsx
export default function Loading() {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-500">Loading...</span>
                </div>
            </div>
        </div>
    );
}
