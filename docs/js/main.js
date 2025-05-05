/**
 * MCP Shrimp Task Manager main website script
 */

// Execute after page load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize scroll animation
  initAOS();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize code highlighting and copying functionality
  initCodeBlocks();

  // Smooth scrolling functionality
  initSmoothScroll();

  // Hero area effects
  initHeroEffects();

  // Pain points and solutions area effects
  initPainPointsEffects();

  // Core features showcase area effects
  initFeaturesEffects();

  // Workflow showcase area effects
  initWorkflowEffects();

  // Initialize installation and configuration section functionality
  initInstallationSection();

  // Check scroll position to show back to top button
  initScrollToTopButton();

  // Initialize lazy loading
  initLazyLoading();

  // Initialize page entrance animation
  initPageEntranceAnimation();

  // Multi-language functionality
  initMultiLanguage();
});

/**
 * Initialize AOS scroll animation library
 */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: "ease-in-out",
    once: true,
    mirror: true,
    disable: function () {
      // Disable animation on low-performance devices based on user preference
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },
  });

  // Re-initialize AOS when window size changes to ensure correct trigger position
  window.addEventListener("resize", function () {
    AOS.refresh();
  });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();

      // In order to support transition effect, first remove hidden class
      if (mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.remove("hidden");

        // Wait for DOM update, then add visible class to start transition effect
        setTimeout(() => {
          mobileMenu.classList.add("visible");
        }, 10);
      } else {
        // First remove visible class to trigger transition effect
        mobileMenu.classList.remove("visible");

        // Wait for transition to complete, then hide menu
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300); // 300ms matches CSS transition time
      }
    });

    // Close menu after clicking menu item
    const menuLinks = mobileMenu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("visible");

        // Wait for transition to complete, then hide menu
        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      });
    });

    // Close menu outside menu area
    document.addEventListener("click", function (e) {
      if (
        !menuToggle.contains(e.target) &&
        !mobileMenu.contains(e.target) &&
        !mobileMenu.classList.contains("hidden")
      ) {
        mobileMenu.classList.remove("visible");

        setTimeout(() => {
          mobileMenu.classList.add("hidden");
        }, 300);
      }
    });
  }
}

/**
 * Initialize hero area effects
 */
function initHeroEffects() {
  // Get hero area
  const heroSection = document.getElementById("hero");
  if (!heroSection) return;

  // Add animation sequence for floating decorative elements
  const decorElements = heroSection.querySelectorAll(".absolute");
  decorElements.forEach((elem, index) => {
    elem.style.setProperty("--animation-order", index + 1);

    // Use fade-in animation to gradually show elements after page load
    setTimeout(() => {
      elem.style.opacity = "0.8";
    }, (index + 1) * 200);
  });

  // Add parallax scrolling effect
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;

    // Apply effect when user scrolls past hero area
    if (scrollTop <= heroHeight) {
      const scrollPercentage = scrollTop / heroHeight;

      // Hero area fade-out effect
      heroSection.style.opacity = 1 - scrollPercentage * 0.8;

      // Title move up effect
      const heroTitle = heroSection.querySelector("h1");
      if (heroTitle) {
        heroTitle.style.transform = `translateY(${scrollPercentage * 50}px)`;
      }
    }
  });

  // Add mouse move parallax effect
  heroSection.addEventListener("mousemove", function (e) {
    // This effect is enabled only on larger screens
    if (window.innerWidth >= 768) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

      // Get hero area's image element
      const heroImage = heroSection.querySelector("img");
      if (heroImage) {
        heroImage.style.transform = `translate(${moveX * 2}px, ${
          moveY * 2
        }px) scale(1.02)`;
      }

      // Get hero area's decorative elements
      decorElements.forEach((elem, index) => {
        // Use different scaling ratios to create a layered effect
        const factorX = (index + 1) * 0.03;
        const factorY = (index + 1) * 0.02;
        elem.style.transform = `translate(${moveX * factorX}px, ${
          moveY * factorY
        }px)`;
      });
    }
  });

  // Reset element position when mouse leaves
  heroSection.addEventListener("mouseleave", function () {
    const heroImage = heroSection.querySelector("img");
    if (heroImage) {
      heroImage.style.transform = "";
    }

    decorElements.forEach((elem) => {
      elem.style.transform = "";
    });
  });

  // Logo animation effect
  const logo = document.querySelector("header nav img");
  if (logo) {
    // Navigation bar logo rotates slightly when page loads
    logo.style.transition = "transform 1s ease-out";
    logo.style.transform = "rotate(0deg)";

    setTimeout(() => {
      logo.style.transform = "rotate(5deg)";
      setTimeout(() => {
        logo.style.transform = "rotate(0deg)";
      }, 500);
    }, 1500);
  }
}

