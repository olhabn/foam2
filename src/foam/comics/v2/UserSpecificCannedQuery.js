/**
* @license
* Copyright 2020 The FOAM Authors. All Rights Reserved.
* http://www.apache.org/licenses/LICENSE-2.0
*/

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'UserSpecificCannedQuery',
  implements: [
    'foam.nanos.auth.CreatedByAware'
  ],

  properties: [
    {
      name: 'id',
      class: 'Long'
    },
    {
      class: 'String',
      name: 'model'
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'createdBy',
    },
    {
      class: 'Reference',
      of: 'foam.nanos.auth.User',
      name: 'createdByAgent',
    },
    {
      class: 'String',
      name: 'name'
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
      name: 'queries',
      class: 'FObjectArray',
      of: 'foam.comics.v2.CannedQuery'
    }
  ]
});