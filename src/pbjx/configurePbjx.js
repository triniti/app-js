/* globals PBJX_ENDPOINT */
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import ContainerAwareServiceLocator from '@gdbots/pbjx/ContainerAwareServiceLocator';
import HttpTransport from '@gdbots/pbjx/transports/HttpTransport';
import Pbjx from '@gdbots/pbjx/Pbjx';
import createReducer from '@gdbots/pbjx/redux/createReducer';
import { serviceIds } from '../constants';

/**
 * @param {App} app
 * @param {Bottle} bottle
 */
export default (app, bottle) => {
  bottle.constant(pbjxServiceIds.TRANSPORT_HTTP_ENDPOINT, PBJX_ENDPOINT);
  bottle.constant(pbjxServiceIds.COMMAND_BUS_TRANSPORT, 'http');
  bottle.constant(pbjxServiceIds.EVENT_BUS_TRANSPORT, 'in_memory');
  bottle.constant(pbjxServiceIds.REQUEST_BUS_TRANSPORT, 'http');

  bottle.service(pbjxServiceIds.LOCATOR, ContainerAwareServiceLocator, serviceIds.CONTAINER);
  bottle.service(
    pbjxServiceIds.TRANSPORT_HTTP,
    HttpTransport,
    pbjxServiceIds.LOCATOR,
    pbjxServiceIds.TRANSPORT_HTTP_ENDPOINT,
  );
  bottle.service(pbjxServiceIds.PBJX, Pbjx, pbjxServiceIds.LOCATOR);
  bottle.factory(pbjxServiceIds.REDUX_REDUCER, () => createReducer());
};
