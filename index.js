import express from "express";
import bodyParser from "body-parser";
import pg from "pg";


const app = express();
const port = 3000;
let log = console.log;

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  password: "password",
  database: "toDoList",
  port: 5432
});


// Middleware
db.connect();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var itemList = [];
var level = 'date';
var selectedDate = new Date();
var selectedWeek = current_week(selectedDate); 
var selectedMonth = selectedDate.getMonth();  
var selectedYear = selectedDate.getFullYear();
var id_currentDate;


function current_week(date) {
  const d = date;
  let yearStart = +new Date(d.getFullYear(), 0, 1);
  let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
  let dayOfYear = ((today - yearStart + 1) / 86400000);
  let week = Math.ceil(dayOfYear / 7);
  return week;
}

app.get("/", async (req, res) => {
  let results_date;
  let results_insert;
  try {

    switch (level) {
      case "date":
        if(typeof(selectedDate)==='string'){
        const formattedDateString = selectedDate.replace(" GMT", "").replace("GMT", "").replace("GMT", "").replace("GMT", "") + "-05:00";
        selectedDate = new Date(formattedDateString);
        }

        results_date = await db.query("select id from dates where date = $1 ", [selectedDate]);
        if (results_date.rows.length === 0) {
          results_insert = await db.query("insert into dates (date) values ($1)", [selectedDate]);
          results_date = await db.query("select id from dates where date = $1", [selectedDate]);
        }
        break;

      case "week":
        results_date = await db.query("select id from weeks where week = $1 and year = $2", [selectedWeek, selectedYear]);
        if (results_date.rows.length === 0) {
          results_insert = await db.query("insert into weeks (week, year) values ($1, $2)", [selectedWeek, selectedYear]);
          results_date = await db.query("select id from weeks where week = $1 and year = $2", [selectedWeek, selectedYear]);
        }
        break;

      case "month":
        results_date = await db.query("select id from months where month = $1 and year = $2", [selectedMonth, selectedYear]);
        if (results_date.rows.length === 0) {
          results_insert = await db.query("insert into months (month, year) values ($1, $2)", [selectedMonth, selectedYear]);
          results_date = await db.query("select id from months where month = $1 and year = $2", [selectedMonth, selectedYear]);
        }
        break;

      case "year":
        results_date = await db.query("select id from years where year = $1 ", [selectedYear]);
        if (results_date.rows.length === 0) {
          results_insert = await db.query("insert into years (year) values ($1)", [selectedYear]);
          results_date = await db.query("select id from years where year = $1", [selectedYear]);
        }
        break;

      default:
        break;
    }



  } catch (error) {
    console.error(error);
  }

  id_currentDate = results_date.rows[0].id;
  const results = await db.query("select * from items  where level = $1 and fk = $2 order by id", [level, id_currentDate]);
  itemList = results.rows;

  res.render('index.ejs', { itemList: itemList,
                           currentSelection: level, 
                           currentDate:selectedDate, 
                           currentWeek: selectedWeek,
                           currentMonth: selectedMonth, 
                           currentYear: selectedYear
  });

})

app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  try {
    const results = await db.query("insert into items (item, level, fk) values($1, $2, $3)", [item, level, id_currentDate]);
  } catch (error) {
    console.error(error);

  }
  res.redirect("/");

})

// Handling edit request
app.post("/edit", async (req, res) => {
  const item = req.body.editedText;
  const id = req.body.id;
  try {
    const results = await db.query("update items set item = $1 where id = $2 and level = $3 and fk = $4", [item, id, level, id_currentDate]);
  } catch (error) {
    console.error(error);

  }
  res.redirect("/");
})

// handling delete request
app.post("/delete", async (req, res) => {
  const id = req.body.deletedItemId; 
  try {
    const results = await db.query("delete from items where id = $1", [id])
  } catch (error) {
    console.log(error);
  }
  res.redirect("/"); 
})

// Handling item completed request
app.post("/strikeThrough", async (req, res) => {
  const id = req.body.itemId;
  const done = req.body.itemDone;
  try {
    const results = await db.query("update items set done = $1 where id = $2", [done, id])
  } catch (error) {
    console.log(error);
  }
  res.redirect("/");
})

// Handling request when Level is switched between daily/weekly/monthly/yearly level
app.post("/updateSelection", async (req, res) => {
  level = req.body.selection;
  switch (level) {
    case "date":
      selectedDate = req.body.date;
      break;

    case "week":
      selectedWeek = req.body.week;
      selectedYear = req.body.year;
      break;

    case "month":
      selectedMonth = req.body.month;
      selectedYear = req.body.year;
      break;

    case "year":
      selectedYear = req.body.year;
      break;

    default:
      break;
  }
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
