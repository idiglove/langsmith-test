import { runOnDataset } from "langchain/smith";
import { ChatPromptTemplate } from "langchain-core/prompts";
import { Client } from "langsmith/client";
import { StringOutputParser } from "langchain-core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { Run } from "langsmith";
import { QAEvalChain } from "langchain/evaluation";

// from langchain import chat_models, prompts, smith
// from langchain.schema import output_parser

// * const message = SystemMessagePromptTemplate.fromTemplate("{text}");
// * const chatPrompt = ChatPromptTemplate.fromMessages([
// *   ["ai", "You are a helpful assistant."],
// *   message,
// * ]);
// * const formattedChatPrompt = await chatPrompt.invoke({
// *   text: "Hello world!",
// * });
// *
// # Define your runnable or chain below.
const prompt = ChatPromptTemplate.fromMessages(
  [
    ["ai", "You are a helpful AI boardgame recommendation engine."],
    ["human", "{question}"],
  ]
  //       [
  //   {
  //     system: "You are a helpful AI boardgame recommendation engine.",
  //     human: "{question}",
  //   },
  // ]
);

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0.5,
});

// chain = prompt | llm | output_parser.StrOutputParser()

// const invoked = async () => {
//   await prompt.invoke({ question: "What's another game like Azul?" });
// };
const chain = prompt
  //   .invoke({ question: "What's another game like Azul?" })
  .pipe(model)
  .pipe(new StringOutputParser());

// const loadChain = loadSummarizationChain(llm, {
//   type: "stuff",
//   prompt,
//   verbose: true,
// });

// const chain = new StuffDocumentsChain({ llmChain: loadChain });
// || output_parser.StrOutputParser()

// # Define the evaluators to apply
// const eval_config = Run({
//   evaluators: ["cot_qa"],
//   custom_evaluators: [],
//   //   eval_llm = chat_models.ChatOpenAI((model = "gpt-4"), (temperature = 0)),
// });

// Define your evaluator
const exactMatch = async ({
  run,
  example,
}: {
  run: Run;
  example?: Example;
}): Promise<EvaluationResult> => {
  return {
    key: "exact_match",
    score: run.outputs?.output === example?.outputs?.output ? 1 : 0,
  };
};
const client = new Client({
  apiKey: "",
});

const chainResults = async () => {
  return await runOnDataset(
    chain,
    // (input: { postfix: string }) => ({ output: `Welcome ${input.postfix}` }), // Your AI system goes here
    "bg-recos-1", // The data to predict and grade over
    {
      client,
      evaluationConfig: {
        evaluators: [QAEvalChain],
        customEvaluators: [exactMatch],
      },
      projectMetadata: {
        version: "1.0.0",
        revision_id: "beta",
      },
    }
  );
};

console.log({ chainResults: JSON.stringify(chainResults()) });
// client = langsmith.Client()
// chain_results = client.run_on_dataset(
//     dataset_name="bg-recos-1",
//     llm_or_chain_factory=chain,
//     evaluation=eval_config,
//     project_name="test-tart-windscreen-96",
//     concurrency_level=5,
//     verbose=True,
// )
