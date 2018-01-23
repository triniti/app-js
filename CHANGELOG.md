# CHANGELOG


## v0.3.1
* Adding application `APP_BASE_URL` setting to define your application's base url.


## v0.3.0
* Add `createDelegateFactory.js` which is used to create a delegate for a connected component.  The delegate can use the `INJECT` symbol to have any dependencies injected.
* Change `BindReduxFormEvent` to just `BindFormEvent` as it can be used with forms that aren't necessarily redux forms.
* Moved all files in `redux/*` and `pbjx/*` to root.  It's a pbjx+redux app so separating these out doesn't make a lot of sense.
* Add `selectors/getForm` for grabbing a complete view of a redux form and `utils/touchErrorFields` which forces inline validation to show up on a redux form.


## v0.2.1
* Restore the "start" plugin hook.  It's useful for allowing plugins to first configure themselves, potentially the app customizing that and later the start method using the final configuration.


## v0.2.0
* Add `events/BindReduxFormEvent.js` which should be used in sagas or redux form handlers to provide customizations via event subscribers on pbjx events.  `const bindEvent = new BindReduxFormEvent(pbj, formName, formData); pbjx.trigger(pbj, SUFFIX_BIND_REDUX_FORM, bindEvent, false);`
* Automatically register all app and plugin instances as subscribers to the dispatcher created for the main app instance.  This is used for application events that don't typically run through redux.  To add listeners, use `app.getDispatcher().addListener(...)` or simply add a method named `getSubscribedEvents` that returns an object `{'event-to-listen-to': function}` to your app or plugin and they'll automatically be called.
* Add `redux/createInterceptorMiddleware` to allow filtering of actions and potentially stopping them from propagating entirely.   An instance of `events/FilterActionEvent.js` will be given to the subscriber.


## v0.1.0
* initial version
