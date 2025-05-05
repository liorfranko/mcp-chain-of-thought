// i18n.js - Multilingual Support Functionality
// Translation Data Structure
const i18n = {
  en: {
    // Navigation Bar
    "nav.pain-points": "Pain Points",
    "nav.features": "Features",
    "nav.workflow": "Workflow",
    "nav.installation": "Installation",
    "nav.github": "GitHub",
    "nav.menu-button": "Menu",
    "nav.logo.alt": "Chain Of Thought Logo",
    "nav.prompt-custom": "Prompt Config",
    // Hero Section
    "hero.title": "Chain Of Thought",
    "hero.subtitle":
      "Intelligent System for Structured Task Management in AI Programming Assistants",
    "hero.description":
      "Empower your AI assistant with long-term memory capabilities, efficient complex task management, and structured task decomposition and execution tracking, making your programming experience smoother and more efficient.",
    "hero.start": "Get Started",
    "hero.learn-more": "Learn More",
    "hero.workflow-image.alt": "Intelligent Task Management Workflow",
    // Pain Points Solution Section
    "pain-points.title": "Pain Points & Solutions",
    "pain-points.subtitle":
      "Chain Of Thought is designed to solve three core pain points faced by AI programming assistants in task management.",
    "pain-points.memory-loss.title": "Memory Loss",
    "pain-points.memory-loss.description":
      "AI assistants lack cross-conversation task memory capability, resulting in inability to track long-term task progress, repeated explanation of the same requirements, and wasted time and resources.",
    "pain-points.memory-loss.solution.title": "Task Memory Function",
    "pain-points.memory-loss.solution.description":
      "Automatically save execution history, provide long-term memory capability, allowing AI assistants to remember previous task progress and seamlessly continue unfinished tasks.",
    "pain-points.memory-loss.icon.alt": "Memory Loss",
    "pain-points.structure-chaos.title": "Structural Chaos",
    "pain-points.structure-chaos.description":
      "Complex tasks lack systematic management leading to inefficiency, missing dependency management, chaotic subtask execution, and difficulty tracking overall progress.",
    "pain-points.structure-chaos.solution.title":
      "Structured Task Decomposition",
    "pain-points.structure-chaos.solution.description":
      "Automatically decompose complex tasks into manageable subtasks, establish clear dependencies, provide ordered execution paths, and ensure efficient completion.",
    "pain-points.structure-chaos.icon.alt": "Structural Chaos",
    "pain-points.structure-chaos.solution.icon.alt":
      "Structured Task Decomposition",
    "pain-points.repeat-work.title": "Repetitive Work",
    "pain-points.repeat-work.description":
      "Unable to effectively utilize past experience and solutions, each conversation starts from scratch, lacking knowledge accumulation and experience reference systems.",
    "pain-points.repeat-work.solution.title":
      "Knowledge Accumulation & Experience Reference",
    "pain-points.repeat-work.solution.description":
      "Automatically records successful solutions, builds a task knowledge base, supports quick reference for similar tasks, achieving experience accumulation and knowledge reuse.",
    "pain-points.repeat-work.icon.alt": "Repetitive Work",
    "pain-points.repeat-work.solution.icon.alt":
      "Knowledge Accumulation and Experience Reference",
    "pain-points.explore": "Explore Core Features",
    // Features Section
    "features.title": "Core Features",
    "features.subtitle":
      "Chain Of Thought provides six core features to help you efficiently manage, execute, and track complex tasks.",
    "features.planning.title": "Intelligent Task Planning & Analysis",
    "features.planning.description":
      "Through in-depth analysis of requirements and constraints, generate structured task plans. Automatically assess scope, risks, and priorities to provide rational and comprehensive implementation strategies.",
    "features.planning.icon.alt": "Intelligent Task Planning and Analysis",
    "features.decomposition.title":
      "Automatic Task Decomposition & Dependency Management",
    "features.decomposition.description":
      "Intelligently break down complex tasks into manageable smaller tasks, identify dependencies between tasks, establish optimized execution paths, and avoid resource conflicts and execution bottlenecks.",
    "features.decomposition.icon.alt":
      "Automatic Task Decomposition and Dependency Management",
    "features.tracking.title": "Execution Status Tracking",
    "features.tracking.description":
      "Monitor the execution status of each task in real-time, provide progress visualization, automatically update dependency status, and provide detailed execution reports upon task completion.",
    "features.tracking.icon.alt": "Execution Status Tracking",
    "features.verification.title": "Task Integrity Verification",
    "features.verification.description":
      "Thoroughly check task completion, ensure all requirements and standards have been met, provide verification reports and quality assessments, and ensure output meets expected requirements.",
    "features.verification.icon.alt": "Task Integrity Verification",
    "features.complexity.title": "Task Complexity Assessment",
    "features.complexity.description":
      "Evaluate task complexity based on multi-dimensional standards, provide resource requirement estimates, identify high-risk components, and help reasonably allocate resources and time.",
    "features.complexity.icon.alt": "Task Complexity Assessment",
    "features.memory.title": "Task Memory Function",
    "features.memory.description":
      "Provide cross-session task memory capabilities, automatically save execution history and context, allow task resumption and continuation at any time, without the need to re-explain requirements.",
    "features.memory.icon.alt": "Task Memory Function",
    "features.learn-workflow": "Learn about the Workflow",
    // Workflow Section
    "workflow.title": "Workflow",
    "workflow.subtitle":
      "Chain Of Thought provides a complete workflow, with each step from task planning to task completion carefully designed.",
    "workflow.step1.title": "Task Planning",
    "workflow.step1.description": "Initialize and plan task flow in detail",
    "workflow.step2.title": "In-depth Analysis",
    "workflow.step2.description":
      "Analyze requirements and assess technical feasibility",
    "workflow.step3.title": "Solution Reflection",
    "workflow.step3.description":
      "Critically review analysis results and optimize solutions",
    "workflow.step4.title": "Task Decomposition",
    "workflow.step4.description":
      "Break down complex tasks into manageable subtasks",
    "workflow.step5.title": "Task Execution",
    "workflow.step5.description":
      "Execute specific tasks according to predetermined plans",
    "workflow.step6.title": "Result Verification",
    "workflow.step6.description":
      "Thoroughly verify task completion and quality",
    "workflow.step7.title": "Task Completion",
    "workflow.step7.description":
      "Mark tasks as completed and generate reports",
    "workflow.learn-more-link": "Learn More →",
    "workflow.mobile.step1.full-description":
      "Initialize and plan task flow in detail, establish clear goals and success criteria, with the option to reference existing tasks for continued planning.",
    "workflow.mobile.step2.full-description":
      "Analyze task requirements in depth and systematically review codebase, assess technical feasibility and potential risks, and provide initial solution recommendations.",
    "workflow.mobile.step3.full-description":
      "Critically review analysis results, evaluate solution completeness and identify optimization opportunities, ensuring solutions follow best practices.",
    "workflow.mobile.step4.full-description":
      "Break complex tasks into independent and trackable subtasks, establish clear dependencies and priorities, support multiple update modes.",
    "workflow.mobile.step5.full-description":
      "Execute specific tasks according to the predefined plan, ensure each step's output meets quality standards, and handle exceptions during execution.",
    "workflow.mobile.step6.full-description":
      "Comprehensively verify task completion, ensure all requirements and technical standards are met with no missing details, provide quality assessment reports.",
    "workflow.mobile.step7.full-description":
      "Formally mark tasks as completed, generate detailed completion reports, and update dependency status of related tasks to ensure workflow continuity.",
    // Installation & Configuration Section
    "installation.title": "Installation & Configuration",
    "installation.subtitle":
      "Chain Of Thought offers multiple installation methods, whether you want to get started quickly or need advanced configuration, it's easy to set up.",
    "installation.manual.title": "Manual Installation",
    "installation.step1": "Clone Repository",
    "installation.step2": "Install Dependencies",
    "installation.step3": "Build Project",
    "installation.cursor.title": "Cursor IDE Configuration",
    "installation.cursor.description":
      "If you use Cursor IDE, you can integrate Chain Of Thought into your development environment.",
    "installation.quickstart.title": "Quick Start",
    "installation.quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Chain of Thought.",
    "installation.faq.title": "FAQ",
    "installation.faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "installation.copy-button": "Copy",
    "installation.important-note.title": "Important Note",
    "installation.important-note.description":
      "Must use absolute path: Please ensure the DATA_DIR configuration uses absolute paths rather than relative paths, otherwise data may not load correctly",
    "installation.prompt-config.title": "Prompt Configuration Guide",
    "installation.prompt-config.intro":
      "Chain Of Thought supports two modes:",
    "installation.prompt-config.mode1.title": "TaskPlanner:",
    "installation.prompt-config.mode1.description":
      "Suitable for initial task planning and complex task decomposition, where the AI assistant plays the role of a task planner.",
    "installation.prompt-config.mode2.title": "TaskExecutor:",
    "installation.prompt-config.mode2.description":
      "Suitable for executing predefined tasks, where the AI assistant plays the role of an execution expert.",
    "installation.prompt-config.tip":
      "You can use Custom modes in Cursor settings to customize modes to suit different work scenarios.",
    // CTA Section
    "cta.title": "Experience Intelligent Task Management Now",
    "cta.description":
      "Enhance your AI programming experience, say goodbye to disorganized task management, and embrace a more efficient workflow.",
    "cta.github": "Go to GitHub Repository",
    "cta.start": "Start Installation",
    // Footer Section
    "footer.copyright": "© 2025 Chain Of Thought. All Rights Reserved.",
    "footer.developer": "Made with ❤️ by Lior Franko",

    // Common UI Elements
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.copy": "Copy",
    "common.copied": "Copied!",
    "common.yes": "Yes",
    "common.no": "No",
    "common.more": "More",
    "common.less": "Less",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.warning": "Warning",
    "common.info": "Info",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.ascending": "Ascending",
    "common.descending": "Descending",
    "common.lang.zh-tw": "中",
    "common.lang.en": "EN",
    "modal.close-button": "Close",
    "modal.close-button-aria": "Close",

    // Workflow Details
    "workflow.step1.content.title": "Task Planning Stage",
    "workflow.step1.content.description":
      "The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.",
    "workflow.step1.content.activities": "Key Activities:",
    "workflow.step1.content.activity1":
      "Clarify project requirements and constraints",
    "workflow.step1.content.activity2":
      "Set clear objectives and define measurable success criteria",
    "workflow.step1.content.activity3":
      "Establish project boundaries and identify stakeholders",
    "workflow.step1.content.activity4":
      "Create a high-level plan with timeline estimates",
    "workflow.step1.content.activity5":
      "Optionally reference existing tasks for continuous planning",
    "workflow.step1.content.outputs": "Outputs:",
    "workflow.step1.content.output1": "Comprehensive task description",
    "workflow.step1.content.output2": "Clear success criteria",
    "workflow.step1.content.output3": "Technical requirements and constraints",
    "workflow.step1.content.summary":
      "This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.",

    "workflow.step2.content.title": "In-depth Analysis Stage",
    "workflow.step2.content.description":
      "The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.",
    "workflow.step2.content.activities": "Key Activities:",
    "workflow.step2.content.activity1":
      "Analyze requirements and identify technical challenges",
    "workflow.step2.content.activity2":
      "Evaluate technical feasibility and potential risks",
    "workflow.step2.content.activity3":
      "Research best practices and available solutions",
    "workflow.step2.content.activity4":
      "Systematically review existing codebase if applicable",
    "workflow.step2.content.activity5":
      "Develop initial implementation concepts",
    "workflow.step2.content.outputs": "Outputs:",
    "workflow.step2.content.output1": "Technical feasibility assessment",
    "workflow.step2.content.output2":
      "Risk identification and mitigation strategies",
    "workflow.step2.content.output3": "Initial implementation approach",
    "workflow.step2.content.output4":
      "Pseudocode or architectural diagrams where appropriate",
    "workflow.step2.content.summary":
      "This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.",

    // Error and Warning Messages
    "error.storage":
      "Unable to access local storage, language preferences will not be saved.",
    "error.translation": "Translation error: Unable to load translation data.",
    "error.network": "Network error: Unable to connect to the server.",
    "warning.browser":
      "Your browser may not support all features, we recommend using the latest version of Chrome, Firefox, or Safari.",
    "warning.mobile": "Some features may be limited on mobile devices.",

    // Code Example Section
    "examples.planning.title": "Task Planning and Decomposition Process",
    "examples.planning.intro":
      "This example demonstrates how to use MCP Chain of Thought to plan and break down complex tasks. The entire process includes four main steps:",
    "examples.planning.step1":
      "Initialize and plan tasks in detail, establishing clear goals and success criteria",
    "examples.planning.step2":
      "Deeply understand the task, analyze technical feasibility and potential challenges",
    "examples.planning.step3":
      "Critically review analysis results and optimize proposals",
    "examples.planning.step4": "Break complex tasks into manageable subtasks",
    "examples.planning.conclusion":
      "With this approach, you can transform complex, large tasks into structured, executable work units while maintaining an overall perspective.",
    "examples.execution.title": "Task Execution and Completion Process",
    "examples.execution.intro":
      "This example demonstrates how to execute and complete planned tasks. The entire process includes four main steps:",
    "examples.execution.step1.title": "Task List",
    "examples.execution.step1":
      "Query pending task list to understand current status",
    "examples.execution.step2":
      "Execute selected tasks according to the predetermined plan",
    "examples.execution.step3":
      "Verify task completion to ensure quality standards are met",
    "examples.execution.step4":
      "Officially mark tasks as completed and generate reports",
    "examples.execution.conclusion":
      "With this approach, you can systematically execute tasks and ensure each step meets expected quality standards, ultimately completing the entire workflow.",
    "examples.tip.title": "💡 Tip",
    "examples.tip.description":
      "The workflow above is not fixed. The Agent will iterate through different steps based on analysis until the expected effect is achieved.",

    // Quick Start and FAQ Section
    "quickstart.title": "Quick Start",
    "quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Chain of Thought.",
    "quickstart.view-code-link": "View Code →",
    "faq.title": "Frequently Asked Questions",
    "faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "faq.view-faq-link": "View FAQ →",
    "installation.cursor.mcp-servers": "to/your/project/.cursor/mcp.jsonn",
    "task.planner.prompt": `You are a professional task planning expert. You must interact with users, analyze their needs, and collect project-related information. Finally, you must use "plan_task" to create tasks. When the task is created, you must summarize it and inform the user to use the "TaskExecutor" mode to execute the task.
You must focus on task planning. Do not use "execute_task" to execute tasks.
Serious warning: you are a task planning expert, you cannot modify the program code directly, you can only plan tasks, and you cannot modify the program code directly, you can only plan tasks.`,
    "task.executor.prompt": `You are a professional task execution expert. When a user specifies a task to execute, use "execute_task" to execute the task.
If no task is specified, use "list_tasks" to find unexecuted tasks and execute them.
When the execution is completed, a summary must be given to inform the user of the conclusion.
You can only perform one task at a time, and when a task is completed, you are prohibited from performing the next task unless the user explicitly tells you to.
If the user requests "continuous mode", all tasks will be executed in sequence.`,
    // Prompt Customization Section
    "prompt-custom.title": "Prompt Customization",
    "prompt-custom.subtitle":
      "Customize AI assistant behavior through environment variables, without modifying code",

    "prompt-custom.overview.title": "Feature Overview",
    "prompt-custom.overview.description":
      "Prompt customization allows users to adjust AI assistant behavior through environment variables, providing two customization methods: completely override original prompts or append content to existing ones.",

    "prompt-custom.benefits.title": "Key Benefits",
    "prompt-custom.benefits.item1":
      "Personalized customization: Adjust system behavior for specific projects or domains",
    "prompt-custom.benefits.item2":
      "Efficiency improvement: Optimize for repetitive task types, reducing redundant instructions",
    "prompt-custom.benefits.item3":
      "Brand consistency: Ensure output content adheres to organization style guides and standards",
    "prompt-custom.benefits.item4":
      "Professional adaptability: Adjust terminology and standards for specific technical fields or industries",
    "prompt-custom.benefits.item5":
      "Team collaboration: Unify prompts used by team members, ensuring consistent workflow",

    "prompt-custom.usage.title": "Usage Guide",
    "prompt-custom.usage.env.title": "Environment Variables Configuration",
    "prompt-custom.usage.env.description":
      "Set environment variables to customize prompts for each function, using specific naming conventions:",
    "prompt-custom.usage.more":
      "View detailed documentation for more configuration methods and parameter usage.",
    "prompt-custom.view-docs": "View Complete Documentation",
  },
};

