import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import crypto from "crypto";
import jwt from "jsonwebtoken"; 
import { OAuth2Client } from "google-auth-library";



import fetch from "node-fetch"; // for Fast2SMS API

// Temporary store for OTPs (in production, use DB or Redis)

const JWT_SECRET = "my_super_secret_key_123";

const razorpay = new Razorpay({
  key_id: "rzp_test_RMCjWSeoFogW8b",       // Replace with your Razorpay Key ID
  key_secret: "UJ4K8KLT9f9xhlyEruuqTLUg", // Replace with your Razorpay Key Secret
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 
app.use("/uploads", express.static("uploads"));


// ✅ Create uploads folder if it doesn't exist
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sathya",
  database: "homestore",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// ✅ Create users table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
  )
`);

// ✅ Create hosts table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS hosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
  )
`);

const CLIENT_ID =
  "561744439193-sqo89ko04q0jb2es4o89m1rc1so8aaba.apps.googleusercontent.com";
const googleClient = new OAuth2Client(CLIENT_ID);

//
// =============== LOCAL SIGNUP ===============
//
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, provider } = req.body;

    // Check if user already exists
    const [existing] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    let hashedPassword = null;
    if (provider === "local") {
      if (!password)
        return res.status(400).json({ message: "Password is required" });
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (name, email, password, role, provider) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, role || "user", provider || "local"]
      );

    const user = {
      id: result.insertId,
      name,
      email,
      role: role || "user",
      provider: provider || "local",
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Signup successful",
      user,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//
// =============== GOOGLE LOGIN/SIGNUP ===============
//
app.post("/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    let user;
    if (rows.length === 0) {
      // Create new Google user
      const [result] = await db
        .promise()
        .query(
          "INSERT INTO users (name, email, provider, role) VALUES (?, ?, 'google', 'user')",
          [name, email]
        );

      user = {
        id: result.insertId,
        name,
        email,
        role: "user",
        provider: "google",
      };
    } else {
      user = rows[0];
    }

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      user,
      token: jwtToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(400).json({ message: "Invalid Google token" });
  }
});

