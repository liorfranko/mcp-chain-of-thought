// i18n.js - Multilingual Support Functionality
// Translation Data Structure
const i18n = {
  "zh-TW": {
    // 導航欄
    "nav.pain-points": "痛點",
    "nav.features": "功能",
    "nav.workflow": "工作流程",
    "nav.installation": "安裝配置",
    "nav.github": "GitHub",
    "nav.menu-button": "菜單",
    "nav.logo.alt": "蝦米任務管理器標誌",
    "nav.prompt-custom": "提示詞配置",
    // 英雄區
    "hero.title": "Shrimp Task Manager",
    "hero.subtitle": "為AI編程助手提供結構化任務管理的智能系統",
    "hero.description":
      "讓AI助手擁有長期記憶能力，高效管理複雜任務，提供結構化的任務分解和執行追蹤，讓您的編程體驗更加流暢和高效。",
    "hero.start": "開始使用",
    "hero.learn-more": "了解更多",
    "hero.workflow-image.alt": "智能任務管理工作流程",
    // 痛點解決方案區
    "pain-points.title": "痛點與解決方案",
    "pain-points.subtitle":
      "Shrimp Task Manager 專為解決 AI 編程助手在任務管理中面臨的三大核心痛點而設計。",
    "pain-points.memory-loss.title": "記憶缺失",
    "pain-points.memory-loss.description":
      "AI助手缺乏跨對話的任務記憶能力，導致無法追蹤長期任務進度，重複解釋相同需求，浪費時間和資源。",
    "pain-points.memory-loss.solution.title": "任務記憶功能",
    "pain-points.memory-loss.solution.description":
      "自動保存執行歷史，提供長期記憶能力，讓AI助手能夠記住之前的任務進度，無縫繼續未完成任務。",
    "pain-points.memory-loss.icon.alt": "記憶缺失",
    "pain-points.structure-chaos.title": "結構混亂",
    "pain-points.structure-chaos.description":
      "複雜任務缺乏系統化管理導致效率低下，缺少依賴關係管理，子任務執行混亂，難以追蹤總體進度。",
    "pain-points.structure-chaos.solution.title": "結構化任務分解",
    "pain-points.structure-chaos.solution.description":
      "自動將複雜任務分解為可管理的子任務，建立清晰的依賴關係，提供有序執行路徑，確保高效完成。",
    "pain-points.structure-chaos.icon.alt": "結構混亂",
    "pain-points.structure-chaos.solution.icon.alt": "結構化任務分解",
    "pain-points.repeat-work.title": "重複工作",
    "pain-points.repeat-work.description":
      "無法有效利用過往經驗與解決方案，每次對話都需從零開始，缺乏知識積累和經驗參考系統。",
    "pain-points.repeat-work.solution.title": "知識積累與經驗參考",
    "pain-points.repeat-work.solution.description":
      "自動記錄成功解決方案，建立任務知識庫，支持相似任務快速參考，實現經驗積累和知識復用。",
    "pain-points.repeat-work.icon.alt": "重複工作",
    "pain-points.repeat-work.solution.icon.alt":
      "Knowledge Accumulation and Experience Reference",
    "pain-points.explore": "探索核心功能",
    // 功能區塊
    "features.title": "核心功能",
    "features.subtitle":
      "Shrimp Task Manager 提供六大核心功能，幫助您高效管理、執行和追蹤複雜任務。",
    "features.planning.title": "智能任務規劃與分析",
    "features.planning.description":
      "通過深入分析需求和約束條件，生成結構化任務計劃。自動評估範圍、風險和優先級，提供理性和全面的實施策略。",
    "features.planning.icon.alt": "智能任務規劃與分析",
    "features.decomposition.title": "自動任務分解與依賴管理",
    "features.decomposition.description":
      "智能將複雜任務分解為可管理的小任務，識別任務間依賴關係，建立優化執行路徑，避免資源衝突與執行瓶頸。",
    "features.decomposition.icon.alt": "自動任務分解與依賴管理",
    "features.tracking.title": "執行狀態追蹤",
    "features.tracking.description":
      "實時監控每個任務的執行狀態，提供進度視覺化顯示，自動更新依賴項狀態，並在任務完成時提供詳細執行報告。",
    "features.tracking.icon.alt": "執行狀態追蹤",
    "features.verification.title": "任務完整性驗證",
    "features.verification.description":
      "全面檢查任務完成度，確保所有需求與標準都已滿足，提供驗證報告與質量評估，確保產出符合預期要求。",
    "features.verification.icon.alt": "任務完整性驗證",
    "features.complexity.title": "任務複雜度評估",
    "features.complexity.description":
      "基於多維度標準評估任務複雜度，提供資源需求估算，識別高風險組件，幫助合理分配資源與時間。",
    "features.complexity.icon.alt": "任務複雜度評估",
    "features.memory.title": "任務記憶功能",
    "features.memory.description":
      "提供跨會話的任務記憶能力，自動保存執行歷史與上下文，允許隨時恢復任務並繼續執行，無需重複解釋需求。",
    "features.memory.icon.alt": "任務記憶功能",
    "features.learn-workflow": "了解工作流程",
    // 工作流程區塊
    "workflow.title": "工作流程",
    "workflow.subtitle":
      "Shrimp Task Manager 提供完整的工作流程，從任務規劃到任務完成的每個步驟都經過精心設計。",
    "workflow.step1.title": "任務規劃",
    "workflow.step1.description": "初始化並詳細規劃任務流程",
    "workflow.step2.title": "深入分析",
    "workflow.step2.description": "深入分析需求並評估技術可行性",
    "workflow.step3.title": "方案反思",
    "workflow.step3.description": "批判性審查分析結果並優化方案",
    "workflow.step4.title": "任務分解",
    "workflow.step4.description": "將複雜任務分解為可管理的子任務",
    "workflow.step5.title": "任務執行",
    "workflow.step5.description": "按照預定計劃執行特定任務",
    "workflow.step6.title": "結果驗證",
    "workflow.step6.description": "全面驗證任務完成度和質量",
    "workflow.step7.title": "任務完成",
    "workflow.step7.description": "標記任務為完成狀態並生成報告",
    "workflow.learn-more-link": "了解更多 →",
    "workflow.mobile.step1.full-description":
      "初始化並詳細規劃任務流程，建立明確的目標與成功標準，可選擇參考現有任務進行延續規劃。",
    "workflow.mobile.step2.full-description":
      "深入分析任務需求並系統性檢查代碼庫，評估技術可行性與潛在風險，提供初步解決方案建議。",
    "workflow.mobile.step3.full-description":
      "批判性審查分析結果，評估方案完整性並識別優化機會，確保解決方案符合最佳實踐。",
    "workflow.mobile.step4.full-description":
      "將複雜任務分解為獨立且可追蹤的子任務，建立明確的依賴關係和優先順序，支援多種更新模式。",
    "workflow.mobile.step5.full-description":
      "按照預定計劃執行特定任務，確保每個步驟的輸出符合質量標準，處理執行過程中的異常情況。",
    "workflow.mobile.step6.full-description":
      "全面驗證任務完成度，確保所有需求與技術標準都已滿足，並無遺漏細節，提供質量評估報告。",
    "workflow.mobile.step7.full-description":
      "正式標記任務為完成狀態，生成詳細的完成報告，並更新關聯任務的依賴狀態，確保工作流程的連續性。",
    // 安裝配置區塊
    "installation.title": "安裝與配置區",
    "installation.subtitle":
      "Shrimp Task Manager 提供多種安裝方式，無論您是想快速開始，還是需要進行高級配置，都能輕鬆上手。",
    "installation.manual.title": "手動安裝設置",
    "installation.step1": "克隆代碼倉庫",
    "installation.step2": "安裝依賴",
    "installation.step3": "編譯項目",
    "installation.cursor.title": "Cursor IDE 配置",
    "installation.cursor.description":
      "如果您使用 Cursor IDE，可以將 Shrimp Task Manager 集成到您的開發環境中。",
    "installation.quickstart.title": "快速入門",
    "installation.quickstart.description":
      "完成安裝後，請查看我們的快速入門指南，了解如何使用 MCP Shrimp Task Manager。",
    "installation.faq.title": "常見問題",
    "installation.faq.description":
      "遇到問題？查看我們的常見問題解答，或在 GitHub 上提交問題。",
    "installation.copy-button": "複製",
    "installation.important-note.title": "重要提示",
    "installation.important-note.description":
      "必須使用絕對路徑： 請確保 DATA_DIR 配置使用絕對路徑而非相對路徑，否則可能無法正確載入資料",
    "installation.prompt-config.title": "提示詞配置說明",
    "installation.prompt-config.intro": "Shrimp Task Manager 支持兩種模式：",
    "installation.prompt-config.mode1.title": "TaskPlanner:",
    "installation.prompt-config.mode1.description":
      "適用於初始任務規劃和複雜任務分解，AI 助手扮演任務規劃師角色。",
    "installation.prompt-config.mode2.title": "TaskExecutor:",
    "installation.prompt-config.mode2.description":
      "適用於執行預定義任務，AI 助手扮演執行專家角色。",
    "installation.prompt-config.tip":
      "您可以在Cursor設置中使用 Custom modes 配置來自定義模式，以適應不同的工作場景。",
    // CTA區塊
    "cta.title": "立即體驗智能任務管理",
    "cta.description":
      "提升您的AI編程體驗，告別無序任務管理，擁抱更高效的工作流程。",
    "cta.github": "前往 GitHub 倉庫",
    "cta.start": "開始安裝",
    // 頁腳區塊
    "footer.copyright": "© 2023 MCP Task Manager. 保留所有權利。",
    "footer.developer": "由 Siage 用 ❤️ 開發",

    // 通用UI元素
    "common.close": "關閉",
    "common.back": "返回",
    "common.next": "下一步",
    "common.submit": "提交",
    "common.cancel": "取消",
    "common.confirm": "確認",
    "common.copy": "複製",
    "common.copied": "已複製!",
    "common.yes": "是",
    "common.no": "否",
    "common.more": "更多",
    "common.less": "收起",
    "common.loading": "載入中...",
    "common.error": "錯誤",
    "common.success": "成功",
    "common.warning": "警告",
    "common.info": "提示",
    "common.search": "搜尋",
    "common.filter": "篩選",
    "common.sort": "排序",
    "common.ascending": "升序",
    "common.descending": "降序",
    "common.lang.zh-tw": "中",
    "common.lang.en": "EN",
    "modal.close-button": "關閉",
    "modal.close-button-aria": "關閉",

    // 工作流程詳細內容
    "workflow.step1.content.title": "任務規劃階段",
    "workflow.step1.content.description":
      "任務規劃階段是AI助手定義項目範圍、設置目標和建立成功標準的初始階段。",
    "workflow.step1.content.activities": "主要活動：",
    "workflow.step1.content.activity1": "明確項目需求和約束條件",
    "workflow.step1.content.activity2": "設定清晰的目標和定義可衡量的成功標準",
    "workflow.step1.content.activity3": "建立項目邊界並識別相關方",
    "workflow.step1.content.activity4": "創建包含時間估算的高級計劃",
    "workflow.step1.content.activity5": "可選擇參考現有任務進行持續規劃",
    "workflow.step1.content.outputs": "輸出成果：",
    "workflow.step1.content.output1": "全面的任務描述",
    "workflow.step1.content.output2": "明確的成功標準",
    "workflow.step1.content.output3": "技術需求和約束條件",
    "workflow.step1.content.summary":
      "這個階段為所有後續工作奠定基礎，確保AI助手和用戶對需要完成的任務有共同理解。",

    "workflow.step2.content.title": "深入分析階段",
    "workflow.step2.content.description":
      "深入分析階段包括對需求和技術環境的徹底檢查，以開發可行的實施策略。",
    "workflow.step2.content.activities": "主要活動：",
    "workflow.step2.content.activity1": "分析需求並識別技術挑戰",
    "workflow.step2.content.activity2": "評估技術可行性和潛在風險",
    "workflow.step2.content.activity3": "研究最佳實踐和可用解決方案",
    "workflow.step2.content.activity4": "系統性地審查現有代碼庫（如適用）",
    "workflow.step2.content.activity5": "開發初步實施概念",
    "workflow.step2.content.outputs": "輸出成果：",
    "workflow.step2.content.output1": "技術可行性評估",
    "workflow.step2.content.output2": "風險識別和緩解策略",
    "workflow.step2.content.output3": "初步實施方法",
    "workflow.step2.content.output4": "必要時提供偽代碼或架構圖",
    "workflow.step2.content.summary":
      "這個階段確保在進入實施之前，提出的解決方案技術上可行並解決所有需求。",

    // 錯誤和警告訊息
    "error.storage": "無法訪問本地存儲，語言偏好將不會被保存。",
    "error.translation": "翻譯錯誤：無法加載翻譯數據。",
    "error.network": "網絡錯誤：無法連接到服務器。",
    "warning.browser":
      "您的瀏覽器可能不支持所有功能，建議使用最新版本的Chrome、Firefox或Safari瀏覽器。",
    "warning.mobile": "某些功能在移動設備上可能受限。",

    // 代碼示例區塊
    "examples.planning.title": "任務規劃與分解流程",
    "examples.planning.intro":
      "這個示例展示了如何使用MCP Shrimp Task Manager來規劃和分解複雜任務。整個流程包括四個主要步驟：",
    "examples.planning.step1": "初始化並詳細規劃任務，明確目標與成功標準",
    "examples.planning.step2": "深入了解任務，分析技術可行性和潛在挑戰",
    "examples.planning.step3": "批判性審查分析結果，優化提案",
    "examples.planning.step4": "將複雜任務分解為可管理的子任務",
    "examples.planning.conclusion":
      "通過這種方法，您可以將複雜的大型任務轉化為結構化的、可執行的工作單元，同時保持整體視角。",
    "examples.execution.title": "任務執行與完成流程",
    "examples.execution.intro":
      "這個示例展示了如何執行和完成已規劃的任務。整個流程包括四個主要步驟：",
    "examples.execution.step1.title": "任務列表",
    "examples.execution.step1": "查詢待處理任務列表，了解當前狀態",
    "examples.execution.step2": "按照預定計劃執行選定的任務",
    "examples.execution.step3": "驗證任務完成情況，確保達到質量標準",
    "examples.execution.step4": "正式標記任務為完成狀態，生成報告",
    "examples.execution.conclusion":
      "通過這種方法，您可以系統地執行任務並確保每個步驟都達到預期的質量標準，最終完成整個工作流程。",
    "examples.tip.title": "💡 提示",
    "examples.tip.description":
      "上面的工作流程並非固定不變的，Agent 會根據分析情況進行重複迭代不同步驟，直到達到預期效果。",

    // 快速入門和常見問題區塊
    "quickstart.title": "快速入門",
    "quickstart.description":
      "完成安裝後，請查看我們的快速入門指南，了解如何使用 MCP Shrimp Task Manager。",
    "quickstart.view-code-link": "查看代碼 →",
    "faq.title": "常見問題",
    "faq.description":
      "遇到問題？查看我們的常見問題解答，或在 GitHub 上提交問題。",
    "faq.view-faq-link": "查看常見問題 →",
    "installation.cursor.mcp-servers": "to/your/project/.cursor/mcp.jsonn",
    "task.planner.prompt": `你是一個專業的任務規劃專家，你必須與用戶進行交互，分析用戶的需求，並收集專案相關資訊，最終使用 "plan_task" 建立任務，當任務建立完成後必須總結摘要，並告知用戶使用"TaskExecutor"模式進行任務執行。
你必須專心於任務規劃禁止使用 "execute_task" 來執行任務，
嚴重警告你是任務規劃專家，你不能直接修改程式碼，你只能規劃任務，並且你不能直接修改程式碼，你只能規劃任務。`,
    "task.executor.prompt": `你是一個專業的任務執行專家，當用戶有指定執行任務，則使用 "execute_task" 進行任務執行，
沒有指定任務時則使用 "list_tasks" 尋找未執行的任務並執行，
當執行完成後必須總結摘要告知用戶結論，
你一次只能執行一個任務，當任務完成時除非用戶明確告知否則禁止進行下一則任務。
用戶如果要求"連續模式"則按照順序連續執行所有任務。`,
    // Prompt 自定義功能區塊
    "prompt-custom.title": "Prompt 自定義功能",
    "prompt-custom.subtitle":
      "透過環境變數自定義系統提示詞，無需修改代碼即可定制 AI 助手行為",

    "prompt-custom.overview.title": "功能概述",
    "prompt-custom.overview.description":
      "Prompt 自定義允許用戶透過環境變數調整 AI 助手的行為表現，提供兩種自定義方式：完全覆蓋原始提示詞或在原有基礎上追加內容。",

    "prompt-custom.benefits.title": "主要好處",
    "prompt-custom.benefits.item1":
      "個性化定制：根據特定項目或領域需求調整系統行為",
    "prompt-custom.benefits.item2":
      "效率提升：針對重複任務類型進行優化，減少冗余說明",
    "prompt-custom.benefits.item3":
      "品牌一致性：確保輸出內容符合組織的風格指南和標準",
    "prompt-custom.benefits.item4":
      "專業適應性：為特定技術領域或行業調整專業術語和標準",
    "prompt-custom.benefits.item5":
      "團隊協作：統一團隊成員使用的提示詞，保證一致的工作方式",

    "prompt-custom.usage.title": "使用方法",
    "prompt-custom.usage.env.title": "環境變數配置",
    "prompt-custom.usage.env.description":
      "設置環境變數來自定義各功能的提示詞，使用特定命名規則：",
    "prompt-custom.usage.more": "查看詳細文檔了解更多配置方式和參數使用說明。",
    "prompt-custom.view-docs": "查看完整文檔",
  },
  en: {
    // 導航欄
    "nav.pain-points": "Pain Points",
    "nav.features": "Features",
    "nav.workflow": "Workflow",
    "nav.installation": "Installation",
    "nav.github": "GitHub",
    "nav.menu-button": "Menu",
    "nav.logo.alt": "Shrimp Task Manager Logo",
    "nav.prompt-custom": "Prompt Config",
    // 英雄區
    "hero.title": "Shrimp Task Manager",
    "hero.subtitle":
      "Intelligent System for Structured Task Management in AI Programming Assistants",
    "hero.description":
      "Empower your AI assistant with long-term memory capabilities, efficient complex task management, and structured task decomposition and execution tracking, making your programming experience smoother and more efficient.",
    "hero.start": "Get Started",
    "hero.learn-more": "Learn More",
    "hero.workflow-image.alt": "Intelligent Task Management Workflow",
    // 痛點解決方案區
    "pain-points.title": "Pain Points & Solutions",
    "pain-points.subtitle":
      "Shrimp Task Manager is designed to solve three core pain points faced by AI programming assistants in task management.",
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
    // 功能區塊
    "features.title": "Core Features",
    "features.subtitle":
      "Shrimp Task Manager provides six core features to help you efficiently manage, execute, and track complex tasks.",
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
    // 工作流程區塊
    "workflow.title": "Workflow",
    "workflow.subtitle":
      "Shrimp Task Manager provides a complete workflow, with each step from task planning to task completion carefully designed.",
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
    // 安裝配置區塊
    "installation.title": "Installation & Configuration",
    "installation.subtitle":
      "Shrimp Task Manager offers multiple installation methods, whether you want to get started quickly or need advanced configuration, it's easy to set up.",
    "installation.manual.title": "Manual Installation",
    "installation.step1": "Clone Repository",
    "installation.step2": "Install Dependencies",
    "installation.step3": "Build Project",
    "installation.cursor.title": "Cursor IDE Configuration",
    "installation.cursor.description":
      "If you use Cursor IDE, you can integrate Shrimp Task Manager into your development environment.",
    "installation.quickstart.title": "Quick Start",
    "installation.quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Shrimp Task Manager.",
    "installation.faq.title": "FAQ",
    "installation.faq.description":
      "Having issues? Check our frequently asked questions or submit an issue on GitHub.",
    "installation.copy-button": "Copy",
    "installation.important-note.title": "Important Note",
    "installation.important-note.description":
      "Must use absolute path: Please ensure the DATA_DIR configuration uses absolute paths rather than relative paths, otherwise data may not load correctly",
    "installation.prompt-config.title": "Prompt Configuration Guide",
    "installation.prompt-config.intro":
      "Shrimp Task Manager supports two modes:",
    "installation.prompt-config.mode1.title": "TaskPlanner:",
    "installation.prompt-config.mode1.description":
      "Suitable for initial task planning and complex task decomposition, where the AI assistant plays the role of a task planner.",
    "installation.prompt-config.mode2.title": "TaskExecutor:",
    "installation.prompt-config.mode2.description":
      "Suitable for executing predefined tasks, where the AI assistant plays the role of an execution expert.",
    "installation.prompt-config.tip":
      "You can use Custom modes in Cursor settings to customize modes to suit different work scenarios.",
    // CTA區塊
    "cta.title": "Experience Intelligent Task Management Now",
    "cta.description":
      "Enhance your AI programming experience, say goodbye to disorganized task management, and embrace a more efficient workflow.",
    "cta.github": "Go to GitHub Repository",
    "cta.start": "Start Installation",
    // 頁腳區塊
    "footer.copyright": "© 2023 MCP Task Manager. All Rights Reserved.",
    "footer.developer": "Made with ❤️ by Siage",

    // 通用UI元素
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

    // 工作流程詳細內容
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

    // 錯誤和警告訊息
    "error.storage":
      "Unable to access local storage, language preferences will not be saved.",
    "error.translation": "Translation error: Unable to load translation data.",
    "error.network": "Network error: Unable to connect to the server.",
    "warning.browser":
      "Your browser may not support all features, we recommend using the latest version of Chrome, Firefox, or Safari.",
    "warning.mobile": "Some features may be limited on mobile devices.",

    // 代碼示例區塊
    "examples.planning.title": "Task Planning and Decomposition Process",
    "examples.planning.intro":
      "This example demonstrates how to use MCP Shrimp Task Manager to plan and break down complex tasks. The entire process includes four main steps:",
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

    // 快速入門和常見問題區塊
    "quickstart.title": "Quick Start",
    "quickstart.description":
      "After installation, check our quick start guide to learn how to use MCP Shrimp Task Manager.",
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
    // Prompt 自定義功能區塊
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

// 翻譯應用函數
function applyTranslations(lang) {
  // 確保選擇的語言有效
  if (!i18n[lang]) {
    console.error("不支援的語言:", lang);
    return;
  }

  // 應用翻譯到所有帶有 data-i18n 屬性的元素
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      element.textContent = i18n[lang][key];
    } else {
      console.warn(`未找到翻譯鍵: ${key}`);
    }
  });

  // 處理語言特定的連結
  document.querySelectorAll(".lang-specific").forEach((element) => {
    if (element.hasAttribute(`data-lang-${lang}`)) {
      const langSpecificHref = element.getAttribute(`data-lang-${lang}`);
      if (langSpecificHref) {
        element.setAttribute("href", langSpecificHref);
      }
    }
  });
}

