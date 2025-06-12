// 测试 API 的脚本
const testAPI = async () => {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  console.log('Testing API at:', baseUrl);
  
  try {
    // 测试健康检查
    console.log('\n1. Testing health check...');
    const healthResponse = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('Health check result:', healthData);
    
    // 测试获取菜品
    console.log('\n2. Testing get dishes...');
    const dishesResponse = await fetch(`${baseUrl}/api/dishes`);
    const dishesData = await dishesResponse.json();
    console.log('Get dishes result:', dishesData);
    
    // 测试添加菜品
    console.log('\n3. Testing add dish...');
    const addResponse = await fetch(`${baseUrl}/api/dishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: '测试菜品' }),
    });
    const addData = await addResponse.json();
    console.log('Add dish result:', addData);
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

testAPI();
