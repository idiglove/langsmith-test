import { Client, Run, Example } from "langsmith";
import { evaluate } from "langsmith/evaluation";
import { EvaluationResult } from "langsmith/evaluation";

const client = new Client();

// Define dataset: these are your test cases
const datasetName = "Sample Dataset";
const dataset = await client.createDataset(datasetName, {
  description: "A sample dataset in LangSmith.",
});
await client.createExamples({
  inputs: [
    { postfix: "to LangSmith" },
    { postfix: "to Evaluations in LangSmith" },
  ],
  outputs: [
    { output: "Welcome to LangSmith" },
    { output: "Welcome to Evaluations in LangSmith" },
  ],
  datasetId: dataset.id,
});

// Define your evaluator
const exactMatch = async (
  run: Run,
  example: Example
): Promise<EvaluationResult> => {
  return {
    key: "exact_match",
    score: run.outputs?.output === example?.outputs?.output,
  };
};

await evaluate(
  (input: { postfix: string }) => ({ output: `Welcome ${input.postfix}` }),
  {
    data: datasetName,
    evaluators: [exactMatch],
    metadata: {
      version: "1.0.0",
      revision_id: "beta",
    },
  }
);
