export interface IJiraIssues {
    maxResults: number,
    total: number,
    issues: IIssue[]
}

export interface IIssue {
    id: string,
    key: string, // номер типа TMS-2121
    fields: {
        parent: {
            id: string,
            key: string,
        } | undefined,
        resolution: { // статус
            id: string,
            name: string,
            description: string
        } | null,
        status: {
            name: string
        }
        labels: string[],
        aggregatetimeoriginalestimate: number | undefined,
        issuelinks: any[],
        assignee: {
            name: string,
            emailAddress: string,
            displayName: string
        },
        reporter: {
            name: string,
            emailAddress: string,
            displayName: string
        },
        progress: {
            progress: number,
            total: number,
            persent: number
        },
        worklog: {
            maxResults: number,
            total: number,
            worklogs: {
                author: {
                    name: string,
                    key: string,
                }
                timeSpentSeconds: number
            }[],
        },
        issuetype: {
            id: string,
            description: string,
            name: string
        },
        timeoriginalestimate: number | undefined,
        timetracking: {
            originalEstimate: string,
            remainingEstimate: string,
            originalEstimateSeconds: number,
            remainingEstimateSeconds: number
        } | {},
        summary: string,
        aggregateprogress: {
            progress: number,
            total: number,
            percent: number,
        },
        subtasks: {
            fields: {
                issuetype: {
                    id: string,
                    description: string,
                    name: string,
                }
            },
            id: string,
            key: string,
            self: string
        }[],
        components: IComponent[]
    }
}

export interface IComponent {
    id: string,
    name: string,
    self: string
}

export interface IWorklog {
        author: {
            name: string,
            key: string,
        }
        timeSpentSeconds: number
}