//
// =============== LOCAL LOGIN ===============
//
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = rows[0];

    if (user.provider === "google") {
      return res.status(400).json({
        message: "This account uses Google Login. Please use Google sign-in.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", user, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { name: decoded.name, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}


// backend route: /homes
app.post("/homes", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const user = req.user; // email comes from session/token
    if (!user) return res.status(400).json({ message: "Seller info not found in session" });

    const {
      homeName,
      description,
      address,
      street,       // ✅ new field
      landmark,
      state,
      city,
      phone,
      bedrooms,
      bathrooms,
      parkingArea,
      rentPerMonth,
      totalPrice,
      sellerName
    } = req.body;

    const image = req.file?.filename || null;
    const status = rentPerMonth ? "rent" : "sale";

    // Insert into DB including street
    await db.promise().query(`
      INSERT INTO homes
      (homeName, description, address, street, landmark, state, city, phone, bedrooms, bathrooms, parkingArea, rentPerMonth, totalPrice, imagePath, sellerName, sellerEmail, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      homeName,
      description,
      address,
      street,      // ✅ included here
      landmark,
      state,
      city,
      phone,
      parseInt(bedrooms),
      parseInt(bathrooms),
      parseInt(parkingArea),
      rentPerMonth ? parseFloat(rentPerMonth) : null,
      totalPrice ? parseFloat(totalPrice) : null,
      image,
      sellerName,
      user.email,
      status
    ]);

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix", // your app password
      },
    });

    await transporter.sendMail({
      from: '"Home Portal" <sathya050721@gmail.com>',
      to: user.email,
      subject: "Home Added Successfully",
      html: `
        <h3>Hello ${sellerName || user.name},</h3>
        <p>Your home "<strong>${homeName}</strong>" has been successfully added to the portal.</p>
        <p>Details:</p>
        <ul>
          <li>Street: ${street || "N/A"}</li>  <!-- ✅ street in email -->
          <li>Landmark: ${landmark || "N/A"}</li>
          <li>City: ${city}</li>
          <li>State: ${state}</li>
          <li>Status: ${status}</li>
        </ul>
        <p>Thank you for listing with us!</p>
      `,
    });

    res.status(200).json({ message: "Home added successfully and email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});






// GET /users/:id - get user info
app.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await db.promise().query(
      "SELECT name, email FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// ✅ Get all homes
app.get("/homes", (req, res) => {
  db.query("SELECT * FROM homes", (err, results) => {
    if (err) {
      console.error("DB Fetch Error:", err);
      return res.status(500).json({ message: "Error fetching homes" });
    }
    res.json(results);
  });
});
// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// server.js or routes/homes.js
// Get one home by ID
// GET /homes/:id
app.get('/homes/:id', async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM homes WHERE id = ?`;

  try {
    const [results] = await db.promise().query(sql, [id]);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(results[0]); // only homes table details
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});




// POST a new comment
app.post("/comments", async (req, res) => {
  try {
    console.log("Incoming comment:", req.body); // 👈 add this
    const homeId = req.body.homeId || req.body.home_id;
    const { username, comment, rating } = req.body;

    const [result] = await db.promise().query(
      "INSERT INTO comments (homeId, username, comment, rating) VALUES (?, ?, ?, ?)",
      [homeId, username, comment, rating]
    );

    // return the inserted comment object so React can render it
    res.json({
      id: result.insertId,
      homeId,
      username,
      comment,
      rating,
      createdAt: new Date()
    });

  } catch (err) {
    console.error("💥 Error adding comment:", err); // 👈 will show exact reason
    res.status(500).json({ message: err.message });
  }
});
// returns all comments for a given home id
app.get("/comments/:homeId", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM comments WHERE homeId = ? ORDER BY id DESC",
      [req.params.homeId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: err.message });
  }
});



// GET homes with filters
app.get("/filter-homes", async (req, res) => {
  const { city, state, minPrice, maxPrice, bedrooms } = req.query;

  let query = "SELECT * FROM homes WHERE 1=1";
  const params = [];

  if (city) {
    query += " AND city = ?";
    params.push(city);
  }
  if (state) {
    query += " AND state = ?";
    params.push(state);
  }
  if (minPrice) {
    query += " AND price >= ?";
    params.push(minPrice);
  }
  if (maxPrice) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }
  if (bedrooms) {
    query += " AND bedrooms = ?";
    params.push(bedrooms);
  }

  try {
    const [rows] = await db.promise().query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/dashboard/:email", async (req, res) => {
  const { email } = req.params;
  try {
    // 1. Find the user
    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // 2. Fetch homes for this user
    const [homes] = await db.promise().query(
      "SELECT * FROM homes WHERE sellerEmail = ?",
      [email]
    );

    res.json({ host: user, homes });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// delete a home by id
app.delete("/homes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.promise().query(
      "DELETE FROM homes WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Home not found" });
    }
    res.json({ message: "Home deleted successfully" });
  } catch (err) {
    console.error("Error deleting home:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a home by ID (includes address & landmark)
// ✅ update home by id (includes address, street, landmark, etc.)
// update home
app.put("/homes/:id", async (req, res) => {
  const { id } = req.params;
  const {
    homeName,
    description,
    address,
    street,
    landmark,
    state,
    city,
    phone,
    imagePath,
    bedrooms,
    bathrooms,
    parkingArea,
    rentPerMonth,
    totalPrice,
    images,
    sellerName,
    sellerEmail,
    status,
  } = req.body;

  try {
    console.log("Updating home:", req.body); // 🪶 Debug log

    const [result] = await db.promise().query(
      `UPDATE homes 
       SET homeName=?, description=?, address=?, street=?, landmark=?, state=?, city=?, 
           phone=?, imagePath=?, bedrooms=?, bathrooms=?, parkingArea=?, 
           rentPerMonth=?, totalPrice=?, images=?, sellerName=?, sellerEmail=?, status=? 
       WHERE id=?`,
      [
        homeName,
        description,
        address,
        street,
        landmark,
        state,
        city,
        phone,
        imagePath || null,
        bedrooms,
        bathrooms,
        parkingArea,
        rentPerMonth || null,
        totalPrice || null,
        images || null,
        sellerName,
        sellerEmail,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Home not found" });
    }

    res.json({ message: "🏡 Home updated successfully!" });
  } catch (err) {
    console.error("Error updating home:", err);
    res.status(500).json({ message: "Server error" });
  }
});





// Add to cart
app.post("/cart", (req, res) => {
  const { user_email, home_id } = req.body;
  db.query(
    "INSERT INTO cart (user_email, home_id) VALUES (?, ?)",
    [user_email, home_id],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({ success: false, message: "Already in cart" });
        }
        return res.status(500).json({ success: false, error: err });
      }
      res.json({ success: true });
    }
  );
});

// Get cart items for user
app.get("/cart/:email", (req, res) => {
  const email = req.params.email;
  db.query(
    `SELECT homes.* FROM cart 
     JOIN homes ON cart.home_id = homes.id 
     WHERE cart.user_email = ?`,
    [email],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// Remove home from cart
app.delete("/cart/:email/:homeId", (req, res) => {
  const { email, homeId } = req.params;
  db.query(
    "DELETE FROM cart WHERE user_email = ? AND home_id = ?",
    [email, homeId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});
const otpStore = {};
// Send a message
// 2. Doubt Email
// ----------------------
app.post("/send-doubt-email", async (req, res) => {
  const { senderEmail, receiverEmail, subject, message } = req.body;
  if (!senderEmail || !receiverEmail || !message) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix", // your App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"Home App" <${senderEmail}>`,
      to: receiverEmail,
      subject: subject || "User Doubt",
      text: message,
    });

    console.log("Email sent:", info.messageId);
    res.json({ success: true });
  } catch (err) {
    console.error("Error sending email:", err);
    res.json({ success: false, error: err.message });
  }
});

// ----------------------
// 3. Send Email OTP
// ----------------------
app.post("/send-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, createdAt: Date.now() };

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix",
      },
    });

    await transporter.sendMail({
      from: '"My App" <sathya050721@gmail.com>',
      to: email,
      subject: "12345",
      text: `Your OTP is ${otp}`,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.json({ success: false, error: err.message });
  }
});