// Translation application function
function applyTranslations(lang) {
  // Ensure the selected language is valid
  if (!i18n[lang]) {
    console.error("Unsupported language:", lang);
    return;
  }

  // Apply translations to all elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      element.textContent = i18n[lang][key];
    } else {
      console.warn(`Translation key not found: ${key}`);
    }
  });

  // Handle language-specific links
  document.querySelectorAll(".lang-specific").forEach((element) => {
    if (element.hasAttribute(`data-lang-${lang}`)) {
      const langSpecificHref = element.getAttribute(`data-lang-${lang}`);
      if (langSpecificHref) {
        element.setAttribute("href", langSpecificHref);
      }
    }
  });
}

// Set language and save user preference
function setLanguage(lang) {
  // Save user preference
  localStorage.setItem("preferred-language", lang);

  // Apply translations
  applyTranslations(lang);

  // Update button state
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update html tag's lang attribute
  document.documentElement.setAttribute("lang", lang);
}

// Get user's preferred language or browser language
function getPreferredLanguage() {
  // Check local storage
  const savedLang = localStorage.getItem("preferred-language");
  if (savedLang && i18n[savedLang]) {
    return savedLang;
  }

  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    // Try to match full language code
    if (i18n[browserLang]) {
      return browserLang;
    }

    // Try to match the first two characters of the language code (e.g., "zh-TW" -> "zh")
    const langPrefix = browserLang.split("-")[0];
    for (const key in i18n) {
      if (key.startsWith(langPrefix)) {
        return key;
      }
    }
  }

  // Default to English
  return "en";
}

