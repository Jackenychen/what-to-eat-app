'use client';

interface MenuListProps {
  menuList: string[];
  onDeleteDish: (dish: string) => void;
  onClearAll?: () => void;
}

export default function MenuList({ menuList, onDeleteDish, onClearAll }: MenuListProps) {
  // 为每个菜品生成随机的背景色
  const getCardColor = (index: number) => {
    const colors = [
      'from-orange-50 to-red-50 border-orange-200 hover:border-orange-300',
      'from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300',
      'from-red-50 to-pink-50 border-red-200 hover:border-red-300',
      'from-pink-50 to-rose-50 border-pink-200 hover:border-pink-300',
      'from-green-50 to-emerald-50 border-green-200 hover:border-green-300',
      'from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300',
      'from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300',
      'from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-300',
    ];
    return colors[index % colors.length];
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">菜品列表 ({menuList.length})</h2>
        {menuList.length > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            🗑️ 清空所有
          </button>
        )}
      </div>
      {menuList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">快添加你的第一个菜吧~ 🥘</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {menuList.map((dish, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${getCardColor(index)} border-2 rounded-xl p-4 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 filter drop-shadow-sm">🥘</div>
                <div className="text-sm font-semibold text-gray-700 leading-tight min-h-[2.5rem] flex items-center justify-center" title={dish}>
                  <span className="line-clamp-2">{dish}</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteDish(dish);
                }}
                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
                title="删除这道菜"
              >
                ×
              </button>
              {/* 添加一个微妙的选中效果 */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 to-red-400/0 group-hover:from-orange-400/5 group-hover:to-red-400/5 rounded-xl transition-all duration-300"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