/**
 * Initialize pain points and solutions area effects
 */
function initPainPointsEffects() {
  const painPointsSection = document.getElementById("pain-points");
  if (!painPointsSection) return;

  // Get all cards
  const cards = painPointsSection.querySelectorAll(
    ".rounded-lg.overflow-hidden"
  );

  // Add delay for each card to appear with animation
  cards.forEach((card, index) => {
    card.setAttribute("data-aos", "fade-up");
    card.setAttribute("data-aos-delay", (index * 150).toString());
  });

  // Add mouse enter and leave effect for each card
  cards.forEach((card, index) => {
    // Get pain points and solutions block
    const painIcon = card.querySelector(".p-6 img");
    const solutionIcon = card.querySelector(".p-4 img");
    const arrowIcon = card.querySelector(".h-8.w-8.text-green-500");

    // Mouse enter effect
    card.addEventListener("mouseenter", function () {
      // Delay animation execution to create sequence animation effect
      if (painIcon) {
        setTimeout(() => {
          painIcon.style.transform = "scale(1.1) rotate(5deg)";
        }, 100);
      }

      if (arrowIcon) {
        setTimeout(() => {
          arrowIcon.style.transform = "translateY(8px)";
        }, 200);
      }

      if (solutionIcon) {
        setTimeout(() => {
          solutionIcon.style.transform = "scale(1.1) rotate(-5deg)";
        }, 300);
      }

      // Add glowing effect
      card.style.boxShadow =
        "0 20px 30px rgba(0, 0, 0, 0.15), 0 0 15px rgba(59, 130, 246, 0.3)";
    });

    // Mouse leave effect
    card.addEventListener("mouseleave", function () {
      if (painIcon) painIcon.style.transform = "";
      if (arrowIcon) arrowIcon.style.transform = "";
      if (solutionIcon) solutionIcon.style.transform = "";

      // Remove glowing effect
      card.style.boxShadow = "";
    });
  });

  // Add parallax scrolling effect
  window.addEventListener("scroll", function () {
    // This effect is enabled only on larger screens
    if (window.innerWidth >= 768) {
      const scrollPosition = window.scrollY;
      const sectionTop = painPointsSection.offsetTop;
      const sectionHeight = painPointsSection.offsetHeight;

      // Apply effect when user scrolls to this area
      if (
        scrollPosition > sectionTop - window.innerHeight &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        cards.forEach((card, index) => {
          // Relative scroll position within the section
          const relativeScroll =
            (scrollPosition - (sectionTop - window.innerHeight)) /
            (sectionHeight + window.innerHeight);
          // Calculate offset based on card position
          const offset = Math.sin(relativeScroll * Math.PI + index * 0.5) * 15;

          // Set different offset directions based on index
          if (index % 2 === 0) {
            card.style.transform = `translateY(${offset}px)`;
          } else {
            card.style.transform = `translateY(${-offset}px)`;
          }
        });
      }
    }
  });
}

/**
 * Initialize code block functionality
 */
function initCodeBlocks() {
  // Ensure Prism.js is loaded
  if (typeof Prism !== "undefined") {
    // Code highlighting application
    Prism.highlightAll();
  }

  // Initialize code example tab switcher
  initCodeTabSwitcher();

  // Optional: Add typing effect
  initTypingEffect();
}

/**
 * Initialize code example tab switcher
 */
