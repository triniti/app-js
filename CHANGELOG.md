# CHANGELOG


## v0.2.0
* Add `events/BindReduxFormEvent.js` which should be used in sagas or redux form handlers to provide customizations via event subscribers on pbjx events.  `const bindEvent = new BindReduxFormEvent(pbj, formName, formData); pbjx.trigger(pbj, SUFFIX_BIND_REDUX_FORM, bindEvent, false);`
* Automatically register all app and plugin instances as subscribers to the dispatcher created for the main app instance.  This is used for application events that don't typically run through redux.  To add listeners, use `app.getDispatcher().addListener(...)` or simply add a method named `getSubscribedEvents` that returns an object `{'event-to-listen-to': function}` to your app or plugin and they'll automatically be called.
* Add `redux/createInterceptorMiddleware` to allow filtering of actions and potentially stopping them from propagating entirely.   An instance of `events/FilterActionEvent.js` will be given to the subscriber.


## v0.1.0
* initial version
