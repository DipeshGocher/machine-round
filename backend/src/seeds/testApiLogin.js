const testApi = async () => {
  const testUsers = [
    { email: 'dipesh@gmail.com', password: 'Dipesh@123' },
    { email: 'rahul@gmail.com', password: 'Rahul@123' },
    { email: 'staff@gmail.com', password: 'Staff@123' }
  ];

  for (const user of testUsers) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        console.log(`✅ API Login SUCCESS for ${user.email}: Role = ${data.data?.user?.role}`);
      } else {
        console.log(`❌ API Login FAILED for ${user.email}: ${data.message}`);
      }
    } catch (err) {
      console.log(`❌ API Error for ${user.email}: ${err.message}`);
    }
  }
};

testApi();
