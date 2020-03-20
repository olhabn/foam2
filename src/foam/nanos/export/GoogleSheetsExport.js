/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.INTERFACE({
  package: 'foam.nanos.export',
  name: 'GoogleSheetsExport',
  methods: [
    {
      name: 'createSheet',
      type: 'String',
      javaThrows: [ 'java.lang.Exception' ],
      async: true,
      args: [
        {
          name: 'obj',
          type: 'Object'
        },
        {
          name: 'metadataObj',
          type: 'foam.nanos.export.GoogleSheetsPropertyMetadata[]',
          javaType: 'Object'
        },
        {
          name: 'config',
          type: 'foam.nanos.export.ExportConfig[]',
        }
      ]
    },
    {
      name: 'deleteSheet',
      args: [
        {
          name: 'sheetId',
          type: 'String'
        }
      ],
      javaThrows: [ 'java.io.IOException', 'java.security.GeneralSecurityException' ]
    }
  ]
});