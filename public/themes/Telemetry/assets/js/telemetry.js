const cache = new Map();

function toggleFilter() {
    const filterPanel = document.getElementById('filter-panel');
    if (filterPanel.classList.contains('w3-hide')) {
        filterPanel.classList.remove('w3-hide');
        filterPanel.classList.add('w3-show');
    } else {
        filterPanel.classList.remove('w3-show');
        filterPanel.classList.add('w3-hide');
    }
}

function toggleJobDetails(jobHeader) {
    const detailsPanel = jobHeader.nextElementSibling;
    const expandIcon = jobHeader.querySelector('.atomic-job-expand-icon i');
    
    if (!detailsPanel || !detailsPanel.classList.contains('atomic-job-details-panel')) {
        console.error('Details panel not found');
        return;
    }
    
    if (!expandIcon) {
        console.error('Expand icon not found');
        return;
    }
    
    const isExpanded = detailsPanel.classList.contains('w3-show');
    
    if (isExpanded) {
        detailsPanel.classList.remove('w3-show');
        detailsPanel.classList.add('w3-hide');
        expandIcon.className = 'fa fa-chevron-right';
        jobHeader.classList.remove('open');
    } else {
        detailsPanel.classList.remove('w3-hide');
        detailsPanel.classList.add('w3-show');
        expandIcon.className = 'fa fa-chevron-down';
        jobHeader.classList.add('open');
        
        const uuidEl = jobHeader.querySelector('.atomic-job-uuid');
        const jobUuid = uuidEl ? uuidEl.textContent.trim() : jobHeader.querySelector('.atomic-job-title').textContent.trim();
        const driver = jobHeader.dataset.driver || 'database';
        if (jobUuid) {
            loadTelemetryEvents(jobUuid, detailsPanel, driver);
            formatJsonPayload(jobUuid);
            formatException(jobUuid);
        }
    }
}

function formatJsonPayload(jobUuid) {
    const payloadElement = document.querySelector(`#payload-${jobUuid} code.json-payload`);
    if (!payloadElement) return;

    let rawJson = payloadElement.textContent;
    let formatted = rawJson;
    let parsed = null;
    try {
        parsed = JSON.parse(rawJson);
        formatted = JSON.stringify(parsed, null, 4);
    } catch (e) {
        // Not valid JSON, keep as-is
    }
    payloadElement.innerHTML = syntaxHighlightJson(formatted);
}

function formatException(jobUuid) {
    const container = document.querySelector(`#exception-${jobUuid}`);
    if (!container) return;

    const cacheKey = `exception_html:${jobUuid}`;
    const cached = cache.get(cacheKey);
    if (cached) {
        container.innerHTML = cached;
        return;
    }

    const codeEl = container.querySelector('code.json-exception');
    if (!codeEl) return;

    let obj = null;
    let message, file, line, trace;
    try {
        const raw = codeEl.textContent.trim();
        obj = JSON.parse(raw);
        message = obj.message || 'Exception';
        file = obj.file || '-';
        line = (typeof obj.line !== 'undefined') ? obj.line : '-';
        trace = obj.trace_string || '';
    } catch (e) {
        const msgEl = container.querySelector('.exception-message');
        const fileEl = container.querySelector('.exception-file');
        const lineEl = container.querySelector('.exception-line');
        const traceEl = container.querySelector('.exception-trace code');
        message = msgEl ? msgEl.textContent.trim() : 'Exception';
        file = fileEl ? fileEl.textContent.trim() : '-';
        line = lineEl ? lineEl.textContent.trim() : '-';
        trace = traceEl ? traceEl.textContent : '';
        obj = {
            message,
            file,
            line,
            trace_string: trace
        };
    }

    const esc = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const traceHighlighted = esc(trace)
        .replace(/(#\d+\s)/g, '<span class="json-key">$1</span>')
        .replace(/(\\|\/app\/|\/vendor\/)/g, '<span class="json-punctuation">$1</span>');

    const html = `
        <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; color: #ff4c4c; font-size: 1rem; font-weight: bold;">
                <i class="fa fa-bolt"></i>
                <span>${esc(message)}</span>
            </div>
            <div class="w3-margin-top" style="display: flex; align-items: center; gap: 8px; color: #e0e0e0; font-size: 0.97rem;">
                <i class="fa fa-file-code-o"></i>
                <span class="at-text-coral">${esc(file)}</span>
                <span style="color: #aaa;">:</span>
                <span style="color: #aaa;">${esc(line)}</span>
            </div>
            <div class="w3-margin-top">
                <div style="color: #aaa; font-size: 0.85rem; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;">
                    <i class="fa fa-stream"></i>
                    <span>Trace</span>
                </div>
                <pre class="atomic-payload-code" style="white-space: pre-wrap; margin:0; border-radius:4px; background: #23272e; color: #e0e0e0; font-size: 0.93rem; padding: 8px 12px; overflow-x: auto;"><code>${traceHighlighted}</code></pre>
            </div>
        </div>
    `;

    container.innerHTML = html;
    cache.set(cacheKey, html);
}

function copyFromDataAttribute(button, attr) {
    try {
        const text = button.dataset[attr] || '';
        copyToClipboard(text, button);
    } catch (e) {
        console.error('Failed to copy from data attribute:', e);
        showCopyFeedback(button, false);
    }
}

function syntaxHighlightJson(json) {
    if (typeof json !== 'string') {
        json = JSON.stringify(json, undefined, 4);
    }
    
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    }).replace(/([{}[\],])/g, '<span class="json-punctuation">$1</span>');
}

