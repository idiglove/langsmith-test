import { OpenAI } from "openai";
import { traceable } from "langsmith/traceable";
import { wrapOpenAI } from "langsmith/wrappers";

// Auto-trace LLM calls in-context
const client = wrapOpenAI(
  new OpenAI({
    apiKey: "",
  })
);
// Auto-trace this function
const pipeline = traceable(async (user_input) => {
  const result = await client.chat.completions.create({
    messages: [{ role: "user", content: user_input }],
    // model: "gpt-4-0613",
    model: "gpt-3.5-turbo",
  });
  return result.choices[0].message.content;
});

const run = async () => {
  //   await pipeline((val) => console.log(val));
  const result = await pipeline("Hello there!");
  console.log({ result });
  // Out: Hello there! How can I assist you today?
};

run();
