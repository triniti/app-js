export default {
  testForm1: (state = { values: { fieldNeedClear: 'not cleared' } }, action) => {
    switch (action.type) {
      case 'CLEAR_ACTION':
        return {
          ...state,
          values: {
            ...state.values,
            fieldNeedClear: 'cleared',
          },
          registeredFields: {
            fieldNeedClear: 'cleared',
          },
        };
      default:
        return state;
    }
  },
  testForm2: (state = { values: { oldField: 'old value' } }, action) => {
    switch (action.type) {
      case 'CHANGE_ACTION':
        return {
          ...state,
          values: {
            fieldNeedChange: 'new value',
          },
        };
      default:
        return state;
    }
  },
};