// 設置語言並儲存用戶偏好
function setLanguage(lang) {
  // 儲存用戶偏好
  localStorage.setItem("preferred-language", lang);

  // 應用翻譯
  applyTranslations(lang);

  // 更新按鈕狀態
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // 更新 html 標籤的 lang 屬性
  document.documentElement.setAttribute("lang", lang);
}

// 獲取用戶偏好語言或瀏覽器語言
function getPreferredLanguage() {
  // 檢查本地儲存
  const savedLang = localStorage.getItem("preferred-language");
  if (savedLang && i18n[savedLang]) {
    return savedLang;
  }

  // 檢查瀏覽器語言
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    // 嘗試使用完整語言代碼匹配
    if (i18n[browserLang]) {
      return browserLang;
    }

    // 嘗試使用語言代碼前兩個字符匹配（如 "zh-TW" -> "zh"）
    const langPrefix = browserLang.split("-")[0];
    for (const key in i18n) {
      if (key.startsWith(langPrefix)) {
        return key;
      }
    }
  }

  // 默認返回英文
  return "en";
}

// 初始化網站語言
function initializeLanguage() {
  const preferredLang = getPreferredLanguage();
  setLanguage(preferredLang);
}

// 頁面載入完成後初始化語言和事件監聽器
document.addEventListener("DOMContentLoaded", function () {
  // 初始化語言
  initializeLanguage();

  // 為語言按鈕添加事件監聽器
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(this.getAttribute("data-lang"));
    });
  });
});