// 4. Verify Email OTP

app.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email & OTP required" });
  }

  const record = otpStore[email];
  if (!record) {
    return res.status(400).json({ success: false, message: "No OTP found" });
  }

  // 5-minute expiry
  if (Date.now() - record.createdAt > 5 * 60 * 1000) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (parseInt(otp) !== record.otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email]; // clear OTP after success
  res.json({ success: true, message: "OTP verified successfully" });
});

// ----------------------

// Booking file upload middleware
const bookingUpload = multer({ storage }).fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
]);

app.post("/bookings", upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar", maxCount: 1 },
]), async (req, res) => {
  try {
    const { homeId, name, email, phone, otpVerified, bookingType } = req.body;

    if (otpVerified !== "true") {
      return res.status(400).json({ success: false, message: "OTP not verified" });
    }

    const photoPath = req.files["photo"] ? req.files["photo"][0].filename : null;
    const aadharPath = req.files["aadhar"] ? req.files["aadhar"][0].filename : null;

    await db.promise().query(
      `INSERT INTO bookings 
        (homeId, name, email, phone, photoPath, aadharPath, bookingType, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [homeId, name, email, phone, photoPath, aadharPath, bookingType]
    );

    res.json({ success: true, message: "Booking saved successfully" });
  } catch (err) {
    console.error("Error submitting booking:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.json({ success: true, answer: "Please type something." });
    }

    // Extract bedrooms number from message (regex)
    const bedroomMatch = message.match(/(\d+)\s*bedrooms?/i);
    const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : null;

    // Extract city (word after 'in')
    const cityMatch = message.match(/in\s+([a-zA-Z\s]+)/i);
    const city = cityMatch ? cityMatch[1].trim() : null;

    // Extract home name (simple: words after "show" or "home")
    const homeMatch = message.match(/(?:show|home)\s+([a-zA-Z0-9\s]+)/i);
    const homeName = homeMatch ? homeMatch[1].trim() : null;

    // Build query dynamically
    let query = "SELECT * FROM homes WHERE 1=1";
    const params = [];

    if (city) {
      query += " AND city LIKE ?";
      params.push(`%${city}%`);
    }

    if (bedrooms) {
      query += " AND bedrooms = ?";
      params.push(bedrooms);
    } 

    if (homeName) {
      query += " AND homeName LIKE ?";
      params.push(`%${homeName}%`);
    }

    const [homes] = await db.promise().query(query, params);

    if (homes.length === 0) {
      return res.json({ success: true, answer: "No homes found matching your request." });
    }

    const answer = homes
      .map((h) => `${h.homeName} – ${h.city}, ${h.bedrooms} bedrooms`)
      .join("\n");

    res.json({ success: true, answer, homes });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ success: false, answer: "Error processing your request." });
  }
});

// Get all bookings for a specific home
app.get('/bookings/home/:homeId', async (req, res) => {
  try {
    const homeId = req.params.homeId;

    const [rows] = await db.promise().query(
      `SELECT id, name, email, phone, bookingType, status, createdAt 
       FROM bookings 
       WHERE homeId = ?`,
      [homeId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching bookings for home:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings for homes owned by this seller
// server.js
app.post('/bookings', upload.fields([{ name: 'photo' }, { name: 'aadhar' }]), async (req, res) => {
  try {
    // Save booking details to DB with status = 'pending'
    const { homeId, name, email, phone, bookingType } = req.body;
    const photoPath = req.files.photo[0].filename;
    const aadharPath = req.files.aadhar[0].filename;

    await db.query(
      'INSERT INTO bookings (home_id, name, email, phone, photo, aadhar, booking_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [homeId, name, email, phone, photoPath, aadharPath, bookingType, 'pending']
    );

    res.json({ success: true, message: 'Request sent to seller (pending)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error saving booking' });
  }
});
app.get('/seller-requests/:sellerEmail', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT 
          b.id, b.homeId, b.name, b.email, b.phone, b.photoPath, b.aadharPath, b.createdAt,
          b.bookingType AS booking_type, b.status, 
          h.homeName, h.sellerEmail 
       FROM bookings b 
       JOIN homes h ON b.homeId = h.id 
       WHERE h.sellerEmail = ? AND b.status='pending'`,
      [req.params.sellerEmail]
    );

    // Map photoPath and aadharPath to full URLs
    const requestsWithUrls = rows.map(r => ({
      ...r,
      photoUrl: r.photoPath ? `http://localhost:5000/uploads/${r.photoPath}` : null,
      aadharUrl: r.aadharPath ? `http://localhost:5000/uploads/${r.aadharPath}` : null
    }));

    res.json({ success: true, requests: requestsWithUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});






// Approve booking
app.put("/bookings/:id/confirm", async (req, res) => {
  const bookingId = req.params.id;

  try {
    // 1️⃣ Update booking status
    const [result] = await db.promise().query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      ["approved", bookingId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // 2️⃣ Get booking details (to get user's email, name, homeId)
    const [rows] = await db.promise().query(
      "SELECT name, email, homeId FROM bookings WHERE id = ?",
      [bookingId]
    );
    const booking = rows[0];

    // 3️⃣ Update the home's status to 'isAvailable = 0' or 'Booked'
    await db.promise().query(
      "UPDATE homes SET status = ? WHERE id = ?",
      ["Booked", booking.homeId]  // or "isAvailable = 0" if you track availability differently
    );

    // 4️⃣ Get home details for email
    const [homes] = await db.promise().query(
      "SELECT homeName FROM homes WHERE id = ?",
      [booking.homeId]
    );
    const home = homes[0];

    // 5️⃣ Send email to user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix", // your app password
      },
    });

    await transporter.sendMail({
      from: '"Home Portal" <sathya050721@gmail.com>',
      to: booking.email,
      subject: "Booking Approved",
      html: `
        <h3>Hello ${booking.name},</h3>
        <p>Your booking for <strong>${home.homeName}</strong> has been <strong>approved</strong>!</p>
        <p>Thank you for booking with us.</p>
      `,
    });

    res.json({ success: true, message: "Booking approved, home status updated, and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database or email error" });
  }
});