// Initialize website language
function initializeLanguage() {
  const preferredLang = getPreferredLanguage();
  setLanguage(preferredLang);
}

// Initialize language and event listeners after page load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize language
  initializeLanguage();

  // Add event listeners for language buttons
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(this.getAttribute("data-lang"));
    });
  });
});

// ==================================================
// Dynamic content translation and performance optimization functions
// ==================================================

/**
 * Create a dynamic element with translation attribute
 * @param {string} i18nKey - Translation key
 * @param {string} defaultText - Default text
 * @param {string} elementType - Element type, default is div
 * @returns {HTMLElement} - Created element
 */
function createDynamicElement(i18nKey, defaultText, elementType = "div") {
  const element = document.createElement(elementType);
  element.setAttribute("data-i18n", i18nKey);

  // Get current language
  const currentLang = localStorage.getItem("preferred-language") || "en";

  // Set text content
  element.textContent =
    i18n[currentLang] && i18n[currentLang][i18nKey]
      ? i18n[currentLang][i18nKey]
      : defaultText;

  return element;
}

/**
 * Translation utility function - get translated text
 * @param {string} key - Translation key
 * @param {string} defaultText - Default text
 * @returns {string} - Translated text
 */
function translateText(key, defaultText) {
  const currentLang = localStorage.getItem("preferred-language") || "en";
  return i18n[currentLang] && i18n[currentLang][key]
    ? i18n[currentLang][key]
    : defaultText;
}

