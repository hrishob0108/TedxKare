import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const testEmail = async () => {
  console.log('--- DEBUG INFO ---');
  console.log('EMAIL_USER from env:', process.env.EMAIL_USER);
  console.log('PASS from env length:', process.env.PASS ? process.env.PASS.length : 0);

  const payload = {
    config: {
      email: process.env.EMAIL_USER,
      pass: process.env.PASS,
      from: `'TEDxKARE VERIFY TEST' <${process.env.EMAIL_USER}>`,
    },
    to: process.env.EMAIL_USER,
    subject: 'TEDxKARE Debug Email',
    text: `This email was sent using EMAIL_USER: ${process.env.EMAIL_USER}`,
    html: `<p>This email was sent using EMAIL_USER: <b>${process.env.EMAIL_USER}</b></p>`
  };

  console.log('Sending payload to API...');
  
  try {
    const response = await axios.post("https://7feej0sxm3.execute-api.eu-north-1.amazonaws.com/default/mail_sender", payload);
    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.data : error.message);
  }
};

testEmail();
