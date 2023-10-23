const express = require("express");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { body } = require("express-validator");
const Nin = require("./entities/Nin");
const Bvn = require("./entities/Bvn");
const User = require("./entities/user");
const swaggerUi = require("swagger-ui-express");
const { sequelize } = require("./entities/database");
const swaggerDocument = require("../swagger.json"); //
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Synchronize the models with the database (create tables)
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Tables created successfully.");
  })
  .catch((error) => {
    console.error("Error occurred:", error);
  });
// Signup API endpoint
app.post(
  "/signup",
  [
    body("uniqueNumber")
      .notEmpty()
      .withMessage("NIN or bvn number is required"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("email").notEmpty().withMessage("email name is required"),
    body("state").notEmpty().withMessage("state name is required"),
    body("local").notEmpty().withMessage("local name is required"),
    body("jobTitle").notEmpty().withMessage("jobTitle name is required"),
    body("disabilityStatus")
      .notEmpty()
      .withMessage("disabilityStatus name is required"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("accessToHousing")
      .notEmpty()
      .withMessage("accessToHousing is required"),
    body("houseHoldCount").notEmpty().withMessage("houseHoldCount is required"),
    body("incomeLevel").notEmpty().withMessage("incomeLevel is required"),
    body("healthInsurance")
      .notEmpty()
      .withMessage("healthInsurance is required"),
    body("homeOwnership").notEmpty().withMessage("homeOwnership is required"),
    body("otherSourcesOfIncome")
      .notEmpty()
      .withMessage("otherSourcesOfIncome is required"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("otherSourcesOfIncome is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        uniqueNumber,
        firstName,
        lastName,
        password,
        email,
        state,
        local,
        disabilityStatus,
        jobTitle,
        accessToHousing,
        houseHoldCount,
        incomeLevel,
        healthInsurance,
        otherSourcesOfIncome,
        homeOwnership,
        phoneNumber,
      } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email number already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        uniqueNumber,
        state,
        local,
        jobtitle: jobTitle,
        disabilityStatus,
        password: hashedPassword,
        accessToHousing,
        houseHoldCount,
        incomeLevel,
        healthInsurance,
        otherSourcesOfIncome,
        homeOwnership,
        phoneNumber,
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
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome" });
});

app.post("/nin", async (req, res) => {
  const nin = await Nin.findOne({ where: { ninNumber: req.body.nin } });
  res.status(200).json({ data: nin });
});

app.post("/bvn", async (req, res) => {
  const bvn = await Bvn.findOne({ where: { bvnNumber: req.body.bvn } });
  res.status(200).json({ data: bvn });
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
  const user = await User.findOne({ where: { uniqueNumber: req.params.id } });
  res.status(200).json({ data: user });
});

app.post("/seed-nin", async (req, res) => {
  try {
    await Nin.bulkCreate([
      {
        ninNumber: "112233445A",
        firstName: "Liam",
        lastName: "Johnson",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "Chronic Illness",
      },
      {
        ninNumber: "556677889B",
        firstName: "Emma",
        lastName: "Martinez",
        state: "lagos",
        jobtitle: "doctor",
        local: "ikeja",
        disabilityStatus: "Visual Impairment",
      },
      {
        ninNumber: "990011223C",
        firstName: "Mia",
        lastName: "Smith",
        state: "abuja",
        jobtitle: "teacher",
        local: "wuse",
        disabilityStatus: "None",
      },
      {
        ninNumber: "334455667D",
        firstName: "Noah",
        lastName: "Brown",
        state: "rivers",
        jobtitle: "nurse",
        local: "port harcourt",
        disabilityStatus: "Hearing Impairment",
      },
      {
        ninNumber: "778899001E",
        firstName: "Oliver",
        lastName: "Davis",
        state: "enugu",
        jobtitle: "scientist",
        local: "enugu north",
        disabilityStatus: "None",
      },
      {
        ninNumber: "112233445F",
        firstName: "Ava",
        lastName: "Martinez",
        state: "kaduna",
        jobtitle: "artist",
        local: "zaria",
        disabilityStatus: "None",
      },
      {
        ninNumber: "556677889G",
        firstName: "Lucas",
        lastName: "Garcia",
        state: "delta",
        jobtitle: "lawyer",
        local: "asaba",
        disabilityStatus: "None",
      },
      {
        ninNumber: "990011223H",
        firstName: "Sophia",
        lastName: "Lee",
        state: "ondo",
        jobtitle: "pilot",
        local: "akure",
        disabilityStatus: "None",
      },
      {
        ninNumber: "334455667I",
        firstName: "Jackson",
        lastName: "Lopez",
        state: "osun",
        jobtitle: "chef",
        local: "osogbo",
        disabilityStatus: "Speech Impairment",
      },
      {
        ninNumber: "778899001J",
        firstName: "Amelia",
        lastName: "Thomas",
        state: "kogi",
        jobtitle: "architect",
        local: "lokoja",
        disabilityStatus: "None",
      },
      {
        ninNumber: "987654321B",
        firstName: "Alice",
        lastName: "Smith",
        state: "lagos",
        jobtitle: "engineer",
        local: "ikoyi",
        disabilityStatus: "None",
      },
      {
        ninNumber: "234567890C",
        firstName: "Michael",
        lastName: "Johnson",
        state: "abuja",
        jobtitle: "teacher",
        local: "garki",
        disabilityStatus: "None",
      },
      {
        ninNumber: "345678901D",
        firstName: "Emily",
        lastName: "Brown",
        state: "enugu",
        jobtitle: "nurse",
        local: "nsukka",
        disabilityStatus: "Mobility Impairment",
      },
      {
        ninNumber: "456789012E",
        firstName: "David",
        lastName: "Williams",
        state: "rivers",
        jobtitle: "scientist",
        local: "port harcourt",
        disabilityStatus: "None",
      },
      {
        ninNumber: "567890123F",
        firstName: "Olivia",
        lastName: "Davis",
        state: "ogun",
        jobtitle: "artist",
        local: "abeokuta",
        disabilityStatus: "None",
      },
      {
        ninNumber: "678901234G",
        firstName: "Daniel",
        lastName: "Wilson",
        state: "benue",
        jobtitle: "lawyer",
        local: "makurdi",
        disabilityStatus: "Cognitive Impairment",
      },
      {
        ninNumber: "789012345H",
        firstName: "Sophia",
        lastName: "Anderson",
        state: "kano",
        jobtitle: "pilot",
        local: "kano city",
        disabilityStatus: "None",
      },
      {
        ninNumber: "890123456I",
        firstName: "James",
        lastName: "Clark",
        state: "delta",
        jobtitle: "chef",
        local: "warri",
        disabilityStatus: "None",
      },
      {
        ninNumber: "901234567J",
        firstName: "Ava",
        lastName: "Moore",
        state: "plateau",
        jobtitle: "architect",
        local: "jos",
        disabilityStatus: "Speech Impairment",
      },
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
      {
        bvnNumber: "11111111111",
        firstName: "Smith",
        lastName: "Drill",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "22222222222",
        firstName: "John",
        lastName: "Drill",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "33333333333",
        firstName: "Alice",
        lastName: "Johnson",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "44444444444",
        firstName: "Michael",
        lastName: "Smith",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "55555555555",
        firstName: "Emma",
        lastName: "Davis",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "Hearing Impairment",
      },
      {
        bvnNumber: "66666666666",
        firstName: "Daniel",
        lastName: "Wilson",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "Chronic Illness",
      },
      {
        bvnNumber: "77777777777",
        firstName: "Olivia",
        lastName: "Moore",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "88888888888",
        firstName: "James",
        lastName: "Anderson",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "99999999999",
        firstName: "Sophia",
        lastName: "Martinez",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "10101010101",
        firstName: "Liam",
        lastName: "Garcia",
        state: "kano",
        jobtitle: "engineer",
        local: "kumbotso",
        disabilityStatus: "None",
      },
      {
        bvnNumber: "11122334455",
        firstName: "Eva",
        lastName: "Johnson",
        state: "lagos",
        jobtitle: "software developer",
        local: "ikeja",
        disabilityStatus: "Visual Impairment",
      },
      {
        bvnNumber: "22334455667",
        firstName: "Isaac",
        lastName: "Williams",
        state: "abuja",
        jobtitle: "data scientist",
        local: "garki",
        disabilityStatus: "Hearing Impairment",
      },
      {
        bvnNumber: "33445566778",
        firstName: "Zara",
        lastName: "Smith",
        state: "kaduna",
        jobtitle: "civil engineer",
        local: "kawo",
        disabilityStatus: "Mobility Impairment",
      },
      {
        bvnNumber: "44556677889",
        firstName: "Oscar",
        lastName: "Davis",
        state: "rivers",
        jobtitle: "graphic designer",
        local: "port harcourt",
        disabilityStatus: "Cognitive Impairment",
      },
      {
        bvnNumber: "55667788990",
        firstName: "Hannah",
        lastName: "Brown",
        state: "enugu",
        jobtitle: "architect",
        local: "nsukka",
        disabilityStatus: "Speech Impairment",
      },
      {
        bvnNumber: "66778899011",
        firstName: "Leo",
        lastName: "Martinez",
        state: "delta",
        jobtitle: "mechanical engineer",
        local: "warri",
        disabilityStatus: "Neurological Impairment",
      },
      {
        bvnNumber: "77889901122",
        firstName: "Aria",
        lastName: "Garcia",
        state: "ondo",
        jobtitle: "pharmacist",
        local: "akure",
        disabilityStatus: "Developmental Disability",
      },
      {
        bvnNumber: "88990011233",
        firstName: "Elijah",
        lastName: "Lopez",
        state: "osun",
        jobtitle: "doctor",
        local: "osogbo",
        disabilityStatus: "Psychiatric Disability",
      },
      {
        bvnNumber: "99001122344",
        firstName: "Luna",
        lastName: "Wilson",
        state: "kogi",
        jobtitle: "biologist",
        local: "lokoja",
        disabilityStatus: "Chronic Illness",
      },
      {
        bvnNumber: "00112233445",
        firstName: "Felix",
        lastName: "Moore",
        state: "benue",
        jobtitle: "chemist",
        local: "makurdi",
        disabilityStatus: "Other (Specify)",
      },
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
        firstName: "Emma",
        lastName: "Johnson",
        email: "emma.johnson@example.com",
        password: "hashed_password",
        state: "lagos",
        jobtitle: "software engineer",
        local: "ikeja",
        disabilityStatus: "Developmental Disability",
        uniqueNumber: "234567890B",
      },
      {
        firstName: "Michael",
        lastName: "Davis",
        email: "michael.davis@example.com",
        password: "hashed_password",
        state: "abuja",
        jobtitle: "data scientist",
        local: "garki",
        disabilityStatus: "Visual Impairment",
        uniqueNumber: "345678901C",
      },
      {
        firstName: "Olivia",
        lastName: "Moore",
        email: "olivia.moore@example.com",
        password: "hashed_password",
        state: "kano",
        jobtitle: "civil engineer",
        local: "kumbotso",
        disabilityStatus: "Speech Impairment",
        uniqueNumber: "65432109833",
      },
      {
        firstName: "Daniel",
        lastName: "Wilson",
        email: "daniel.wilson@example.com",
        password: "hashed_password",
        state: "rivers",
        jobtitle: "graphic designer",
        local: "port harcourt",
        disabilityStatus: "Mobility Impairment",
        uniqueNumber: "54321098744",
      },
      {
        firstName: "Sophia",
        lastName: "Martinez",
        email: "sophia.martinez@example.com",
        password: "hashed_password",
        state: "enugu",
        jobtitle: "architect",
        local: "nsukka",
        disabilityStatus: "None",
        uniqueNumber: "43210987655",
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