/**
 * Batch apply translations for performance
 * Use when the page contains a large number of elements to translate
 */
function batchApplyTranslations() {
  // Delay load translations to ensure not blocking page rendering
  window.addEventListener("load", function () {
    // If there are many translations, process in batches
    setTimeout(function () {
      const elements = document.querySelectorAll("[data-i18n]");
      const batchSize = 50; // Process 50 elements at a time
      const currentLang = localStorage.getItem("preferred-language") || "en";

      for (let i = 0; i < elements.length; i += batchSize) {
        setTimeout(function () {
          const batch = Array.prototype.slice.call(elements, i, i + batchSize);
          batch.forEach(function (el) {
            // Apply unprocessed translations
            const key = el.getAttribute("data-i18n");
            if (i18n[currentLang] && i18n[currentLang][key]) {
              el.textContent = i18n[currentLang][key];
            }
          });
        }, 0);
      }
    }, 0);
  });
}

/**
 * Language switch with animation effect
 * @param {string} lang - Target language
 */
function setLanguageWithAnimation(lang) {
  // Add fade out effect
  document.body.classList.add("lang-transition");

  setTimeout(function () {
    // Apply translations
    setLanguage(lang);

    // Add fade in effect
    document.body.classList.remove("lang-transition");
  }, 300);
}

