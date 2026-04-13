const cache = new Map();

// ── DOM helpers ────────────────────────────────────────────────────────────

function makeEl(tag, classes, text) {
    const e = document.createElement(tag);
    if (classes) e.className = classes;
    if (text !== undefined) e.textContent = text;
    return e;
}

function makeIcon(faClass) {
    return makeEl('i', faClass);
}

function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
}

function setChildren(el, ...nodes) {
    clearNode(el);
    nodes.forEach(n => el.appendChild(typeof n === 'string' ? document.createTextNode(n) : n));
}

function makeSpinner(labelText) {
    const wrap = makeEl('div', 'w3-center w3-margin-top');
    wrap.appendChild(makeIcon('fa fa-spinner fa-spin w3-text-grey'));
    wrap.appendChild(makeEl('span', 'w3-text-grey w3-margin-left', labelText));
    return wrap;
}

function makeErrorBox(labelText) {
    const wrap = makeEl('div', 'w3-center w3-margin-top');
    wrap.appendChild(makeIcon('fa fa-exclamation-triangle w3-text-red'));
    wrap.appendChild(makeEl('span', 'w3-text-red w3-margin-left', labelText));
    return wrap;
}

function makeInfoBox(labelText) {
    const wrap = makeEl('div', 'w3-center w3-margin-top');
    wrap.appendChild(makeIcon('fa fa-info-circle w3-text-grey'));
    wrap.appendChild(makeEl('span', 'w3-text-grey w3-margin-left', labelText));
    return wrap;
}

function makeTelemetryHeader() {
    const div = makeEl('div', 'w3-text-grey w3-medium atomic-telemetry-header');
    div.appendChild(makeIcon('fa fa-bar-chart w3-margin-right'));
    div.appendChild(document.createTextNode('Telemetry Events'));
    return div;
}

// ── JSON syntax highlighting (DOM-based, no innerHTML) ─────────────────────

function syntaxHighlightJsonFragment(json) {
    if (typeof json !== 'string') json = JSON.stringify(json, undefined, 4);
    const frag = document.createDocumentFragment();
    const re = /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}[\],])/g;
    let last = 0, m;
    while ((m = re.exec(json)) !== null) {
        if (m.index > last) {
            frag.appendChild(document.createTextNode(json.slice(last, m.index)));
        }
        const token = m[0];
        let cls;
        if (token[0] === '"') {
            cls = /:$/.test(token) ? 'json-key' : 'json-string';
        } else if (token === 'true' || token === 'false') {
            cls = 'json-boolean';
        } else if (token === 'null') {
            cls = 'json-null';
        } else if (/^-?\d/.test(token)) {
            cls = 'json-number';
        } else {
            cls = 'json-punctuation';
        }
        const span = makeEl('span', cls);
        span.textContent = token;
        frag.appendChild(span);
        last = m.index + token.length;
    }
    if (last < json.length) {
        frag.appendChild(document.createTextNode(json.slice(last)));
    }
    return frag;
}

function makeJsonCodeBlock(json) {
    const code = document.createElement('code');
    code.appendChild(syntaxHighlightJsonFragment(json));
    const pre = makeEl('pre', 'w3-code w3-round atomic-payload-code');
    pre.appendChild(code);
    return pre;
}

// ── Log tag highlighting (DOM-based, no innerHTML) ─────────────────────────

function highlightLogTagsFragment(text) {
    const frag = document.createDocumentFragment();
    const str = text || '';
    const re = /\[([A-Za-z_]+)\]/g;
    let last = 0, m;
    while ((m = re.exec(str)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(str.slice(last, m.index)));
        const upper = m[1].toUpperCase();
        const strong = document.createElement('strong');
        if (upper === 'HIVE' || upper === 'ONERROR') strong.className = 'w3-text-red';
        strong.textContent = '[' + m[1] + ']';
        frag.appendChild(strong);
        last = m.index + m[0].length;
    }
    if (last < str.length) frag.appendChild(document.createTextNode(str.slice(last)));
    return frag;
}