function initCodeTabSwitcher() {
  const tabButtons = document.querySelectorAll(".code-tab-btn");
  const contentSections = document.querySelectorAll(".code-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Get target content ID
      const targetId = btn.getAttribute("data-target");

      // Remove all button active states
      tabButtons.forEach((b) => {
        b.classList.remove("active", "bg-blue-50", "text-blue-600");
        b.classList.add("hover:bg-blue-50");
      });

      // Activate the current button
      btn.classList.add("active", "bg-blue-50", "text-blue-600");

      // Hide all content
      contentSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // Show target content
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");

        // Make sure code highlighting in the activated content area is applied
        const codeBlocks = targetSection.querySelectorAll("code");
        if (typeof Prism !== "undefined" && codeBlocks.length) {
          codeBlocks.forEach((block) => {
            Prism.highlightElement(block);
          });
        }
      }
    });
  });
}

/**
 * Initialize typing effect (optional feature)
 */
function initTypingEffect() {
  // Check if typing effect is enabled (can be controlled via URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  const enableTyping = urlParams.get("typing") === "true";

  if (!enableTyping) return;

  const codeBlocks = document.querySelectorAll("#examples code");
  if (!codeBlocks.length) return;

  codeBlocks.forEach((codeBlock) => {
    const originalText = codeBlock.textContent;
    codeBlock.textContent = "";

    let charIndex = 0;
    const typingSpeed = 30; // 每字符間隔毫秒

    // First hide the original code, then perform the typing effect
    codeBlock.parentElement.classList.add("typing-in-progress");

    // Start typing effect when the window enters the visible area
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(codeBlock.parentElement);

    function startTyping() {
      const typingInterval = setInterval(() => {
        if (charIndex < originalText.length) {
          codeBlock.textContent += originalText.charAt(charIndex);
          charIndex++;

          // Automatically scroll the code block to track the cursor
          codeBlock.parentElement.scrollTop =
            codeBlock.parentElement.scrollHeight;

          // Dynamically apply syntax highlighting
          if (typeof Prism !== "undefined") {
            Prism.highlightElement(codeBlock);
          }
        } else {
          clearInterval(typingInterval);
          codeBlock.parentElement.classList.remove("typing-in-progress");
        }
      }, typingSpeed);
    }
  });
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Make sure it's not just a "#" link
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          // Calculate target element position and consider the height of the fixed navigation bar
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/**
 * Core features showcase area effects initialization
 */
function initFeaturesEffects() {
  const featuresSection = document.getElementById("features");
  if (!featuresSection) return;

  // Get all feature cards
  const featureCards = featuresSection.querySelectorAll(".rounded-lg");

  // Add hover effect for each card
  featureCards.forEach((card, index) => {
    // Get the icon and title in the card
    const featureIcon = card.querySelector(".p-6 img");
    const featureTitle = card.querySelector("h3");

    // Mouse enter effect
    card.addEventListener("mouseenter", function () {
      if (featureIcon) {
        featureIcon.style.transform = "scale(1.2) rotate(5deg)";
        featureIcon.style.transition = "transform 0.5s ease";
      }

      if (featureTitle) {
        featureTitle.style.transform = "translateY(-5px)";
        featureTitle.style.transition = "transform 0.3s ease";
      }
    });

    // Mouse leave effect
    card.addEventListener("mouseleave", function () {
      if (featureIcon) {
        featureIcon.style.transform = "";
      }

      if (featureTitle) {
        featureTitle.style.transform = "";
      }
    });

    // Click effect - add slight bounce effect
    card.addEventListener("click", function () {
      card.style.transform = "scale(0.95)";
      setTimeout(() => {
        card.style.transform = "";
      }, 200);
    });
  });

  // Add scroll parallax effect
  window.addEventListener("scroll", function () {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate the effect trigger range
    const sectionTop = featuresSection.offsetTop;
    const sectionHeight = featuresSection.offsetHeight;
    const triggerStart = sectionTop - windowHeight;
    const triggerEnd = sectionTop + sectionHeight;

    // Calculate parallax only within the effect range
    if (scrollPosition > triggerStart && scrollPosition < triggerEnd) {
      const scrollProgress =
        (scrollPosition - triggerStart) / (triggerEnd - triggerStart);

      // Apply various parallax effects
      featureCards.forEach((card, index) => {
        const delayFactor = (index % 3) * 0.1;
        const moveY = Math.sin((scrollProgress + delayFactor) * Math.PI) * 15;

        // Apply parallax effect
        card.style.transform = `translateY(${moveY}px)`;
      });
    }
  });
}

/**
 * Workflow showcase area effects initialization
 */
function initWorkflowEffects() {
  // Step details popup functionality
  initWorkflowModal();

  // Add connection line animation for the desktop timeline
  animateWorkflowConnections();

  // Add interactive effects for step icons
  addWorkflowIconInteractions();
}

/**
 * Initialize workflow details popup
 */
function initWorkflowModal() {
  const modal = document.getElementById("workflow-detail-modal");
  const closeBtn = document.getElementById("close-modal");
  const closeBtnAlt = document.getElementById("close-modal-btn");
  const detailLinks = document.querySelectorAll(
    ".workflow-detail-link, .workflow-step"
  );
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  if (!modal || !closeBtn || !detailLinks.length) return;

  // Workflow step details data
  const workflowDetails = {
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
  };

  // Click detail link to open popup
  detailLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const stepIndex = parseInt(this.getAttribute("data-step"));
      const lang = localStorage.getItem("preferred-language") || "en";
      if (stepIndex >= 0 && workflowDetails[lang][stepIndex]) {
        modalTitle.textContent = workflowDetails[lang][stepIndex].title;
        modalContent.innerHTML = workflowDetails[lang][stepIndex].content;
        modal.classList.remove("hidden");
        modal.classList.add("active");
      }
    });
  });

  // Close popup
  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("active");
  }

  closeBtn.addEventListener("click", closeModal);
  closeBtnAlt.addEventListener("click", closeModal);

  // Click outside the popup to close
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}