// Perform performance-optimized batch translation on page load
batchApplyTranslations();

// Add CSS styles for language switch animation
const styleElement = document.createElement("style");
styleElement.textContent = `
.lang-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.lang-btn.active {
  background-color: #3b82f6;
  color: white;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

/* Language switch transition animation */
.lang-transition {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
`;
document.head.appendChild(styleElement);

// ==================================================
// Defensive programming functions to ensure translation system robustness
// ==================================================

/**
 * Safe translation function - ensures no crash if i18n object is missing or malformed
 * @param {string} key - Translation key
 * @param {string} defaultText - Default text
 * @returns {string} - Translated text
 */
function safeTranslate(key, defaultText) {
  try {
    const currentLang = localStorage.getItem("preferred-language") || "en";
    if (
      typeof i18n === "undefined" ||
      !i18n[currentLang] ||
      !i18n[currentLang][key]
    ) {
      console.warn(`Translation key "${key}" not found, using default text`);
      return defaultText;
    }
    return i18n[currentLang][key];
  } catch (e) {
    console.error("Translation error:", e);
    return defaultText;
  }
}

/**
 * Check if LocalStorage is available
 * @param {string} type - Storage type, usually 'localStorage'
 * @returns {boolean} - Whether available
 */
function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // Firefox
      (e.code === 22 ||
        // Chrome
        e.code === 1014 ||
        // Test name field
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // Confirm storage is not empty
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * Enhanced initialization function - adds defensive features
 */
function enhancedInitializeLanguage() {
  try {
    // Check if browser supports LocalStorage
    if (storageAvailable("localStorage")) {
      let preferredLang = localStorage.getItem("preferred-language");

      if (!preferredLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        preferredLang =
          browserLang && browserLang.startsWith("zh") ? "en" : "en";
      }

      // Verify language code is valid
      if (!i18n[preferredLang]) {
        console.warn(`Unsupported language code ${preferredLang}, using default language`);
        preferredLang = "en";
      }

      setLanguage(preferredLang);
    } else {
      // If LocalStorage is not available, default to English
      console.warn("LocalStorage not available, language preference will not be saved");
      setLanguage("en");
    }
  } catch (error) {
    console.error("Error initializing language:", error);
    // In case of error, use default language
    try {
      setLanguage("en");
    } catch (e) {
      console.error("Unable to set default language:", e);
    }
  }
}

// Replace original function with enhanced language switch function
function enhancedSetLanguage(lang) {
  try {
    // Ensure language code is valid
    if (!i18n[lang]) {
      console.warn(`Unsupported language code: ${lang}, using default language`);
      lang = "en";
    }

    // Try to save user preference
    try {
      if (storageAvailable("localStorage")) {
        localStorage.setItem("preferred-language", lang);
      }
    } catch (e) {
      console.warn("Unable to save language preference:", e);
    }

    // Apply translations
    applyTranslations(lang);

    // Update button state
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        if (btn.getAttribute("data-lang") === lang) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    } catch (e) {
      console.warn("Unable to update language button state:", e);
    }

    // Update HTML tag's lang attribute
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch (e) {
      console.warn("Unable to update HTML lang attribute:", e);
    }

    // Trigger custom event to notify language change
    try {
      const event = new CustomEvent("languageChanged", {
        detail: { language: lang },
      });
      document.dispatchEvent(event);
    } catch (e) {
      console.warn("Unable to trigger language change event:", e);
    }
  } catch (error) {
    console.error("Error setting language:", error);
  }
}

