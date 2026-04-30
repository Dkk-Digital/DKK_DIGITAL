import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const sampleImage = path.resolve(process.cwd(), 'frontend/public/logo.png');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const run = async () => {
  try {
    console.log('ENV adminEmail:', adminEmail);
    console.log('ENV adminPassword:', adminPassword ? '***' : null);
    console.log('Logging in as admin...');
    const loginRes = await axios.post(`${BASE}/auth/login`, { email: adminEmail, password: adminPassword });
    const token = loginRes.data.token;
    console.log('✓ Logged in');

    // Create service
    console.log('Creating service with image...');
    const fd = new FormData();
    fd.append('title', 'E2E Test Service');
    fd.append('description', 'Created by E2E test');
    fd.append('shortDescription', 'E2E Short');
    fd.append('price', '12345');
    fd.append('category', 'SEO');
    fd.append('features', 'a,b,c');
    fd.append('image', fs.createReadStream(sampleImage));

    const createRes = await axios.post(`${BASE}/services`, fd, {
      headers: { ...fd.getHeaders(), Authorization: `Bearer ${token}` },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const service = createRes.data.service || createRes.data;
    console.log('✓ Created service:', service._id || service.id);

    // Wait a moment for Cloudinary to finalize
    await sleep(1500);

    // Update service (change title)
    console.log('Updating service title...');
    const fd2 = new FormData();
    fd2.append('title', 'E2E Updated Service');
    fd2.append('price', '54321');
    // reuse same image
    fd2.append('image', fs.createReadStream(sampleImage));

    const updateRes = await axios.put(`${BASE}/services/${service._id || service.id}`, fd2, {
      headers: { ...fd2.getHeaders(), Authorization: `Bearer ${token}` },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log('✓ Updated service');

    // Delete service
    console.log('Deleting service...');
    await axios.delete(`${BASE}/services/${service._id || service.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('✓ Deleted service');

    console.log('E2E test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('E2E test failed:', err.response?.data || err.message || err);
    process.exit(1);
  }
};

run();