function loadTelemetryEvents(jobUuid, detailsPanel, driver) {
    const container = detailsPanel.querySelector('[id^="telemetry-"]');
    if (!container) return;
    
    const eventsCacheKey = `events:${jobUuid}`;
    const cached = cache.get(eventsCacheKey);
    if (cached && Array.isArray(cached.events)) {
        displayTelemetryEvents(cached.events, cached.job_uuid, container);
        return;
    }

    container.innerHTML = `
        <div class="w3-text-grey w3-medium atomic-telemetry-header">
            <i class="fa fa-bar-chart w3-margin-right"></i>Telemetry Events
        </div>
        <div class="w3-center w3-margin-top atomic-loading-spinner">
            <i class="fa fa-spinner fa-spin w3-text-grey"></i>
            <span class="w3-text-grey w3-margin-left">Loading telemetry events...</span>
        </div>
    `;
    
    fetch('/telemetry/events/' + driver + '/' + jobUuid)
        .then(response => response.json())
        .then(data => {
            cache.set(eventsCacheKey, data);
            displayTelemetryEvents(data.events, data.job_uuid, container);
        })
        .catch(error => {
            container.innerHTML = `
                <div class="w3-text-grey w3-medium atomic-telemetry-header">
                    <i class="fa fa-bar-chart w3-margin-right"></i>Telemetry Events
                </div>
                <div class="w3-center w3-margin-top">
                    <i class="fa fa-exclamation-triangle w3-text-red"></i>
                    <span class="w3-text-red w3-margin-left">Error loading telemetry events: ${error.message}</span>
                </div>
            `;
        });
}

