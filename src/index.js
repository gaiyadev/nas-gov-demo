const express = require("express");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { body } = require("express-validator");
const Nin = require("./entities/Nin");
const Bvn = require("./entities/Bvn");
const User = require("./entities/user");
const swaggerUi = require("swagger-ui-express");
const { sequelize } = require('./entities/database');
const swaggerDocument = require("./../swagger.json"); //
const cors = require("cors"); //

const app = express();
app.use(express.json());
app.use(cors('*'));

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Synchronize the models with the database (create tables)
sequelize.sync()
  .then(() => {
    console.log('Tables created successfully.');
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });
// Signup API endpoint
app.post(
  "/signup",
  [
    body("ninNumber").notEmpty().withMessage("NIN number is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").notEmpty().withMessage("email name is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { ninNumber, firstName, lastName, password, email } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this NIN number already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        ninNumber,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Login API endpoint
app.post(
  "/login",
  [
    body("email").notEmpty().withMessage("email number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Invalid email or password" });
      }
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.get("/", (req, res) => {
  res.status(500).json({ message: "Internal Server Error" });
});

app.get("/nin/:nin", async (req, res) => {
  const nin = await Nin.findOne({ where: { ninNumber: req.params.nin } });
  res.status(200).json({ data: nin });
});

app.get("/bvn/:bvn", async (req, res) => {
  const nin = await Bvn.findOne({ where: { bvnNumber: req.params.bvn } });
  res.status(200).json({ data: nin });
});

app.get("/bvn", async (req, res) => {
  const bvn = await Bvn.findAll();
  res.status(200).json({ data: bvn });
});

app.get("/nin", async (req, res) => {
  const nin = await Nin.findAll();
  res.status(200).json({ data: nin });
});

app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.status(200).json({ data: users });
});

app.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.status(200).json({ data: user });
});

app.post("/seed-nin", async (req, res) => {
  try {
    await Nin.bulkCreate([
      { ninNumber: "123456789A", firstName: "John", lastName: "Doe" },
      { ninNumber: "987654321B", firstName: "Alice", lastName: "Smith" },
      { ninNumber: "987054321B", firstName: "Alice", lastName: "Smith" },
      { ninNumber: "187054321B", firstName: "Alice", lastName: "Smith" },
    ]);

    res.status(201).json({ message: "Nin data seeded successfully." });
  } catch (error) {
    console.error("Error seeding Nin data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/seed-bvn", async (req, res) => {
  try {
    await Bvn.bulkCreate([
      { bvnNumber: "11111111111", firstName: "Smith", lastName: 'drill' },
      { bvnNumber: "22222222222", firstName: "jonhn", lastName: 'drill'},
      { bvnNumber: "22222202222" , firstName: "jonhn", lastName: 'Alice'},
      { bvnNumber: "222226822222" , firstName: "Alice", lastName: 'drill'},
      { bvnNumber: "32222222222" , firstName: "Alice", lastName: 'drill'},

      // Add more Bvn records as needed
    ]);

    res.status(201).json({ message: "Bvn data seeded successfully." });
  } catch (error) {
    console.error("Error seeding Bvn data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/seed-users", async (req, res) => {
  try {
    await User.bulkCreate([
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "hashed_password",
      },
      {
        firstName: "Alice",
        lastName: "Smith",
        email: "alice.smith@example.com",
        password: "hashed_password",
      },
    ]);

    res.status(201).json({ message: "User data seeded successfully." });
  } catch (error) {
    console.error("Error seeding User data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
