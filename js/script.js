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
    'System prompt version: stash-prompt.v2',
    '',
    'You are Stash, a senior Git and GitHub workflow assistant for this Git Protocol handbook.',
    '',
    'Conversation opening:',
    '- When the user starts a new conversation, begin your first reply with:',
    '- "Hi there! I\'m Stash, your Git/GitHub assistant. How can I help you with version control today?"',
    '',
    'For optimal assistance, guide the user to share:',
    '- The Git command they are trying to run.',
    '- Their current branch name, if it is relevant.',
    '- Any error messages they are seeing.',
    '',
    'Tone and style:',
    '- Be friendly, professional, and practical.',
    '- Prefer step-by-step instructions and concrete commands.',
    '- Avoid filler and unnecessary apologies.',
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
    'Consistency and context within a single session:',
    '- Use the same terminology for recurring concepts (main, dev, feature/<name>).',
    '- Always show full Git commands, not abbreviations.',
    '- When two questions have the same intent, prefer the same recommended workflow and branch strategy.',
    '- Keep track of earlier messages in this chat and reference them when they help clarify your answer.',
    '',
    'Handling ambiguous or incomplete inputs:',
    '- If important context is missing (branch names, remotes, current state), state what you will assume.',
    '- Ask one or two focused clarifying questions when the request is vague, then continue with the safest default guidance.',
    '- Make your clarifying questions concrete, for example:',
    '- "Which branch are you currently on?"',
    '- "Which Git command were you running when you saw this error?"',
    '',
    'Error handling and limitations:',
    '- If you cannot answer confidently, say so, explain why, and list what information would be needed.',
    '- If a request conflicts with the standards in this handbook, explain the conflict and recommend the handbook approach.',
    '- Never invent Git commands or flags. If you are unsure, say that you are unsure and suggest consulting git help or GitHub Docs.',
    '',
    'Behavior across interactions in this chat window:',
    '- Treat this chat as a single session without login or long-term memory.',
    '- Reuse relevant context and terminology from earlier messages in this chat.',
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
    const text = String(content).replace(/\r\n/g, '\n');
    const lines = text.split('\n');
    let i = 0;
    let inCode = false;
    let codeLines = [];
    function escapeHTML(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function renderInline(s) {
        const escaped = escapeHTML(s);
        const html = escaped
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.+?)_/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="stash-inline-code">$1</code>');
        const span = document.createElement('span');
        span.innerHTML = html;
        return span;
    }
    while (i < lines.length) {
        const line = lines[i];
        if (!inCode && line.trim().startsWith('```')) {
            inCode = true;
            codeLines = [];
            i += 1;
            continue;
        }
        if (inCode) {
            if (line.trim().startsWith('```')) {
                const pre = document.createElement('pre');
                pre.className = 'stash-code';
                const code = document.createElement('code');
                code.className = 'stash-code-inner';
                code.textContent = codeLines.join('\n');
                pre.appendChild(code);
                container.appendChild(pre);
                inCode = false;
                codeLines = [];
                i += 1;
                continue;
            } else {
                codeLines.push(line);
                i += 1;
                continue;
            }
        }
        if (/^\s*\d+\.\s+/.test(line)) {
            const ol = document.createElement('ol');
            ol.className = 'stash-list stash-list-ol';
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                const item = lines[i].replace(/^\s*\d+\.\s+/, '');
                const li = document.createElement('li');
                li.appendChild(renderInline(item));
                ol.appendChild(li);
                i += 1;
            }
            container.appendChild(ol);
            continue;
        }
        if (/^\s*[-*]\s+/.test(line)) {
            const ul = document.createElement('ul');
            ul.className = 'stash-list stash-list-ul';
            while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                const item = lines[i].replace(/^\s*[-*]\s+/, '');
                const li = document.createElement('li');
                li.appendChild(renderInline(item));
                ul.appendChild(li);
                i += 1;
            }
            container.appendChild(ul);
            continue;
        }
        const paraLines = [];
        while (i < lines.length) {
            const l = lines[i];
            if (l.trim() === '') {
                i += 1;
                break;
            }
            if (/^\s*\d+\.\s+/.test(l) || /^\s*[-*]\s+/.test(l) || l.trim().startsWith('```')) {
                break;
            }
            paraLines.push(l);
            i += 1;
        }
        if (paraLines.length) {
            const p = document.createElement('p');
            p.className = 'stash-paragraph';
            p.appendChild(renderInline(paraLines.join('\n')));
            container.appendChild(p);
        } else {
            i += 1;
        }
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

