/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.controller',
  name: 'Memento',

  constants: {
    SEPARATOR: ':',
    PARAMS_BEGIN: '{',
    PARAMS_END: '}',
    PARAMS_SEPARATOR: ',',
    EQUILITY_SIGN: '=',
    NEXT_INDEX: 1
  },

  properties: [
    {
      class: 'Boolean',
      name: 'feedback_',
      documentation: 'Internal flag to prevent feedback loops'
    },
    {
      name: 'value',
      value: '',
      postSet: function(o, n) {
        this.parseValue();
      }
    },
    {
      name: 'head',
      // value: '',
      postSet: function(o, n) {
        if ( this.feedback_ ) return;
        this.feedback_ = true;
        this.value = this.combine();
        this.feedback_ = false;
      }
    },
    {
      name: 'tail',
      postSet: function(o, n) {
        // if ( this.tail )
        //   this.tail.parent = this;

        if ( this.feedback_ ) {
          return;
        }
        this.feedback_ = true;
        this.changeIndicator = ! this.changeIndicator;
        this.value = this.combine();
        this.feedback_ = false;
      },
      value: null
    },
    {
      name: 'parent',
      postSet: function() {
        console.log('parent change');
        // console.log('not equal: ' + this.parent.tail == this);
      }
    },
    {
      name: 'changeIndicator',
      postSet: function() {
        if ( this.parent ) {
          this.parent.feedback_ = true;
          this.parent.changeIndicator = ! this.parent.changeIndicator;
          this.parent.feedback_ = false;
        }
      }
    },
    {
      name: 'params',
      postSet: function() {
        if ( this.feedback_ ) {
          return;
        }
        this.feedback_ = true;
        var dict = {};
        if ( this.params ) {
          var params = decodeURI(this.params);
          this.parseParam(dict, params);
        }
        this.paramsDict = dict;
        this.feedback_ = false;
      },
      value: ''
    },
    {
      name: 'paramsDict',
      postSet: function() {
        if ( this.feedback_ ) {
          return;
        }
        this.feedback_ = true;

        var params;
        if (Object.keys(this.paramsDict).length !== 0) {
          params = '';
          for ( var key in this.paramsDict ) {
            if ( params ) {
              params += ',';
            }
            params += key;
            params += this.EQUILITY_SIGN;
            params += this.paramsDict[key].join ? this.paramsDict[key].join(',') : this.paramsDict[key];
            //foam.Array.isInstance(this.paramsDict[key]): false
            //fix encoding foam.Array.isInstance(this.paramsDict['search']): true
          }
          params = this.PARAMS_BEGIN + encodeURI(params) + this.PARAMS_END;
        } else {
          params = null;
        }
        this.params = params;
        this.changeIndicator = ! this.changeIndicator;
        this.value = this.combine();
        this.feedback_ = false;
      },
      factory: function() {
        return {};
      }
    }
  ],
   
  methods: [
    function combine() {
      var params =  this.params ?  this.SEPARATOR + this.params : '';
      var tail = this.tail ? this.SEPARATOR + this.tail.combine() : '';
      return this.head
        + params
        + tail;
    },
    function parseValue() {
      //added as value's subscribers methods are executed earlier then post set
      if ( this.feedback_ ) return;
      this.feedback_ = true;
      var i = this.value.indexOf(this.SEPARATOR);
      if ( i === -1 ) {
        this.head = this.value;
        this.tail = null;
      } else {
        this.head = this.value.substring(0, i);
        var tailStr = this.value.substring(i+1);
        var tailIndex = this.value.indexOf(this.SEPARATOR, i+1); 
        if ( tailStr.includes(this.PARAMS_BEGIN) && tailStr.includes(this.PARAMS_END) && ( tailIndex === -1 || this.value.indexOf(this.PARAMS_BEGIN, i+1) < tailIndex ) ) {
          if ( this.value.indexOf(this.PARAMS_BEGIN) === i + 1 ) {
            this.feedback_ = false;
            this.params = this.value.substring(i+1, tailIndex > 0 ? tailIndex : this.value.length);
            this.feedback_ = true;
            if ( tailIndex !== -1 ) {
              this.tail = this.cls_.create({ value: this.value.substring(tailIndex+1), parent: this });//2 is for excluding } and : 
            }
          } else {
            this.tail = this.cls_.create({ value: tailStr, parent: this });
          }
        } else {
          this.tail = this.cls_.create({ value: tailStr, parent: this });
        }
      }
      this.feedback_ = false;
    },
    function parseParam(dict, params) {
      var i = 1;//a=q,q,q,b=sd,z=sdf
      //also i think will need to parse objs
      //like {collumns={name=Code,order=D},{name=Alternative Names,orderBy=A}}
      //to dict too
      while( i >= 0 && i < params.length - 1 ) {
        var beginWith = i;
        var equalitySymbolIndex = params.indexOf(this.EQUILITY_SIGN, i);
        var nextParametersAssignmentIndex = equalitySymbolIndex !== -1 ? params.indexOf(this.EQUILITY_SIGN, equalitySymbolIndex + this.NEXT_INDEX) : -1;
        
        var paramBeginIndex = params.indexOf(this.PARAMS_BEGIN, equalitySymbolIndex + this.NEXT_INDEX);
        var paramEndIndex = params.indexOf(this.PARAMS_END, equalitySymbolIndex + this.NEXT_INDEX);
        
        if ( nextParametersAssignmentIndex !== -1 && paramBeginIndex !== -1 && nextParametersAssignmentIndex < paramEndIndex) {
          nextParametersAssignmentIndex = params.indexOf(this.EQUILITY_SIGN, paramEndIndex + this.NEXT_INDEX);
        }
        var isThereAnotherParam = nextParametersAssignmentIndex !== -1;
        var nextParamIndex = nextParametersAssignmentIndex > -1 ? nextParametersAssignmentIndex : params.length-1;
        var thisParameterValueToParse;

        var beginWith1 = -1;
        var indexOfComa = params.indexOf(this.PARAMS_SEPARATOR, i + this.NEXT_INDEX);
        while ( indexOfComa !== -1 ) {
          var isComaLast = indexOfComa > nextParamIndex;
          if ( isThereAnotherParam ) {
            var indexOfNextComa = params.indexOf(this.PARAMS_SEPARATOR, indexOfComa + this.NEXT_INDEX);
            isComaLast = indexOfNextComa > nextParamIndex || indexOfNextComa === -1;
          }

          beginWith1 = indexOfComa;

          if ( isComaLast ) {
            break;
          }
          
          indexOfComa = params.indexOf(this.PARAMS_SEPARATOR, beginWith1 + this.NEXT_INDEX);
        }

        thisParameterValueToParse = params.substring(equalitySymbolIndex == -1 ? nextParametersAssignmentIndex + 1 : equalitySymbolIndex + 1, beginWith1 > 0 ? beginWith1 :  params.length-1);

        i = beginWith1 > 0 ? beginWith1 + this.NEXT_INDEX : -1;//instead of NEXT_INDEX may be better to find next alphabetic character

        if ( thisParameterValueToParse.includes(this.PARAMS_BEGIN) ) {
          thisParameterValueToParse = params.substring(equalitySymbolIndex + 1, params.indexOf(this.PARAMS_END, equalitySymbolIndex)+1);
          dict[params.substring(beginWith, equalitySymbolIndex)] = {};
          this.parseParam(dict[params.substring(beginWith, equalitySymbolIndex)], thisParameterValueToParse);
        } else 
          dict[params.substring(beginWith, equalitySymbolIndex)] = thisParameterValueToParse.split(this.PARAMS_SEPARATOR);
        if ( beginWith1 === -1 )
          break; 
      }
    }
  ]
});