function displayTelemetryEvents(events, jobUuid, container) {
    console.log(events);
    
    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="w3-text-grey w3-medium atomic-telemetry-header">
                <i class="fa fa-bar-chart w3-margin-right"></i>Telemetry Events
            </div>
            <div class="w3-center w3-margin-top">
                <i class="fa fa-info-circle w3-text-grey"></i>
                <span class="w3-text-grey w3-margin-left">No telemetry events found for this job</span>
            </div>
        `;
        return;
    }
    
    const batches = new Map();
    events.forEach(event => {
        if (!batches.has(event.uuid_batch)) {
            batches.set(event.uuid_batch, []);
        }
        batches.get(event.uuid_batch).push(event);
    });
    
    const batchColors = generateBatchColors(Array.from(batches.keys()));
    
    let html = `
        <div class="w3-text-grey w3-medium atomic-telemetry-header">
            <i class="fa fa-bar-chart w3-margin-right"></i>Telemetry Events
        </div>
        <div class="w3-margin-top atomic-telemetry-timeline">
    `;
    
    let batchIndex = 0;
    for (const [batchUuid, batchEvents] of batches) {
        const batchColor = batchColors[batchIndex % batchColors.length];
        const isLastBatch = batchIndex === batches.size - 1;
        html += `
            <div class="atomic-batch-group" data-batch="${batchUuid}">
                <div class="atomic-batch-header" style="display: flex; align-items: center; gap: 8px;">
                    <div class="atomic-batch-marker" style="background-color: ${batchColor};"></div>
                    <div class="w3-text-grey w3-small atomic-batch-title" style="display: flex; align-items: center; gap: 8px;">
                        <i class="fa fa-layer-group w3-margin-right"></i>
                        <span>Batch: <span class="atomic-batch-uuid" style="font-family: monospace;">${batchUuid}</span></span>
                        <button class="atomic-copy-btn" title="Copy Batch UUID" onclick="copyToClipboard('${batchUuid}', this)"><i class="fa fa-clone"></i></button>
                        <span class="w3-margin-left w3-tag w3-round w3-tiny w3-dark-grey">${batchEvents.length} events</span>
                    </div>
                </div>
        `;
        
        batchEvents.forEach((event, eventIndex) => {
            const eventTypeColor = getEventTypeColor(event.event_type_id);
            const eventIcon = getEventTypeIcon(event.event_type_id);
            const isLastEvent = eventIndex === batchEvents.length - 1;
            html += `
                <div class="atomic-event-with-line">
                    <div class="atomic-timeline-line" style="background-color: ${batchColor};" data-last-event="${isLastEvent}"></div>
                    <div class="atomic-timeline-dot" style="background-color: ${eventTypeColor}; border-color: ${batchColor};"></div>
                    <div class="w3-container w3-round atomic-telemetry-event w3-hover-dark-grey">
                        <div class="w3-row">
                            <div class="w3-col s8 m8 l8">
                                <div class="at-text-coral w3-small">
                                    <i class="fa ${eventIcon} w3-margin-right" style="color: ${eventTypeColor};"></i>
                                    ${event.event_description}
                                </div>
                            </div>
                            <div class="w3-col s4 m4 l4 w3-right-align" style="display: flex; align-items: center; justify-content: flex-end; gap: 6px;">
                                <div class="w3-tag w3-round w3-tiny w3-dark-grey" style="font-family: monospace;">Event UUID: ${event.uuid}</div>
                                <button class="atomic-copy-btn" title="Copy Event UUID" onclick="copyToClipboard('${event.uuid}', this)"><i class="fa fa-clone"></i></button>
                            </div>
                        </div>
                        <div class="w3-text-grey w3-tiny w3-margin-top">
                            <i class="fa fa-clock-o w3-margin-right"></i>${event.created_at_formatted}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        if (!isLastBatch) {
            html += '<div class="atomic-batch-separator"></div>';
        }
        
        batchIndex++;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function generateBatchColors(batchUuids) {
    const colors = [
        '#58a6ff', // Blue
        '#7c3aed', // Purple
        '#f97316', // Orange
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#84cc16', // Lime
        '#f43f5e', // Rose
        '#8b5cf6'  // Violet
    ];
    
    return batchUuids.map((uuid, index) => {
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            const char = uuid.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return colors[Math.abs(hash) % colors.length];
    });
}

function getEventTypeColor(eventTypeId) {
    switch(eventTypeId) {
        case 1: return '#28a745'; // JOB_CREATED - green
        case 2: return '#1f6feb'; // JOB_FETCHED - blue
        case 3: return '#2ea043'; // JOB_SUCCESS - green
        case 4: return '#f85149'; // JOB_FAILED - red
        case 5: return '#fb8500'; // JOB_RETRY - orange
        case 6: return '#eab308'; // JOB_INCOMPLETE_HANDLED - yellow
        default: return '#7c3aed'; // custom event - purple
    }
}

function getEventTypeIcon(eventTypeId) {
    switch(eventTypeId) {
        case 1: return 'fa-plus-circle'; // JOB_CREATED
        case 2: return 'fa-download'; // JOB_FETCHED
        case 3: return 'fa-check-circle'; // JOB_SUCCESS
        case 4: return 'fa-times-circle'; // JOB_FAILED
        case 5: return 'fa-repeat'; // JOB_RETRY
        case 6: return 'fa-exclamation-circle'; // JOB_INCOMPLETE_HANDLED
        default: return 'fa-star'; // custom event
    }
}

function togglePayload(button, jobUuid) {
    const payloadContent = document.getElementById('payload-' + jobUuid);
    const icon = button.querySelector('i');
    const isVisible = !payloadContent.classList.contains('w3-hide');
    if (isVisible) {
        payloadContent.classList.add('w3-hide');
        payloadContent.classList.remove('w3-show');
        icon.className = 'fa fa-chevron-right w3-margin-right';
        button.innerHTML = '<i class="fa fa-chevron-right w3-margin-right"></i>Expand';
    } else {
        payloadContent.classList.remove('w3-hide');
        payloadContent.classList.add('w3-show');
        icon.className = 'fa fa-chevron-down w3-margin-right';
        button.innerHTML = '<i class="fa fa-chevron-down w3-margin-right"></i>Collapse';
        formatJsonPayload(jobUuid);
    }
}

function copyToClipboard(text, button) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function() {
            showCopyFeedback(button, true);
        }).catch(function(err) {
            console.error('Failed to copy using Clipboard API:', err);
            showCopyFeedback(button, false);
        });
    } else {
        console.error('Clipboard API not available');
        showCopyFeedback(button, false);
    }
}

