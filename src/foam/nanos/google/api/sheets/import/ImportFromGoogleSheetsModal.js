foam.CLASS({
  package: 'foam.nanos.google.api.sheets',
  name: 'ImportFromGoogleSheetsModal',
  extends: 'foam.u2.View',
  requires: [
    'foam.u2.dialog.NotificationMessage'
  ],
  imports: [
    'ctrl'
  ],
  properties: [
    {
      name: 'importConfig',
      class: 'FObjectProperty',
      of: 'foam.nanos.google.api.sheets.GoogleSheetsImportConfig',
      expression: function(of) {
        return foam.nanos.google.api.sheets.GoogleSheetsImportConfig.create({importClassInfo: of});
      }
    },
    {
      name: 'importServiceName',
      class: 'String',
      value: 'googleSheetsDataImport'
    },
    'of'
  ],
  methods: [
    function initE() {
      var self = this;
      //!!! on Column header not being mapped show warning which says: 
      //Data for column with header ______ cannot be imported. 
      //You can import your data but this column will be ignored
      this.SUPER();
      this
      .start('h2').style({'padding-left': '16px'}).add('Google Sheets Data Import').end()
      .startContext({ data: this })
        .tag(this.importConfig)
        .add(this.slot(function(importConfig$columnHeaderPropertyMappings){
          return this.E()
          .callIf(importConfig$columnHeaderPropertyMappings && importConfig$columnHeaderPropertyMappings.length > 0, function() {
            this.start('h4').style({ 'padding-left': '16px' }).add('Column headers').end().forEach(importConfig$columnHeaderPropertyMappings, function(c) {
              this.start()
              .style({ 'padding-left': '16px' })
                .start({class: 'foam.u2.TextField',
                  data: c.columnHeader
                })
                  .style({ 'background-color': c.prop ? 'none' : '#fbedec',
                           'color': c.prop ? 'none' : '#a61414' })
                  .setAttribute('readonly', true)
                .end()
                .callIf(! c.prop, function() {
                  this.start()
                    .style({ 'color': 'red' })
                    .add('Data for column with header "' + c.columnHeader + '" cannot be imported. You can still import your data but this column data will be ignored')
                  .end();
                })
              .end()
              .br();
              //if c.prop.label doesn't exist add error message
            });
          });
          // .callIf( importConfig$columnHeaderPropertyMappings && importConfig$columnHeaderPropertyMappings.length === 0, function() {
          //   this.start().add(
          //     'it looks like there is not data we can import to current page. please make sure that link to gooogle sheet you\'ve provided is correct'
          //   ).end();
          // });
          
        }))
        .start().show(this.showAction$).addClass(this.myClass('btn-box'))
          .tag(this.CANCEL, {
            buttonStyle: 'SECONDARY',
            size: 'LARGE'
          })
          .tag(this.GET_COLUMNS, {
            buttonStyle: 'SECONDARY',
            size: 'LARGE'
          })
          .tag(this.IMPORT_DATA, {
            buttonStyle: 'SECONDARY',
            size: 'LARGE'
          })
        .end()
      .endContext();
        // .tag({
        //   class: 'net.nanopay.sme.ui.wizardModal.WizardModalNavigationBar',
        //   back: this.CANCEL,
        //   next: this.IMPORT_DATA
        // })
    }
  ],
  actions: [
    {
      name: 'cancel',
      code: function(X) {
        X.closeDialog();
      }
    },
    {
      name: 'getColumns',
      label: 'Get columns',
      isEnabled: function(importConfig$googleSpreadsheetId) {
        return importConfig$googleSpreadsheetId;
      },
      code: function(X) {
        X.googleSheetsDataImport.getColumns(X, this.importConfig).then(columnHeaders => {
          if ( columnHeaders ) {
            var arr = [];
            for ( var columnHeader of columnHeaders ) {
              var prop = this.importConfig.importClassInfo.getAxiomsByClass(foam.core.Property).find(p => ! p.networkTransient && ! foam.core.FObjectProperty.isInstance(p) && p.label === columnHeader);
              var colHeaderConfig = foam.nanos.google.api.sheets.ColumnHeaderToPropertyName.create({ of: this.importConfig.importClassInfo, columnHeader: columnHeader, prop: prop });

              if ( prop && prop.cls_.id === "foam.core.UnitValue" && prop.unitPropName ) {
                colHeaderConfig.unitProperty = this.importConfig.importClassInfo.getAxiomByName(prop.unitPropName);
              }

              arr.push(colHeaderConfig);
            }
            this.importConfig.columnHeaderPropertyMappings = arr;
          }          
        });
      }
    },
    {
      name: 'importData',
      label: 'Import',
      isEnabled: function(importConfig$columnHeaderPropertyMappings) {
        return importConfig$columnHeaderPropertyMappings.some(c => c && c.prop );
      },
      code: function(X) {
        X[this.importServiceName].importData(X, this.importConfig).then(r => {
          // X.closeDialog();
          var message = this.NotificationMessage.create();
          if ( r ) message.message = 'success!';
          else {
            message.message = 'failure!';
            message.type = 'error';
          }
          this.ctrl.add(message);
        });
      }
    },
  ]
});