// Reject booking
app.put("/bookings/:id/reject", async (req, res) => {
  const bookingId = req.params.id;

  try {
    // 1️⃣ Update booking status
    const [result] = await db.promise().query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      ["rejected", bookingId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // 2️⃣ Get booking details
    const [rows] = await db.promise().query(
      "SELECT name, email, homeId FROM bookings WHERE id = ?",
      [bookingId]
    );
    const booking = rows[0];

    // 3️⃣ Get home details
    const [homes] = await db.promise().query(
      "SELECT homeName FROM homes WHERE id = ?",
      [booking.homeId]
    );
    const home = homes[0];

    // 4️⃣ Send rejection email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix", // your app password
      },
    });

    await transporter.sendMail({
      from: '"Home Portal" <sathya050721@gmail.com>',
      to: booking.email,
      subject: "Booking Rejected",
      html: `
        <h3>Hello ${booking.name},</h3>
        <p>We are sorry to inform you that your booking for <strong>${home.homeName}</strong> has been <strong>rejected</strong>.</p>
        <p>Please feel free to explore other homes on our portal.</p>
      `,
    });

    res.json({ success: true, message: "Booking rejected and email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Database or email error" });
  }
});

// GET bookings for a specific user
// GET bookings for a specific user
app.get('/user/:email/bookings', async (req, res) => {
  try {
    const email = req.params.email;

    const [rows] = await db.promise().query(
      `SELECT 
         b.id,
         b.name,
         b.email,
         b.phone,
         h.address,
         h.city,
         h.state,
         h.imagePath,
         b.status,
         b.bookingType,
         h.homeName,
         h.totalPrice AS totalPrice,
         h.rentPerMonth AS rentPerMonth
       FROM bookings b
       JOIN homes h ON b.homeId = h.id
       WHERE b.email = ?`,
      [email]
    );

    const bookingsWithImages = rows.map(booking => ({
      ...booking,
      imagePath: booking.imagePath 
        ? `http://localhost:5000/uploads/${booking.imagePath}`
        : null
    }));

    res.json(bookingsWithImages);
  } catch (err) {
    console.error('Error fetching bookings', err);
    res.status(500).json({ error: 'Server error' });
  }
});