/**
 * Add connection line animation for the workflow timeline
 */
function animateWorkflowConnections() {
  const desktopTimeline = document.querySelector(
    "#workflow .hidden.md\\:block"
  );
  if (!desktopTimeline) return;

  // Trigger animation when the timeline enters the viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const steps = entry.target.querySelectorAll(".workflow-step");

          steps.forEach((step, index) => {
            setTimeout(() => {
              step.classList.add("animated");
            }, index * 200);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(desktopTimeline);
}

/**
 * Add interactive effects for workflow step icons
 */
function addWorkflowIconInteractions() {
  const workflowIcons = document.querySelectorAll(
    ".workflow-icon, .workflow-icon-mobile"
  );

  workflowIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "scale(1.2) rotate(5deg)";
        img.style.transition = "transform 0.3s ease";
      }
    });

    icon.addEventListener("mouseleave", function () {
      const img = this.querySelector("img");
      if (img) {
        img.style.transform = "";
      }
    });

    // Add click effect
    icon.addEventListener("click", function () {
      const link =
        this.parentNode.querySelector(".workflow-detail-link") ||
        this.closest(".flex").querySelector(".workflow-detail-link");

      if (link) {
        link.click();
      }
    });
  });
}

/**
 * Initialize installation and configuration section functionality
 */
function initInstallationSection() {
  // Initialize installation method tab switching
  initInstallTabs();

  // Initialize Cursor IDE configuration tab switching
  initCursorTabs();

  // Initialize command line copy button
  initCommandCopyButtons();

  // Add animation effect for installation cards
  initInstallCardsAnimation();
}

/**
 * Initialize installation method tab switching
 */
function initInstallTabs() {
  const tabButtons = document.querySelectorAll(".install-tab-btn");
  const contentSections = document.querySelectorAll(".install-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove all active states
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // Set current active state
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * Initialize Cursor IDE configuration tab switching
 */
function initCursorTabs() {
  const tabButtons = document.querySelectorAll(".cursor-tab-btn");
  const contentSections = document.querySelectorAll(".cursor-content-section");

  if (!tabButtons.length || !contentSections.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove all active states
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      contentSections.forEach((section) => section.classList.add("hidden"));

      // Set current active state
      button.classList.add("active");
      const targetId = button.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
      }
    });
  });
}

