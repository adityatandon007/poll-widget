// poll-widget.test.js
const { createPollWidgetContainer } = require('./poll-widget');

describe('Poll Widget', () => {
  let widget;

  beforeEach(() => {
    document.body.innerHTML = '';
    widget = createPollWidgetContainer({
      dataWidgetId: 'test-widget',
      dataPollOptions: '["Option 1", "Option 2", "Option 3"]',
      dataPollQuestion: 'Which option do you prefer?'
    });
  });

  test('Widget renders correctly', () => {
    widget.init();

    const pollContainer = document.querySelector('.poll-container');
    expect(pollContainer).toBeTruthy()

    const options = pollContainer.querySelectorAll('.option');
    expect(options.length).toBe(3);
  });
});