// ── Exception trace highlighting (DOM-based) ───────────────────────────────

function buildTraceFragment(trace) {
    const frag = document.createDocumentFragment();
    if (!trace) return frag;
    const re = /(#\d+\s)|(\\|\/app\/|\/vendor\/)/g;
    let last = 0, m;
    while ((m = re.exec(trace)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(trace.slice(last, m.index)));
        const span = makeEl('span', m[1] ? 'json-key' : 'json-punctuation');
        span.textContent = m[0];
        frag.appendChild(span);
        last = m.index + m[0].length;
    }
    if (last < trace.length) frag.appendChild(document.createTextNode(trace.slice(last)));
    return frag;
}

// ── UI functions ───────────────────────────────────────────────────────────

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
    try {
        formatted = JSON.stringify(JSON.parse(rawJson), null, 4);
    } catch (e) {
        // Not valid JSON, keep as-is
    }
    setChildren(payloadElement, syntaxHighlightJsonFragment(formatted));
}

function formatException(jobUuid) {
    const container = document.querySelector(`#exception-${jobUuid}`);
    if (!container) return;

    const cacheKey = `exception_data:${jobUuid}`;
    let data = cache.get(cacheKey);

    if (!data) {
        const codeEl = container.querySelector('code.json-exception');
        if (!codeEl) return;

        try {
            const obj = JSON.parse(codeEl.textContent.trim());
            data = {
                message: obj.message || 'Exception',
                file: obj.file || '-',
                line: typeof obj.line !== 'undefined' ? obj.line : '-',
                trace: obj.trace_string || ''
            };
        } catch (e) {
            data = {
                message: container.querySelector('.exception-message')?.textContent.trim() || 'Exception',
                file: container.querySelector('.exception-file')?.textContent.trim() || '-',
                line: container.querySelector('.exception-line')?.textContent.trim() || '-',
                trace: container.querySelector('.exception-trace code')?.textContent || ''
            };
        }
        cache.set(cacheKey, data);
    }

    const root = makeEl('div');
    root.style.cssText = 'display:flex;flex-direction:column;gap:6px';

    const msgRow = makeEl('div');
    msgRow.style.cssText = 'display:flex;align-items:center;gap:8px;color:#ff4c4c;font-size:1rem;font-weight:bold';
    msgRow.appendChild(makeIcon('fa fa-bolt'));
    msgRow.appendChild(makeEl('span', '', String(data.message)));
    root.appendChild(msgRow);

    const fileRow = makeEl('div', 'w3-margin-top');
    fileRow.style.cssText = 'display:flex;align-items:center;gap:8px;color:#e0e0e0;font-size:0.97rem';
    fileRow.appendChild(makeIcon('fa fa-file-code-o'));
    fileRow.appendChild(makeEl('span', 'at-text-coral', String(data.file)));
    const colon = makeEl('span');
    colon.style.color = '#aaa';
    colon.textContent = ':';
    fileRow.appendChild(colon);
    const lineSpan = makeEl('span');
    lineSpan.style.color = '#aaa';
    lineSpan.textContent = String(data.line);
    fileRow.appendChild(lineSpan);
    root.appendChild(fileRow);

    const traceWrap = makeEl('div', 'w3-margin-top');
    const traceLabel = makeEl('div');
    traceLabel.style.cssText = 'color:#aaa;font-size:0.85rem;margin-bottom:2px;display:flex;align-items:center;gap:4px';
    traceLabel.appendChild(makeIcon('fa fa-stream'));
    traceLabel.appendChild(makeEl('span', '', 'Trace'));
    traceWrap.appendChild(traceLabel);

    const pre = makeEl('pre', 'atomic-payload-code');
    pre.style.cssText = 'white-space:pre-wrap;margin:0;border-radius:4px;background:#23272e;color:#e0e0e0;font-size:0.93rem;padding:8px 12px;overflow-x:auto';
    const code = document.createElement('code');
    code.appendChild(buildTraceFragment(data.trace));
    pre.appendChild(code);
    traceWrap.appendChild(pre);
    root.appendChild(traceWrap);

    setChildren(container, root);
}

