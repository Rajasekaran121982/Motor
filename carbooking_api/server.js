const express = require('express');
const app = express();
const { Storage } = require('@google-cloud/storage');
const { PubSub } = require('@google-cloud/pubsub');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Multer = require('multer');
const { Spanner } = require('@google-cloud/spanner');
const path = require('path');
const port = 3000; // Change to the desired port number
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { request } = require('http');
const { Console } = require('console');
const pubsub = new PubSub(

  {
    keyFilename: path.join(__dirname, 'google-cloud-key.json'), 
    projectId: 'gcds-oht33885u6-2023',  
  }
);
const topicName = 'OTP_Request';
const subscriptionName = 'OTP_Request-sub';
const subscription = pubsub.subscription(subscriptionName);
const transporter = nodemailer.createTransport({
  // Configure the SMTP settings for your email provider
  // For example, Gmail SMTP settings
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL_ADDRESS',
    pass: 'YOUR_EMAIL_PASSWORD'
  }
});

const twilioClient = twilio('ACde7362cfa65e524fdd851ee88bd82e58', 'c7643cca1cc5abe6b1c4a7c281942645');





const carbookingsystemSchema = `
  CREATE TABLE CarBooking (
    bookingId STRING(MAX) NOT NULL,
    name STRING(MAX) NOT NULL,
    carModel STRING(MAX) NOT NULL,
    pickupDate DATE NOT NULL,
    returnDate DATE NOT NULL
  ) PRIMARY KEY (bookingId)
`;







// Gets a reference to the instance

// asia-south2 (Delhi)
// Define the instance configuration

const spanner = new Spanner({
  keyFilename: path.join(__dirname, 'google-cloud-key.json'),
  projectId: 'gcds-oht33885u6-2023',
});

const instance = spanner.instance('carbooking');
const database = instance.database('carbookingsystem');





const instanceConfig = 'asia-south2 (Delhi)';






app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(
    cors({
      origin: 'http://localhost:4200',
      methods: 'GET,POST',
      allowedHeaders: 'Content-Type, Authorization',
    })
  );
  // export GOOGLE_APPLICATION_CREDENTIALS=/google-cloud-key.json export GOOGLE_APPLICATION_CREDENTIALS="google-cloud-key.json"

const storage = new Storage({
  keyFilename: path.join(__dirname, 'google-cloud-key.json'), // Path to your service account key JSON file
  projectId: 'gcds-oht33885u6-2023', // Your Google Cloud project ID
});

const bucketName = 'viking_images'; // Your Google Cloud Storage bucket name
const bucket = storage.bucket(bucketName);


const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Max file size is 5MB
  },
});

app.use(express.json());

app.post('/api/register', async (req, res) => {
  const { token, formData } = req.body;
  
  try {
        // Implement your reCAPTCHA verification logic here
    // Verify the reCAPTCHA token using the reCAPTCHA Enterprise API or libraries
    
    // If reCAPTCHA verification is successful, save the form data to the Google Cloud Storage bucket
    const filename = `login_${req.body.formData.UserEmailId}.json`;
    const file = bucket.file(filename);
    await file.save(JSON.stringify(formData));
    const otp = generateOTP();
    const email= req.body.formData.UserEmailId;
    const phoneNumber = req.body.formData.mobileno;

    console.log(phoneNumber);
    console.log(otp);
    console.log(email);
    // Publish OTP to Pub/Sub topic
  const message = JSON.stringify({ email, phoneNumber, otp });
  pubsub.topic(topicName).publish(Buffer.from(message));
   // Send OTP via email
  

   // Send OTP via SMS
   sendOTPBySMS(phoneNumber, otp);


    console.log('Registration data saved successfully');
    res.status(200).json({ message: 'Registration data saved successfully' });
  } catch (error) {
    console.error('Error saving registration data:', error);
    res.status(500).json({ message: 'Error saving registration data' });
  }
});