function stashStreamAssistantMessage(content) {
    const container = document.getElementById('stash-messages');
    if (!container) {
        return;
    }
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-start gap-2';
    const avatar = document.createElement('div');
    avatar.className = 'w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0 bg-[#24292f] mt-1';
    avatar.textContent = 'S';
    const bubble = document.createElement('div');
    bubble.className = 'max-w-[80%] px-3 py-2 text-xs shadow-sm rounded-2xl rounded-tl-sm bg-white border border-[#d0d7de] text-[#24292f]';
    const streaming = document.createElement('p');
    streaming.className = 'stash-paragraph';
    bubble.appendChild(streaming);
    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    container.appendChild(wrapper);
    container.scrollTop = container.scrollHeight;
    const full = String(content || '');
    let index = 0;
    const total = full.length;
    const step = 4;
    function tick() {
        if (index >= total) {
            const formatted = stashFormatMessageContent(full);
            bubble.innerHTML = '';
            bubble.appendChild(formatted);
            const meta = document.createElement('p');
            meta.className = 'mt-1 text-[10px] text-[#8c959f]';
            meta.textContent = 'Read';
            bubble.appendChild(meta);
            container.scrollTop = container.scrollHeight;
            return;
        }
        index += step;
        if (index > total) {
            index = total;
        }
        streaming.textContent = full.slice(0, index);
        container.scrollTop = container.scrollHeight;
        setTimeout(tick, 20);
    }
    tick();
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
    stashAppendMessage('assistant', 'I had trouble reaching the Git brain behind Stash just now. Please check your connection or try again in a moment.\n\nI\'d love to help with that! Could you share more details about what you\'re trying to accomplish? For example:\n- What Git command were you running?\n- What branch are you working on?\n- What specific issue are you encountering?\n\nThis will help me give you the most accurate guidance.', {
        meta: 'Connection issue'
    });
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
            let assistantMessage = '';
            let assistantRole = 'assistant';
            let reasoningValue = null;

            if (data && data.data && data.data.message && data.data.message.content) {
                assistantMessage = String(data.data.message.content);
                if (data.data.message.role) {
                    assistantRole = data.data.message.role;
                }
                if (data.data.reasoning) {
                    reasoningValue = data.data.reasoning;
                }
            } else {
                const choice = data && data.choices && data.choices[0];
                if (choice && choice.message && choice.message.content) {
                    assistantMessage = String(choice.message.content);
                    if (choice.message.role) {
                        assistantRole = choice.message.role;
                    }
                    if (choice.reasoning || choice.reasoning_details) {
                        reasoningValue = choice.reasoning || choice.reasoning_details;
                    }
                }
            }

            if (reasoningValue) {
                stashReasoningDetails.push({
                    at: Date.now(),
                    reasoning: reasoningValue
                });
            }
            if (!assistantMessage) {
                stashAppendMessage('assistant', 'I\'d love to help with that! Could you share more details about what you\'re trying to accomplish? For example:\n- What Git command were you running?\n- What branch are you working on?\n- What specific issue are you encountering?\n\nThis will help me give you the most accurate guidance.');
            } else {
                stashMessages.push({
                    role: assistantRole,
                    content: assistantMessage
                });
                stashStreamAssistantMessage(assistantMessage);
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
