// poll-widget.js
function createPollWidgetContainer(config) {
  const { dataWidgetId, dataPollOptions = "", dataPollQuestion = "" } = config;
  const options = JSON.parse(dataPollOptions);
  let results = [];
  let activeOption = null;
  let userVoted = false;

  const pollContainer = document.createElement('div');
  pollContainer.classList.add('poll-container');
  document.body.appendChild(pollContainer);

  function init() {
    const savedResults = localStorage.getItem(`poll_results_${dataWidgetId}`);
    results = savedResults ? JSON.parse(savedResults) : createInitialResults();
    render();
  }

  function createInitialResults() {
    return Array.from({ length: options.length }, () => 0);
  }

  function saveResults(updatedResults) {
    localStorage.setItem(`poll_results_${dataWidgetId}`, JSON.stringify(updatedResults));
  }

  function handleVote(optionIndex) {
    const updatedResults = [...results];
    if (userVoted) {
      updatedResults[activeOption]--;
    }
    updatedResults[optionIndex]++;
    results = updatedResults;
    activeOption = optionIndex;
    saveResults(updatedResults);
    userVoted = true;
    updateOptionElements();
  }

  function updateOptionElements() {
    options.forEach((option, index) => {
      const optionContainer = pollContainer.querySelector(`#radio-container-${index}-${dataWidgetId}`);
      const votesCountElement = optionContainer.querySelector('strong');
      const highlightElement = optionContainer.querySelector('.highlight');

      votesCountElement.textContent = `${results[index]} Votes`;
      highlightElement.style.transform = `scaleX(${getHighlights(index).transform})`;
      highlightElement.style.background = getHighlights(index).background;
    });
  }

  function getHighlights(index) {
    const pollSum = results.reduce((a, b) => a + b, 0);
    const res = results[index] / pollSum;
    return {
      transform: res,
      background: !pollSum ? '#fff' : (activeOption === index ? '#18d0ff' : '#f5f2f2')
    };
  }

  function render() {
    const fragment = document.createDocumentFragment();
    const pollElement = document.createElement('div');
    pollElement.classList.add('poll');
    const questionElement = document.createElement('p');
    questionElement.textContent = dataPollQuestion;
    pollElement.appendChild(questionElement);

    options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('option');
      if (activeOption === index) {
        optionElement.classList.add('active');
      }
      optionElement.addEventListener('click', () => handleVote(index));
      optionElement.innerHTML = `
        <div class='radio-container' id='radio-container-${index}-${dataWidgetId}'>
          <input type='radio' id='option-${index}-${dataWidgetId}' name='${dataWidgetId}' />
          <label for='option-${index}-${dataWidgetId}'>${option} <strong>${results[index]} Votes</strong></label>
          <span class='checkmark'></span>
          <div class='highlight'></div>
        </div>
      `;
      fragment.appendChild(optionElement);
    });

    pollContainer.innerHTML = '';
    pollContainer.appendChild(pollElement);
    pollElement.appendChild(fragment);
    updateOptionElements();
  }

  return {
    init
  };
}
module.exports = { createPollWidgetContainer };