function generateOTP() {
  // Generate the OTP logic here
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}




 function sendOTPBySMS(otp, phoneNumber) {

  const otpFilePath = `${phoneNumber}_otp.txt`;
  const file = bucket.file(otpFilePath);
     file.save(otp);

  twilioClient.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: '+15737312566',
      to: phoneNumber
    })
    

    .then((message) => console.log('OTP sent by SMS:', message.sid))
    .catch((error) => console.error('Error sending OTP by SMS:', error));
}

function handleOTPMessage(message) {
  const { otp, email, phoneNumber } = JSON.parse(message.data.toString());
  // Implement your OTP handling logic here
  console.log(`Received OTP: ${otp}`);
  
  sendOTPBySMS(otp, phoneNumber);
  message.ack(); // Acknowledge the message to remove it from the subscription
}


subscription.on('message', handleOTPMessage);



app.post('/api/verify-otp', async (req, res) => {
  const phoneNumber = req.body.formData.mobileno
  const receivedOTP = req.body.formData.Otp;
  

  // Implement your OTP validation logic here
  // Compare the received OTP with the expected OTP for the phone number
  if (!phoneNumber || !receivedOTP) {
    return res.status(400).json({ error: 'Phone number and OTP are required.' });
  }
  const otpFilePath = `${phoneNumber}_otp.txt`;
  try {
    // Get the stored OTP from GCS
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(otpFilePath);
    const [content] = await file.download();

    const expectedOTP = content.toString().trim();
    console.log(expectedOTP);

    if (receivedOTP === expectedOTP) {
      // If the received OTP matches the expected OTP, it's valid.
      res.json({ message: 'OTP is valid.' });
    } else {
      // If the received OTP does not match the expected OTP, it's invalid.
      res.status(401).json({ error: 'Invalid OTP.' });
    }
  } catch (err) {
    console.error('Error validating OTP:', err);
    res.status(500).json({ error: 'Failed to validate OTP.' });
  }
 
});






