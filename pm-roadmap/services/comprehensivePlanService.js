

import { GoogleGenAI, Type } from "@google/genai";

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

// Using gemini-2.5-flash for consistency and capability handling structured JSON outputs from large contexts.
const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const consultingModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for Consulting Plan ---
const consultingPlanSchema = {
    type: Type.OBJECT,
    properties: {
        projectTitle: { type: Type.STRING },
        executiveSummary: { type: Type.STRING },
        standardsAndMethodologies: { type: Type.STRING, description: "Detailing the local/international standards and methodologies used (PMI, ISO, etc.)." },
        scopeAndObjectives: { type: Type.STRING },
        governanceStructure: {
             type: Type.OBJECT,
             properties: {
                 rolesAndResponsibilities: { type: Type.STRING },
                 raciMatrix: { type: Type.STRING, description: "A markdown table representing the RACI matrix." }
             },
             required: ['rolesAndResponsibilities', 'raciMatrix']
        },
        executionStrategy: { type: Type.STRING, description: "Covering Agile, Lean, etc." },
        riskAndChangeManagement: { type: Type.STRING },
        qualityAssuranceAndKPIs: { type: Type.STRING },
        lessonsLearnedMechanism: { type: Type.STRING },
        conclusion: { type: Type.STRING }
    },
    required: ['projectTitle', 'executiveSummary', 'standardsAndMethodologies', 'scopeAndObjectives', 'governanceStructure', 'executionStrategy', 'riskAndChangeManagement', 'qualityAssuranceAndKPIs', 'lessonsLearnedMechanism', 'conclusion']
};


/**
 * Generates a professional project management plan based on user inputs.
 * @param {object} details - Object containing field, name, scope, and location.
 * @returns {Promise<object>} A structured project management plan object.
 */
export const generateConsultingPlan = async (details) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }

    const { field, name, scope, location } = details;

    const prompt = `
        You work as a consultant and experienced expert in the field of project management ${field}, with over 25 years of experience. Your resume includes working with several leading international consulting firms such as PWC, McKinsey, Deloitte, KPMG, EY, JASARA, BCG, AT Kearney, Oliver Wyman, Roland Berger, Accenture. You are asked to build a professional Project Management Plan for managing a project "${name}", with a brief summary specifying the scope of the project’s work: "${scope}", and the geographical area or regional scope in which it operates: "${location}".

        The plan must be based on the highest local and international standards and methodologies, and contain all elements typically included in global and local management consulting documents. The plan should include all required documents, role distribution, responsibilities, and the technical and managerial aspects that contribute to preparing a professional project management plan that meets requirements and standards of management consultations.

        Key Points in the Plan:
        - Relying on all local standards and references relevant to the sector in which the project operates, such as contract standards and government project agreements (like EXPRO), while also mentioning international standards (such as PMI for project management, and ISO for management systems) and including references from AXELOS or other international institutes.
        - Ensuring full utilization of local regulations and relevant local standards adapting to the geographical, sectoral, and legal context of the project.
        - Adopting all advanced methodologies in project management (such as Agile Management, Change Management, Governance Management, Earned Value Management, Lean Planning, SMART goals, KPIs, OKRs).
        - Keeping the plan comprehensive with the ability to scale and adapt according to project scope ${field}.
        - The plan must be structured in a clear, organized, and systematic manner, showing the integration mechanisms of work procedures and updates from involved stakeholders and all relevant parties, with procedural and executive controls to support plan consistency and promote positive outcomes throughout the project’s success.

        Implementation Details:
        - Make the plan comprehensive and modeled according to the reality and nature of the project and its complex environment.
        - Make sure all integration components are harmonized and unified.
        - Use responsibility matrices such as RACI to clarify who is responsible or accountable for each field or decision inside the plan. Present the RACI matrix as a Markdown table.
        - Focus on “how”, “what”, and “why” for each element in the plan, ensuring full clarity in what needs to be carried out and how to verify quality.
        - Remember the plan is a dynamic document. It should specify when and how the plan will be reviewed and updated, especially when essential change events or transitions to another phase occur.
        - Define how the plan will collect and document lessons learned for ongoing improvement throughout the project’s lifetime, not just at its completion.
        - Ensure output text uses Markdown formatting for clarity, including tables, lists, and bold text.

        The required final output must be a coordinated, professional, and methodical plan that covers all standards and methodologies mentioned, taking into consideration the nature of the project, its work domain, country, and project’s actual geographical location.
        
        Output this plan as a structured JSON object according to the schema provided. Use Markdown formatting for the text content within the JSON fields to ensure readability (e.g., bullet points, bold text).
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: consultingModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: consultingPlanSchema,
                systemInstruction: "You are a world-class Project Management Consultant. Generate a detailed, professional project management plan in structured JSON format.",
            },
        });
        
        const jsonText = result.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating project plan:", error);
        throw new Error("Failed to generate the project plan. The AI model may be temporarily unavailable or the request could not be processed.");
    }
};