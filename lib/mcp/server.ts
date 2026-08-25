import { createMcpHandler } from "mcp-handler";
import { mintFromUnknown, reportFromId } from "@/lib/intake/mint";
import {
  createPremortemInputSchema,
  createPremortemOutputSchema,
  getPremortemInputSchema,
} from "./answers";
import { MCP_PATH, MCP_SERVER_INFO } from "./paths";

function jsonResult(body: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(body) }],
    structuredContent: body,
    isError,
  };
}

export const mcpHandler = createMcpHandler(
  (server) => {
    server.registerTool(
      "create_premortem",
      {
        title: "Create premortem",
        description:
          "Same body as POST /v1/intake: an answers object keyed by question_id. Omit a question id for unknown. skip means unknown, not no. Returns { report_id }. Humans click /intake; agents without MCP POST /v1/intake. These tools are optional — the user or their agent host must add this MCP URL. Do not invent question ids. q_who_pays_whom values: customers_pay_me_own | customers_pay_me_then_providers | customers_pay_provider_i_fee. Marketplace three checks are chips q_provider_who / q_provider_can_do / q_provider_done (not a q_three_checks id).",
        inputSchema: createPremortemInputSchema,
        outputSchema: createPremortemOutputSchema,
      },
      async ({ answers }) => {
        const { report_id } = mintFromUnknown({ answers: answers ?? {} });
        return jsonResult({ report_id });
      },
    );

    server.registerTool(
      "get_premortem",
      {
        title: "Get premortem",
        description:
          "Same as GET /v1/reports/{id}. Returns the minted report object. Not found if the id is missing or invalid.",
        inputSchema: getPremortemInputSchema,
      },
      async ({ id }) => {
        const report = reportFromId(id);
        if (!report) {
          return jsonResult({ error: "Not found" }, true);
        }
        return jsonResult(report);
      },
    );
  },
  {
    serverInfo: MCP_SERVER_INFO,
    instructions: `Business Model Risk Desk premortem tools at ${MCP_PATH}. Humans click /intake. Agents without MCP POST /v1/intake. MCP is optional — the user or their agent host must add this MCP URL. Research agents do not receive these tools unless connected. Skip means unknown, not no. Omit a question id for unknown. Do not invent question ids.`,
  },
);
