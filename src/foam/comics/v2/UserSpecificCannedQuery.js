/**
* @license
* Copyright 2020 The FOAM Authors. All Rights Reserved.
* http://www.apache.org/licenses/LICENSE-2.0
*/

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'UserSpecificCannedQuery',

  properties: [
    {
      name: 'id',
      class: 'Long'
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'queryUser'
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.Group',
      name: 'queryGroup'
    },
    {
      name: 'query',
      class: 'FObjectProperty',
      of: 'foam.comics.v2.CannedQuery'
    }
  ]
});