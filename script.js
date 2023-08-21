const apiKey = "sess-k6rVsXBNuqZnQaVTsQuAGQV1KGom0FDSKXMRYMAa";
const raw = {
  model: "text-davinci-003",
  prompt: "",
  max_tokens: 2048,
  temperature: 0,
  top_p: 1,
  n: 1,
  stream: false,
  logprobs: null,
};

// set request options
const requestOptions = {
  method: "POST",
  headers: {},
  body: {},
  redirect: "follow",
};

const openAICall = async (inputString, node) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${apiKey}`);

    // set request payload
    raw["prompt"] = inputString;

    requestOptions["headers"] = myHeaders;
    requestOptions["body"] = JSON.stringify(raw);
    // make the api call
    let response = await fetch(
      "https://api.openai.com/v1/completions",
      requestOptions
    );
    response = await response.json();
    const { choices } = response;
    // remove the spaces from the response
    const res = choices[0].text.replace(/^\s+|\s+$/g, "");

    // populate the node with the response
    node.textContent = res;
  } catch (e) {
    console.error("Error while calling api", e);
  }
};

const debounce = (fn, timer = 500) => {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, timer);
  };
};

const getStringBetween = (str, start = "Firdos:", end = ";") => {
  const result = str.match(new RegExp(start + "(.*)" + end));
  return result ? result[1] : "";
};

const readText = () => {
  // It can be different for different websites, not all web apps have contenteditable property
  /**
   * Make it generic
   */
  const element = document.querySelector('[contenteditable="true"]');

  const valueString = element.textContent;

  if (valueString) {
    const inputString = getStringBetween(valueString);

    openAICall(inputString, element);
  }
};

const startListening = debounce(readText, 2500);
window.addEventListener("keypress", startListening);