function copyFromDataAttribute(button, attr) {
    try {
        copyToClipboard(button.dataset[attr] || '', button);
    } catch (e) {
        console.error('Failed to copy from data attribute:', e);
        showCopyFeedback(button, false);
    }
}

function togglePayload(button, jobUuid) {
    const payloadContent = document.getElementById('payload-' + jobUuid);
    const isVisible = !payloadContent.classList.contains('w3-hide');
    if (isVisible) {
        payloadContent.classList.add('w3-hide');
        payloadContent.classList.remove('w3-show');
        clearNode(button);
        button.appendChild(makeIcon('fa fa-chevron-right w3-margin-right'));
        button.appendChild(document.createTextNode('Expand'));
    } else {
        payloadContent.classList.remove('w3-hide');
        payloadContent.classList.add('w3-show');
        clearNode(button);
        button.appendChild(makeIcon('fa fa-chevron-down w3-margin-right'));
        button.appendChild(document.createTextNode('Collapse'));
        formatJsonPayload(jobUuid);
    }
}

function copyToClipboard(text, button) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
            showCopyFeedback(button, true);
        }).catch(function (err) {
            console.error('Failed to copy using Clipboard API:', err);
            showCopyFeedback(button, false);
        });
    } else {
        console.error('Clipboard API not available');
        showCopyFeedback(button, false);
    }
}

function copyTimestamp(dateTimeString, button) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(String(dateTimeString)).then(function () {
            showCopyFeedback(button, true, 'Copied!');
        }).catch(function (err) {
            console.error('Failed to copy timestamp using Clipboard API:', err);
            showCopyFeedback(button, false, 'Error');
        });
    } else {
        console.error('Clipboard API not available');
        showCopyFeedback(button, false, 'Error');
    }
}

function showCopyFeedback(button, success, customMessage = null) {
    const savedNodes = [...button.childNodes].map(n => n.cloneNode(true));
    const savedClass = button.className;

    const iconEl = button.querySelector('i');
    const isIconOnly = iconEl && iconEl.className.includes('fa-copy') && button.textContent.trim() === '';

    clearNode(button);

    if (success) {
        button.appendChild(makeIcon(isIconOnly ? 'fa fa-check' : 'fa fa-check w3-margin-right'));
        if (!isIconOnly) button.appendChild(document.createTextNode(customMessage || 'Copied!'));
        button.className = savedClass.replace('w3-blue', 'w3-green').replace('w3-dark-grey', 'w3-green');
        button.classList.add('copied');
    } else {
        button.appendChild(makeIcon(isIconOnly ? 'fa fa-times' : 'fa fa-times w3-margin-right'));
        if (!isIconOnly) button.appendChild(document.createTextNode(customMessage || 'Failed'));
        button.className = savedClass.replace('w3-blue', 'w3-red').replace('w3-dark-grey', 'w3-red');
    }

    setTimeout(function () {
        clearNode(button);
        savedNodes.forEach(n => button.appendChild(n));
        button.className = savedClass;
        button.classList.remove('copied');
    }, 2000);
}

// ── Telemetry events ───────────────────────────────────────────────────────