function copyTimestamp(dateTimeString, button) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(dateTimeString.toString()).then(function() {
                showCopyFeedback(button, true, 'Copied!');
            }).catch(function(err) {
                console.error('Failed to copy timestamp using Clipboard API:', err);
                showCopyFeedback(button, false, 'Error');
            });
        } else {
            console.error('Clipboard API not available');
            showCopyFeedback(button, false, 'Error');
        }
    } catch (err) {
        console.error('Failed to copy timestamp:', err);
        showCopyFeedback(button, false, 'Error');
    }
}

function showCopyFeedback(button, success, customMessage = null) {
    const originalHTML = button.innerHTML;
    const originalClass = button.className;
    
    if (success) {
        const message = customMessage || 'Copied!';
        if (originalHTML.includes('fa-copy') && !originalHTML.includes('Copy')) {
            button.innerHTML = '<i class="fa fa-check"></i>';
        } else {
            button.innerHTML = '<i class="fa fa-check w3-margin-right"></i>' + message;
        }
        button.className = button.className.replace('w3-blue', 'w3-green').replace('w3-dark-grey', 'w3-green');
    } else {
        const message = customMessage || 'Failed';
        if (originalHTML.includes('fa-copy') && !originalHTML.includes('Copy')) {
            button.innerHTML = '<i class="fa fa-times"></i>';
        } else {
            button.innerHTML = '<i class="fa fa-times w3-margin-right"></i>' + message;
        }
        button.className = button.className.replace('w3-blue', 'w3-red').replace('w3-dark-grey', 'w3-red');
    }
    
    if (success) {
        button.classList.add('copied');
    }

    setTimeout(function() {
        button.innerHTML = originalHTML;
        button.className = originalClass;
        button.classList.remove('copied');
    }, 2000);
}

