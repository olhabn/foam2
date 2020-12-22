/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.u2.filter.properties',
  name: 'DateFilterView',
  extends: 'foam.u2.Controller',

  documentation: 'A SearchView for properties of type Date.',

  implements: [
    'foam.mlang.Expressions'
  ],

  messages: [
    { name: 'LABEL_ALL',    message: 'Search' },
    { name: 'LABEL_AFTER',    message: 'After' },
    { name: 'LABEL_BEFORE',    message: 'Before' },
    { name: 'LABEL_BETWEEN',    message: 'Search' }
  ],

  css: `
    ^ {
      padding: 24px 16px;
      box-sizing: border-box;
      min-width: 214px;
    }

    ^ .foam-u2-tag-Select {
      width: 100%;
      height: 36px;

      border-radius: 3px;
      border: solid 1px #cbcfd4;
      background-color: #ffffff;
    }

    ^ .foam-u2-DateView {
      width: 100%;
      height: 36px;

      margin-top: 16px;

      border-radius: 3px;
      border: solid 1px #cbcfd4;
      background-color: #ffffff;
    }
  `,

  properties: [
    {
      name: 'property',
      documentation: `
        The property that this view is filtering by. Should be of type Date.
      `,
      required: true
    },
    {
      class: 'String',
      name: 'qualifier',
      documentation: 'Lets the user choose a predicate to filter the view by.',
      view: {
        class: 'foam.u2.view.ChoiceView',
        choices: [
          ['True', this.LABEL_ALL],
          ['Gt', this.LABEL_AFTER],
          ['Lt', this.LABEL_BEFORE],
          ['Bt', this.LABEL_BETWEEN]
        ],
        defaultValue: 'True'
      }
    },
    {
      class: 'Date',
      name: 'date1',
      documentation: `
        A date selectable by the user. Used as the second argument to the
        predicate generated by this view.
      `,
    },
    {
      class: 'Date',
      name: 'date2',
      documentation: `
        A date selectable by the user. Used as the second argument to the
        predicate generated by this view.
      `,
    },
    {
      name: 'predicate',
      documentation: `
        All Search Views must have a predicate as required by the
        Filter Controller. When this property changes, the Filter Controller will
        generate a new main predicate and also reciprocate the changes to the
        other Search Views.
      `,
      expression: function(qualifier, date1, date2) {
        if ( ! qualifier || ! date1 || isNaN(date1.valueOf()) ) return this.TRUE;

        if ( qualifier !== 'Bt' ) {
          return foam.mlang.predicate[qualifier].create({
            arg1: this.property,
            arg2: date1
          });
        }

        return this.AND(this.GT(this.property, date1), this.LT(this.property, date2));
      }
    },
    {
      name: 'name',
      documentation: 'Required by Filter Controller.',
      expression: function(property) {
        return property.name;
      }
    }
  ],

  methods: [
    function initE() {
      var self = this;
      this.addClass(this.myClass())
        .start(this.QUALIFIER)
          .start('div').addClass(this.myClass('carrot')).end()
        .end()
        .add(this.onDetach(this.slot(function(qualifier) {
          if ( ! qualifier || qualifier === 'True' ) return this.E();
          return qualifier === 'Bt' ?
            this.E().add(self.DATE1).add(self.DATE2) :
            this.E().add(self.DATE1);
        })));
    },

    /**
     * Clears the fields to their default values.
     * Required on all SearchViews. Called by ReciprocalSearch.
     */
    function clear() {
      this.qualifier = 'True';
    },

    /**
     * Restores the view based on passed in predicate
     */
    function restoreFromPredicate(predicate) {
      if ( predicate === this.TRUE ) return;

      var qualifier = predicate.cls_.name;

      if ( qualifier == 'And' ) {
        this.qualifier = 'Bt';
        this.date1 = predicate.args[0].arg2.value;
        this.date2 = predicate.args[1].arg2.value;
      } else {
        this.qualifier = qualifier;
        this.date1 = predicate.arg2.value;
      }
    }
  ]
});
