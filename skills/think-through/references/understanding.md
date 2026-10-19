# Understanding how something works

Adapted from PDF pages 2–3. The goal is an explanation that supports a checkable prediction, at the depth needed for the user's question.

## Set the boundary

Name exactly what is inside the model and what belongs to its environment. List inputs, relevant initial state, and the observable output. Distinguish the intended purpose, direct output, and downstream effect. For natural phenomena, describe the relationship under study rather than assigning an intended purpose.

A thermostat's control logic takes a measurement and setpoint and produces an on/off command. If the sensor is brought inside the boundary, its measurement becomes an internal signal and the device responds to the surrounding temperature. A heater converts an energy supply into heat transfer. A model including the heater and room can instead observe room temperature over time. Sending the command does not guarantee the downstream temperature change.

Outputs can be messages, movement, heat, file changes, or measurements of state; they need not be a function return value. State captures relevant history. A two-threshold thermostat can be on or off at the same measured temperature, depending on its previous command. Changing the boundary requires redefining inputs and outputs.

## Build only the needed model

1. **Black box:** establish the boundary, inputs, state, outputs, and environment before describing internals.
2. **Decomposition:** divide by the question, such as sensing, deciding, and acting. Record connections. Deepen only the part that does not yet explain the observation.
3. **Concrete trace:** choose one input and initial state. Follow the components, rule, state transition, output, and resulting feedback in order. Keep a command separate from execution and later consequences.
4. **Mechanism:** explain why each step leads to the next without merely repeating labels. Identify feedback, delays, and gaps. If a source was supplied, reconstruct the mechanism yourself without consulting it, then check uncertain steps against it. Otherwise mark what evidence is needed.
5. **Changed-case prediction:** change a condition or examine a boundary case. Make the prediction yourself before consulting an observation or source, then compare and revise. If no observation is available, report the prediction as untested. These are the agent's checks, not comprehension questions for the user.

For a heating model, consider whether heating power exceeds heat loss, whether heat continues flowing after switch-off, and where the sensor sits. Negative feedback counteracts change but does not by itself guarantee stability. A sensor next to the heater may reach a threshold before the rest of the room is warm; temperatures at both locations could check that prediction.

**Output:** the bounded model, one worked trace, any genuine gaps found, and a prediction with a feasible check. A matching prediction supports the model without proving its proposed mechanism. Unsolicited recall practice is omitted in this conversational adaptation; use available evidence and necessary substantive questions to advance the actual problem.
