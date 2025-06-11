'use client';

interface AddMenuProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onAddDish: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  loading?: boolean;
}

export default function AddMenu({ inputValue, setInputValue, onAddDish, onKeyPress, loading = false }: AddMenuProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">添加菜品</h2>
      <div className="flex gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="输入菜名..."
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          onClick={onAddDish}
          disabled={!inputValue.trim() || loading}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              添加中...
            </div>
          ) : (
            '添加'
          )}
        </button>
      </div>
    </div>
  );
}
