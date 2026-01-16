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

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        // Prevent body scroll when menu is open
        if (sidebar.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on overlay
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('mobile-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeMobileMenu();
            }
        });
    });

    initializeGoldenRules();
    
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMobileMenu);
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
        }
    });
});

const stashApiUrl = '/api/stash-chat';
const stashModel = 'nvidia/nemotron-3-nano-30b-a3b:free';
const stashSystemMessage = [
    'System prompt version: stash-prompt.v1',
    '',
    'You are Stash, a senior Git and GitHub workflow assistant for this Git Protocol handbook.',
    '',
    'Tone and style:',
    '- Be concise, direct, and practical.',
    '- Prefer step-by-step instructions and concrete commands.',
    '- Avoid filler, small talk, and unnecessary apologies.',
    '',
    'Knowledge boundaries:',
    '- Focus on Git, GitHub, branching strategies, commits, pull requests, and workflows described in this handbook.',
    '- If a question is outside this scope, say it is out of scope and suggest consulting official Git or GitHub documentation.',
    '- Do not invent details about tools or systems not mentioned in the conversation.',
    '',
    'Response format:',
    '1) Start with a short direct answer (1–3 sentences).',
    '2) If the user needs to perform actions, include a numbered list of steps.',
    '3) Provide Git commands in a separate block, one command per line, without inline explanations.',
    '4) When relevant, end with a brief checklist or key notes.',
    '',
    'Consistency rules:',
    '- Use the same terminology for recurring concepts (main, dev, feature/<name>).',
    '- Always show full Git commands, not abbreviations.',
    '- When two questions have the same intent, prefer the same recommended workflow and branch strategy.',
    '',
    'Handling ambiguous or edge-case inputs:',
    '- If important context is missing (branch names, remotes, current state), state what you will assume.',
    '- If there are multiple valid strategies, present the safest default first and briefly compare alternatives.',
    '- If the question is too vague, ask at most one focused clarifying question before proceeding.',
    '',
    'Error handling and limitations:',
    '- If you cannot answer confidently, say so, explain why, and list what information would be needed.',
    '- If a request conflicts with the standards in this handbook, explain the conflict and recommend the handbook approach.',
    '- Never invent Git commands or flags. If you are unsure, say that you are unsure and suggest consulting git help or GitHub Docs.',
    '',
    'Behavior across interactions:',
    '- Treat each conversation as self-contained unless prior messages in this chat provide relevant context.',
    '- For similar questions within the same chat, reuse the same terminology, branch names, and recommended workflows.',
    '- When revising an earlier answer, clearly state what changed and why.'
].join('\n');
const stashMessages = [];
const stashReasoningDetails = [];
const stashQueue = [];
let stashIsRequestInFlight = false;
let stashLastRequestTime = 0;
const stashMinIntervalMs = 3000;

function stashFormatMessageContent(content) {
    const container = document.createElement('div');
    container.className = 'stash-message-content';
    if (content == null) {
        return container;
    }
    const normalized = String(content).replace(/\r\n/g, '\n');
    const blocks = normalized.split(/\n{2,}/);
    for (let i = 0; i < blocks.length; i += 1) {
        const value = blocks[i];
        if (!value) {
            continue;
        }
        const paragraph = document.createElement('p');
        paragraph.textContent = value;
        container.appendChild(paragraph);
    }
    return container;
}

function stashAppendMessage(role, content, options) {
    const container = document.getElementById('stash-messages');
    if (!container) {
        return;
    }
    const wrapper = document.createElement('div');
    const isUser = role === 'user';
    wrapper.className = isUser ? 'flex items-end justify-end gap-2' : 'flex items-start gap-2';
    const avatar = document.createElement('div');
    avatar.className = 'w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0';
    if (isUser) {
        avatar.classList.add('bg-[#0969da]', 'mt-1');
        avatar.textContent = 'You';
    } else {
        avatar.classList.add('bg-[#24292f]', 'mt-1');
        avatar.textContent = 'S';
    }
    const bubble = document.createElement('div');
    bubble.className = 'max-w-[80%] px-3 py-2 text-xs shadow-sm';
    if (isUser) {
        bubble.classList.add('rounded-2xl', 'rounded-tr-sm', 'bg-[#0969da]', 'text-white');
    } else {
        bubble.classList.add('rounded-2xl', 'rounded-tl-sm', 'bg-white', 'border', 'border-[#d0d7de]', 'text-[#24292f]');
    }
    const formatted = stashFormatMessageContent(content);
    bubble.appendChild(formatted);
    if (options && options.meta) {
        const meta = document.createElement('p');
        meta.className = 'mt-1 text-[10px] text-[#8c959f]';
        meta.textContent = options.meta;
        bubble.appendChild(meta);
    }
    if (isUser) {
        wrapper.appendChild(bubble);
        wrapper.appendChild(avatar);
    } else {
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
    }
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
}

function stashSetTyping(isTyping) {
    const typing = document.getElementById('stash-typing');
    if (!typing) {
        return;
    }
    if (isTyping) {
        typing.classList.remove('hidden');
    } else {
        typing.classList.add('hidden');
    }
}

