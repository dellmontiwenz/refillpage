var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var temp1 = [];
var temp = [];
const SLOTINFO_FILE_DIR = 'files/';
const SERVER_PORT = 3050;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static('static'));
app.use(express.static('node_modules'));
//app.use('/', indexRouter);
app.use('/users', usersRouter);



function readStock() {
    fs.readFile('files/main.json', (err, data) => {       ///home/machine/atom-files/main.json
        if(err) throw err;
        temp = JSON.parse(data);
        temp1 = temp;
        saveData();
    });
}

function saveStock() {
  fs.writeFile(SLOTINFO_FILE_DIR + 'main' + '.json', JSON.stringify(temp1, null, 2), 'utf8', (err) => {
    if (err) {
        console.log('Failed to save new slot info to main.json');
		//logger.error('Failed to save slot info to file.');
		//logger.error({ error: err });
    } else {
        console.log('Successfully saved the new slot info to main.json' );
        //logger.info('Success to save slot info to file.');
    }
  });
}


function saveData() {
  fs.writeFile(SLOTINFO_FILE_DIR + 'tempstockinfo' + '.json', JSON.stringify(temp, null, 2), 'utf8', (err) => {
    if (err) {
        console.log('Failed to backup main.json');
		//logger.error('Failed to save slot info to file.');
		//logger.error({ error: err });
    } else {
        console.log('Successfully backup main.json' );
        //logger.info('Success to save slot info to file.');
    }
  });
}

app.post('/stock-update', function(req, res) {
	if (typeof req.body.slotinfo != 'undefined') {
		//refillStock(req.body.slotinfo);
        var newSlotInfo = req.body.slotinfo;
        Object.keys(newSlotInfo).forEach(function(keys) {
           temp1[keys].stock = newSlotInfo[keys].stock;
           temp1[keys].capacity = newSlotInfo[keys].max;
        });
		res.contentType('json');
		res.send({ result: 0 });
		saveStock();
	} else {
		res.contentType('json');
		res.send({ result: -1 });
	}
});

app.get('/', function(req, res){
  readStock();
  setTimeout(function(){
    res.render('pages/stock', {
        title: 'Atom-vending-touch Refill Page Express',
        slotinfo: temp
    });
  },500);

});

function refillStock (newSlotInfo) {

}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = app.listen(SERVER_PORT, () => {
  console.log(`Atom-Vending-Touch-Refill_page service port is ${SERVER_PORT}`);
});

module.exports = app;
