/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.export',
  name: 'PDFGoogleSheetsExportDriver',

  implements: [ 'foam.nanos.export.ExportDriver' ],

  requires: [
    'foam.nanos.export.GoogleSheetsOutputter'
  ],

  properties: [
    {
      name: 'outputter',
      factory: function() {
        return this.GoogleSheetsOutputter.create();
      }
    }
  ],
  methods: [
    async function exportFObject(X, obj, config) {
        var self = this;
        
        var sheetId  = '';
        var stringArray = [];
        var props = X.filteredTableColumns ? X.filteredTableColumns : self.outputter.getAllPropertyNames(dao.of);
        var metadata = self.outputter.getColumnMethadata(dao.of, props);
        stringArray.push(metadata.map(m => m.columnLabel));
        var values = self.outputter.outputArray([ obj ], metadata);
        stringArray = stringArray.concat(values);

        sheetId = await X.googleSheetsDataExport.createSheet(stringArray, metadata, config);
        if ( ! sheetId || sheetId.length == 0)
          return '';
        var url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?exportFormat=pdf&format=pdf&scale=3`;
        X.googleSheetsDataExport.deleteSheet(sheetId);
        return url;
    },
    async function exportDAO(X, dao, config) {
      var self = this;
      
      var sink = await dao.select();
      var sheetId  = '';
      var stringArray = [];
      var props = X.filteredTableColumns ? X.filteredTableColumns : self.outputter.getAllPropertyNames(dao.of);
      var metadata = self.outputter.getColumnMethadata(dao.of, props);
      stringArray.push(metadata.map(m => m.columnLabel));
      var values = self.outputter.outputArray(sink.array, metadata);
      stringArray = stringArray.concat(values);

      sheetId = await X.googleSheetsDataExport.createSheet(stringArray, metadata, config);
      if ( ! sheetId || sheetId.length == 0)
        return '';
      var url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?exportFormat=pdf&format=pdf&scale=3`;
      X.googleSheetsDataExport.deleteSheet(sheetId);
      return url;
    }
  ]
});