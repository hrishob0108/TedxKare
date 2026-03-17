import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const testEmail = async () => {
  const EMAIL = process.env.EMAIL_USER;
  const PASS = process.env.PASS;

  console.log('--- DETAILED DEBUG INFO ---');
  console.log('EMAIL_USER:', EMAIL);
  console.log('PASS LENGTH:', PASS ? PASS.length : 'NULL');

  const payload = {
    config: {
      email: EMAIL,
      pass: PASS,
      from: EMAIL, // Try with just the email address as the 'from'
    },
    to: EMAIL,
    subject: 'TEDxKARE Detailed Debug',
    text: `Test email sent at ${new Date().toISOString()}`,
    html: `<b>Test email sent at ${new Date().toISOString()}</b>`
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await axios.post("https://7feej0sxm3.execute-api.eu-north-1.amazonaws.com/default/mail_sender", payload);
    console.log("Status:", response.status);
    console.log("Data:", response.data);
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
};

testEmail();
