import {IJiraIssues} from "./interfaces/IIssue";

interface ILog {
    [author: string]: number
}

interface Iissue {
    [key: string]: number
}

// @ts-ignore
export const worklogs = async (sprintId: string, response: IJiraIssues, boardId: string): void => {
    let allWorkTime = 0;
    let allLogTime = 0;
    let allLogs: ILog = {};
    let allIssueTime: Iissue = {};
    let allWorkIssueTime: Iissue = {};

    response.issues.filter(task => !task.fields.parent).forEach((task, idx) => {
        const taskTime = task.fields.aggregatetimeoriginalestimate ? task.fields.aggregatetimeoriginalestimate : 0;
        allWorkTime += taskTime;
        let timeForTask = task.fields.aggregateprogress.progress ? task.fields.aggregateprogress.progress : 0;
        allLogTime += timeForTask;
        let worklogsArr = task.fields.worklog.worklogs;
        if (worklogsArr.length) {
            worklogsArr.forEach((log) => {
                if (allLogs.hasOwnProperty(log.author.name)) {
                    const time = allLogs[log.author.name];
                    allLogs[log.author.name] = time + log.timeSpentSeconds;
                } else {
                    allLogs[log.author.name] = log.timeSpentSeconds;
                }
            })
        }
        if (allIssueTime.hasOwnProperty(task.key)) {
            const time = allIssueTime[task.key];
            allIssueTime[task.key] = time + timeForTask;
        } else {
            allIssueTime[task.key] = timeForTask;
        }
        if (allWorkIssueTime.hasOwnProperty(task.key)) {
            const time = allWorkIssueTime[task.key];
            allWorkIssueTime[task.key] = time + taskTime;
        } else {
            allWorkIssueTime[task.key] = taskTime;
        }
    });


    console.log(allIssueTime);
    console.log(allLogs);
    console.log(allWorkTime);
    console.log(allLogTime);

    const newTable = document.createElement('div');
    newTable.className = 'rts-work-item';
    newTable.innerHTML = `<div>
        <h3 style="margin-bottom: 8px; padding-top: 8px; font-weight: bold;">Всего времени:  ${allLogTime / 60 / 60}  / ${allWorkTime / 60 / 60}</h3>
              
        <div class="workLogList">
                        ${Object.keys(allLogs).map((log, idx)=>{
                            return `<div class="worklogworker"><span>${log}:</span> <span>${allLogs[log] / 60 / 60}</span></div>`    
                        })}
        </div>
                        
        </div>`.trim();
    let container = document.querySelector(`[data-sprint-id="${sprintId}"]`);
    if (container) {
        container.querySelectorAll('.rts-work-item').forEach(element => element.remove());
        container.prepend(newTable)
    }
}