import { CallError } from 'yemot-router2';
import { performAction } from './flow-actions';

export async function runFlow(call, flow, context) {
  try {
    while (true) {
      const currentNode = flow.nodes.find(n => n.id === context.currentNodeId);
      if (!currentNode) {
        console.warn(`Node not found: ${context.currentNodeId}`);
        throw new Error('Invalid flow state');
      }

      switch (currentNode.type) {
        case 'tapInput':
          await handleTapInputNode(call, context, currentNode);
          break;

        case 'action':
          await handleActionNode(call, context, currentNode);
          break;

        default:
          console.warn(`Unhandled node type: ${currentNode.type}`);
          break;
      }

      context.currentNodeId = getNextNodeIdForInput(context, currentNode);

      if (context.currentNodeId === 'end') {
        return call.hangup();
      }
    }
  } catch (error) {
    if (error instanceof CallError) {
      console.log('CallError:', error);
    } else {
      console.error('Flow execution error:', error);
      await call.id_list_message(
        [{ type: 'text', data: 'An error occurred, please try again later' }],
        { prependToNextAction: true }
      );
      return call.hangup();
    }
  }
}

async function handleTapInputNode(call, context, node) {
  const prompt = replacePlaceholders(node.message || '', context.variables);
  const config = node.inputConfig || {};

  const userInput = await call.read(
    [{ type: 'text', data: prompt }],
    'tap',
    {
      max_digits: config.max ?? 3,
      min_digits: config.min ?? 1,
      block_asterisk_key: config.blockAsterisk ?? true,
      val_name: node.storeVar,
      digits_allowed: config.allowedDigits,
    }
  );

  if (node.storeVar) {
    context.variables[node.storeVar] = userInput;
  }
}

async function handleActionNode(call, context, node) {
  if (node.action) {
    await performAction(node.action, context, call);
  }
  if (node.message) {
    const msg = replacePlaceholders(node.message, context.variables);
    await call.id_list_message([{ type: 'text', data: msg }], { prependToNextAction: true });
  }
}

/**
 * If the node has `nextIf`, we pick by stored variable. Otherwise fallback to node.next.
 */
function getNextNodeIdForInput(context, node) {
  if (node.nextIf && node.storeVar) {
    const storedValue = context.variables[node.storeVar];
    const branchedNext = node.nextIf[storedValue];
    if (branchedNext) {
      return branchedNext;
    }
  }
  return node.next ?? 'end';
}

/**
 * Replace placeholders like {studentName} in text
 */
function replacePlaceholders(text, vars) {
  return text.replace(/\{(\w+)\}/g, (_, varName) => {
    return vars[varName] ?? '';
  });
}