/**
 * Initialize command line copy button
 */
function initCommandCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy-cmd-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.getAttribute("data-command");
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);

        // Update button text
        const originalText = button.textContent.trim();
        button.textContent = "Copied!";
        button.classList.add("bg-gray-600");
        button.classList.remove(
          "bg-blue-600",
          "bg-green-600",
          "bg-purple-600",
          "hover:bg-blue-700",
          "hover:bg-green-700",
          "hover:bg-purple-700"
        );

        // Restore original state
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("bg-gray-600");

          // Restore style based on button color
          if (button.classList.contains("copy-cmd-btn")) {
            if (button.closest("#smithery-install")) {
              button.classList.add("bg-blue-600", "hover:bg-blue-700");
            } else if (button.closest("#manual-install")) {
              button.classList.add("bg-green-600", "hover:bg-green-700");
            } else if (button.closest("#cursor-config")) {
              button.classList.add("bg-purple-600", "hover:bg-purple-700");
            }
          }
        }, 2000);
      } catch (err) {
        console.error("Copy command failed:", err);
        button.textContent = "Copy failed";
      }
    });
  });
}

/**
 * Animation effect for installation cards
 */
function initInstallCardsAnimation() {
  const installCards = document.querySelectorAll("#installation .grid > div");

  installCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px)";
      card.style.boxShadow =
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";

      // Find the icon inside the card and add animation
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.boxShadow = "";

      // Restore icon
      const icon = card.querySelector("svg");
      if (icon) {
        icon.style.transform = "";
      }
    });
  });
}

/**
 * Initialize page scroll to top button
 */
function initScrollToTopButton() {
  // Create back to top button element
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.id = "scrollToTop";
  scrollToTopBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" /></svg>';
  scrollToTopBtn.className =
    "fixed bottom-5 right-5 bg-blue-600 text-white p-2 rounded-full shadow-lg transform scale-0 transition-transform duration-300";
  scrollToTopBtn.setAttribute("aria-label", "Back to top");

  // Add button to the document
  document.body.appendChild(scrollToTopBtn);

  // Click event - smooth scroll to top
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Show or hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      scrollToTopBtn.style.transform = "scale(1)";
    } else {
      scrollToTopBtn.style.transform = "scale(0)";
    }
  });
}

/**
 * Initialize image lazy loading functionality
 */
function initLazyLoading() {
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback solution - Use Intersection Observer API
    const imgObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      imgObserver.observe(img);
    });
  }
}

/**
 * Initialize page entrance animation
 */
function initPageEntranceAnimation() {
  // Animation effect after page load is complete
  document.body.classList.add("page-loaded");

  // Start sequence animation after a slight delay
  setTimeout(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }

    const heroContent = document.querySelector("#hero .container");
    if (heroContent) {
      setTimeout(() => {
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateY(0)";
      }, 200);
    }
  }, 100);
}

/**
 * Add animation class to element
 * @param {Element} element - Element to add animation to
 * @param {string} animationClass - Animation class name to add
 * @param {number} delay - Delay time (milliseconds)
 */
function addAnimation(element, animationClass, delay = 0) {
  if (!element) return;

  setTimeout(() => {
    element.classList.add(animationClass);

    // Remove class after animation ends
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClass);
      },
      { once: true }
    );
  }, delay);
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} - Whether the element is in the viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0 &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right >= 0
  );
}

/**
 * Initialize multi-language functionality
 */