/**
 * Compatibility test function - check if multilingual system works properly
 * Tests the following features:
 * 1. LocalStorage availability
 * 2. Language switch functionality
 * 3. Translation application
 * 4. Dynamic content translation
 *
 * @returns {Object} Test result object
 */
function i18nCompatibilityTest() {
  const results = {
    localStorage: false,
    languageSwitch: false,
    translations: false,
    dynamicContent: false,
    details: {
      errors: [],
      warnings: [],
      info: [],
    },
  };

  // Test LocalStorage availability
  try {
    results.localStorage = storageAvailable("localStorage");
    results.details.info.push(
      "LocalStorage " + (results.localStorage ? "available" : "not available")
    );
  } catch (e) {
    results.details.errors.push("Error testing LocalStorage: " + e.message);
  }

  // Test language switch functionality
  try {
    // Save current language
    const originalLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language") ||
      "en";

    // Try to switch language
    const testLang = originalLang === "en" ? "en" : "en";

    // Use safe language switch method
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(testLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(testLang);
    } else {
      throw new Error("Language switch function not found");
    }

    // Check if language switched successfully
    const newLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language");

    results.languageSwitch = newLang === testLang;
    results.details.info.push(
      "Language switch " + (results.languageSwitch ? "successful" : "failed")
    );

    // Restore original language
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(originalLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(originalLang);
    }
  } catch (e) {
    results.details.errors.push("Error testing language switch: " + e.message);
  }

  // Test translation application
  try {
    // Find elements with data-i18n attribute
    const translatedElements = document.querySelectorAll("[data-i18n]");
    if (translatedElements.length > 0) {
      // Check if content exists
      let hasContent = false;
      translatedElements.forEach((el) => {
        if (el.textContent && el.textContent.trim() !== "") {
          hasContent = true;
        }
      });

      results.translations = hasContent;
      results.details.info.push(
        "Found " +
          translatedElements.length +
          " translated elements, content " +
          (hasContent ? "normal" : "abnormal")
      );
    } else {
      results.details.warnings.push("No elements with data-i18n attribute found");
    }
  } catch (e) {
    results.details.errors.push("Error testing translation application: " + e.message);
  }

  // Test dynamic content translation
  try {
    if (
      typeof createDynamicElement === "function" &&
      typeof translateText === "function"
    ) {
      // Create test element
      const testKey = "test.dynamic";
      const testDefault = "Test dynamic content";
      const testElement = createDynamicElement(testKey, testDefault);

      // Check if element created correctly
      if (
        testElement &&
        testElement.getAttribute("data-i18n") === testKey &&
        testElement.textContent === testDefault
      ) {
        results.dynamicContent = true;
      }

      results.details.info.push(
        "Dynamic content translation " + (results.dynamicContent ? "normal" : "abnormal")
      );
    } else {
      results.details.warnings.push("Dynamic content translation function not available");
    }
  } catch (e) {
    results.details.errors.push("Error testing dynamic content translation: " + e.message);
  }

  // Output test result summary
  console.log(
    "Multilingual compatibility test result:",
    results.localStorage && results.languageSwitch && results.translations
      ? "Passed ✅"
      : "Some features abnormal ⚠️"
  );
  console.table({
    "LocalStorage available": results.localStorage ? "✅" : "❌",
    "Language switch functionality": results.languageSwitch ? "✅" : "❌",
    "Translation application": results.translations ? "✅" : "❌",
    "Dynamic content translation": results.dynamicContent ? "✅" : "❌",
  });

  if (results.details.errors.length > 0) {
    console.error("Errors:", results.details.errors);
  }

  if (results.details.warnings.length > 0) {
    console.warn("Warnings:", results.details.warnings);
  }

  return results;
}

// Automatically run compatibility test and save result to global variable
window.addEventListener("load", function () {
  // Delay execution test to ensure page fully loaded
  setTimeout(function () {
    try {
      window.i18nTestResults = i18nCompatibilityTest();
    } catch (e) {
      console.error("Error running multilingual compatibility test:", e);
    }
  }, 1000);
});
