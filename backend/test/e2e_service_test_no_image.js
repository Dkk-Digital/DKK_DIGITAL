import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
import axios from 'axios';

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post(`${BASE}/auth/login`, { email: adminEmail, password: adminPassword });
    const token = loginRes.data.token;
    console.log('✓ Logged in');

    // Create service without image
    console.log('Creating service (no image)...');
    const createRes = await axios.post(
      `${BASE}/services`,
      {
        title: 'E2E No-Image Service',
        description: 'Created by E2E no-image test',
        shortDescription: 'E2E Short',
        price: 11111,
        category: 'SEO',
        features: ['x', 'y'],
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const service = createRes.data.service || createRes.data;
    console.log('✓ Created service:', service._id || service.id);

    await sleep(500);

    // Update service (change title)
    console.log('Updating service title...');
    await axios.put(
      `${BASE}/services/${service._id || service.id}`,
      { title: 'E2E Updated No-Image', price: 22222 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Updated service');

    // Delete service
    console.log('Deleting service...');
    await axios.delete(`${BASE}/services/${service._id || service.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✓ Deleted service');

    console.log('E2E no-image test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('E2E no-image test failed:', err.response?.data || err.message || err);
    process.exit(1);
  }
};

run();