app.post('/api/login', async (req, res) => {
  
  
  const UserEmailId = req.body.UserEmailId;
  const password=req.body.password;

  try {
    // Implement your logic to verify the login credentials

    if (!UserEmailId) {
      console.log('UserEmailId is missing');
      
      res.status(400).json({ message: 'UserEmailId is missing' });
      return;
    }

    // Retrieve the necessary data from the Google Cloud Storage bucket based on the login information
    const filename = `login_${UserEmailId}.json`;
    const file = bucket.file(filename);
    const [data] = await file.download();
    

    // Validate the password against the stored data
    const storedData = JSON.parse(data.toString());
    console.log('rajatesting - '+storedData);
    if (storedData.password === password) {
      console.log('Login successful');
      res.status(200).json({ userid: UserEmailId });
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/api/admin', async (req, res) => {
  
  
  const UserEmailId = 'admin@gmail.com';
  const password=req.body.password;

  try {
    // Implement your logic to verify the login credentials

    if (!UserEmailId) {
      console.log('UserEmailId is missing');
      
      res.status(400).json({ message: 'UserEmailId is missing' });
      return;
    }

    // Retrieve the necessary data from the Google Cloud Storage bucket based on the login information
    const filename = `login_${UserEmailId}.json`;
    const file = bucket.file(filename);
    const [data] = await file.download();
    

    // Validate the password against the stored data
    const storedData = JSON.parse(data.toString());
    
    if (storedData.password === password) {
      console.log('Login successful');
      if (!res.headersSent) // if doesn't sent yet
    res.status(200).send({ "routeid": "/adminDashboard" })
      
      
      return;
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});


app.post('/api/dealer', async (req, res) => {
  
  
  const UserEmailId = 'dealer@gmail.com';
  const password=req.body.password;

  try {
    // Implement your logic to verify the login credentials

    if (!UserEmailId) {
      console.log('UserEmailId is missing');
      
      res.status(400).json({ message: 'UserEmailId is missing' });
      return;
    }

    // Retrieve the necessary data from the Google Cloud Storage bucket based on the login information
    const filename = `login_${UserEmailId}.json`;
    const file = bucket.file(filename);
    const [data] = await file.download();
    

    // Validate the password against the stored data
    const storedData = JSON.parse(data.toString());
    
    if (storedData.password === password) {
      console.log('Login successful');
      if (!res.headersSent) // if doesn't sent yet
    res.status(200).send({ "routeid": "/dealerDashboard" })
      
      
      return;
    } else {
      console.log('Invalid email or password');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});



// Define the API endpoint for file upload
app.post('/api/upload', upload.single('file'), (req, res, next) => {
  const file = req.file;
  
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileName = file.originalname;
  const bucket = storage.bucket(bucketName);
  const blob = bucket.file(fileName);

  const blobStream = blob.createWriteStream({
    resumable: false,
    gzip: true,
  });

  blobStream.on('error', (err) => {
    console.error(err);
    next(err);
  });
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(200).send(publicUrl);
  });

  blobStream.end(file.buffer);
});


// Define the API endpoint to fetch image URLs
app.get('/api/images', async (req, res, next) => {
  try {
    const prefix = 'CAR'
    const [files] = await storage.bucket(bucketName).getFiles({
      prefix: prefix,
    });
    
    const imageUrls = files.map((file) => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`;
      return publicUrl;
    });
    res.set('Content-Type', 'image/jpeg'); 
    res.json(imageUrls);
  } catch (error) {
    console.error(error);
    next(error);
  }
});





app.post('/api/cars', upload.single('image'),async(req, res, next) => {

  try {
    console.log(req.file);
    const file = req.file;
    const { name, price } = req.body;
    const fileName = req.file.originalname;

    // Construct the image URL
    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    // Create a JSON object combining the car information and image URL
    const carData = {
      name,
      price,
      imageUrl,
    };

    // Convert the JSON object to a string
    const carDataString = JSON.stringify(carData);

    // Upload the car data as a file to Google Cloud Storage
    await storage.bucket(bucketName).file(fileName).save(carDataString, {
      metadata: {
        contentType: 'application/json',
      },
    });

    res.status(201).json({ message: 'Car information and image saved successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }


});



// Database code and API call



app.post('/api/bookings', async (req, res) => {
  
  const newBooking = req.body; // Assuming the request body contains the new booking details

  console.log(newBooking.bookingId);
  const bookingId = generateUniqueBookingId();
  database.runTransaction(async (err, transaction) => {
    if (err) {
      console.error(err);
      return;
    }
    try {

      
      const name = newBooking.name;
      const carModel = newBooking.carModel;
      const pickupDate = newBooking.pickupDate;
      const returnDate = newBooking.returnDate;

      const [rowCount] = await transaction.runUpdate({
        sql: `INSERT CustomerCarBookingDetails (bookingId, name, carModel, pickupDate, returnDate) VALUES
        (@bookingId, @name, @carModel, @pickupDate, @returnDate)`,
        params: {
          bookingId: bookingId,
          name: name,
          carModel: carModel,
          pickupDate: pickupDate,
          returnDate: returnDate,
        },
      });
      console.log(`${rowCount} records inserted.`);
      await transaction.commit();
    } catch (err) {
      console.error('ERROR:', err);
      transaction.end();
    } finally {
      // Close the database when finished.
      
    }
  });
}); 

function generateUniqueBookingId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000); // You can adjust the range of random numbers if needed
  const uniqueId = timestamp * 10000 + random;
  return uniqueId;
}
   
app.get('/api/customerbookings', async (req, res) => {
  try {
    // Run a SQL query to fetch data from the table
    const [rows] = await database.run({
      sql: 'SELECT * FROM CustomerCarBookingDetails',
    });

    const customerBookings = rows.map((row) => row.toJSON({ wrapNumbers: true })); // Use wrapNumbers: true
// const customerBookings = rows.map((row) => {
//       return {
//         bookingId: row.bookingId.value, // Extract the value from the object
//         name: row.name,
//         carModel: row.carModel,
//         pickupDate: row.pickupDate,
//         returnDate: row.returnDate,
//       };
//     });
    console.log(customerBookings);
    res.json(customerBookings);
  } catch (error) {
    console.error('Error retrieving customer bookings:', error);
    res.status(500).json({ error: 'Error retrieving customer bookings' });
  }
});