function initMultiLanguage() {
  // Check if i18n.js is loaded
  if (typeof i18n !== "undefined") {
    // Prioritize using the enhanced initialization function
    if (typeof enhancedInitializeLanguage === "function") {
      enhancedInitializeLanguage();
    } else if (typeof initializeLanguage === "function") {
      // Compatibility handling, use the original method if the enhanced function does not exist
      initializeLanguage();
    } else {
      console.warn("Multi-language initialization function is unavailable, will use basic initialization");
      // Basic initialization - Provide basic functionality when i18n.js cannot be loaded correctly
      try {
        const currentLang =
          localStorage.getItem("preferred-language") ||
          (navigator.language && navigator.language.startsWith("zh")
            ? "zh-TW"
            : "en");
        document.documentElement.setAttribute("lang", currentLang);
      } catch (e) {
        console.error("Basic language initialization failed:", e);
      }
    }

    // Add custom event for language switching
    try {
      document.querySelectorAll(".lang-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const lang = this.getAttribute("data-lang");

          // Prioritize using the enhanced language switching function
          if (typeof enhancedSetLanguage === "function") {
            enhancedSetLanguage(lang);
          } else if (typeof setLanguageWithAnimation === "function") {
            // Second priority: use language switching with animation effect
            setLanguageWithAnimation(lang);
          } else if (typeof setLanguage === "function") {
            // Compatibility handling, use the basic language switching function
            setLanguage(lang);
          } else {
            console.warn("Language switching function is unavailable");
            // Most basic handling - Update HTML lang attribute and save preference
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);
            } catch (e) {
              console.error("Basic language switching failed:", e);
            }
          }
        });
      });
    } catch (e) {
      console.error("Error adding event listener for language buttons:", e);
    }

    // Execute batch translation during initialization to optimize performance
    if (typeof batchApplyTranslations === "function") {
      batchApplyTranslations();
    }
  } else {
    console.warn("i18n.js has not been loaded, cannot enable full multi-language functionality");
    // Try to provide basic multi-language support
    try {
      const basicLanguageSupport = function () {
        const langBtns = document.querySelectorAll(".lang-btn");
        if (langBtns.length === 0) return;

        langBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            const lang = this.getAttribute("data-lang");
            try {
              localStorage.setItem("preferred-language", lang);
              document.documentElement.setAttribute("lang", lang);

              // Update button state
              langBtns.forEach((b) => {
                if (b.getAttribute("data-lang") === lang) {
                  b.classList.add("active");
                } else {
                  b.classList.remove("active");
                }
              });
            } catch (e) {
              console.error("Basic language switching failed:", e);
            }
          });
        });

        // Initialize button state
        try {
          const savedLang =
            localStorage.getItem("preferred-language") ||
            (navigator.language && navigator.language.startsWith("zh")
              ? "zh-TW"
              : "en");

          langBtns.forEach((btn) => {
            if (btn.getAttribute("data-lang") === savedLang) {
              btn.classList.add("active");
            } else {
              btn.classList.remove("active");
            }
          });

          document.documentElement.setAttribute("lang", savedLang);
        } catch (e) {
          console.error("Initializing language button state failed:", e);
        }
      };

      basicLanguageSupport();
    } catch (e) {
      console.error("Basic multi-language support initialization failed:", e);
    }
  }

  // Listen for language change events
  try {
    document.addEventListener("languageChanged", function (event) {
      const lang = event.detail.language;
      console.log("Language changed to:", lang);

      // Use translateText function to update special elements
      const updateSpecialElements = function () {
        // Safely get the translation function
        const getTranslation = (key, defaultText) => {
          if (typeof safeTranslate === "function") {
            return safeTranslate(key, defaultText);
          } else if (typeof translateText === "function") {
            return translateText(key, defaultText);
          } else {
            return lang === "en" ? defaultText.en : defaultText.zh;
          }
        };

        try {
          // Update copy button text
          const copyBtns = document.querySelectorAll(".copy-cmd-btn");
          const copyText = getTranslation("common.copy", {
            en: "Copy",
            zh: "複製",
          });

          copyBtns.forEach((btn) => {
            // Only update buttons that do not show "Copied!" or "已複製!"
            if (
              btn.textContent !== "Copied!" &&
              btn.textContent !== "已複製!"
            ) {
              btn.textContent = copyText;
            }
          });
        } catch (e) {
          console.warn("Failed to update copy button text:", e);
        }

        try {
          // Update close button text in modal window
          const closeModalBtn = document.getElementById("close-modal-btn");
          if (closeModalBtn) {
            closeModalBtn.textContent = getTranslation("common.close", {
              en: "Close",
              zh: "關閉",
            });
          }
        } catch (e) {
          console.warn("Failed to update close button text:", e);
        }
      };

      // Use setTimeout to avoid blocking UI
      setTimeout(updateSpecialElements, 0);

      // Update workflow modal content based on current language
      try {
        updateWorkflowModalContent(lang);
      } catch (e) {
        console.warn("Failed to update workflow modal content:", e);
      }
    });
  } catch (e) {
    console.error("Failed to add language change event listener:", e);
  }
}

