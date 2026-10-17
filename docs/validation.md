# Validation, 17 October 2026

- The pinned Skills CLI installed 15 Matt skills, four pstack checks, two Emil skills, and the pstack support material locally. The exported catalog contains those 21 upstream skills plus `workflow`; support entry files are passive `INSTRUCTIONS.md` resources.
- Both sync paths ran successfully. All 117 imported files matched their original pinned Git blobs, including supporting files and license notices. The custom skill passed the skill-creator validator.
- A fresh client installation discovered all 22 exports. Reinstallation retained the client's own verifier and left its application and git revision unchanged. Installed bytes and Claude Code links were checked directly.
- Review found and corrected stale exports when removing a selection. Isolated runs confirmed exported and nested support removal, preservation of unexpected custom files, and passing catalog checks after clean removal.
- The portable plugin manifest passed the official Agent Plugins JSON schema. Plugin directory packaging and local reference checks passed. Native agent end-to-end execution was not tested across all three hosts.
- An independent agent used the installed `workflow verify` on a deliberately defective CLI. It reproduced a failed cross-process persistence requirement, retained commands/results, and made no product fixes or commits.
- A second independent run had no app verifier. It created and executed a client-owned `.agents/skills/verify-settings-cli`, with ten passing runtime checks and evidence surviving cleanup. No application files changed. Independent review remained explicitly blocked because the evaluation prohibited subagents; runtime success was not reported as complete workflow success.

These are package and CLI-fixture checks, not proof that every future app, browser, device, or cross-provider model configuration works. Client runs must produce their own evidence. No publication or global plugin installation was performed.
