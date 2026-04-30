import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

const BASE = `http://localhost:${process.env.PORT || 5000}/api`;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const sampleImage = path.resolve(process.cwd(), 'frontend/public/logo.png');

const run = async () => {
  try {
    const loginRes = await axios.post(`${BASE}/auth/login`, { email: adminEmail, password: adminPassword });
    const token = loginRes.data.token;

    const createForm = new FormData();
    createForm.append('title', 'E2E Blog Test');
    createForm.append('content', '<p>Created by blog E2E test.</p>');
    createForm.append('excerpt', 'Blog E2E excerpt');
    createForm.append('category', 'SEO');
    createForm.append('tags', 'e2e,blog,test');
    createForm.append('published', 'true');
    createForm.append('image', fs.createReadStream(sampleImage));

    const createRes = await axios.post(`${BASE}/blogs`, createForm, {
      headers: { ...createForm.getHeaders(), Authorization: `Bearer ${token}` },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const blog = createRes.data.blog;
    if (!blog?._id) throw new Error('Blog create did not return an id');

    const updateForm = new FormData();
    updateForm.append('title', 'E2E Blog Test Updated');
    updateForm.append('content', '<p>Updated blog body.</p>');
    updateForm.append('excerpt', 'Updated excerpt');
    updateForm.append('category', 'SEO');
    updateForm.append('tags', 'updated,e2e');
    updateForm.append('published', 'true');
    updateForm.append('image', fs.createReadStream(sampleImage));

    await axios.put(`${BASE}/blogs/${blog._id}`, updateForm, {
      headers: { ...updateForm.getHeaders(), Authorization: `Bearer ${token}` },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    await axios.delete(`${BASE}/blogs/${blog._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Blog E2E test completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Blog E2E test failed:', error.response?.data || error.message || error);
    process.exit(1);
  }
};

run();
