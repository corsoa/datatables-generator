var express = require('express');
var app = express();

app.use(function(req, res, next) {
    // Set cross-origin headers to receive content on different port (if desired)
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'));

app.get('/', function(req, res, next) {
    res.sendFile('index.html', {
        root: __dirname
    });
});

app.get('/generateRandomImage', function(req, res, next) {
    // let's not DDOS some poor site.
    var gm = require('gm');

    var fill = '#' + ('000000' + (Math.random() * 0xFFFFFF << 0).toString(16)).slice(-6);

    gm(100, 100, '#fff')
        .fill(fill)
        .drawRectangle(0, 0, 100, 100)
        .stroke(fill, 2)
        .toBuffer('PNG', function(err, buffer) {
            if (err) {
                console.log(err);
            } else {
                console.log('Generated random image with fill ' + fill);

                res.writeHead(200, {
                    'Content-Type': 'image/png'
                });
                res.end(buffer, 'binary');
            }
        });
});

app.get('/ajax', function(req, res, next) {
    // propNames param is the parameters that should be
    // generate.
    // throw an error if required params aren't there.
    var response;
    var generateLoremIpsum = function() {
        var allText = ' Loremipsu mdolorsitamet,consec teturadipi scingelit,seddoeiusmodtempori ncididuntutlaboreet dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse';
        // generate random number of wrods.
        var numWords = parseInt(Math.random() * (allText.split(' ').length - 1) + 1);
        randomText = [];
        allText.split(' ').map(function(word, key) {
            if (key < numWords) {
                randomText.push(word);
            }
        });
        randomText
            .push('SUPERSUPERSUPERSUPERSUPERSUPERSUPERLONGTEXTSUPERSUPERSUPERSUPERSUPERSUPERSUPERLONGTEXT');
        return randomText.join(' ');
    };

    if (!req.query.columns || !req.query.numRows) {
        response = 'Missing parameters.';
    } else {
        var columns = req.query.columns.split(',');
        var numRows = req.query.numRows;
        response = [];
        if (req.query.nonUsedCols) {
            columns = columns.concat(['BogusData1', 'BogusData2', 'BogusData3']);
        }
        for (var i = 0; i < numRows; i++) {
            var objToPush = {};
            for (var j = 0; j < columns.length; j++) {
                var indColumn = columns[j],
                    content;
                // if the column starts with 'Bogus', push null data into it.
                if (columns[j].indexOf('Bogus') === 0) {
                    content = null;
                } else if (columns[j].toLowerCase().indexOf('image') === 0) {
                    /*
                     * if useImages param was flagged and the column starts with 'image', generate some HTML
                     * dataTables does some optimization on images; if it sees a duplicate <img> src, it only performs
                     * an $.ajax once.  Throw some params at the end to make multiple requests.
                     */
                    var generatedImageURL = req.protocol + '://' + req.get('host') + '/generateRandomImage' + '?randomParams=' + parseInt(Math.random() * 10000);
                    content = '<img src="' + generatedImageURL + '" />';
                } else if (columns[j].toLowerCase().indexOf('message') === 0 && req.query.useFormattedText) {
                    // generate some Lorem Ipsum
                    content = '<h3>' + generateLoremIpsum() + '</h3>';
                } else {
                    content = columns[j] + parseInt(Math.random() * 10000);
                }
                objToPush[indColumn] = content;
            }
            response.push(objToPush);
        }
    }

    res.send(response);
});

var server = app.listen(process.env.PORT || 3000, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('datatables-generator listening at http://%s:%s', host, port);

});
