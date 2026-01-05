function openTab(tabName, btn) {
    // Hide all contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Remove active state from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Show specific content
    document.getElementById(tabName).classList.add('active');

    // Set active button
    btn.classList.add('active');
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback (you could add a toast notification here)
        console.log('Copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Golden Rules Carousel
const goldenRules = [
    "Never push directly to dev or main. Always use a branch.",
    "Always sync with dev before starting new work.",
    "Use semantic commit messages: type(scope): description",
    "Keep commits small and focused on one logical change",
    "Create PRs for all changes, no direct commits to protected branches",
    "Review your own code before requesting review"
];

let currentRuleIndex = 0;
let ruleInterval = null;

function initializeGoldenRules() {
    const rulesContainer = document.getElementById('golden-rules');
    if (!rulesContainer) return;
    
    rulesContainer.innerHTML = '';
    goldenRules.forEach((rule, index) => {
        const ruleElement = document.createElement('div');
        ruleElement.className = `golden-rule-item ${index === 0 ? 'active' : ''}`;
        ruleElement.innerHTML = `
            <div class="flex items-start gap-2 text-[#24292f]">
                <svg class="w-3.5 h-3.5 text-[#9a6700] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.5 7.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5zm-7 0a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
                <span class="text-xs leading-relaxed text-[#24292f]">${rule}</span>
            </div>
        `;
        rulesContainer.appendChild(ruleElement);
    });
    
    updateRuleIndicator();
    startRuleCarousel();
}

function showRule(index) {
    const rules = document.querySelectorAll('.golden-rule-item');
    if (rules.length === 0) return;
    
    // Find current active rule
    const currentActive = document.querySelector('.golden-rule-item.active');
    if (currentActive) {
        currentActive.classList.remove('active');
        currentActive.classList.add('exit');
    }
    
    // After exit animation, show new rule
    setTimeout(() => {
        // Remove exit class from all
        rules.forEach(rule => rule.classList.remove('exit'));
        
        // Show new rule
        if (rules[index]) {
            rules[index].classList.add('active');
        }
        currentRuleIndex = index;
        updateRuleIndicator();
    }, 500);
}

function nextRule() {
    const nextIndex = (currentRuleIndex + 1) % goldenRules.length;
    showRule(nextIndex);
    resetCarousel();
}

function previousRule() {
    const prevIndex = (currentRuleIndex - 1 + goldenRules.length) % goldenRules.length;
    showRule(prevIndex);
    resetCarousel();
}

function updateRuleIndicator() {
    const indicator = document.getElementById('rule-indicator');
    if (indicator) {
        indicator.textContent = `${currentRuleIndex + 1} / ${goldenRules.length}`;
    }
}

function startRuleCarousel() {
    ruleInterval = setInterval(() => {
        nextRule();
    }, 5000); // Change rule every 5 seconds
}

function resetCarousel() {
    if (ruleInterval) {
        clearInterval(ruleInterval);
        startRuleCarousel();
    }
}

// Command Category Switching
function showCommandCategory(category, btn) {
    // Hide all category contents
    const allContents = document.querySelectorAll('.command-category-content');
    allContents.forEach(content => content.classList.add('hidden'));
    
    // Remove active state from all tabs
    const allTabs = document.querySelectorAll('.command-category-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected category
    const selectedContent = document.getElementById(`category-${category}`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }
    
    // Add active state to clicked tab
    if (btn) {
        btn.classList.add('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGoldenRules();
});

