import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// Define a function to create loading effect
function loader(element) {
  element.textContent = "";

  // Create an interval to update the loading indicator text content
  loadInterval = setInterval(() => {
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

// Define a function to type text on the chat window
function typeText(element, text) {
  let index = 0;

  // Create an interval to type each character one by one
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// Define a function to create chat stripe
function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

// Define a function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the form data
  const data = new FormData(form);

  // Add user's chat stripe to the chat window
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  // Reset the form
  form.reset();

  // Add bot's chat stripe to the chat window
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // Scroll to the bottom of the chat window
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Get the specific message div
  const messageDiv = document.getElementById(uniqueId);

  // Start loading effect
  loader(messageDiv);

  // Send the user's prompt to the server and get the bot's response
  const response = await fetch("https://kortana.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  // Stop the loading effect
  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  // If the response is ok, add the bot's response to the chat window
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

    typeText(messageDiv, parsedData);
  } else {
    // If the response is not ok, show an error message
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
