setTimeout((eve) => {
    let container = document.querySelectorAll('.ghx-controls.aui-group');
    if (container) {
        let styles = `
.dream-btns {
    display: flex;
    justify-content: flex-start;
}

.dream-btn {
    display: flex;
    border-radius: 3.01px;
    margin: 8px 4px 0 29px;
    background-image: none;
    background-color: #ecedf0;
    color: #344563;
    text-decoration: none;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    width: fit-content;
    cursor: pointer;
}

.dream-btn.dream-btn2 {
    margin-left: 0;
}

.dream-btn:hover {
    background-color: #dfe2e7;
}

.dream-table {
    display: flex;
    align-items: flex-start;
    font-size: 12px;
    width: 100%;
    border: 1px solid black;
}

.dream-title {
    margin-bottom: 0;
    font-size: 12px;
    padding: 4px 0;
    border-bottom: 1px solid black;
}

.dream-inner {
    border-right: 1px solid black;
    flex: 1 1 auto;
    text-align: center;
}

.dream-inner:last-child {
    border-right: transparent;
}

.dream-th {
    display: flex;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid black;
}

.dream-th > div {
    width: 7px;
    height: 80px;
    flex: 1 1 auto;
    border-right: 1px solid black;
    font-weight: 800;
    position: relative;
}

.dream-th > div:last-child {
    border-right: none;
}

.dream-th > div > span {
    position: relative;
    bottom: -29px;
    text-align: center;
    display: block;
    transform: rotate(-90deg);
}

.dream-vals {
    display: flex;
}

.dream-vals > div {
    width: 10px;
    font-size: 10px;
    padding: 4px 0;
    flex: 1 1 auto;
    text-align: center;
    border-right: 1px solid black;
}

.dream-vals > div:last-child {
    border-right: none;
}
        `;
        let styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        container.forEach((i, idx) => {
            if (i.parentNode) {
                let wrapper = document.createElement("div");
                wrapper.className = 'dream-btns';
                let btn = document.createElement("div");
                btn.innerHTML = "Разработка завершена";
                btn.id = `new-btn-${idx}`;
                btn.className = 'dream-btn';
                btn.onclick = async (e) => {
                    await getSprint(i, false);
                };
                wrapper.append(btn);
                let btn2 = document.createElement("div");
                btn2.innerHTML = "Только готовые";
                btn2.id = `new-btn-${idx}`;
                btn2.className = 'dream-btn dream-btn2';
                btn2.onclick = async (e) => {
                    await getSprint(i, true);
                };
                wrapper.append(btn2);
                i.parentNode.append(wrapper);
            }
        });
    }
}, 1000);
const getSprint = async (i, onlyReady) => {
    let contForSprint = i.closest('.ghx-backlog-header.js-sprint-header');
    let contForProject = document.getElementById('browser-metrics-report');
    if (contForSprint && contForProject) {
        let sprintId = contForSprint.getAttribute('data-sprint-id');
        let boardId = '';
        let obj = JSON.parse(contForProject.innerHTML);
        if (obj.report.entityId) {
            boardId = obj.report.entityId;
        }
        let response = await fetch(`https://jira.eapteka.ru/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue`);
        if (response.ok) {
            let json = await response.json();
            let maxResults = json.maxResults;
            let total = json.total;
            if (total > maxResults) {
                let count = Math.ceil(total / maxResults);
                let startAt = maxResults;
                for (let i = 0; i < count; i++) {
                    let additionalResponse = await fetch(`https://jira.eapteka.ru/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue?startAt=${startAt}`);
                    if (additionalResponse.ok) {
                        let additionalJson = await additionalResponse.json();
                        let issues = additionalJson.issues;
                        json = { ...json, issues: [...json.issues, ...issues] };
                        startAt = startAt + maxResults;
                    }
                }
            }
            generateStat(sprintId || '', json, onlyReady);
        }
        else {
            alert("Ошибка HTTP: " + response.status);
        }
    }
};
const generateStat = (sprintNumber, response, onlyReady) => {
    let productTasksCount = 0;
    let techDebtTasksCount = 0;
    let supportTasksCount = 0;
    let productTasksCountComplete = 0;
    let techDebtTasksCountComplete = 0;
    let supportTasksCountComplete = 0;
    let withoutLabels = [];
    let withoutTime = [];
    let productTasksTime = 0;
    let techDebtTasksTime = 0;
    let supportTasksTime = 0;
    let productTasksTimeComplete = 0;
    let techDebtTasksTimeComplete = 0;
    let supportTasksTimeComplete = 0;
    let totalCount = 0;
    let taskNames = [];
    response.issues.forEach((task, idx) => {
        const taskTime = task.fields.aggregatetimeoriginalestimate ? task.fields.aggregatetimeoriginalestimate / 60 / 60 : 0;
        const taskLabels = task.fields.labels;
        let label = '';
        taskNames.push(task.key);
        const defaultStatuses = onlyReady ? ['done', 'готово'] : ['done', 'готово', 'готово для теста qa', 'ожидает релиза', 'релиз', 'готово для теста', 'integration test', 'тест', 'тестирование', 'ready for release', 'rs testing', 'release stand', 'ready for release', 'feature review', 'testing', 'ready for test', 'test in progress', 'ux/ui review', 'build', 'integration test', 'ready for deployment', 'ready for ox', 'ready for rs', 'business approve', 'cancelled', 'ready for build', 'build', 'integration test', 'ready for deployment', 'test review'];
        taskLabels.forEach(labelItem => {
            if (['TechDebt', 'techDebt', 'techdebt', 'tech-debt'].includes(labelItem)) {
                label = 'TechDebt';
            }
            if (['Product', 'product'].includes(labelItem)) {
                label = 'Product';
            }
            if (['Support', 'support'].includes(labelItem)) {
                label = 'Support';
            }
        });
        let timeForTask = task.fields.worklog.worklogs.reduce((time, item) => (time + (!!item.timeSpentSeconds ? item.timeSpentSeconds / 60 / 60 : 0)), 0);
        switch (label) {
            case 'TechDebt':
                techDebtTasksCount = techDebtTasksCount + 1;
                techDebtTasksTime = techDebtTasksTime + taskTime;
                if (defaultStatuses.includes(task.fields.status.name.toLowerCase())) {
                    techDebtTasksCountComplete = techDebtTasksCountComplete + 1;
                }
                techDebtTasksTimeComplete = techDebtTasksTimeComplete + timeForTask;
                break;
            case 'Product':
                productTasksCount = productTasksCount + 1;
                productTasksTime = productTasksTime + taskTime;
                if (defaultStatuses.includes(task.fields.status.name.toLowerCase())) {
                    productTasksCountComplete = productTasksCountComplete + 1;
                }
                productTasksTimeComplete = productTasksTimeComplete + timeForTask;
                break;
            case 'Support':
                supportTasksCount = supportTasksCount + 1;
                supportTasksTime = supportTasksTime + taskTime;
                if (defaultStatuses.includes(task.fields.status.name.toLowerCase())) {
                    supportTasksCountComplete = supportTasksCountComplete + 1;
                }
                supportTasksTimeComplete = supportTasksTimeComplete + timeForTask;
                break;
        }
        if (!label) {
            withoutLabels.push(task.key);
        }
        if (!taskTime) {
            withoutTime.push(task.key);
        }
        totalCount = totalCount + 1;
    });
    const newTable = document.createElement('div');
    newTable.innerHTML = `<div>
        <h3 style="margin-bottom: 8px; padding-top: 8px; font-weight: bold;">Всего задач:  ${totalCount}</h3>
        <div style="margin-bottom: 8px">
           <span style="font-weight: bold">Без бакета: </span>
           <span>${withoutLabels.map(item => `<a href="https://jira.eapteka.ru/browse/${item}" target="_blank">${item}</a>`)}</span>
        </div>
        <div style="margin-bottom: 8px">
           <span style="font-weight: bold">Без указания времени: </span>
           <span>${withoutTime.map(item => `<a href="https://jira.eapteka.ru/browse/${item}" target="_blank">${item}</a>`)}</span>
        </div>
        
        <div class="dream-table">
                        <div class="dream-inner">
                            <div class="dream-title">Planned hours</div>
                            <div class="dream-th">
                                <div><span>Product</span></div>
                                <div><span>TechDebt</span></div>
                                <div><span>Support</span></div>
                            </div>
                            <div class="dream-vals">
                                <div>${Math.round(productTasksTime)}</div>
                                <div>${Math.round(techDebtTasksTime)}</div>
                                <div>${Math.round(supportTasksTime)}</div>
                            </div>
                        </div>
                        <div class="dream-inner">
                            <div class="dream-title">Logged hours</div>
                            <div class="dream-th">
                                <div><span>Product</span></div>
                                <div><span>TechDebt</span></div>
                                <div><span>Support</span></div>
                            </div>
                            <div class="dream-vals">
                                <div>${Math.round(productTasksTimeComplete)}</div>
                                <div>${Math.round(techDebtTasksTimeComplete)}</div>
                                <div>${Math.round(supportTasksTimeComplete)}</div>
                            </div>
                        </div>
                        <div class="dream-inner">
                            <div class="dream-title">Planned issues</div>
                            <div class="dream-th">
                                <div><span>Product</span></div>
                                <div><span>TechDebt</span></div>
                                <div><span>Support</span></div>
                            </div>
                            <div class="dream-vals">
                                <div>${productTasksCount}</div>
                                <div>${techDebtTasksCount}</div>
                                <div>${supportTasksCount}</div>
                            </div>
                        </div>
                        <div class="dream-inner">
                            <div class="dream-title">Completed issues</div>
                            <div class="dream-th">
                                <div><span>Product</span></div>
                                <div><span>TechDebt</span></div>
                                <div><span>Support</span></div>
                            </div>
                            <div>
                                <div class="dream-vals">
                                    <div>${productTasksCountComplete}</div>
                                    <div>${techDebtTasksCountComplete}</div>
                                    <div>${supportTasksCountComplete}</div>
                                </div>
                            </div>
                        </div>
                    </div>
        
    </div>`.trim();
    let container = document.querySelector(`[data-sprint-id="${sprintNumber}"]`);
    if (container) {
        container.prepend(newTable);
    }
};