function loadTelemetryEvents(jobUuid, detailsPanel, driver) {
    const container = detailsPanel.querySelector('[id^="telemetry-"]');
    if (!container) return;

    const eventsCacheKey = `events:${jobUuid}`;
    const cached = cache.get(eventsCacheKey);
    if (cached && Array.isArray(cached.events)) {
        displayTelemetryEvents(cached.events, cached.job_uuid, container);
        return;
    }

    clearNode(container);
    container.appendChild(makeTelemetryHeader());
    const spinner = makeEl('div', 'w3-center w3-margin-top atomic-loading-spinner');
    spinner.appendChild(makeIcon('fa fa-spinner fa-spin w3-text-grey'));
    spinner.appendChild(makeEl('span', 'w3-text-grey w3-margin-left', 'Loading telemetry events...'));
    container.appendChild(spinner);

    fetch('/telemetry/events/' + encodeURIComponent(driver) + '/' + encodeURIComponent(jobUuid))
        .then(response => response.json())
        .then(data => {
            cache.set(eventsCacheKey, data);
            displayTelemetryEvents(data.events, data.job_uuid, container);
        })
        .catch(error => {
            clearNode(container);
            container.appendChild(makeTelemetryHeader());
            container.appendChild(makeErrorBox('Error loading telemetry events: ' + error.message));
        });
}

function displayTelemetryEvents(events, jobUuid, container) {
    clearNode(container);
    container.appendChild(makeTelemetryHeader());

    if (!events || events.length === 0) {
        container.appendChild(makeInfoBox('No telemetry events found for this job'));
        return;
    }

    const batches = new Map();
    events.forEach(event => {
        if (!batches.has(event.uuid_batch)) batches.set(event.uuid_batch, []);
        batches.get(event.uuid_batch).push(event);
    });

    const batchColors = generateBatchColors(Array.from(batches.keys()));
    const timeline = makeEl('div', 'w3-margin-top atomic-telemetry-timeline');

    let batchIndex = 0;
    for (const [batchUuid, batchEvents] of batches) {
        const batchColor = batchColors[batchIndex % batchColors.length];
        const isLastBatch = batchIndex === batches.size - 1;

        const batchGroup = makeEl('div', 'atomic-batch-group');
        batchGroup.dataset.batch = batchUuid;

        const batchHeader = makeEl('div', 'atomic-batch-header');
        batchHeader.style.cssText = 'display:flex;align-items:center;gap:8px';

        const marker = makeEl('div', 'atomic-batch-marker');
        marker.style.backgroundColor = batchColor;
        batchHeader.appendChild(marker);

        const titleDiv = makeEl('div', 'w3-text-grey w3-small atomic-batch-title');
        titleDiv.style.cssText = 'display:flex;align-items:center;gap:8px';
        titleDiv.appendChild(makeIcon('fa fa-layer-group w3-margin-right'));

        const batchLabel = makeEl('span');
        batchLabel.appendChild(document.createTextNode('Batch: '));
        const batchUuidSpan = makeEl('span', 'atomic-batch-uuid', batchUuid);
        batchUuidSpan.style.fontFamily = 'monospace';
        batchLabel.appendChild(batchUuidSpan);
        titleDiv.appendChild(batchLabel);

        const copyBtn = makeEl('button', 'atomic-copy-btn');
        copyBtn.title = 'Copy Batch UUID';
        copyBtn.appendChild(makeIcon('fa fa-clone'));
        copyBtn.addEventListener('click', () => copyToClipboard(batchUuid, copyBtn));
        titleDiv.appendChild(copyBtn);

        titleDiv.appendChild(makeEl('span', 'w3-margin-left w3-tag w3-round w3-tiny w3-dark-grey', `${batchEvents.length} events`));
        batchHeader.appendChild(titleDiv);
        batchGroup.appendChild(batchHeader);

        batchEvents.forEach((event, eventIndex) => {
            const eventTypeColor = getEventTypeColor(event.event_type_id);
            const eventIcon = getEventTypeIcon(event.event_type_id);
            const isLastEvent = eventIndex === batchEvents.length - 1;

            const eventWithLine = makeEl('div', 'atomic-event-with-line');

            const timelineLine = makeEl('div', 'atomic-timeline-line');
            timelineLine.style.backgroundColor = batchColor;
            timelineLine.dataset.lastEvent = isLastEvent;
            eventWithLine.appendChild(timelineLine);

            const dot = makeEl('div', 'atomic-timeline-dot');
            dot.style.backgroundColor = eventTypeColor;
            dot.style.borderColor = batchColor;
            eventWithLine.appendChild(dot);

            const eventCard = makeEl('div', 'w3-container w3-round atomic-telemetry-event w3-hover-dark-grey');
            const row = makeEl('div', 'w3-row');

            const leftCol = makeEl('div', 'w3-col s8 m8 l8');
            const descDiv = makeEl('div', 'at-text-coral w3-small');
            const evIcon = makeIcon(`fa ${eventIcon} w3-margin-right`);
            evIcon.style.color = eventTypeColor;
            descDiv.appendChild(evIcon);
            descDiv.appendChild(document.createTextNode(event.event_description));
            leftCol.appendChild(descDiv);
            row.appendChild(leftCol);

            const rightCol = makeEl('div', 'w3-col s4 m4 l4 w3-right-align');
            rightCol.style.cssText = 'display:flex;align-items:center;justify-content:flex-end;gap:6px';
            const uuidTag = makeEl('div', 'w3-tag w3-round w3-tiny w3-dark-grey', 'Event UUID: ' + event.uuid);
            uuidTag.style.fontFamily = 'monospace';
            const evCopyBtn = makeEl('button', 'atomic-copy-btn');
            evCopyBtn.title = 'Copy Event UUID';
            evCopyBtn.appendChild(makeIcon('fa fa-clone'));
            evCopyBtn.addEventListener('click', () => copyToClipboard(event.uuid, evCopyBtn));
            rightCol.appendChild(uuidTag);
            rightCol.appendChild(evCopyBtn);
            row.appendChild(rightCol);
            eventCard.appendChild(row);

            const timeDiv = makeEl('div', 'w3-text-grey w3-tiny w3-margin-top');
            timeDiv.appendChild(makeIcon('fa fa-clock-o w3-margin-right'));
            timeDiv.appendChild(document.createTextNode(event.created_at_formatted));
            eventCard.appendChild(timeDiv);

            eventWithLine.appendChild(eventCard);
            batchGroup.appendChild(eventWithLine);
        });

        timeline.appendChild(batchGroup);

        if (!isLastBatch) {
            timeline.appendChild(makeEl('div', 'atomic-batch-separator'));
        }

        batchIndex++;
    }

    container.appendChild(timeline);
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

    return batchUuids.map(uuid => {
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            hash = ((hash << 5) - hash) + uuid.charCodeAt(i);
            hash = hash & hash;
        }
        return colors[Math.abs(hash) % colors.length];
    });
}

