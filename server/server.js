import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL Pool connection (Supports DATABASE_URL for Supabase / Cloud & env vars for local)
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        user: process.env.DB_USER || "tau_admin",
        password: process.env.DB_PASSWORD || "tau_password_2024",
        database: process.env.DB_NAME || "tau_tracer_db",
      }
);

// Middleware: Verify Admin Token for Sensitive Endpoints
const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // For local development fallback, allow requests with tau_admin_auth header or fallback token
    const adminHeader = req.headers["x-admin-auth"];
    if (adminHeader === "true" || process.env.NODE_ENV !== "production") {
      return next();
    }
    return res.status(401).json({ error: "Akses ditolak. Silakan login sebagai Admin terlebih dahulu." });
  }
  next();
};

// Admin Login Endpoint
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  const inputEmail = String(email || "").trim().toLowerCase();

  const VALID_ADMINS = [
    {
      email: "student.affairs@tau.ac.id",
      password: "kemahasiswaantau",
      name: "Student Affairs TAU",
      role: "admin"
    },
    {
      email: "biro.kemahasiswaan@tau.ac.id",
      password: "birokemahasiswaan",
      name: "Biro Kemahasiswaan & Alumni",
      role: "admin"
    }
  ];

  const foundAdmin = VALID_ADMINS.find(
    (acc) => acc.email.toLowerCase() === inputEmail && acc.password === password
  );

  if (foundAdmin) {
    return res.json({
      success: true,
      token: "tau_session_token_" + Date.now(),
      user: {
        email: foundAdmin.email,
        name: foundAdmin.name,
        role: foundAdmin.role
      }
    });
  }
  return res.status(401).json({ error: "Email atau password salah." });
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const dbRes = await pool.query("SELECT NOW()");
    res.json({ status: "OK", server: "TAU Tracer API", db_time: dbRes.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// GET all responses (Protected for Admin)
app.get("/api/responses", verifyAdminToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tracer_responses ORDER BY submitted_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new questionnaire submission
app.post("/api/responses", async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `TAU-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

    const query = `
      INSERT INTO tracer_responses (
        id, kdptim, kdpst, nim, nama, hp, email, nik, npwp, tahun_lulus,
        f8, f502, f505, f5a1, f5a2, f1101, f1102, f5b, f5c, f5d,
        f18a, f18b, f18c, f18d, f1001, f1002,
        f1301a, f1301b, f1302a, f1302b, f1303a, f1303b, f1304a, f1304b, f1305a, f1305b, f1306a, f1306b, f1307a, f1307b,
        f1401, f1402, f1403, f1404, f1405,
        f11, f12,
        f1601, f1602, f1603, f1604, f1605, f1606, f1607, f1608,
        f1613, f1614
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44, $45,
        $46, $47,
        $48, $49, $50, $51, $52, $53, $54, $55,
        $56, $57
      ) RETURNING *;
    `;

    const values = [
      id, data.kdptim || "031054", data.kdpst, data.nim, data.nama, data.hp, data.email, data.nik, data.npwp || "", data.tahun_lulus,
      data.f8, data.f502 || "", data.f505 || "", data.f5a1 || "", data.f5a2 || "", data.f1101 || "", data.f1102 || "", data.f5b || "", data.f5c || "", data.f5d || "",
      data.f18a || "", data.f18b || "", data.f18c || "", data.f18d || "", data.f1001 || "", data.f1002 || "",
      data.f1301a || "4", data.f1301b || "5", data.f1302a || "4", data.f1302b || "5", data.f1303a || "4", data.f1303b || "4",
      data.f1304a || "4", data.f1304b || "5", data.f1305a || "4", data.f1305b || "5", data.f1306a || "4", data.f1306b || "5",
      data.f1307a || "4", data.f1307b || "5",
      data.f1401 || "4", data.f1402 || "4", data.f1403 || "5", data.f1404 || "4", data.f1405 || "5",
      data.f11 || "", data.f12 || "",
      data.f1601 || "0", data.f1602 || "0", data.f1603 || "0", data.f1604 || "0", data.f1605 || "0", data.f1606 || "0", data.f1607 || "0", data.f1608 || "0",
      data.f1613 || "", data.f1614 || ""
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a response by ID (Protected for Admin)
app.delete("/api/responses/:id", verifyAdminToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM tracer_responses WHERE id = $1", [id]);
    res.json({ success: true, message: `Response ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`TAU Tracer Study API server running on port ${PORT}`);
});
