var generateDataTable;
/**
 * The main wrapper for generating a datatable based on a HTTP WS resource and column options.
 * @param tableName {String} - DOM ID where the datatable will be rendered
 * @param ajaxResource {String} - HTTP WebService where data is obtained.
 * @param columnOptions {Object} - Array with mixed inner types. If the inner type is a String, the data is rendered directly and corresponds to the column header text.
 * If an object, the key corresponds to the column header text.  Available sub object key-values are:
 * width: any allowed CSS width - % or px.
 * className: A class or space separated class to apply to the column.
 */
generateDataTable = function(tableName, ajaxResource, columnOptions) {
    /**
     * @namespace generateDataTable.helper
     */
    var helper = {};
    var shouldGenerateDefs = false;
    /**
     * Helper function to generate 'columns' property for the datatable (simple options)
     * @memberOf generateDataTable.helper
     * @param columnOptions {Multi[]} - Array of strings or mixed strings and objects.
     * @returns newColumns {Object[]} - array of objects for the column title text.
     */
    helper.generateColumnsArray = function(columnOptions) {
        var newColumns = [];
        columnOptions.forEach(function(individualCol, key) {
            // allow for columnOrdering or columnOptions
            if (typeof(individualCol) === 'object') {
                individualCol = Object.keys(individualCol)[0];
            }
            newColumns.push({
                title: individualCol
            });
        });
        return newColumns;
    };

    /**
     * Helper function that processes WS data into a universal format given the columns and columnDefs args to datatables.
     * @memberOf generateDataTable.helper
     * @param rawData - {Object[]} data from WS response.
     * @param columnOptions - {Object[]} - same as main constructor.
     */
    helper.manipulateDatasource = function(rawData, columnOptions) {
        // we may manipulate the columnOptions inside, so use a closure to prevent the original var from being manipulated.
        var newData = [];
        if (Array.isArray(rawData)) {
            rawData.map(function(individualData, key) {
                var individualArray = [];
                for (var i = 0; i < columnOptions.length; i++) {
                    // allow for an array of strings (columnOrdering) or a more configurable
                    // array of strings and Objects which contain additional options.
                    var tempColumnOption;
                    if (typeof(columnOptions[i]) === 'object') {
                        shouldGenerateDefs = true;
                        // prevent pass-by-reference without cloning entire columnOptions.
                        tempColumnOption = Object.keys(columnOptions[i])[0];
                    } else {
                        tempColumnOption = columnOptions[i];
                    }
                    if (individualData.hasOwnProperty(tempColumnOption)) {
                        individualArray.push(individualData[tempColumnOption]);
                    }
                }
                newData.push(individualArray);
            });
        } else {
            console.error('Expected Raw data to be of type array');
        }
        return newData;
    };
    /**
     * For an array of strings or objects, generates columnDefs acceptable for datatables.
     * @memberOf generateDataTable.helper
     * @param columnOptions {Multi[]} - From constructor.
     */
    helper.generateColumnDefs = function(columnOptions) {
        // determined in manipulateDatasource
        if (shouldGenerateDefs) {
            var columnDefs = [];
            columnOptions.map(function(columnOption, key) {
                if (typeof(columnOption) === 'object') {

                    // there's only one prop in the top-level which is the name of the column.
                    for (var prop in columnOption) {
                        // look in the sub-properties for the actual data that needs associated targets.
                        for (var subprop in columnOption[prop]) {
                            var individualDef = {};
                            individualDef[subprop] = columnOption[prop][subprop];
                            individualDef.targets = key;
                            columnDefs.push(individualDef);
                        }
                    }
                }
            });
            return columnDefs;
        } else {
            return null;
        }
    };
    /**
     * Helper - if you rely on a different library to make AJAX calls - use the global 'Ajax' to return data.
     @param ajaxResource - URL
     */
    var defaultAjaxHandler = function(ajaxResource) {
        return $.ajax({
            url: ajaxResource,
        }).done(function(data) {
            return data;
        });
    };

    var ajaxHandler = (typeof(Ajax) === 'function') ? Ajax(ajaxResource, null) : defaultAjaxHandler(ajaxResource);
    ajaxHandler.success(function(success) {
        $('#' + tableName).dataTable({
            "data": helper.manipulateDatasource(success, columnOptions),
            "columns": helper.generateColumnsArray(columnOptions),
            "columnDefs": helper.generateColumnDefs(columnOptions)
        });
    });
};