function getEventTypeColor(eventTypeId) {
    switch (eventTypeId) {
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
    switch (eventTypeId) {
        case 1: return 'fa-plus-circle';     // JOB_CREATED
        case 2: return 'fa-download';        // JOB_FETCHED
        case 3: return 'fa-check-circle';    // JOB_SUCCESS
        case 4: return 'fa-times-circle';    // JOB_FAILED
        case 5: return 'fa-repeat';          // JOB_RETRY
        case 6: return 'fa-exclamation-circle'; // JOB_INCOMPLETE_HANDLED
        default: return 'fa-star';           // custom event
    }
}

/* Tabs */
(function () {
    const tabState = {
        active: '',
        loaded: { dashboard: false, hive: false, logs: false }
    };

    function qs(sel, root = document) { return root.querySelector(sel); }
    function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

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
                setActiveTab(btn.getAttribute('data-tab'));
            });
        });
        setActiveTab('dashboard');
    }

    function loadDashboardTab() {
        const container = qs('#tab-dashboard .tab-body');
        if (!container) return;
        setChildren(container, makeSpinner('Загрузка сведений...'));
        fetchJson('/telemetry/dashboard')
            .then(info => {
                clearNode(container);
                const addGroup = (title, obj) => {
                    if (!obj) return;
                    const header = makeEl('div', 'w3-margin-top w3-text-grey w3-medium atomic-info-header');
                    header.appendChild(makeIcon('fa fa-info-circle w3-margin-right'));
                    header.appendChild(document.createTextNode(title));
                    container.appendChild(header);
                    const group = makeEl('div', 'w3-margin-bottom');
                    Object.keys(obj).forEach(k => {
                        const v = obj[k];
                        const row = makeEl('div', 'w3-row w3-padding-small w3-border-bottom at-border-grey');
                        const keyCol = makeEl('div', 'w3-col s5 m4 l3 w3-text-grey w3-small', k + ':');
                        const valCol = makeEl('div', 'w3-col s7 m8 l9 at-text-coral w3-small',
                            typeof v === 'object' ? JSON.stringify(v) : String(v));
                        valCol.style.wordWrap = 'break-word';
                        row.appendChild(keyCol);
                        row.appendChild(valCol);
                        group.appendChild(row);
                    });
                    container.appendChild(group);
                };
                addGroup('PHP', info.php);
                addGroup('Fat-Free Framework', info.f3);
                addGroup('Atomic', info.atomic);
                addGroup('База данных', info.db);
                addGroup('Система', info.system);
            })
            .catch(err => {
                setChildren(container, makeErrorBox('Ошибка загрузки: ' + err.message));
            });
    }

    function loadHiveTab() {
        const container = qs('#tab-hive .tab-body');
        if (!container) return;
        setChildren(container, makeSpinner('Загрузка Hive...'));
        fetchJson('/telemetry/hive')
            .then(data => {
                setChildren(container, makeJsonCodeBlock(JSON.stringify(data, null, 4)));
            })
            .catch(err => {
                setChildren(container, makeErrorBox('Ошибка загрузки: ' + err.message));
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
            if (isNaN(t)) return ts;
            d = new Date(t);
        }
        const mm = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const pad = (n) => (n < 10 ? '0' + n : '' + n);
        return `${pad(d.getDate())} ${mm[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function renderLogLines(lines, mountEl, channelName) {
        clearNode(mountEl);
        if (!lines.length) {
            mountEl.appendChild(makeInfoBox('Log is empty'));
            return;
        }
        const prefix = 'ch-' + channelName.replace(/[^a-z0-9]/gi, '_');
        const list = makeEl('div', 'atomic-log-list');

        lines.forEach((ln, idx) => {
            const msgRaw = ln.message || '';
            const hasOnerror = /\[ONERROR\]/i.test(msgRaw);
            const hasHive = /\[HIVE\]/i.test(msgRaw);
            const chipText = hasOnerror ? 'ONERROR' : (hasHive ? 'HIVE' : (ln.level || '').toUpperCase());

            const lineEl = makeEl('div', 'atomic-log-line w3-padding-small w3-border-bottom at-border-dark-grey');

            const metaDiv = makeEl('div', 'w3-small w3-text-grey');
            const chip = makeEl('span', 'atomic-chip');
            chip.appendChild(makeIcon('fa fa-tag'));
            chip.appendChild(document.createTextNode(chipText));
            metaDiv.appendChild(chip);
            metaDiv.appendChild(makeEl('span', 'w3-margin-left', formatLogTs(ln.ts)));
            lineEl.appendChild(metaDiv);

            const msgDiv = makeEl('div', 'w3-margin-top at-text-coral w3-small');
            msgDiv.style.wordBreak = 'break-word';
            msgDiv.appendChild(highlightLogTagsFragment(msgRaw));
            lineEl.appendChild(msgDiv);

            if (ln.dump_id) {
                const dumpDiv = makeEl('div', 'w3-right at-log-dump-buttons');

                const copyBtn = makeEl('button', 'atomic-copy-btn');
                copyBtn.title = 'Copy dump id';
                copyBtn.appendChild(makeIcon('fa fa-clone'));
                copyBtn.addEventListener('click', () => copyToClipboard(ln.dump_id, copyBtn));

                const viewBtn = makeEl('button', 'atomic-copy-btn');
                viewBtn.appendChild(makeIcon('fa fa-eye'));
                viewBtn.appendChild(document.createTextNode(' View dump'));
                viewBtn.addEventListener('click', () => viewDump(ln.dump_id, `${prefix}-dump-${idx}`));

                dumpDiv.appendChild(copyBtn);
                dumpDiv.appendChild(viewBtn);
                lineEl.appendChild(dumpDiv);
            }

            const dumpMount = makeEl('div', 'w3-margin-top w3-hide');
            dumpMount.id = `${prefix}-dump-${idx}`;
            lineEl.appendChild(dumpMount);

            list.appendChild(lineEl);
        });

        mountEl.appendChild(list);
    }

    function logStatUrl(channelName) {
        return '/telemetry/log-stat' + (channelName ? '?channel=' + encodeURIComponent(channelName) : '');
    }

    function logLogsUrl(channelName) {
        return '/telemetry/logs' + (channelName ? '?channel=' + encodeURIComponent(channelName) : '');
    }

    function updateChannelMeta(metaEl, count) {
        if (!metaEl) return;
        const now = new Date();
        const pad = n => (n < 10 ? '0' + n : '' + n);
        const ts = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        clearNode(metaEl);
        metaEl.appendChild(makeIcon('fa fa-list-ul'));
        metaEl.appendChild(document.createTextNode(` ${count} lines \u00a0\u00b7\u00a0 `));
        metaEl.appendChild(makeIcon('fa fa-clock-o'));
        metaEl.appendChild(document.createTextNode(` ${ts}`));
    }

    function loadChannelLogs(channelName, bodyEl, metaEl) {
        const cacheKey = 'logs:' + channelName;
        const cached = cache.get(cacheKey);
        if (cached) {
            renderLogLines(cached.lines, bodyEl, channelName);
            updateChannelMeta(metaEl, cached.count);
            return;
        }
        setChildren(bodyEl, makeSpinner('Loading logs...'));
        fetchJson(logLogsUrl(channelName))
            .then(payload => {
                const lines = payload.lines || [];
                cache.set(cacheKey, { lines, count: lines.length });
                renderLogLines(lines, bodyEl, channelName);
                updateChannelMeta(metaEl, lines.length);
            })
            .catch(err => {
                setChildren(bodyEl, makeErrorBox('Error: ' + err.message));
            });
    }

    function refreshChannelLogs(channelName, bodyEl, metaEl, btn) {
        const cacheKey = 'logs:' + channelName;
        const savedNodes = [...btn.childNodes].map(n => n.cloneNode(true));
        const savedClass = btn.className;
        btn.disabled = true;
        clearNode(btn);
        btn.appendChild(makeIcon('fa fa-spinner fa-spin'));

        fetchJson(logStatUrl(channelName))
            .then(stat => {
                const cached = cache.get(cacheKey);
                const cachedCount = cached ? cached.count : -1;
                if (cached && stat.count === cachedCount) {
                    clearNode(btn);
                    btn.appendChild(makeIcon('fa fa-check'));
                    btn.appendChild(document.createTextNode(' Up to date'));
                    setTimeout(() => {
                        clearNode(btn);
                        savedNodes.forEach(n => btn.appendChild(n));
                        btn.className = savedClass;
                        btn.disabled = false;
                    }, 2000);
                    return;
                }
                return fetchJson(logLogsUrl(channelName))
                    .then(payload => {
                        const lines = payload.lines || [];
                        cache.set(cacheKey, { lines, count: lines.length });
                        renderLogLines(lines, bodyEl, channelName);
                        updateChannelMeta(metaEl, lines.length);
                        clearNode(btn);
                        savedNodes.forEach(n => btn.appendChild(n));
                        btn.className = savedClass;
                        btn.disabled = false;
                    });
            })
            .catch(() => {
                clearNode(btn);
                savedNodes.forEach(n => btn.appendChild(n));
                btn.className = savedClass;
                btn.disabled = false;
            });
    }

    function loadLogsTab() {
        const container = qs('#tab-logs .tab-body');
        if (!container) return;
        setChildren(container, makeSpinner('Loading channels...'));
        fetchJson('/telemetry/log-channels')
            .then(payload => {
                const channels = payload.channels || [];
                clearNode(container);
                if (!channels.length) {
                    loadChannelLogs('', container, null);
                    return;
                }

                const nav = makeEl('div', 'atomic-log-channels-nav');
                const content = makeEl('div', 'atomic-log-channels-content');

                channels.forEach((ch, i) => {
                    const tabBtn = makeEl('button', 'atomic-log-channel-tab' + (i === 0 ? ' active' : ''));
                    tabBtn.dataset.channel = ch;
                    tabBtn.appendChild(makeIcon('fa fa-file-text-o'));
                    tabBtn.appendChild(document.createTextNode(' ' + ch));
                    nav.appendChild(tabBtn);

                    const pane = makeEl('div', 'atomic-log-channel-pane' + (i === 0 ? '' : ' w3-hide'));
                    pane.dataset.channel = ch;

                    const header = makeEl('div', 'atomic-log-channel-header');
                    const meta = makeEl('span', 'atomic-log-channel-meta w3-text-grey w3-small');
                    const refreshBtn = makeEl('button', 'atomic-log-refresh-btn atomic-copy-btn');
                    refreshBtn.dataset.channel = ch;
                    refreshBtn.appendChild(makeIcon('fa fa-refresh'));
                    refreshBtn.appendChild(document.createTextNode(' Refresh'));
                    header.appendChild(meta);
                    header.appendChild(refreshBtn);

                    const body = makeEl('div', 'atomic-log-channel-body');
                    pane.appendChild(header);
                    pane.appendChild(body);
                    content.appendChild(pane);

                    refreshBtn.addEventListener('click', () => {
                        refreshChannelLogs(ch, body, meta, refreshBtn);
                    });

                    tabBtn.addEventListener('click', () => {
                        nav.querySelectorAll('.atomic-log-channel-tab').forEach(b => b.classList.remove('active'));
                        tabBtn.classList.add('active');
                        content.querySelectorAll('.atomic-log-channel-pane').forEach(p => p.classList.add('w3-hide'));
                        pane.classList.remove('w3-hide');
                        if (!body.firstChild) {
                            loadChannelLogs(ch, body, meta);
                        }
                    });
                });

                container.appendChild(nav);
                container.appendChild(content);

                const firstPane = content.querySelector('.atomic-log-channel-pane');
                if (firstPane) {
                    loadChannelLogs(
                        channels[0],
                        firstPane.querySelector('.atomic-log-channel-body'),
                        firstPane.querySelector('.atomic-log-channel-meta')
                    );
                }
            })
            .catch(() => {
                loadChannelLogs('', container, null);
            });
    }

    function viewDump(dumpId, targetId) {
        const mount = document.getElementById(targetId);
        if (!mount) return;
        if (!mount.classList.contains('w3-hide')) {
            mount.classList.add('w3-hide');
            clearNode(mount);
            return;
        }
        setChildren(mount, makeSpinner('Загрузка дампа...'));
        fetchJson('/telemetry/dumps/' + encodeURIComponent(dumpId))
            .then(data => {
                setChildren(mount, makeJsonCodeBlock(JSON.stringify(data, null, 4)));
                mount.classList.remove('w3-hide');
            })
            .catch(err => {
                const errDiv = makeEl('div', 'w3-text-red');
                errDiv.appendChild(makeIcon('fa fa-exclamation-triangle'));
                errDiv.appendChild(document.createTextNode(' ' + err.message));
                setChildren(mount, errDiv);
                mount.classList.remove('w3-hide');
            });
    }

    window.addEventListener('DOMContentLoaded', initTabs);
})();