// ==================================================
// 動態內容翻譯和性能優化函數
// ==================================================

/**
 * 創建帶有翻譯屬性的動態元素
 * @param {string} i18nKey - 翻譯鍵
 * @param {string} defaultText - 默認文本
 * @param {string} elementType - 元素類型，默認為div
 * @returns {HTMLElement} - 創建的元素
 */
function createDynamicElement(i18nKey, defaultText, elementType = "div") {
  const element = document.createElement(elementType);
  element.setAttribute("data-i18n", i18nKey);

  // 獲取當前語言
  const currentLang = localStorage.getItem("preferred-language") || "zh-TW";

  // 設置文本內容
  element.textContent =
    i18n[currentLang] && i18n[currentLang][i18nKey]
      ? i18n[currentLang][i18nKey]
      : defaultText;

  return element;
}

/**
 * 翻譯工具函數 - 獲取翻譯文本
 * @param {string} key - 翻譯鍵
 * @param {string} defaultText - 默認文本
 * @returns {string} - 翻譯後的文本
 */
function translateText(key, defaultText) {
  const currentLang = localStorage.getItem("preferred-language") || "zh-TW";
  return i18n[currentLang] && i18n[currentLang][key]
    ? i18n[currentLang][key]
    : defaultText;
}

/**
 * 批量處理翻譯，提高性能
 * 當頁面包含大量需要翻譯的元素時使用
 */
