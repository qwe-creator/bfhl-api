import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));


const FULL_NAME_LOWER = "niha_pogaku";      
const DOB_DDMMYYYY    = "09122004";       
const EMAIL_ID        = "nihapogaku76@gmail.com";  
const ROLL_NUMBER     = "22BRS1160";       

const USER_ID = `${FULL_NAME_LOWER}_${DOB_DDMMYYYY}`;


const isAlphaOnly = (s) => /^[A-Za-z]+$/.test(s);
const isDigitOnly = (s) => /^-?\d+$/.test(s); 

function buildReverseAlternatingCaps(allAlphaChars) {
  const rev = allAlphaChars.slice().reverse();
  const out = rev.map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()));
  return out.join("");
}

app.post("/bfhl", (req, res) => {
  try {
    const data = req?.body?.data;
    if (!Array.isArray(data)) {
      return res.status(200).json({
        is_success: false,
        user_id: USER_ID,
        email: EMAIL_ID,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        error: "Invalid payload: 'data' must be an array of strings."
      });
    }

  
    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];            
    const special_characters = [];   
    const alphaCharsFlat = [];      

    let sumNumbers = 0;

    for (const token of data) {
      const s = String(token);

     
      for (const ch of s) {
        if (/[A-Za-z]/.test(ch)) alphaCharsFlat.push(ch);
      }

      if (isDigitOnly(s)) {
       
        const n = parseInt(s, 10);
        sumNumbers += n;
        if (Math.abs(n % 2) === 1) odd_numbers.push(s);
        else even_numbers.push(s);
      } else if (isAlphaOnly(s)) {
        alphabets.push(s.toUpperCase());
      } else {
       
        special_characters.push(s);
      }
    }

    const concat_string = buildReverseAlternatingCaps(alphaCharsFlat);
    const sum = String(sumNumbers);

    return res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL_ID,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum,
      concat_string
    });
  } catch (err) {
   
    return res.status(200).json({
      is_success: false,
      user_id: USER_ID,
      email: EMAIL_ID,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Server error. Please try again."
    });
  }
});


app.get("/", (_req, res) => {
  res.status(200).send("BFHL API up. POST /bfhl");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});

export default app;
