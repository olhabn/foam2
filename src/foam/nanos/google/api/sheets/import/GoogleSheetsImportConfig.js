/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

 foam.CLASS({
  package: 'foam.nanos.google.api.sheets',
  name: 'GoogleSheetsImportConfig',
  documentation: 'GoogleSheetsImportConfig contains info about import',
  properties: [
    {
      name: 'importClassInfo',
      class: 'Class',
      javaType: 'foam.core.ClassInfo',
      hidden: true,
    },
    {
      name: 'googleSheetLink',
      class: 'String',
      label: 'Google Sheets Link',
      postSet: function() {
        var findMatch = this.googleSheetLink.match(this.SPREADSHEET_ID_REGEX);
       this.googleSpreadsheetId = findMatch ? findMatch[1]: findMatch;
      },
      required: true
    },
    {
      name: 'cellsRange',
      class: 'String',
      hidden: true
    },
    {
      name: 'googleSpreadsheetId',
      class: 'String',
      label: 'Google Spreadsheet Id',
      hidden: true,
      expression: function(googleSheetLink) {
        var findMatch = googleSheetLink.match(this.SPREADSHEET_ID_REGEX);
        return  findMatch ? findMatch[1] : findMatch;
      }
    },
    {
      name: 'googleSheetId',
      class: 'String',
      label: 'Google Sheets Id',
      hidden: true,
      // expression: function(googleSheetLink) {
      //   var findMatch = googleSheetLink.match(this.SHEET_ID_REGEX);
      //   return  findMatch ? findMatch[1] : findMatch;
      // },
      value: 'Sheet1'
    },
    {
      name: 'columnHeaderPropertyMappings',
      class: 'FObjectArray',
      of: 'foam.nanos.google.api.sheets.ColumnHeaderToPropertyMapping',
      visibility: 'RO',
      hidden: true
    },
    {
      name: 'DAO',
      class: 'String',
      hidden: true,
    }
  ],
  constants: {
    //info retrieved from https://developers.google.com/sheets/api/guides/concepts
    SPREADSHEET_ID_REGEX: '/spreadsheets/d/([a-zA-Z0-9-_]+)',
    // SHEET_ID_REGEX: '[#&]gid=([0-9]+)'//not usefull info unless we want to use gridRange which is probably too much
  },
});

foam.CLASS({
  package: 'foam.nanos.google.api.sheets',
  name: 'ColumnHeaderToPropertyMapping',
  properties: [
    {
      name: 'of',
      hidden: true
    },
    {
      name: 'columnHeader',
      class: 'String',
      // visibility: 'RO',
      visibility: 'DISABLED',
      validationTextVisible: true,
      validateObj: function() {
        if ( this.prop ) return;
        return 'Data for column with header  "' + this.columnHeader + '" cannot be imported. You can still import your data but this column data will be ignored';
      }
    },
    {
      name: 'prop',
      javaType: 'foam.core.PropertyInfo',
      javaInfoType: 'foam.core.AbstractObjectPropertyInfo',
      hidden: true,
      javaJSONParser: 'foam.lib.json.ExprParser.instance()',
    },
    {
      name: 'unitProperty',
      class: 'foam.mlang.ExprProperty',
      hidden: true,
      javaJSONParser: 'foam.lib.json.ExprParser.instance()',
    }
  ]
});