function batchApplyTranslations() {
  // 延遲加載翻譯，確保不阻塞頁面渲染
  window.addEventListener("load", function () {
    // 如果有大量翻譯內容，分批處理
    setTimeout(function () {
      const elements = document.querySelectorAll("[data-i18n]");
      const batchSize = 50; // 每批處理50個元素
      const currentLang = localStorage.getItem("preferred-language") || "zh-TW";

      for (let i = 0; i < elements.length; i += batchSize) {
        setTimeout(function () {
          const batch = Array.prototype.slice.call(elements, i, i + batchSize);
          batch.forEach(function (el) {
            // 應用未處理的翻譯
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
 * 帶動畫效果的語言切換
 * @param {string} lang - 目標語言
 */
function setLanguageWithAnimation(lang) {
  // 添加淡出效果
  document.body.classList.add("lang-transition");

  setTimeout(function () {
    // 應用翻譯
    setLanguage(lang);

    // 添加淡入效果
    document.body.classList.remove("lang-transition");
  }, 300);
}

// 在頁面載入時執行性能優化的批量翻譯
batchApplyTranslations();

// 添加語言切換動畫的CSS樣式
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

/* 語言切換過渡動畫 */
.lang-transition {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
`;
document.head.appendChild(styleElement);

// ==================================================
// 防禦性編程函數，確保翻譯系統的健壯性
// ==================================================

/**
 * 安全翻譯函數 - 確保在i18n對象缺失或格式錯誤時不會崩潰
 * @param {string} key - 翻譯鍵
 * @param {string} defaultText - 默認文本
 * @returns {string} - 翻譯後的文本
 */
function safeTranslate(key, defaultText) {
  try {
    const currentLang = localStorage.getItem("preferred-language") || "zh-TW";
    if (
      typeof i18n === "undefined" ||
      !i18n[currentLang] ||
      !i18n[currentLang][key]
    ) {
      console.warn(`翻譯鍵 "${key}" 不存在，使用默認文本`);
      return defaultText;
    }
    return i18n[currentLang][key];
  } catch (e) {
    console.error("翻譯錯誤:", e);
    return defaultText;
  }
}

/**
 * 檢測 LocalStorage 是否可用
 * @param {string} type - 存儲類型，通常是 'localStorage'
 * @returns {boolean} - 是否可用
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
      // 針對 Firefox
      (e.code === 22 ||
        // 針對 Chrome
        e.code === 1014 ||
        // 測試名稱字段
        e.name === "QuotaExceededError" ||
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // 確認存儲不為空
      storage &&
      storage.length !== 0
    );
  }
}

/**
 * 增強版初始化函數 - 添加防禦性功能
 */
function enhancedInitializeLanguage() {
  try {
    // 檢查瀏覽器是否支持 LocalStorage
    if (storageAvailable("localStorage")) {
      let preferredLang = localStorage.getItem("preferred-language");

      if (!preferredLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        preferredLang =
          browserLang && browserLang.startsWith("zh") ? "zh-TW" : "en";
      }

      // 驗證語言代碼是否有效
      if (!i18n[preferredLang]) {
        console.warn(`不支援的語言代碼 ${preferredLang}，使用默認語言`);
        preferredLang = "zh-TW";
      }

      setLanguage(preferredLang);
    } else {
      // 如果不支持 LocalStorage，默認使用中文
      console.warn("LocalStorage 不可用，語言偏好將不會被保存");
      setLanguage("zh-TW");
    }
  } catch (error) {
    console.error("初始化語言時發生錯誤:", error);
    // 在錯誤情況下使用默認語言
    try {
      setLanguage("zh-TW");
    } catch (e) {
      console.error("無法設置默認語言:", e);
    }
  }
}

// 替換原始函數的增強版語言切換函數
function enhancedSetLanguage(lang) {
  try {
    // 確保語言代碼有效
    if (!i18n[lang]) {
      console.warn(`不支援的語言代碼: ${lang}，使用默認語言`);
      lang = "zh-TW";
    }

    // 嘗試保存用戶偏好
    try {
      if (storageAvailable("localStorage")) {
        localStorage.setItem("preferred-language", lang);
      }
    } catch (e) {
      console.warn("無法保存語言偏好:", e);
    }

    // 應用翻譯
    applyTranslations(lang);

    // 更新按鈕狀態
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        if (btn.getAttribute("data-lang") === lang) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    } catch (e) {
      console.warn("無法更新語言按鈕狀態:", e);
    }

    // 更新 HTML 標籤的 lang 屬性
    try {
      document.documentElement.setAttribute("lang", lang);
    } catch (e) {
      console.warn("無法更新 HTML lang 屬性:", e);
    }

    // 觸發自定義事件通知語言變更
    try {
      const event = new CustomEvent("languageChanged", {
        detail: { language: lang },
      });
      document.dispatchEvent(event);
    } catch (e) {
      console.warn("無法觸發語言變更事件:", e);
    }
  } catch (error) {
    console.error("設置語言時發生錯誤:", error);
  }
}

/**
 * 兼容性測試函數 - 檢查多語系系統是否正常工作
 * 測試以下功能:
 * 1. LocalStorage 是否可用
 * 2. 語言切換功能是否正常
 * 3. 翻譯應用是否正常
 * 4. 動態內容翻譯是否正常
 *
 * @returns {Object} 測試結果對象
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

  // 測試 LocalStorage 是否可用
  try {
    results.localStorage = storageAvailable("localStorage");
    results.details.info.push(
      "LocalStorage " + (results.localStorage ? "可用" : "不可用")
    );
  } catch (e) {
    results.details.errors.push("測試 LocalStorage 時發生錯誤: " + e.message);
  }

  // 測試語言切換功能
  try {
    // 保存當前語言
    const originalLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language") ||
      "zh-TW";

    // 嘗試切換語言
    const testLang = originalLang === "en" ? "zh-TW" : "en";

    // 使用安全的語言切換方式
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(testLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(testLang);
    } else {
      throw new Error("找不到語言切換函數");
    }

    // 檢查語言是否成功切換
    const newLang =
      document.documentElement.lang ||
      localStorage.getItem("preferred-language");

    results.languageSwitch = newLang === testLang;
    results.details.info.push(
      "語言切換 " + (results.languageSwitch ? "正常" : "異常")
    );

    // 恢復原來的語言
    if (typeof enhancedSetLanguage === "function") {
      enhancedSetLanguage(originalLang);
    } else if (typeof setLanguage === "function") {
      setLanguage(originalLang);
    }
  } catch (e) {
    results.details.errors.push("測試語言切換時發生錯誤: " + e.message);
  }

  // 測試翻譯應用是否正常
  try {
    // 查找頁面上有 data-i18n 屬性的元素
    const translatedElements = document.querySelectorAll("[data-i18n]");
    if (translatedElements.length > 0) {
      // 檢查是否有內容
      let hasContent = false;
      translatedElements.forEach((el) => {
        if (el.textContent && el.textContent.trim() !== "") {
          hasContent = true;
        }
      });

      results.translations = hasContent;
      results.details.info.push(
        "找到 " +
          translatedElements.length +
          " 個翻譯元素，內容" +
          (hasContent ? "正常" : "異常")
      );
    } else {
      results.details.warnings.push("頁面上找不到帶有 data-i18n 屬性的元素");
    }
  } catch (e) {
    results.details.errors.push("測試翻譯應用時發生錯誤: " + e.message);
  }

  // 測試動態內容翻譯
  try {
    if (
      typeof createDynamicElement === "function" &&
      typeof translateText === "function"
    ) {
      // 創建測試元素
      const testKey = "test.dynamic";
      const testDefault = "測試動態內容";
      const testElement = createDynamicElement(testKey, testDefault);

      // 檢查元素是否正確創建
      if (
        testElement &&
        testElement.getAttribute("data-i18n") === testKey &&
        testElement.textContent === testDefault
      ) {
        results.dynamicContent = true;
      }

      results.details.info.push(
        "動態內容翻譯 " + (results.dynamicContent ? "正常" : "異常")
      );
    } else {
      results.details.warnings.push("動態內容翻譯功能不可用");
    }
  } catch (e) {
    results.details.errors.push("測試動態內容翻譯時發生錯誤: " + e.message);
  }

  // 輸出測試結果摘要
  console.log(
    "多語系兼容性測試結果:",
    results.localStorage && results.languageSwitch && results.translations
      ? "通過 ✅"
      : "部分功能異常 ⚠️"
  );
  console.table({
    LocalStorage可用: results.localStorage ? "✅" : "❌",
    語言切換功能: results.languageSwitch ? "✅" : "❌",
    翻譯應用: results.translations ? "✅" : "❌",
    動態內容翻譯: results.dynamicContent ? "✅" : "❌",
  });

  if (results.details.errors.length > 0) {
    console.error("錯誤:", results.details.errors);
  }

  if (results.details.warnings.length > 0) {
    console.warn("警告:", results.details.warnings);
  }

  return results;
}

// 自動運行兼容性測試並將結果保存到全局變量
window.addEventListener("load", function () {
  // 延遲執行測試，確保頁面完全載入
  setTimeout(function () {
    try {
      window.i18nTestResults = i18nCompatibilityTest();
    } catch (e) {
      console.error("執行多語系兼容性測試時發生錯誤:", e);
    }
  }, 1000);
});