foam.CLASS({
  package: 'foam.nanos.google.api.sheets',
  name: 'ColumnHeaderToPropertyName',
  properties: [
    {
      name: 'of',
      hidden: true
    },
    {
      name: 'columnHeader',
      class: 'String',
      visibility: 'RO'
    },
    {
      name: 'prop',
      class: 'foam.mlang.ExprProperty',
      //javaType: 'foam.core.PropertyInfo',
      visibility: 'RO',
      hidden: true,
      javaJSONParser: 'foam.lib.json.ExprParser.instance()',
      // view: {
      //   class: 'foam.u2.TextField',
      //   data: this.prop$label
      // },
    },
    {
      name: 'unitProperty',
      class: 'foam.mlang.ExprProperty',
      visibility: 'RO',
      hidden: true,
      javaJSONParser: 'foam.lib.json.ExprParser.instance()',
    }
  ]
});

//overkill
// foam.CLASS({
//   package: 'foam.nanos.google.api.sheets',
//   name: 'ColumnHeaderToPropertyName',
//   properties: [
//     {
//       name: 'maxDepth',
//       class: 'Int',
//       value: 5,
//       hidden: true
//     },
//     {
//       name: 'of',
//       hidden: true
//     },
//     {
//       name: 'columnHeader',
//       class: 'String',
//       postSet: function() {
//         this.findPropertyName();
//       }
//     },
//     {
//       name: 'propertiesOptions',
//       // class: 'StringArray',
//       hidden: true,
//     },
//     {
//       name: 'selectedProp',
//       class: 'StringArray',
//       view: function(_, X) {
//         return X.data.slot(function(propertiesOptions) {
//           return foam.u2.view.ChoiceView.create({choices: propertiesOptions, data$: this.selectedProp$});
//         });
//       }
//     }
//   ],
//   methods: [
//     function findPropertyName() {
//       var prop = this.of.getAxiomByName(this.columnHeader);
//       if ( prop ) {
//         this.propertyLabel = prop.label;
//       }
//       var props =  this.of.getAxiomsByClass(foam.core.Property).filter(p => ! p.networkTransient );
//       var resultSoFar = [];
//       var checkedClsIds = [ this.of.id ];
//       var  i = 0;
//       for ( prop of props ) {
//         this.findPropOptions(prop, '', '', i, checkedClsIds, resultSoFar);
//       }
//       this.propertiesOptions = resultSoFar;
//       console.log(resultSoFar);
//     },
//     function findPropOptions(prop, propNameSoFar, labelSoFar, i, checkedClsIds, resultSoFar) {

//       propNameSoFar += propNameSoFar ? '.' + prop.name : prop.name;
//       labelSoFar += labelSoFar ? ' -> ' + prop.label : prop.label;

//       if ( /** foam.core.FObjectProperty.isInstance(prop) || **/ foam.core.Reference.isInstance(prop) ) {
//         checkedClsIds.push(prop.of.id);
//       } else {
//         if ( prop && prop.label === this.columnHeader ) {
//           resultSoFar.push([propNameSoFar, labelSoFar]);
//         }
//         return;
//       }

//       var propChildren =  prop.of.getAxiomsByClass(foam.core.Property).filter(p => ! p.networkTransient &&  ( /** foam.core.FObjectProperty.isInstance(p) ||  **/ foam.core.Reference.isInstance(p)  ? ! checkedClsIds.includes(p.of.id) : true ) );
      
//       if ( ++i >= this.maxDepth ) return;

//       for ( var p of propChildren ) {
//         this.findPropOptions(p, propNameSoFar, labelSoFar, i, checkedClsIds, resultSoFar);
//       }
//       return;
//     }
//   ]
// });