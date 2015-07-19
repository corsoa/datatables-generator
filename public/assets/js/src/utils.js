/**
 * Helper methods for routing
 */
var loadPartial = function(jObj) {
    var partialPage = $(jObj).attr('id').substr(0, $(jObj).attr('id').indexOf('_'));
    $.ajax({
        url: 'assets/partials/' + partialPage + '.html',
        context: document.body
    }).done(function(data) {
        $('#content').html(data);
        //find any textareas with .code class and codemirror
        $('textarea.code').each(function(key, textarea) {
            CodeMirror.fromTextArea(textarea, {
                lineNumbers: true,
                mode: 'javascript'
            });
        });
    });
};
$(document).ready(function() {
    $('#documentation-iframe').hide();
    $('.navbar ul li a').click(function(e) {
        if ($(this).attr('id').indexOf('documentation') !== -1) {
            $('#content').hide();
            return loadDocumentation();
        } else {
            $('#content').show();
            loadPartial($(this));
            $('#documentation-iframe').hide();
        }
        return true;
    });
});

var loadDocumentation = function() {
    $('#documentation-iframe').attr('src', 'doc/');
    $('#documentation-iframe').show();
    return false; //jQuery strangeness - when changing src of iframe dynamically, your function must return false to prevent navigation.
};

/**
 * Helper method for WebService query.
 */
var constructURL = function(base, columnDefintions, numRows, nonUsedCols, useImages, useFormattedText) {
    // helper method - buklds a URL to send to the express server based off the
    // column definitions and num rows.
    var resultColumns = [];
    columnDefintions.map(function(columnDefinition, key) {
        if (typeof(columnDefinition) === 'object') {
            resultColumns.push(Object.keys(columnDefinition)[0]);
        } else {
            resultColumns.push(columnDefinition);
        }
    });

    var builtURL = base + '?columns=' + resultColumns.join(",") + '&numRows=' + numRows;
    if (typeof(nonUsedCols) !== 'undefined' && nonUsedCols) {
        builtURL += '&nonUsedCols=true';
    }
    if (typeof(useImages) !== 'undefined' && useImages) {
        builtURL += '&useImages=true';
    }
    if (typeof(useFormattedText) !== 'undefined' && useFormattedText) {
        builtURL += '&useFormattedText=true';
    }
    return builtURL;
};

// Example of alternative means to provide WebService data.
var Ajax = function(requestURL, secondParam) {
    return $.ajax({
        url: requestURL,
    }).done(function(data) {
        return data;
    });
};