/**
 * Update workflow modal window content based on the current language
 * @param {string} lang - Current language code ("en" or "zh-TW")
 */
function updateWorkflowModalContent(lang) {
  const modal = document.getElementById("workflow-detail-modal");
  if (!modal) return;

  // Get the currently displayed step
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");
  const currentStep = modal.getAttribute("data-current-step");

  if (currentStep && modalTitle && modalContent) {
    // Get corresponding language content from workflow details
    const workflowDetails = getWorkflowDetails();
    const langKey = lang === "en" ? "en" : "zh-TW";

    if (workflowDetails[langKey] && workflowDetails[langKey][currentStep]) {
      const stepData = workflowDetails[langKey][currentStep];

      // Use requestAnimationFrame to optimize rendering performance
      requestAnimationFrame(function () {
        modalTitle.textContent = stepData.title;
        modalContent.innerHTML = stepData.content;

        // Add data-i18n attribute for dynamically generated content
        const dynamicElements = modalContent.querySelectorAll("h4, p, li");
        dynamicElements.forEach(function (el, index) {
          const key = `workflow.step${currentStep}.content.${index}`;
          el.setAttribute("data-i18n-dynamic", key);
        });
      });
    }
  }
}

/**
 * Get workflow details data
 * @returns {Object} Workflow details object
 */
