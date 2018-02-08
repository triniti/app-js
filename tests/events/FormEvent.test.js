import test from 'tape';
import FormEvent from '../../src/events/FormEvent';

test('FormEvent tests', (t) => {
  const event = new FormEvent('message', 'test_form', { field: 'fval' }, { prop: 'pval' });
  t.same('message', event.getMessage());

  t.false(event.hasErrors(), 'FormEvent should not have errors on new instance.');
  event.addError('error', 'reason');
  t.true(event.hasErrors(), 'FormEvent should have errors after addError');

  t.false(event.hasWarnings(), 'FormEvent should not have warnings on new instance.');
  event.addWarning('warning', 'reason');
  t.true(event.hasWarnings(), 'FormEvent should have warnings after addWarning');

  const childEvent = event.createChildEvent('child_message');
  t.same('child_message', childEvent.getMessage(), 'child event should have its own message.');
  t.same(event.getName(), childEvent.getName(), 'child event should have same name.');
  t.same(event.getData(), childEvent.getData(), 'child event should have same data.');
  t.same(event.getErrors(), childEvent.getErrors(), 'child event should have same errors.');
  t.same(event.getWarnings(), childEvent.getWarnings(), 'child event should have same warnings.');

  t.end();
});
