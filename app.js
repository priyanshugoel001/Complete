require("dotenv").config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const { google } = require("googleapis")

var bodyParser = require('body-parser')

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files 
app.use(express.urlencoded({ extended: true })) //To extract the data from the website to the app.js file
app.use(bodyParser.json());

// app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css'))) 
// app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js'))) 
// app.use('/jq', express.static(path.join(__dirname, '../node_modules/jquery/dist'))) 
app.use(cookieParser())

// PUG SPECIFIC STUFF
// app.set('view engine', 'pug') // Set the template engine as pug
// app.set('views', path.join(__dirname, '../views')) // Set the views directory

// Home Page
app.get("/", (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ a: 1 }, null, 3));
  
});
app.post("/requestDemo", async (req, res) => {
  if (!req.body.name || !req.body.companyName || !req.body.companyEmail || !req.body.contactNumber || !req.body.fromWhereDidYouHear) {
    res.status(400).send();
    //res.send("Validation error");
  } else {
    try{
      const { name, companyName, companyEmail, contactNumber, fromWhereDidYouHear } = req.body;
      console.log("Form data submitted is " + JSON.stringify(req.body))
      const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
    
      // Create client instance for auths
      const client = await auth.getClient();
    
      // Instance of Google Sheets API
      const googleSheets = google.sheets({ version: "v4", auth: client });
    
      const spreadsheetId = "1I5XxpLwTMCi6ARlhWrJSfFKaEa8TVgWJbFTA548BhLw";
    
      // Get metadata about spreadsheet
      const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
      });
      
      await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:E",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [[name, companyName, companyEmail, contactNumber, fromWhereDidYouHear]],
        },
      });
      res.status(200).send();
      //res.redirect("../../");
      //res.send("Successfully submitted! Thank you!");
    } catch (e) {
      console.log("Error in Submitting Form data is " + e);
      res.status(500).send();
    }
  }
});

//listening on specified Port
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
