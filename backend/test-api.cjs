const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/attendees', {
      ticketType: 'Internal',
      name: 'John Doe',
      gender: 'Male',
      email: 'test@klu.ac.in',
      phone: '9876543210',
      registrationNumber: '9921004123',
      department: 'CSE',
      hostelDayScholar: 'Day Scholar',
      transactionId: '123456789012',
      paymentScreenshot: 'data:image/png;base64,iVBORw0KGgo'
    });
    console.log('Success:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Error:', err.message);
    }
  }
}

test();
