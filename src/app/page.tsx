'use client';

import { useState, useEffect } from 'react';
import AddMenu from '@/components/AddMenu';
import MenuList from '@/components/MenuList';
import RandomPick from '@/components/RandomPick';

export default function Home() {
  const [menuList, setMenuList] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从数据库加载菜单
  useEffect(() => {
    loadDishesFromDB();
  }, []);

  // 从数据库加载菜品
  const loadDishesFromDB = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/dishes');
      const result = await response.json();

      if (result.success) {
        setMenuList(result.data);
      } else {
        setError(result.error || '加载菜品失败');
      }
    } catch (error) {
      console.error('Error loading dishes:', error);
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  // 添加菜品
  const addDish = async () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedValue }),
      });

      const result = await response.json();

      if (result.success) {
        setMenuList(result.data);
        setInputValue('');
      } else {
        setError(result.error || '添加菜品失败');
      }
    } catch (error) {
      console.error('Error adding dish:', error);
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  // 删除菜品
  const deleteDish = async (dishToDelete: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dishes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: dishToDelete }),
      });

      const result = await response.json();

      if (result.success) {
        setMenuList(result.data);
      } else {
        setError(result.error || '删除菜品失败');
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  // 随机选择菜品
  const randomPick = async () => {
    let currentMenu = menuList;

    // 如果当前菜单为空，自动使用预设菜品并添加到数据库
    if (currentMenu.length === 0) {
      try {
        setLoading(true);
        const response = await fetch('/api/dishes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dishes: presetDishes }),
        });

        const result = await response.json();
        if (result.success) {
          currentMenu = result.data;
          setMenuList(currentMenu);
        } else {
          // 如果添加失败，使用预设菜品进行随机选择
          currentMenu = presetDishes;
        }
      } catch (error) {
        console.error('Error adding preset dishes:', error);
        // 如果网络错误，使用预设菜品进行随机选择
        currentMenu = presetDishes;
      } finally {
        setLoading(false);
      }
    }

    if (currentMenu.length > 0) {
      const randomIndex = Math.floor(Math.random() * currentMenu.length);
      setSelectedDish(currentMenu[randomIndex]);
      setShowResult(true);
    }
  };

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addDish();
    }
  };

  // 预设菜品数据
  const presetDishes = [
    '红烧肉', '糖醋排骨', '宫保鸡丁', '鱼香肉丝', '麻婆豆腐',
    '回锅肉', '青椒肉丝', '蒜泥白肉', '水煮鱼', '口水鸡',
    '酸辣土豆丝', '蒜蓉菠菜', '清炒小白菜', '番茄炒蛋', '韭菜炒蛋',
    '红烧鲫鱼', '清蒸鲈鱼', '白灼虾', '油爆虾', '糟凤爪',
    '腌笃鲜', '三鲜汤', '萝卜煨肉汤', '荠菜豆腐羹', '蘑菇汤'
  ];

  // 添加预设菜品
  const addPresetDishes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dishes: presetDishes }),
      });

      const result = await response.json();

      if (result.success) {
        setMenuList(result.data);
      } else {
        setError(result.error || '添加预设菜品失败');
      }
    } catch (error) {
      console.error('Error adding preset dishes:', error);
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  // 清空所有菜品
  const clearAllDishes = async () => {
    if (!window.confirm('确定要清空所有菜品吗？')) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dishes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clearAll: true }),
      });

      const result = await response.json();

      if (result.success) {
        setMenuList(result.data);
        setShowResult(false);
      } else {
        setError(result.error || '清空菜品失败');
      }
    } catch (error) {
      console.error('Error clearing dishes:', error);
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-8">
          🍽️ 今天吃什么？
        </h1>

        {/* 随机选择区域 - 移到最上面 */}
        <RandomPick
          menuList={menuList}
          selectedDish={selectedDish}
          showResult={showResult}
          onRandomPick={randomPick}
        />

        {/* 分隔线和管理区域标题 */}
        <div className="my-8">
          <div className="border-t border-gray-200 mb-6"></div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">📝 菜品管理</h2>
            <p className="text-gray-500">添加和管理你的菜品列表</p>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 添加菜品区域 */}
        <AddMenu
          inputValue={inputValue}
          setInputValue={setInputValue}
          onAddDish={addDish}
          onKeyPress={handleKeyPress}
          loading={loading}
        />

        {/* 快速添加预设菜品 */}
        {menuList.length === 0 && !loading && (
          <div className="bg-blue-50 rounded-lg shadow-lg p-6 mb-6 border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">快速开始</h2>
            <p className="text-blue-600 mb-4">还没有菜品？试试添加一些常见的菜品吧！</p>
            <button
              onClick={addPresetDishes}
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🍽️ 添加常见菜品
            </button>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className="bg-gray-50 rounded-lg shadow-lg p-6 mb-6 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
              <p className="text-gray-600">正在处理中...</p>
            </div>
          </div>
        )}

        {/* 菜品列表 */}
        <MenuList
          menuList={menuList}
          onDeleteDish={deleteDish}
          onClearAll={clearAllDishes}
        />

        {/* 统计信息 */}
        {menuList.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-600">
              📊 当前有 <span className="font-bold text-orange-500">{menuList.length}</span> 道菜品
              {menuList.length >= 10 && <span className="ml-2">🎉 选择丰富！</span>}
            </p>
          </div>
        )}

        {/* 页脚 */}
        <footer className="text-center text-gray-500 mt-8">
          <p>🍽️ 让选择变得简单，让用餐变得有趣！</p>
          <p className="text-sm mt-2">💡 小贴士：添加更多菜品，让选择更有趣</p>
        </footer>
      </div>
    </div>
  );
}
