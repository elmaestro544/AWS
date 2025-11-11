
import { GoogleGenAI, Type } from "@google/genai";
import { generateProjectPlan } from './planningService.js';

// --- API Key and Client Management ---
const geminiApiKey = window.process?.env?.API_KEY;
const isValidKey = (key) => !!key && !key.startsWith('YOUR_');
const isGeminiConfigured = () => isValidKey(geminiApiKey);

const geminiClient = isGeminiConfigured() ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
const schedulingModel = 'gemini-2.5-flash';

// --- JSON Schema Definition for the Gantt Chart ---
const ganttChartSchema = {
    type: Type.ARRAY,
    description: "An array of tasks representing a project schedule for a Gantt chart.",
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique identifier for the task (e.g., 'task-1')." },
            name: { type: Type.STRING, description: "The name of the task or phase." },
            start: { type: Type.STRING, description: "The start date of the task in 'YYYY-MM-DD' format." },
            end: { type: Type.STRING, description: "The end date of the task in 'YYYY-MM-DD' format." },
            progress: { type: Type.INTEGER, description: "The completion percentage of the task (0-100)." },
            type: { type: Type.STRING, description: "The type of item, e.g., 'project' for a main phase, 'task' for a sub-item, 'milestone' for a key date." },
            project: { type: Type.STRING, description: "The ID of the parent project/phase, if this is a sub-task. Empty for top-level phases." },
            dependencies: {
                type: Type.ARRAY,
                description: "An array of task IDs that this task depends on.",
                items: { type: Type.STRING }
            }
        },
        required: ['id', 'name', 'start', 'end', 'progress', 'type']
    }
};


// --- Service Function ---
/**
 * Generates a full Gantt chart schedule from a high-level project objective.
 * @param {string} objective - The user's high-level project goal.
 * @returns {Promise<object>} A structured array of tasks for the Gantt chart.
 */
export const generateScheduleFromObjective = async (objective) => {
    if (!geminiClient) {
        throw new Error("Gemini client is not initialized. Please check your API key.");
    }
    
    // Step 1: Generate the foundational project plan.
    const projectPlan = await generateProjectPlan(objective);

    // Step 2: Formulate a prompt to convert the plan into a timed schedule.
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const projectStartDate = tomorrow.toISOString().split('T')[0];

    const prompt = `
        Based on the provided project plan, create a detailed project schedule suitable for a Gantt chart.
        The project must start on ${projectStartDate}.
        
        Project Plan:
        ${JSON.stringify(projectPlan, null, 2)}

        Instructions:
        1. Convert all WBS items and Key Milestones into a flat list of schedule tasks.
        2. Assign a unique 'id' to each item (e.g., 'phase-1', 'task-1.1', 'milestone-1'). Use a hierarchical naming convention for subtasks.
        3. For WBS items, use the type 'project'. For their subtasks, use 'task'. For Key Milestones, use 'milestone'.
        4. Calculate realistic 'start' and 'end' dates in 'YYYY-MM-DD' format for every item based on its duration and logical dependencies. The project starts on ${projectStartDate}.
        5. Establish logical dependencies between tasks. A task cannot start until its predecessors are complete. Reference dependencies using their unique IDs. For example, 'Design' phase should depend on 'Initiation' phase completion.
        6. Assign a random but realistic 'progress' value (0-100) for each task to simulate an in-progress project. Milestones that are not yet reached should have 0 progress.
        7. The output must be a single, valid JSON array that strictly adheres to the provided schema.
    `;

    try {
        const result = await geminiClient.models.generateContent({
            model: schedulingModel,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: ganttChartSchema,
                systemInstruction: "You are an expert AI Project Scheduler. Your task is to convert a project plan into a detailed, time-based Gantt chart schedule. You must calculate dates, establish dependencies, and output a valid JSON array matching the required schema.",
            },
        });
        
        const jsonText = result.text.trim();
        const scheduleData = JSON.parse(jsonText);

        // Re-structure data for hierarchical display
        const projects = scheduleData.filter(item => item.type === 'project').sort((a, b) => a.start.localeCompare(b.start));
        const tasksByProject = scheduleData.filter(item => item.type === 'task').reduce((acc, task) => {
            const projectId = task.project || 'unassigned';
            if (!acc[projectId]) {
                acc[projectId] = [];
            }
            acc[projectId].push(task);
            return acc;
        }, {});

        const hierarchicallySortedData = [];
        projects.forEach(project => {
            hierarchicallySortedData.push(project);
            if (tasksByProject[project.id]) {
                const sortedTasks = tasksByProject[project.id].sort((a, b) => a.start.localeCompare(b.start));
                hierarchicallySortedData.push(...sortedTasks);
            }
        });
        
        const milestones = scheduleData.filter(item => item.type === 'milestone').sort((a,b) => a.start.localeCompare(b.start));
        hierarchicallySortedData.push(...milestones);

        // Add any orphaned tasks at the end
        if (tasksByProject['unassigned']) {
             hierarchicallySortedData.push(...tasksByProject['unassigned'].sort((a,b) => a.start.localeCompare(b.start)));
        }

        return hierarchicallySortedData;

    } catch (error) {
        console.error("Error generating project schedule:", error);
        throw new Error("Failed to generate the project schedule from the plan. The AI model may be busy or the response was invalid.");
    }
};