function stashSetStatus(label, variant) {
    const status = document.getElementById('stash-status');
    const indicator = document.getElementById('stash-connection-indicator');
    if (status) {
        status.textContent = label;
    }
    if (indicator) {
        const dot = indicator.querySelector('span');
        if (dot) {
            dot.classList.remove('bg-[#1a7f37]', 'bg-[#9a6700]', 'bg-[#cf222e]');
            if (variant === 'ok') {
                dot.classList.add('bg-[#1a7f37]');
                indicator.textContent = 'Ready';
            } else if (variant === 'warn') {
                dot.classList.add('bg-[#9a6700]');
                indicator.textContent = 'Degraded';
            } else if (variant === 'error') {
                dot.classList.add('bg-[#cf222e]');
                indicator.textContent = 'Offline';
            }
        }
    }
}

function stashToggle(open) {
    const chat = document.getElementById('stash-chat');
    const launcher = document.getElementById('stash-launcher');
    const input = document.getElementById('stash-input');
    if (!chat || !launcher) {
        return;
    }
    const shouldOpen = typeof open === 'boolean' ? open : chat.classList.contains('hidden');
    if (shouldOpen) {
        chat.classList.remove('hidden');
        launcher.setAttribute('aria-expanded', 'true');
        if (input) {
            setTimeout(() => {
                input.focus();
            }, 50);
        }
    } else {
        chat.classList.add('hidden');
        launcher.setAttribute('aria-expanded', 'false');
        launcher.focus();
    }
}

function stashBuildPayload() {
    const messages = [];
    messages.push({
        role: 'system',
        content: stashSystemMessage
    });
    for (let i = 0; i < stashMessages.length; i += 1) {
        messages.push(stashMessages[i]);
    }
    return {
        model: stashModel,
        messages: messages
    };
}

function stashHandleApiError(error, userText) {
    stashSetTyping(false);
    stashIsRequestInFlight = false;
    stashSetStatus('Temporary issue reaching Stash backend', 'error');
    stashAppendMessage('assistant', 'I could not reach my Git brain right now. Please check your connection or try again in a moment.', {
        meta: 'Fallback response'
    });
    if (userText) {
        const docsUrl = 'https://docs.github.com/search?q=' + encodeURIComponent(userText);
        stashAppendMessage('assistant', 'As a backup, you can also search GitHub docs: ' + docsUrl);
    }
}

function stashProcessQueue() {
    if (stashIsRequestInFlight) {
        return;
    }
    if (!stashQueue.length) {
        return;
    }
    const now = Date.now();
    const delta = now - stashLastRequestTime;
    if (delta < stashMinIntervalMs) {
        const delay = stashMinIntervalMs - delta;
        setTimeout(stashProcessQueue, delay);
        return;
    }
    const next = stashQueue.shift();
    if (!next) {
        return;
    }
    stashCallApi(next.text);
}

function stashCallApi(userText) {
    stashIsRequestInFlight = true;
    stashLastRequestTime = Date.now();
    stashSetTyping(true);
    stashSetStatus('Stash is thinking about your Git question…', 'ok');
    const payload = stashBuildPayload();
    fetch(stashApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            stashSetTyping(false);
            stashIsRequestInFlight = false;
            const choice = data && data.choices && data.choices[0];
            const assistantMessage = choice && choice.message && choice.message.content ? String(choice.message.content) : '';
            if (choice && (choice.reasoning || choice.reasoning_details)) {
                stashReasoningDetails.push({
                    at: Date.now(),
                    reasoning: choice.reasoning || choice.reasoning_details
                });
            }
            if (!assistantMessage) {
                stashAppendMessage('assistant', 'I could not formulate a confident answer. Try rephrasing your question with more Git context, such as the branch name or exact command you ran.');
            } else {
                stashMessages.push({
                    role: 'assistant',
                    content: assistantMessage
                });
                stashAppendMessage('assistant', assistantMessage, {
                    meta: 'Read'
                });
            }
            stashSetStatus('Ready for your next Git question', 'ok');
            stashProcessQueue();
        })
        .catch(error => {
            stashHandleApiError(error, userText);
            stashProcessQueue();
        });
}

function stashSendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) {
        return;
    }
    stashMessages.push({
        role: 'user',
        content: trimmed
    });
    stashAppendMessage('user', trimmed, {
        meta: 'Sent'
    });
    stashQueue.push({
        text: trimmed,
        at: Date.now()
    });
    stashProcessQueue();
}

document.addEventListener('DOMContentLoaded', () => {
    const launcher = document.getElementById('stash-launcher');
    const closeButton = document.getElementById('stash-close');
    const form = document.getElementById('stash-form');
    const input = document.getElementById('stash-input');

    if (launcher) {
        launcher.addEventListener('click', () => stashToggle());
    }
    if (closeButton) {
        closeButton.addEventListener('click', () => stashToggle(false));
    }
    if (form && input) {
        form.addEventListener('submit', event => {
            event.preventDefault();
            const value = input.value;
            if (!value.trim()) {
                return;
            }
            stashSetStatus('Sending your question to Stash…', 'ok');
            stashSendMessage(value);
            input.value = '';
            input.style.height = 'auto';
        });
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        });
        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 96) + 'px';
        });
    }
});
