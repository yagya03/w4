var express = require("express");
var fs = require("fs");
var bodyParser = require("body-parser");

var app = express();

// Middleware for parsing URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Home Route
app.get("/", function (req, res) {
    res.send("Hello, this is my first Express application!");
});

// Start the server
app.listen(5000, function () {
    console.log("Server is running on port 5000");
});

// Route to Get All Students
app.get("/GetStudents", function (req, res) {
    fs.readFile(__dirname + "/Student.json", "utf8", function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).json({
                status: false,
                Status_Code: 500,
                message: "Error reading student data",
            });
        } else {
            res.json({
                status: true,
                Status_Code: 200,
                requestedAt: new Date().toISOString(),
                requrl: req.url,
                requestMethod: req.method,
                studentData: JSON.parse(data),
            });
        }
    });
});

// Route to Get Student by ID
app.get("/GetStudentid/:id", (req, res) => {
    fs.readFile(__dirname + "/Student.json", "utf8", function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).json({
                status: false,
                Status_Code: 500,
                message: "Error reading student data",
            });
        } else {
            var students = JSON.parse(data);
            var student = students["Student" + req.params.id];
            if (student) {
                res.json(student);
            } else {
                res.status(404).json({
                    status: false,
                    Status_Code: 404,
                    message: "Student not found",
                });
            }
        }
    });
});

// Serve the Student Info HTML File
app.get("/studentinfo", function (req, res) {
    res.sendFile("StudentInfo.html", { root: __dirname });
});

// Route to Handle Form Submission
app.post("/submit-data", function (req, res) {
    // Safeguard against missing input values
    var name = (req.body.firstName || "N/A") + " " + (req.body.lastName || "N/A");
    var ageAndGender = `Age: ${req.body.myAge || "N/A"}, Gender: ${req.body.gender || "N/A"}`;
    var qualifications = req.body.Qual || "N/A";

    // Log form data for debugging
    console.log("Received Form Data:", req.body);

    // Send response
    res.send({
        status: true,
        message: "Form Details Submitted Successfully",
        data: {
            name: name,
            ageAndGender: ageAndGender,
            qualifications: qualifications,
        },
    });
});