// ---------- Neighborhood endpoints (add to server.js) ----------
/**
 * GET /api/neighborhood?lat=<lat>&lng=<lng>&radius=<meters>
 * Returns: { coords, radius, amenities: [...], counts: {...}, airQuality: {...}, score: {safety,transport,air,overall} }
 */
// Get all homes
app.get('/api/homes', (req, res) => {
  db.query('SELECT * FROM homes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// Get all bookings (exclude photoPath and aadharPath)
app.get('/api/bookings', (req, res) => {
  const query = `
    SELECT id, homeId, name, email, phone, bookingType, status, createdAt 
    FROM bookings
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Bookings from DB:", results); // <-- check server console
    res.json(results);
  });
});

// Delete a home
// Delete a home
app.delete('/api/homes/:id', (req, res) => {
  const homeId = req.params.id;
  const query = 'DELETE FROM homes WHERE id = ?';
  db.query(query, [homeId], (err, results) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Home not found' });
    }
    res.json({ message: 'Home deleted successfully' });
  });
});

// route to create an order
// server.js
// create order route
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ message: "Amount and currency required" });
    }

    const options = {
      amount: amount,       // amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,  // unique receipt id
    };

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created:", order); // 🔍 log to debug

    res.json(order); // must include order.id
  } catch (err) {
    console.error("Error creating order", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// (optional) payment success route
// Razorpay payment success
// Razorpay payment success
app.post("/payment/success", async (req, res) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;

    if (!bookingId || !paymentId || !orderId) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", razorpay.key_secret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (signature !== generatedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 1️⃣ Update booking status to 'paid'
    const [bookingRows] = await db.promise().query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      ["paid", bookingId]
    );

    if (bookingRows.affectedRows === 0)
      return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Get booking + home details (including seller info)
    const [bookingDetails] = await db.promise().query(
      `SELECT b.homeId, b.name, b.email, b.bookingType,
              h.rentPerMonth, h.totalPrice, h.sellerEmail, h.sellerName, h.homeName
       FROM bookings b
       JOIN homes h ON b.homeId = h.id
       WHERE b.id = ?`,
      [bookingId]
    );

    const booking = bookingDetails[0];

    // 3️⃣ Update home status to 'Booked'
    await db.promise().query(
      "UPDATE homes SET status = ? WHERE id = ?",
      ["Booked", booking.homeId]
    );

    // 4️⃣ Insert payment record
    await db.promise().query(
      `INSERT INTO payments 
        (home_id, username, email, type, amount, payment_date, next_payment_date, payment_id, order_id, signature)
       VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        booking.homeId,
        booking.name,
        booking.email,
        booking.bookingType,
        booking.bookingType === "rent" ? booking.rentPerMonth : booking.totalPrice,
        booking.bookingType === "rent"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null, // next payment for rent
        paymentId,
        orderId,
        signature,
      ]
    );

    // 5️⃣ Send emails (to both buyer & seller)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix", // App Password
      },
    });

    // 📨 Buyer email
    await transporter.sendMail({
      from: '"Home Portal" <sathya050721@gmail.com>',
      to: booking.email,
      subject: "Payment Successful - Home Booking Confirmed",
      html: `
        <h3>Hello ${booking.name},</h3>
        <p>Your payment for <strong>${booking.homeName}</strong> was successful!</p>
        <p><strong>Booking ID:</strong> ${bookingId}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p>Status: <strong>Paid</strong></p>
        <p>Thank you for booking with us!</p>
      `,
    });

    // 📨 Seller email
    await transporter.sendMail({
      from: '"Home Portal" <sathya050721@gmail.com>',
      to: booking.sellerEmail,
      subject: "Your Home Has Been Booked!",
      html: `
        <h3>Hello ${booking.sellerName},</h3>
        <p>Your home <strong>${booking.homeName}</strong> has been successfully booked.</p>
        <p><strong>Buyer:</strong> ${booking.name}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Booking Type:</strong> ${booking.bookingType}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Amount:</strong> ₹${
          booking.bookingType === "rent"
            ? booking.rentPerMonth
            : booking.totalPrice
        }</p>
        <p>The payment status is confirmed as <strong>Paid</strong>.</p>
      `,
    });

    res.json({
      success: true,
      message: "Payment successful, emails sent to buyer and seller",
    });
  } catch (err) {
    console.error("Payment success error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


app.post("/payment/cash", async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID required" });
    }

    // 1️⃣ Get booking + home details (including seller info)
    const [bookingDetails] = await db.promise().query(
      `SELECT b.homeId, b.name, b.email, b.bookingType,
              h.homeName, h.sellerEmail, h.sellerName
       FROM bookings b
       JOIN homes h ON b.homeId = h.id
       WHERE b.id = ?`,
      [bookingId]
    );

    const booking = bookingDetails[0];
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Optionally mark booking as "pending cash" in DB
    await db.promise().query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      ["pending-cash", bookingId]
    );

    // 3️⃣ Send email to seller
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sathya050721@gmail.com",
        pass: "iqon zill bqrw wyix", // App Password
      },
    });

    await transporter.sendMail({
      from: '"Home Portal" <sathya050721@gmail.com>',
      to: booking.sellerEmail,
      subject: `Cash Payment Requested for ${booking.homeName}`,
      html: `
        <h3>Hello ${booking.sellerName},</h3>
        <p><strong>${booking.name}</strong> (${booking.email}) wants to pay in cash for <strong>${booking.homeName}</strong>.</p>
        <p>Booking Type: ${booking.bookingType}</p>
        <p>Please contact the user to receive the cash payment and confirm the booking.</p>
      `,
    });

    res.json({
      success: true,
      message: "Seller notified about cash payment request",
    });
  } catch (err) {
    console.error("Cash payment error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all bookings for a seller
// GET bookings for a specific seller
// GET bookings for a specific seller
app.get('/seller/:email/bookings', async (req, res) => {
  try {
    const sellerEmail = decodeURIComponent(req.params.email);

    const [rows] = await db.promise().query(
      `SELECT 
         b.id AS bookingId,
         b.name AS userName,
         b.email AS userEmail,
         b.phone,
         b.photoPath,
         b.aadharPath,
         b.bookingType,
         b.status,
         b.createdAt,
         h.homeName,
         h.city,
         h.state,
         h.imagePath,
         h.totalPrice,
         h.rentPerMonth
       FROM bookings b
       JOIN homes h ON b.homeId = h.id
       WHERE h.sellerEmail = ?`,
      [sellerEmail]
    );

    // Map paths to full URLs
    const bookingsWithImages = rows.map(booking => ({
      ...booking,
      imageUrl: booking.imagePath
        ? `http://localhost:5000/uploads/${booking.imagePath}`
        : null,
      photoUrl: booking.photoPath
        ? `http://localhost:5000/uploads/${booking.photoPath}`
        : null,
      aadharUrl: booking.aadharPath
        ? `http://localhost:5000/uploads/${booking.aadharPath}`
        : null
    }));

    res.json(bookingsWithImages);
  } catch (err) {
    console.error('Error fetching seller bookings', err);
    res.status(500).json({ success: false, message: 'Database or email error' });
  }
});


// ---------- Admin routes (add to server.js) ----------
import { Parser } from "json2csv"; // install: npm i json2csv
// NOTE: if you can't use ES import in that file, require instead:
// const { Parser } = require('json2csv');

//
// 1) Overview (totals)
// GET /admin/overview
//
app.get("/admin/overview", async (req, res) => {
  try {
    const [[{ totalHomes }]] = await db.promise().query(
      "SELECT COUNT(*) AS totalHomes FROM homes"
    );
    const [[{ totalBookings }]] = await db.promise().query(
      "SELECT COUNT(*) AS totalBookings FROM bookings"
    );
    const [[{ totalUsers }]] = await db.promise().query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );
    // revenue from payments table (if you have one)
    const [[{ revenue }]] = await db.promise().query(
      "SELECT IFNULL(SUM(amount), 0) AS revenue FROM payments"
    );
    // pending approvals (bookings with 'pending' or homes with status pending)
    const [[{ pendingBookings }]] = await db.promise().query(
      "SELECT COUNT(*) AS pendingBookings FROM bookings WHERE status IN ('pending','pending-cash')"
    );
    const [[{ pendingHomes }]] = await db.promise().query(
      "SELECT COUNT(*) AS pendingHomes FROM homes WHERE status IN ('pending','Pending')"
    );

    res.json({
      totalHomes,
      totalBookings,
      totalUsers,
      revenue,
      pendingBookings,
      pendingHomes,
    });
  } catch (err) {
    console.error("Admin overview error:", err);
    res.status(500).json({ message: err.message });
  }
});

//
// 2) List Homes (GET /admin/homes)
//
app.get("/admin/homes", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT id, homeName, sellerName, sellerEmail, city, state, rentPerMonth, totalPrice, imagePath, status
       FROM homes ORDER BY id DESC`
    );
    // map image full URL
    const mapped = rows.map((r) => ({
      ...r,
      imageUrl: r.imagePath ? `http://localhost:5000/uploads/${r.imagePath}` : null,
    }));
    res.json(mapped);
  } catch (err) {
    console.error("Admin homes error:", err);
    res.status(500).json({ message: err.message });
  }
});

