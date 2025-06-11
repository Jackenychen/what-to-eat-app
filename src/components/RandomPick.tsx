'use client';

interface RandomPickProps {
  menuList: string[];
  selectedDish: string;
  showResult: boolean;
  onRandomPick: () => void;
}

export default function RandomPick({
  menuList,
  selectedDish,
  showResult,
  onRandomPick
}: RandomPickProps) {
  return (
    <>
      {/* 随机选择区域 */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-xl p-8 mb-6">
        <div className="text-center">
          <button
            onClick={onRandomPick}
            className="w-full max-w-md py-6 bg-gradient-to-r from-red-500 to-orange-500 text-white text-2xl font-bold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🎲 今天吃什么
          </button>
          <p className="text-gray-600 mt-4 text-sm">
            {menuList.length > 0
              ? `从 ${menuList.length} 道菜中为你随机选择`
              : '将从常见菜品中为你随机选择，也可以在下方添加自己的菜品'
            }
          </p>
        </div>
      </div>

      {/* 结果显示 */}
      {showResult && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-xl shadow-2xl p-8 mb-6 text-center relative overflow-hidden animate-in slide-in-from-top duration-500">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-red-300/20 animate-pulse"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-6 drop-shadow-lg animate-bounce">🎉 今天就吃：</h3>
            <div className="bg-white rounded-2xl py-8 px-10 inline-block transform hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-white/50 backdrop-blur-sm">
              <div className="text-6xl font-bold text-gray-800 mb-4 animate-pulse">🍴</div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                {selectedDish}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center relative z-10">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: '今天吃什么',
                    text: `今天决定吃：${selectedDish}！`,
                  });
                } else {
                  navigator.clipboard?.writeText(`今天决定吃：${selectedDish}！`);
                }
              }}
              className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/30"
            >
              📱 分享结果
            </button>
          </div>
        </div>
      )}
    </>
  );
}
