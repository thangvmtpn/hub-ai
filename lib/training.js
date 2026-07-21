import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const TRAINING_FILE = join(process.cwd(), 'training.json');

export function getTrainingData() {
  try {
    return JSON.parse(readFileSync(TRAINING_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

export function getAgentTraining(agentId) {
  const data = getTrainingData();
  return data[agentId] || null;
}

export function saveAgentTraining(agentId, systemPrompt) {
  const data = getTrainingData();
  if (systemPrompt?.trim()) {
    data[agentId] = { systemPrompt: systemPrompt.trim() };
  } else {
    delete data[agentId];
  }
  writeFileSync(TRAINING_FILE, JSON.stringify(data, null, 2));
}
