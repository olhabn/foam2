/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.u2.stack',
  name: 'StackView',
  extends: 'foam.u2.View',

  requires: [
    'foam.nanos.controller.Memento',
    'foam.u2.stack.Stack'
  ],

  exports: [ 'data as stack' ],

  properties: [
    {
      name: 'data',
      factory: function() { return this.Stack.create(); }
    },
    {
      class: 'Boolean',
      name: 'showActions',
      value: true
    }
  ],

  css: '%CUSTOMCSS%',

  methods: [
    // TODO: Why is this init() instead of initE()? Investigate and maybe fix.
    function init() {
      this.setNodeName('div');
      this.addClass(this.myClass());

      if ( this.showActions ) {
        this.start('actions')
          .add(this.data.cls_.getAxiomsByClass(foam.core.Action))
        .end();
      }

      this.add(this.slot(function(s) {
        if ( ! s ) return this.E('span');

        var view   = s[0];
        var parent = s[1];

        var X;
        if ( ! parent ) {
          X = this.__subSubContext__;
        } else {
          if ( parent.isContext ) {
            X = parent;
          } else if ( parent.__subContext__ ) {
            X = parent.__subContext__;
          } else {
            // I'm not sure how this is a good idea, KGR
            // TODO: find all places we do this and see if we can replace
            // with case 1 above.

            // Do a bit of a dance with the context, to ensure that exports from
            // "parent" are available to "view"
            X = this.__subSubContext__.createSubContext(parent);
          }
        }

        var v = foam.u2.ViewSpec.createView(view, null, this, X);
        if ( v.mementoHead ) {
          var currMemento = this.data.findCurrentMemento();
          //we need to check if memento is already set
          //for example when we copy-paste url
          if ( ! X.memento.value.includes(v.mementoHead) ) { //can check only substring 0 index of : if eny or length
            var m = this.Memento.create();

            m.head$ = v.mementoHead$;
            m.parent = currMemento;
  
            currMemento.tail = m;
          }
        }
        return v;

      }, this.data$.dot('top')));
    }
  ]
});
