/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

package foam.dao;

import foam.core.FObject;
import foam.core.X;
import foam.mlang.order.Comparator;
import foam.mlang.predicate.Predicate;
import foam.nanos.pm.PM;

public class PipelinePMDAO
  extends ProxyDAO
{
  protected String putName_;
  protected String findName_;
  protected String removeName_;
  protected String removeAllName_;

  public PMDAO(X x, DAO delegate) {
    super(x, delegate);
    init();
  }

  void init() {
    createPipeline();
    putName_       = getDelegate().getClass().getName() + ":pipePut";
    findName_      = getDelegate().getClass().getName() + ":pipeFind";
    removeName_    = getDelegate().getClass().getName() + ":pipeRemove";
    removeAllName_ = getDelegate().getClass().getName() + ":pipeRemoveAll";
  }

  private void createPipeline() {
    DAO delegate = getDelagate();
    DAO secondaryDelagate;
    if( delegate instanceof ProxyDAO ) {
      secondaryDelagate = delagate.getDelagate();
      delegate.setDelegate(new EndPipelinePMDAO(getX(), secondaryDelagate));
      delegate = delagate.getDelegate();
      if(secondaryDelagate instanceof ProxyDAO) {
        delegate.setDelegate(new PipelinePMDAO(x, secondaryDelagate));
      }
    }
  }

  @Override
  public FObject put_(X x, FObject obj) {
    PM pm = new PM();
    pm.setClassType(PMDAO.getOwnClassInfo());
    pm.setName(putName_);
    X pipeX = getX().put('pipePmStart', pm);
    return super.put_(pipeX, obj);
  }

  @Override
  public FObject find_(X x, Object id) {
    PM pm = new PM();
    pm.setClassType(PMDAO.getOwnClassInfo());
    pm.setName(findName_);
    X pipeX = getX().put('pipePmStart', pm);
    return super.find_(pipeX, id);
  }

  @Override
  public FObject remove_(X x, FObject obj) {
    PM pm = new PM();
    pm.setClassType(PMDAO.getOwnClassInfo());
    pm.setName(removeName_);
    X pipeX = getX().put('pipePmStart', pm);
    return super.remove_(pipeX, obj);
  }

  @Override
  public void removeAll_(X x, long skip, long limit, Comparator order, Predicate predicate) {
    PM pm = new PM();
    pm.setClassType(PMDAO.getOwnClassInfo());
    pm.setName(removeAllName_);
    X pipeX = getX().put('pipePmStart', pm);
    super.removeAll_(pipeX, skip, limit, order, predicate);
  }

  public class EndPipelinePMDAO extends ProxyDAO {
    @Override
    public FObject put_(X x, FObject obj) {
      getX().get('pipePmStart').log(x);
      return super.put_(x, obj);
    }

    @Override
    public FObject find_(X x, Object id) {
      getX().get('pipePmStart').log(x);
      return super.find_(x, id);
    } 

    @Override
    public FObject remove_(X x, FObject obj) {
      getX().get('pipePmStart').log(x);
      return super.remove_(x, obj);
    }

    @Override
    public void removeAll_(X x, long skip, long limit, Comparator order, Predicate predicate) {
      getX().get('pipePmStart').log(x);
      super.removeAll_(x, skip, limit, order, predicate);
    }
  }
}