/* Tabs */
(function () {
    const tabState = {
        active: '',
        loaded: { dashboard: false, hive: false, logs: false }
    };

    function qs(sel, root = document) { return root.querySelector(sel); }
    function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
    function escapeHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    async function fetchJson(url) {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            const snippet = text.replace(/<[^>]*>/g, ' ').trim().slice(0, 200) || res.status + ' ' + res.statusText;
            throw new Error(snippet);
        }
    }

    function setHeaderActionsVisibility(name) {
        const actions = document.getElementById('queue-header-actions');
        const counters = document.getElementById('queue-header-counters');
        if (actions) actions.style.display = (name === 'queues') ? '' : 'none';
        if (counters) counters.style.display = (name === 'queues') ? '' : 'none';
    }

    function setActiveTab(name) {
        qsa('.atomic-nav-tab').forEach(b => b.classList.remove('atomic-active'));
        const btn = qs(`.atomic-nav-tab[data-tab="${name}"]`);
        if (btn) btn.classList.add('atomic-active');

        qsa('[id^="tab-"]').forEach(el => el.classList.add('w3-hide'));
        const pane = qs(`#tab-${name}`);
        if (pane) pane.classList.remove('w3-hide');

        setHeaderActionsVisibility(name);

        if (!tabState.loaded[name]) {
            if (name === 'dashboard') loadDashboardTab();
            if (name === 'hive') loadHiveTab();
            if (name === 'logs') loadLogsTab();
            tabState.loaded[name] = true;
        }
        tabState.active = name;
    }

    function initTabs() {
        qsa('.atomic-nav-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = btn.getAttribute('data-tab');
                setActiveTab(tab);
            });
        });
        setActiveTab('dashboard');
    }

    function loadDashboardTab() {
        const container = qs('#tab-dashboard .tab-body');
        if (!container) return;
        container.innerHTML = `
            <div class="w3-center w3-margin-top">
                <i class="fa fa-spinner fa-spin w3-text-grey"></i>
                <span class="w3-text-grey w3-margin-left">Загрузка сведений...</span>
            </div>
        `;
        fetchJson('/telemetry/dashboard')
            .then(info => {
                const rows = [];
                const addGroup = (title, obj) => {
                    if (!obj) return;
                    rows.push(`<div class="w3-margin-top w3-text-grey w3-medium atomic-info-header"><i class="fa fa-info-circle w3-margin-right"></i>${escapeHtml(title)}</div>`);
                    rows.push('<div class="w3-margin-bottom">');
                    Object.keys(obj).forEach(k => {
                        const v = obj[k];
                        rows.push(`
                            <div class="w3-row w3-padding-small w3-border-bottom at-border-grey">
                                <div class="w3-col s5 m4 l3 w3-text-grey w3-small">${escapeHtml(k)}:</div>
                                <div class="w3-col s7 m8 l9 at-text-coral w3-small" style='word-wrap: break-word;'>${escapeHtml(typeof v === 'object' ? JSON.stringify(v) : String(v))}</div>
                            </div>
                        `);
                    });
                    rows.push('</div>');
                };
                addGroup('PHP', info.php);
                addGroup('Fat-Free Framework', info.f3);
                addGroup('Atomic', info.atomic);
                addGroup('База данных', info.db);
                addGroup('Система', info.system);
                container.innerHTML = rows.join('');
            })
            .catch(err => {
                container.innerHTML = `
                    <div class="w3-center w3-margin-top">
                        <i class="fa fa-exclamation-triangle w3-text-red"></i>
                        <span class="w3-text-red w3-margin-left">Ошибка загрузки: ${escapeHtml(err.message)}</span>
                    </div>
                `;
            });
    }

    function loadHiveTab() {
        const container = qs('#tab-hive .tab-body');
        if (!container) return;
        container.innerHTML = `
            <div class="w3-center w3-margin-top">
                <i class="fa fa-spinner fa-spin w3-text-grey"></i>
                <span class="w3-text-grey w3-margin-left">Загрузка Hive...</span>
            </div>
        `;
        fetchJson('/telemetry/hive')
            .then(data => {
                const json = JSON.stringify(data, null, 4);
                container.innerHTML = `
                    <pre class="w3-code w3-round atomic-payload-code"><code>${syntaxHighlightJson(json)}</code></pre>
                `;
            })
            .catch(err => {
                container.innerHTML = `
                    <div class="w3-center w3-margin-top">
                        <i class="fa fa-exclamation-triangle w3-text-red"></i>
                        <span class="w3-text-red w3-margin-left">Ошибка загрузки: ${escapeHtml(err.message)}</span>
                    </div>
                `;
            });
    }

    function formatLogTs(ts) {
        if (!ts) return '';
        const m = ts.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
        let d;
        if (m) {
            d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6]));
        } else {
            const t = Date.parse(ts);
            if (isNaN(t)) return escapeHtml(ts);
            d = new Date(t);
        }
        const mm = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${pad(d.getDate())} ${mm[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function highlightLogTags(text) {
        const escaped = escapeHtml(text || '');
        return escaped.replace(/\[([A-Za-z_]+)\]/g, (match, name) => {
            const upper = String(name).toUpperCase();
            const extra = (upper === 'HIVE' || upper === 'ONERROR') ? ' w3-text-red' : '';
            return `<strong class="${extra.trim()}">[${escapeHtml(name)}]</strong>`;
        });
    }

    function loadLogsTab() {
        const container = qs('#tab-logs .tab-body');
        if (!container) return;
        container.innerHTML = `
            <div class="w3-center w3-margin-top">
                <i class="fa fa-spinner fa-spin w3-text-grey"></i>
                <span class="w3-text-grey w3-margin-left">Загрузка логов...</span>
            </div>
        `;
        fetchJson('/telemetry/logs')
            .then(payload => {
                const lines = payload.lines || [];
                if (!lines.length) {
                    container.innerHTML = `
                        <div class="w3-center w3-margin-top">
                            <i class="fa fa-info-circle w3-text-grey"></i>
                            <span class="w3-text-grey w3-margin-left">Логи пусты</span>
                        </div>
                    `;
                    return;
                }
                const html = [];
                html.push('<div class="atomic-log-list">');
                lines.forEach((ln, idx) => {
                    const level = (ln.level || '').toLowerCase();
                    const msgRaw = ln.message || '';
                    const hasOnerror = /\[ONERROR\]/i.test(msgRaw);
                    const hasHive = /\[HIVE\]/i.test(msgRaw);
                    const chipText = hasOnerror ? 'ONERROR' : (hasHive ? 'HIVE' : (ln.level || '').toUpperCase());
                    const dumpBtn = ln.dump_id ? `
                        <div class="w3-right at-log-dump-buttons">
                            <button class="atomic-copy-btn" title="Copy dump id" onclick="copyToClipboard('${ln.dump_id}', this)"><i class="fa fa-clone"></i></button>
                            <button class="atomic-copy-btn" data-dump="${ln.dump_id}" data-target="dump-${idx}"><i class="fa fa-eye"></i> View dump</button>
                        </div>
                    ` : '';
                    html.push(`
                        <div class="atomic-log-line w3-padding-small w3-border-bottom at-border-dark-grey">
                            <div class="w3-small w3-text-grey">
                                <span class="atomic-chip"><i class="fa fa-tag"></i>${escapeHtml(chipText)}</span>
                                <span class="w3-margin-left">${formatLogTs(ln.ts)}</span>
                            </div>
                            <div class="w3-margin-top at-text-coral w3-small" style="word-break: break-word;">${highlightLogTags(ln.message || '')}</div>
                            ${dumpBtn}
                            <div id="dump-${idx}" class="w3-margin-top w3-hide"></div>
                        </div>
                    `);
                });
                html.push('</div>');
                container.innerHTML = html.join('');
                qsa('#tab-logs .atomic-copy-btn[data-dump]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const dumpId = btn.getAttribute('data-dump');
                        const target = btn.getAttribute('data-target');
                        viewDump(dumpId, target, btn);
                    });
                });
            })
            .catch(err => {
                container.innerHTML = `
                    <div class="w3-center w3-margin-top">
                        <i class="fa fa-exclamation-triangle w3-text-red"></i>
                        <span class="w3-text-red w3-margin-left">Ошибка загрузки: ${escapeHtml(err.message)}</span>
                    </div>
                `;
            });
    }

    function viewDump(dumpId, targetId) {
        const mount = document.getElementById(targetId);
        if (!mount) return;
        if (!mount.classList.contains('w3-hide')) {
            mount.classList.add('w3-hide');
            mount.innerHTML = '';
            return;
        }
        mount.innerHTML = `
            <div class="w3-center w3-margin-top">
                <i class="fa fa-spinner fa-spin w3-text-grey"></i>
                <span class="w3-text-grey w3-margin-left">Загрузка дампа...</span>
            </div>
        `;
        fetchJson('/telemetry/dumps/' + encodeURIComponent(dumpId))
            .then(data => {
                const json = JSON.stringify(data, null, 4);
                mount.innerHTML = `
                    <pre class="w3-code w3-round atomic-payload-code"><code>${syntaxHighlightJson(json)}</code></pre>
                `;
                mount.classList.remove('w3-hide');
            })
            .catch(err => {
                mount.innerHTML = `
                    <div class="w3-text-red"><i class="fa fa-exclamation-triangle"></i> ${escapeHtml(err.message)}</div>
                `;
                mount.classList.remove('w3-hide');
            });
    }

    window.addEventListener('DOMContentLoaded', initTabs);
})();