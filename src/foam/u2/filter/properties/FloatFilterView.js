/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.u2.filter.properties',
  name: 'FloatFilterView',
  extends: 'foam.u2.filter.properties.IntegerFilterView',

  documentation: `
    A SearchView for properties of type Float and Double. Lets the
    user filter by two criteria:
      1. A qualifier (Eg: equal to, not equal to, greater than)
      2. An amount (Eg: 25.19)
  `,

  properties: [
    {
      class: 'Float',
      name: 'amount',
      documentation: `The number to filter by.`,
      view: {
        class: 'foam.u2.FloatView',
        onKey: true,
        precision: 2
      }
    }
  ],
  methods: [
    function setFilterValue(obj) {
      this.qualifier = obj.qualifier;
      this.amount = obj.amount;
    },
    
    function returnFilterObj() {
      if ( ! this.qualifier )
        return null;
      var obj = { name:this.property.name, qualifier:this.qualifier, amount:this.amount };
      return obj;
    }
  ]
});
