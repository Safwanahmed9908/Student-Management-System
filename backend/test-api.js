const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

let mongod;
let app;

async function setupServer() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await mongoose.connect(uri);

  app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE END-TO-END TESTS ---');
  await setupServer();
  console.log('In-memory MongoDB initialized and connected.');

  let authToken = '';
  let studentId = '';

  try {
    // 1. Test User Registration
    console.log('\n[1] Testing POST /api/auth/register...');
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dr. Jane Smith',
        email: 'jane.smith@college.edu',
        password: 'password123',
      });
    
    if (regRes.status === 201 && regRes.body.success && regRes.body.data.token) {
      console.log('✅ Registration PASSED. Token received.');
      authToken = regRes.body.data.token;
    } else {
      throw new Error(`Registration failed: ${JSON.stringify(regRes.body)}`);
    }

    // 2. Test Duplicate Registration Prevention
    console.log('\n[2] Testing Duplicate User Registration (should fail with 400)...');
    const dupRegRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Duplicate',
        email: 'jane.smith@college.edu',
        password: 'password123',
      });
    if (dupRegRes.status === 400) {
      console.log('✅ Duplicate user registration correctly rejected.');
    } else {
      throw new Error(`Duplicate registration was not rejected properly.`);
    }

    // 3. Test Login with Valid Credentials
    console.log('\n[3] Testing POST /api/auth/login...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane.smith@college.edu',
        password: 'password123',
      });
    if (loginRes.status === 200 && loginRes.body.data.token) {
      console.log('✅ Login PASSED. Valid token verified.');
      authToken = loginRes.body.data.token;
    } else {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }

    // 4. Test Login with Invalid Password
    console.log('\n[4] Testing Login with Invalid Password (should fail with 401)...');
    const badLoginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane.smith@college.edu',
        password: 'wrongpassword',
      });
    if (badLoginRes.status === 401) {
      console.log('✅ Invalid password correctly rejected with 401.');
    } else {
      throw new Error('Invalid login did not return 401.');
    }

    // 5. Test Access to Protected Route Without Token
    console.log('\n[5] Testing GET /api/students without JWT Token (should fail with 401)...');
    const noAuthRes = await request(app).get('/api/students');
    if (noAuthRes.status === 401) {
      console.log('✅ Protected route correctly blocked unauthenticated request.');
    } else {
      throw new Error('Protected route allowed unauthenticated request.');
    }

    // 6. Test Create Student (POST /api/students)
    console.log('\n[6] Testing POST /api/students with JWT Auth...');
    const createRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Rahul Sharma',
        rollNumber: 'CS2024-101',
        email: 'rahul.sharma@student.edu',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
      });
    if (createRes.status === 201 && createRes.body.data._id) {
      studentId = createRes.body.data._id;
      console.log(`✅ Student created successfully. ID: ${studentId}`);
    } else {
      throw new Error(`Student creation failed: ${JSON.stringify(createRes.body)}`);
    }

    // 7. Test Duplicate Roll Number Prevention
    console.log('\n[7] Testing Duplicate Roll Number (should fail with 400)...');
    const dupRollRes = await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Another Student',
        rollNumber: 'CS2024-101',
        email: 'another@student.edu',
        department: 'Mechanical Engineering',
        year: '2nd Year',
      });
    if (dupRollRes.status === 400) {
      console.log('✅ Duplicate roll number correctly rejected.');
    } else {
      throw new Error('Duplicate roll number was not rejected.');
    }

    // Add a second student for search testing
    await request(app)
      .post('/api/students')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Priya Patel',
        rollNumber: 'IT2024-202',
        email: 'priya.patel@student.edu',
        department: 'Information Technology',
        year: '2nd Year',
      });

    // 8. Test Get All Students
    console.log('\n[8] Testing GET /api/students...');
    const getAllRes = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${authToken}`);
    if (getAllRes.status === 200 && getAllRes.body.data.length === 2) {
      console.log(`✅ Retrieved all students: Count = ${getAllRes.body.count}`);
    } else {
      throw new Error(`Failed to retrieve all students: ${JSON.stringify(getAllRes.body)}`);
    }

    // 9. Test Search Functionality
    console.log('\n[9] Testing GET /api/students?search=rahul...');
    const searchRes = await request(app)
      .get('/api/students?search=rahul')
      .set('Authorization', `Bearer ${authToken}`);
    if (searchRes.status === 200 && searchRes.body.data.length === 1 && searchRes.body.data[0].name === 'Rahul Sharma') {
      console.log('✅ Search filtering by name PASSED.');
    } else {
      throw new Error(`Search failed: ${JSON.stringify(searchRes.body)}`);
    }

    // 10. Test Get Student By ID
    console.log(`\n[10] Testing GET /api/students/${studentId}...`);
    const getByIdRes = await request(app)
      .get(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (getByIdRes.status === 200 && getByIdRes.body.data.rollNumber === 'CS2024-101') {
      console.log('✅ Get single student by ID PASSED.');
    } else {
      throw new Error(`Get by ID failed: ${JSON.stringify(getByIdRes.body)}`);
    }

    // 11. Test Update Student (PUT /api/students/:id)
    console.log(`\n[11] Testing PUT /api/students/${studentId}...`);
    const updateRes = await request(app)
      .put(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Rahul Sharma (Updated)',
        year: '4th Year',
      });
    if (updateRes.status === 200 && updateRes.body.data.name === 'Rahul Sharma (Updated)' && updateRes.body.data.year === '4th Year') {
      console.log('✅ Student update PASSED.');
    } else {
      throw new Error(`Update failed: ${JSON.stringify(updateRes.body)}`);
    }

    // 12. Test Delete Student (DELETE /api/students/:id)
    console.log(`\n[12] Testing DELETE /api/students/${studentId}...`);
    const deleteRes = await request(app)
      .delete(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (deleteRes.status === 200 && deleteRes.body.success) {
      console.log('✅ Student delete PASSED.');
    } else {
      throw new Error(`Delete failed: ${JSON.stringify(deleteRes.body)}`);
    }

    // 13. Verify Deleted Student is Not Found
    console.log(`\n[13] Verifying Deleted Student cannot be fetched (expect 404)...`);
    const verifyDelRes = await request(app)
      .get(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    if (verifyDelRes.status === 404) {
      console.log('✅ Student confirmed deleted (404 Not Found returned).');
    } else {
      throw new Error('Deleted student still exists in DB.');
    }

    console.log('\n=========================================');
    console.log('🎉 ALL 13 TEST SUITES PASSED FLAWLESSLY!');
    console.log('=========================================');
  } catch (err) {
    console.error('❌ TEST FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
  }
}

runTests();
