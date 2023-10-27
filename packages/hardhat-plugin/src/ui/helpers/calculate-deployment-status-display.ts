import { StatusResult } from "@nomicfoundation/ignition-core";
import chalk from "chalk";

export function calculateDeploymentStatusDisplay(
  deploymentId: string,
  statusResult: StatusResult
): string {
  if (statusResult.started.length > 0) {
    return _calculateStartedButUnfinished(deploymentId, statusResult);
  }

  if (
    statusResult.timedOut.length > 0 ||
    statusResult.failed.length > 0 ||
    statusResult.held.length > 0
  ) {
    return _calculateFailed(deploymentId, statusResult);
  }

  return _calculateSuccess(deploymentId, statusResult);
}

function _calculateSuccess(deploymentId: string, statusResult: StatusResult) {
  let successText = `Deployment ${deploymentId} was successful\n\n`;

  if (Object.values(statusResult.contracts).length === 0) {
    successText += chalk.italic("No contracts were deployed");
  } else {
    successText += `${chalk.bold("Deployed Addresses")}\n\n`;

    successText += Object.values(statusResult.contracts)
      .map((contract) => `${contract.id} - ${contract.address}`)
      .join("\n");
  }

  return successText;
}

function _calculateStartedButUnfinished(
  deploymentId: string,
  statusResult: StatusResult
) {
  let startedText = `Deployment ${deploymentId} has futures that have started but not completed\n\n`;

  startedText += Object.values(statusResult.started)
    .map((futureId) => ` - ${futureId}`)
    .join("\n");

  startedText += "\n\nPlease rerun your deployment.";

  return startedText;
}

function _calculateFailed(deploymentId: string, statusResult: StatusResult) {
  let failedExecutionText = `Deployment ${deploymentId} failed\n`;

  const sections: string[] = [];

  if (statusResult.timedOut.length > 0) {
    let timedOutSection = `\nFutures with transactions unconfirmed after maximum fee bumps:\n`;

    timedOutSection += Object.values(statusResult.timedOut)
      .map(({ futureId }) => ` - ${futureId}`)
      .join("\n");

    timedOutSection += "\n\nConsider increasing the fee in your config.";

    sections.push(timedOutSection);
  }

  if (statusResult.failed.length > 0) {
    let failedSection = `\nFutures failed during execution:\n`;

    failedSection += Object.values(statusResult.failed)
      .map(({ futureId, error }) => ` - ${futureId}: ${error}`)
      .join("\n");

    failedSection +=
      "\n\nTo learn how to handle these errors: https://hardhat.org/ignition-errors";

    sections.push(failedSection);
  }

  if (statusResult.held.length > 0) {
    let heldSection = `\nFutures where held by the strategy:\n`;

    heldSection += Object.values(statusResult.held)
      .map(({ futureId, reason }) => ` - ${futureId}: ${reason}`)
      .join("\n");

    sections.push(heldSection);
  }

  failedExecutionText += sections.join("\n");

  return failedExecutionText;
}