//
// 3) List Users (GET /admin/users)
//
app.get('/admin/users', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT id, name, email, provider, role FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});


//
// 4) List Bookings (GET /admin/bookings)
//
app.get("/admin/bookings", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT b.id AS bookingId, b.homeId, b.name AS userName, b.email AS userEmail,
              b.phone, b.photoPath, b.aadharPath, b.bookingType, b.status, b.createdAt,
              h.homeName, h.sellerName, h.sellerEmail, h.imagePath
       FROM bookings b
       JOIN homes h ON b.homeId = h.id
       ORDER BY b.createdAt DESC`
    );

    const mapped = rows.map((r) => ({
      ...r,
      photoUrl: r.photoPath ? `http://localhost:5000/uploads/${r.photoPath}` : null,
      aadharUrl: r.aadharPath ? `http://localhost:5000/uploads/${r.aadharPath}` : null,
      homeImageUrl: r.imagePath ? `http://localhost:5000/uploads/${r.imagePath}` : null,
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Admin bookings error:", err);
    res.status(500).json({ message: err.message });
  }
});

//
// 5) Approve booking (PUT /admin/bookings/:id/approve)
//
app.put("/admin/bookings/:id/approve", async (req, res) => {
  const bookingId = req.params.id;
  try {
    // set booking -> approved
    const [update] = await db.promise().query(
      "UPDATE bookings SET status = 'approved' WHERE id = ?",
      [bookingId]
    );
    if (update.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });

    // mark home's status to Booked
    const [[bookingData]] = await db.promise().query(
      "SELECT homeId, name, email FROM bookings WHERE id = ?",
      [bookingId]
    );
    if (bookingData && bookingData.homeId) {
      await db.promise().query("UPDATE homes SET status = ? WHERE id = ?", ["Booked", bookingData.homeId]);
    }

    // send email to user optional (you already have nodemailer configured)
    // ... (reuse your transporter code if required)

    res.json({ success: true, message: "Booking approved" });
  } catch (err) {
    console.error("Approve booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

//
// 6) Reject booking (PUT /admin/bookings/:id/reject)
//
app.put("/admin/bookings/:id/reject", async (req, res) => {
  const bookingId = req.params.id;
  try {
    const [update] = await db.promise().query("UPDATE bookings SET status = 'rejected' WHERE id = ?", [bookingId]);
    if (update.affectedRows === 0) return res.status(404).json({ message: "Booking not found" });

    // Optionally email user about rejection here

    res.json({ success: true, message: "Booking rejected" });
  } catch (err) {
    console.error("Reject booking error:", err);
    res.status(500).json({ message: err.message });
  }
});

//
// 7) Revenue chart / bookings per month (GET /admin/reports/revenue)
// returns last 12 months revenue and booking count
// reports route - daily revenue & bookings for last 30 days
app.get("/admin/reports/revenue", async (req, res) => {
  try {
    // daily revenue from payments table
    const [payments] = await db.promise().query(
      `SELECT 
         DATE(payment_date) AS date,
         IFNULL(SUM(amount),0) AS revenue,
         COUNT(*) AS count
       FROM payments
       WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(payment_date)
       ORDER BY DATE(payment_date) ASC`
    );

    // daily bookings count
    const [bookings] = await db.promise().query(
      `SELECT 
         DATE(createdAt) AS date,
         COUNT(*) AS bookings
       FROM bookings
       WHERE createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY DATE(createdAt)
       ORDER BY DATE(createdAt) ASC`
    );

    res.json({ payments, bookings });
  } catch (err) {
    console.error("Reports revenue error:", err);
    res.status(500).json({ message: err.message });
  }
});


//
// 8) Export CSV (GET /admin/export/bookings.csv)
//
app.get("/admin/export/bookings.csv", async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT b.id AS bookingId, b.homeId, h.homeName, b.name AS userName, b.email AS userEmail, b.phone,
              b.bookingType, b.status, b.createdAt
       FROM bookings b
       JOIN homes h ON b.homeId = h.id
       ORDER BY b.createdAt DESC`
    );
    const fields = ["bookingId", "homeId", "homeName", "userName", "userEmail", "phone", "bookingType", "status", "createdAt"];
    const parser = new Parser({ fields });
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("bookings.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Export CSV error:", err);
    res.status(500).json({ message: err.message });
  }
});

// delete a home by id
app.delete("/admin/homes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // use promise() for async/await support
    const [result] = await db.promise().execute(
      "DELETE FROM homes WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Home not found" });
    }

    res.json({ message: "Home deleted successfully" });
  } catch (err) {
    console.error("Error deleting home:", err);
    res.status(500).json({ message: "Failed to delete home" });
  }
});





// ✅ Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
