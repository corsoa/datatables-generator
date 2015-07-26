datatables-generator
====================

Making [datatables](https://www.datatables.net/ ) play nicer with RESTful WebService data.
```
generateDataTable('myDatatableDiv', 'my/api/user-devices', ['Device Name', 'Image', {'Attributes': {width: '300px'}]);
```

Makes the building of columns vs. columnDefs easy and to minimize transport load on the server for large datasets.

You may also include special 'Delete' columns or 'Group Action' functionality which is best viewed through the examples.

To view the examples:

```
npm install
npm start
```