function getWorkflowDetails() {
  // Return workflow details data
  return {
    // Keep existing data unchanged
    en: {
      1: {
        title: "Task Planning",
        content: `
          <p>The task planning stage is the initial phase where AI assistants define project scope, set goals, and establish success criteria.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Clarify project requirements and constraints</li>
            <li>Set clear objectives and define measurable success criteria</li>
            <li>Establish project boundaries and identify stakeholders</li>
            <li>Create a high-level plan with timeline estimates</li>
            <li>Optionally reference existing tasks for continuous planning</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Comprehensive task description</li>
            <li>Clear success criteria</li>
            <li>Technical requirements and constraints</li>
          </ul>
          <p class="mt-4">This stage lays the foundation for all subsequent work, ensuring that both the AI assistant and the user have a shared understanding of what needs to be accomplished.</p>
        `,
      },
      2: {
        title: "In-depth Analysis",
        content: `
          <p>The in-depth analysis stage involves a thorough examination of the requirements and technical landscape to develop a viable implementation strategy.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Analyze requirements and identify technical challenges</li>
            <li>Evaluate technical feasibility and potential risks</li>
            <li>Research best practices and available solutions</li>
            <li>Systematically review existing codebase if applicable</li>
            <li>Develop initial implementation concepts</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Technical feasibility assessment</li>
            <li>Risk identification and mitigation strategies</li>
            <li>Initial implementation approach</li>
            <li>Pseudocode or architectural diagrams where appropriate</li>
          </ul>
          <p class="mt-4">This stage ensures that the proposed solution is technically sound and addresses all requirements before proceeding to implementation.</p>
        `,
      },
      3: {
        title: "Solution Reflection",
        content: `
          <p>The solution reflection stage involves critical review and optimization of the proposed approach before implementation.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Critically review the analysis results and proposed solutions</li>
            <li>Identify potential gaps, edge cases, or inefficiencies</li>
            <li>Consider alternative approaches and their trade-offs</li>
            <li>Evaluate solution against best practices and design principles</li>
            <li>Refine implementation strategy based on insights</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Outputs:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Optimized solution design</li>
            <li>Documented considerations and trade-offs</li>
            <li>Refined implementation strategy</li>
          </ul>
          <p class="mt-4">This reflective process helps catch potential issues early and ensures the chosen approach is optimal before investing in implementation.</p>
        `,
      },
      4: {
        title: "Task Decomposition",
        content: `
          <p>The task decomposition stage breaks down complex tasks into manageable, atomic subtasks with clear dependencies and execution order.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Break down complex tasks into smaller, manageable units</li>
            <li>Establish clear dependencies between subtasks</li>
            <li>Define scope and acceptance criteria for each subtask</li>
            <li>Assign priority levels and estimate complexity</li>
            <li>Create a logical execution sequence</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Supported Update Modes:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>Append:</strong> Keep all existing tasks and add new ones</li>
            <li><strong>Overwrite:</strong> Clear all uncompleted tasks and completely replace them, while preserving completed tasks</li>
            <li><strong>Selective:</strong> Intelligently update existing tasks based on task names, preserving tasks not in the list</li>
            <li><strong>Clear All Tasks:</strong> Remove all tasks and create a backup</li>
          </ul>
          <p class="mt-4">This structured approach makes complex projects manageable by creating a clear roadmap of small, achievable steps.</p>
        `,
      },
      5: {
        title: "Task Execution",
        content: `
          <p>The task execution stage involves implementing specific tasks according to the predetermined plan, with a focus on quality and adherence to requirements.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Select tasks for execution based on dependencies and priorities</li>
            <li>Implement solutions following the implementation guide</li>
            <li>Follow coding standards and best practices</li>
            <li>Handle edge cases and error conditions</li>
            <li>Document implementation decisions and rationale</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Execution Process:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Prepare necessary resources and environment</li>
            <li>Follow the implementation guide step by step</li>
            <li>Monitor progress and handle any unexpected issues</li>
            <li>Maintain code quality and documentation</li>
          </ul>
          <p class="mt-4">This stage transforms plans into concrete results, implementing the solutions designed in earlier stages.</p>
        `,
      },
      6: {
        title: "Result Verification",
        content: `
          <p>The result verification stage ensures that implemented tasks meet all requirements and quality standards before being marked as complete.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Verify that all requirements have been implemented</li>
            <li>Check for adherence to technical standards and best practices</li>
            <li>Test edge cases and error handling</li>
            <li>Review code quality and documentation</li>
            <li>Validate against the verification criteria defined for the task</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Verification Checklist:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Functional correctness: Does it work as expected?</li>
            <li>Completeness: Are all requirements addressed?</li>
            <li>Quality: Does it meet coding standards and best practices?</li>
            <li>Performance: Does it operate efficiently?</li>
            <li>Documentation: Is the implementation well-documented?</li>
          </ul>
          <p class="mt-4">This thorough verification process ensures high-quality deliverables that fully satisfy requirements.</p>
        `,
      },
      7: {
        title: "Task Completion",
        content: `
          <p>The task completion stage formally marks tasks as complete, generates detailed completion reports, and updates the status of dependent tasks.</p>
          <h4 class="text-lg font-semibold mt-4 mb-2">Key Activities:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Formally mark task as completed after successful verification</li>
            <li>Generate a comprehensive completion report</li>
            <li>Update the status of dependent tasks</li>
            <li>Archive relevant information for future reference</li>
            <li>Communicate completion to stakeholders</li>
          </ul>
          <h4 class="text-lg font-semibold mt-4 mb-2">Completion Report Contents:</h4>
          <ul class="list-disc pl-6 space-y-2">
            <li>Summary of completed work</li>
            <li>Implementation highlights and key decisions</li>
            <li>Any notable challenges encountered and their solutions</li>
            <li>Recommendations for future work or improvements</li>
          </ul>
          <p class="mt-4">The completion stage ensures proper closure of tasks, maintains workflow continuity, and builds institutional knowledge for future projects.</p>
        `,
      },
    },
  };
}
